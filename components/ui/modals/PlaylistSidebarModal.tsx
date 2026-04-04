import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { usePlaylists } from '@/lib/api/hooks/usePlaylists';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PlaylistRowButton } from '../buttons/PlaylistRowButton';
import { ConfirmPlaylistModal } from './ConfirmPlaylistModal';

interface PlaylistSidebarModalProps {
    visible: boolean;
    onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = xdWidth(400);

export const PlaylistSidebarModal: React.FC<PlaylistSidebarModalProps> = ({
    visible,
    onClose,
}) => {
    const { t } = useTranslation();
    const deviceId = useDeviceStore((state) => state.id);
    const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);
    const setActivePlaylistId = useDeviceStore((state) => state.setActivePlaylistId);

    const { playlists, loading, error } = usePlaylists({ deviceId: deviceId || '' });

    const [pendingPlaylistId, setPendingPlaylistId] = useState<string | null>(null);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

    // Ref for the first playlist item to auto-focus
    const firstItemRef = useRef<View>(null);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();

            // Auto-focus first item after animation completes
            setTimeout(() => {
                if (firstItemRef.current) {
                    // @ts-ignore
                    firstItemRef.current.focus?.();
                }
            }, 400);
        } else {
            Animated.timing(slideAnim, {
                toValue: SIDEBAR_WIDTH,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: SIDEBAR_WIDTH,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    // Create refs for all items to enable up/down navigation
    const itemRefs = useRef<(any | null)[]>([]);

    const handlePlaylistSelect = (id: string) => {
        if (id !== activePlaylistId) {
            setPendingPlaylistId(id);
            setIsConfirmVisible(true);
        }
    };

    const confirmPlaylist = () => {
        if (pendingPlaylistId) {
            setActivePlaylistId(pendingPlaylistId);
        }
        setIsConfirmVisible(false);
        setPendingPlaylistId(null);
        handleClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={handleClose} />

                <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                    <Text style={styles.title}>{t('common.playlists')}</Text>
                    <View style={styles.divider} />

                    <ScrollView
                        style={styles.playlistContainer}
                        contentContainerStyle={{ gap: xdHeight(12) }}
                        showsVerticalScrollIndicator={false}
                    >
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#FFFFFF" />
                                <Text style={styles.loadingText}>{t('settings.playlistOptions.loading')}</Text>
                            </View>
                        ) : error ? (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.errorText}>{t('settings.playlistOptions.error')}</Text>
                            </View>
                        ) : playlists.length === 0 ? (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>{t('settings.playlistOptions.empty')}</Text>
                            </View>
                        ) : (
                            playlists.map((p, index) => (
                                <PlaylistRowButton
                                    key={p.id}
                                    ref={(el: any) => {
                                        if (index === 0) firstItemRef.current = el;
                                        itemRefs.current[index] = el;
                                    }}
                                    label={p.name}
                                    url={p.url}
                                    isSelected={p.id === activePlaylistId}
                                    isPinRequired={p.isPinRequired}
                                    hasTVPreferredFocus={index === 0}
                                    onPress={() => handlePlaylistSelect(p.id)}
                                />
                            ))
                        )}
                    </ScrollView>
                </Animated.View>
            </View>

            <ConfirmPlaylistModal
                visible={isConfirmVisible}
                onClose={() => {
                    setIsConfirmVisible(false);
                    setPendingPlaylistId(null);
                }}
                onConfirm={confirmPlaylist}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    sidebar: {
        width: xdWidth(400),
        backgroundColor: Colors.dark[10],
        height: '100%',
        paddingVertical: xdHeight(40),
        paddingHorizontal: xdWidth(32),
        borderLeftWidth: 1,
        borderLeftColor: Colors.dark[8],
        shadowColor: '#000',
        shadowOffset: {
            width: -5,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: scale(24),
        fontWeight: '600',
        color: Colors.gray[100],
        marginBottom: xdHeight(16),
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dark[8],
        marginBottom: xdHeight(24),
        opacity: 0.5,
    },
    playlistContainer: {
        flex: 1,
        padding: xdWidth(8)
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: xdHeight(40),
    },
    loadingText: {
        color: Colors.gray[400],
        marginTop: xdHeight(12),
        fontSize: scale(14),
    },
    errorText: {
        color: '#FF5252',
        marginTop: xdHeight(12),
        fontSize: scale(14),
    },
});
