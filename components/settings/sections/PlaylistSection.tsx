
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { PlaylistRowButton } from '@/components/ui/buttons/PlaylistRowButton';
import { ConfirmPlaylistModal } from '@/components/ui/modals/ConfirmPlaylistModal';
import { Colors, scale } from '@/constants';
import { panelStyles } from '@/styles/settings_panel.styles';
import React, { useState } from 'react';
import { findNodeHandle, Text, View } from 'react-native';

interface PlaylistSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

type PlaylistTab = 'M3U' | 'M3U8' | 'Xtream Code';

export const PlaylistSection: React.FC<PlaylistSectionProps> = ({ startRef, sidebarRef }) => {
    const [activeTab, setActiveTab] = useState<PlaylistTab>('M3U');
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('1');
    const [pendingPlaylistId, setPendingPlaylistId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const playlists = [
        { id: '1', title: 'Playlist 1', sub: 'https://example.com/live/stream.m3u8', type: 'M3U' },
        { id: '2', title: 'Playlist 2', sub: 'https://example.com/live/stream.m3u8', type: 'M3U' },
        { id: '3', title: 'Playlist 3', sub: 'https://example.com/live/stream.m3u8', type: 'M3U8' },
        { id: '4', title: 'Playlist 4', sub: 'https://example.com/live/stream.m3u8', type: 'Xtream Code' },
    ];

    const filteredPlaylists = playlists.filter(p => {
        if (activeTab === 'M3U') return p.type === 'M3U';
        if (activeTab === 'M3U8') return p.type === 'M3U8';
        if (activeTab === 'Xtream Code') return p.type === 'Xtream Code';
        return true;
    });

    const sidebarNode = sidebarRef?.current ? findNodeHandle(sidebarRef.current) : undefined;

    return (
        <View style={{ flex: 1 }}>
            <View style={panelStyles.tabs}>
                <CategoryButton
                    isActive={activeTab === 'M3U'}
                    onPress={() => setActiveTab('M3U')}
                    ref={startRef}
                    nativeID="settings_content_start"
                    nextFocusLeft={sidebarNode as any}
                >
                    M3U
                </CategoryButton>
                <CategoryButton
                    isActive={activeTab === 'M3U8'}
                    onPress={() => setActiveTab('M3U8')}
                    nextFocusLeft={sidebarNode as any}
                >
                    M3U8
                </CategoryButton>
                <CategoryButton
                    isActive={activeTab === 'Xtream Code'}
                    onPress={() => setActiveTab('Xtream Code')}
                    nextFocusLeft={sidebarNode as any}
                    nextFocusRight={"self" as any} // CategoryButton should handle "self" to point to its own handle
                >
                    Xtream Code
                </CategoryButton>
            </View>

            <View style={{ gap: 12 }}>
                {filteredPlaylists.map((p, index) => (
                    <PlaylistRowButton
                        key={p.id}
                        label={p.title}
                        url={p.sub}
                        isSelected={p.id === selectedPlaylistId}
                        onPress={() => {
                            if (p.id !== selectedPlaylistId) {
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
                            No playlists found for {activeTab}
                        </Text>
                    </View>
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
                        setSelectedPlaylistId(pendingPlaylistId);
                    }
                    setIsModalVisible(false);
                    setPendingPlaylistId(null);
                }}
            />
        </View>
    );
};
