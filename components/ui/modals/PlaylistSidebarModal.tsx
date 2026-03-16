import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, Animated, Dimensions, findNodeHandle } from 'react-native';
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
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('1');
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

    // Hardcoded for now based on PlaylistSection.tsx
    const playlists = [
        { id: '1', title: 'Playlist 1', sub: 'https://example.com/live/stream.m3u8', type: 'M3U' },
        { id: '2', title: 'Playlist 2', sub: 'https://example.com/live/stream.m3u8', type: 'M3U' },
        { id: '3', title: 'Playlist 3', sub: 'https://example.com/live/stream.m3u8', type: 'M3U8' },
        { id: '4', title: 'Playlist 4', sub: 'https://example.com/live/stream.m3u8', type: 'Xtream Code' },
    ];
    
    // Create refs for all items to enable up/down navigation
    const itemRefs = useRef<(View | null)[]>([]);

    const handlePlaylistSelect = (id: string) => {
        if (id !== selectedPlaylistId) {
            setPendingPlaylistId(id);
            setIsConfirmVisible(true);
        }
    };

    const confirmPlaylist = () => {
        if (pendingPlaylistId) {
            setSelectedPlaylistId(pendingPlaylistId);
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
                    <Text style={styles.title}>Playlists</Text>
                    <View style={styles.divider} />
                    
                    <ScrollView 
                        style={styles.playlistContainer}
                        contentContainerStyle={{ gap: xdHeight(12) }}
                        showsVerticalScrollIndicator={false}
                    >
                        {playlists.map((p, index) => (
                            <PlaylistRowButton
                                key={p.id}
                                ref={(el: any) => {
                                    if (index === 0) firstItemRef.current = el;
                                    itemRefs.current[index] = el;
                                }}
                                label={p.title}
                                url={p.sub}
                                isSelected={p.id === selectedPlaylistId}
                                hasTVPreferredFocus={index === 0}
                                onPress={() => handlePlaylistSelect(p.id)}
                                // Link up/down focus
                                nextFocusUp={index > 0 ? findNodeHandle(itemRefs.current[index - 1]) || undefined : undefined}
                                nextFocusDown={index < playlists.length - 1 ? findNodeHandle(itemRefs.current[index + 1]) || undefined : undefined}
                                // Disable left/right navigation within the list, route back to topnav or self
                                nextFocusLeft={"self" as any}
                                nextFocusRight={"self" as any}
                            />
                        ))}
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
    },
});
