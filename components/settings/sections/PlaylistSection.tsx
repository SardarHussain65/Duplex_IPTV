import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { PlaylistRowButton } from '@/components/ui/buttons/PlaylistRowButton';
import { ConfirmPlaylistModal } from '@/components/ui/modals/ConfirmPlaylistModal';
import { Colors, scale } from '@/constants';
import { usePlaylists } from '@/lib/api/hooks/usePlaylists';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { panelStyles } from '@/styles/settings_panel.styles';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, findNodeHandle, Text, View } from 'react-native';

interface PlaylistSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

type PlaylistTab = 'Playlist URL' | 'Xtream Code';

export const PlaylistSection: React.FC<PlaylistSectionProps> = ({ startRef, sidebarRef }) => {
    const { t } = useTranslation();
    const deviceId = useDeviceStore(state => state.id);
    const activePlaylistId = useDeviceStore(state => state.activePlaylistId);
    const setActivePlaylistId = useDeviceStore(state => state.setActivePlaylistId);

    const [activeTab, setActiveTab] = useState<PlaylistTab>('Playlist URL');
    const [pendingPlaylistId, setPendingPlaylistId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { playlists, loading, error } = usePlaylists({ 
        deviceId: deviceId || '',
        limit: 50,
    });

    console.log('[PlaylistSection] deviceId:', deviceId);
    console.log('[PlaylistSection] fetched playlists count:', playlists?.length);
    if (playlists?.length > 0) {
        console.log('[PlaylistSection] first playlist type:', playlists[0].type);
    }

    const filteredPlaylists = playlists.filter(p => {
        const type = (p.type || '').toLowerCase();
        if (activeTab === 'Playlist URL') return type === 'url';
        if (activeTab === 'Xtream Code') return type === 'xcode' || type === 'xtream' || type === 'xtream codes';
        return false;
    });

    const sidebarNode = sidebarRef?.current ? findNodeHandle(sidebarRef.current) : undefined;

    return (
        <View style={{ flex: 1 }}>
            <View style={panelStyles.tabs}>
                <CategoryButton
                    isActive={activeTab === 'Playlist URL'}
                    onPress={() => setActiveTab('Playlist URL')}
                    ref={startRef}
                    nativeID="settings_content_start"
                    nextFocusLeft={sidebarNode as any}
                >
                    Playlist URL
                </CategoryButton>
                <CategoryButton
                    isActive={activeTab === 'Xtream Code'}
                    onPress={() => setActiveTab('Xtream Code')}
                    nextFocusLeft={sidebarNode as any}
                    nextFocusRight={"self" as any}
                >
                    Xtream Codes
                </CategoryButton>
            </View>

            <View style={{ gap: 12 }}>
                {loading ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator color={Colors.primary[500]} size="large" />
                    </View>
                ) : error ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <Text style={{ color: '#FF5252', fontSize: scale(16) }}>
                            Error loading playlists
                        </Text>
                    </View>
                ) : (
                    <>
                        {filteredPlaylists.map((p, index) => (
                            <PlaylistRowButton
                                key={p.id}
                                label={p.name}
                                url={p.url}
                                isSelected={p.id === activePlaylistId}
                                isPinRequired={p.isPinRequired}
                                onPress={() => {
                                    if (p.id !== activePlaylistId) {
                                        setPendingPlaylistId(p.id);
                                        setIsModalVisible(true);
                                    }
                                }}
                                nextFocusLeft={sidebarNode as any}
                                nextFocusRight={"self" as any}
                                nextFocusDown={index === filteredPlaylists.length - 1 ? (sidebarNode as any) : undefined}
                            />
                        ))}
                        {filteredPlaylists.length === 0 && (
                            <View style={{ padding: 40, alignItems: 'center' }}>
                                <Text style={{ color: Colors.gray[400], fontSize: scale(16) }}>
                                    {t('settings.playlistOptions.noPlaylists', { tab: activeTab })}
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </View>

            <ConfirmPlaylistModal
                visible={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false);
                    setPendingPlaylistId(null);
                }}
                onConfirm={() => {
                    if (pendingPlaylistId) {
                        setActivePlaylistId(pendingPlaylistId);
                    }
                    setIsModalVisible(false);
                    setPendingPlaylistId(null);
                }}
            />
        </View>
    );
};
