/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Channel Detail Screen
 * ─────────────────────────────────────────────────────────────
 */

import {
    NavIconButton
} from '@/components/ui/buttons';
import { VideoPreviewCard } from '@/components/ui/cards/VideoPreviewCard';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useStreamUrl } from '@/lib/api/hooks/useStreamUrl';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTranslation } from 'react-i18next';

// ── Dummy live stream URL (public domain) ─────────────────────
import { useFavorites } from '@/lib/api';

// ── Dummy live stream URL (public domain) ─────────────────────
const DUMMY_VIDEO_URI =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// ── Types ─────────────────────────────────────────────────────

type EPGSlot = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    isLive?: boolean;
    widthFactor: number;
};

// ── Mock EPG data ─────────────────────────────────────────────

// EPG slots are now handled directly in the render logic for simplicity in matching Figma design

// ── Screen ────────────────────────────────────────────────────

export default function ChannelDetailScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams<{
        id: string;
        name: string;
        category: string;
        logo: string;
        streamHash?: string;
        tvgId?: string;
        contentType?: string;
    }>();

    const { useGetFavorites, addFavorite, removeFavorite, isAdding, isRemoving } = useFavorites();
    const { data: favData } = useGetFavorites({ type: 'LIVE' });

    // Check if this channel is in favorites
    const favoriteItem = favData?.getFavorites?.items?.find(item => 
        item?.metadata?.streamHash === params.streamHash || item.id === params.id
    );
    const isFavorite = !!favoriteItem;
    const [isLocked, setIsLocked] = useState(false);
    const { setIsScrolled, setParentalModalVisible } = useTab();

    useEffect(() => {
        setIsScrolled(false);
        return () => setIsScrolled(false);
    }, []);

    // Real data from params
    const channelName = params.name ?? 'Live Channel';
    const channelCategory = params.category ?? '';
    const channelLogo = params.logo ?? '';

    // EPG data — channel name is the best "show title" we have without a
    // dedicated EPG API. Other fields are clearly marked as placeholders.
    const programme = {
        showTitle: channelName,
        description: channelCategory
            ? t('detail.nowStreamingNameCat', { name: channelName, category: channelCategory })
            : t('detail.nowStreamingName', { name: channelName }),
        date: t('detail.live'),
        episode: channelCategory || t('common.liveTv'),
        timeLeft: t('detail.live'),
        progress: 0,
    };

    const streamHash = params.streamHash || params.id;
    const { data: streamUrl } = useStreamUrl(streamHash || null);
    console.log(`[ChannelDetailScreen] channelName: ${channelName}, streamHash: ${streamHash}, streamUrl: ${streamUrl}`);

    const handleExpand = () => {
        router.push({
            pathname: '/player/[id]',
            params: {
                id: params.id || 'live',
                name: channelName,
                category: channelCategory,
                year: 'Live',
                duration: 'Live',
                logo: channelLogo,
                streamHash: params.streamHash,
            },
        });
    };

    const handleFavoritePress = async () => {
        try {
            if (isFavorite && favoriteItem) {
                await removeFavorite(favoriteItem.id);
            } else {
                await addFavorite({
                    name: channelName,
                    type: 'LIVE',
                    metadata: {
                        name: channelName,
                        tvgId: params.tvgId || '',
                        tvgName: channelName,
                        tvgLogo: channelLogo,
                        groupTitle: channelCategory,
                        contentType: params.contentType || 'LIVE',
                        category: channelCategory,
                        genre: channelCategory,
                        streamHash: params.streamHash || params.id || '',
                    }
                });
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };


    return (
        <View style={styles.screen}>
            {/* ── Top Section ── */}
            <View style={styles.topSection}>

                {/* Full-width blurred background image */}
                {channelLogo ? (
                    <Image
                        source={{ uri: channelLogo }}
                        style={styles.topBgImage}
                        contentFit="cover"
                    />
                ) : null}
                {/* Dark overlay on top of bg */}
                <View style={styles.topBgOverlay} />

                {/* Left: Video Preview Card */}
                <VideoPreviewCard
                    title={programme.showTitle}
                    channelName={channelName}
                    channelImage={channelLogo}
                    date={programme.date}
                    episode={programme.episode}
                    timeLeft={programme.timeLeft}
                    onExpandPress={handleExpand}
                    videoUri={streamUrl || undefined}
                />

                {/* Right: Info Panel */}
                <View style={styles.infoPanel}>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>{channelName}</Text>
                        <Text style={styles.metaDot}>•</Text>
                        <Text style={styles.metaText}>{programme.date}</Text>
                        <Text style={styles.metaDot}>•</Text>
                        <Text style={styles.metaText}>{programme.episode}</Text>
                        <Text style={styles.metaDot}>•</Text>
                        <Text style={styles.metaText}>{programme.timeLeft} {t('detail.left')}</Text>
                    </View>

                    <Text style={styles.showTitle}>{programme.showTitle}</Text>

                    <Text style={styles.description} numberOfLines={5}>
                        {programme.description}
                    </Text>

                    <View style={styles.actionRow}>
                        <NavIconButton
                            icon={<MaterialCommunityIcons name={isFavorite ? 'heart' : 'heart-outline'} size={scale(20)} color={isFavorite ? '#E0334C' : Colors.gray[300]} />}
                            isActive={isFavorite}
                            activeBackgroundColor="#E0334C"
                            onPress={handleFavoritePress}
                            disabled={isAdding}
                        />
                        <NavIconButton
                            icon={<MaterialCommunityIcons name={isLocked ? 'lock' : 'lock-open-outline'} size={scale(20)} color={Colors.gray[300]} />}
                            isActive={isLocked}
                            onPress={() => setParentalModalVisible(true)}
                        />
                    </View>
                </View>
            </View>

            {/* ── EPG Section ── */}
            <View style={styles.epgSection}>
                <View style={styles.epgHeader}>
                    <TouchableOpacity style={styles.todaySelector}>
                        <Text style={styles.todayText}>{t('detail.today')}</Text>
                        <MaterialCommunityIcons name="chevron-down" size={scale(18)} color={Colors.gray[400]} />
                    </TouchableOpacity>

                    <View style={styles.timeMarkersRow}>
                        {['1:30', '2:00', '2:30'].map((t) => (
                            <Text key={t} style={styles.timeMarker}>
                                {t}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* EPG Row */}
                <View style={styles.epgRow}>
                    {/* Channel logo */}
                    <View style={styles.epgLogoCell}>
                        <Image
                            source={{ uri: channelLogo }}
                            style={styles.epgLogo}
                            contentFit="contain"
                        />
                    </View>

                    {/* Current Program Card */}
                    <TouchableOpacity style={[styles.programCard, styles.programCardActive]}>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>{programme.showTitle}</Text>
                            <Text style={styles.cardSub}>{programme.timeLeft} {t('detail.left')}</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: '35%' }]} />
                        </View>
                    </TouchableOpacity>

                    {/* Next Program Card */}
                    <TouchableOpacity style={styles.programCard}>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>{programme.showTitle}</Text>
                            <Text style={styles.cardSub}>1:30 PM - 2:00 PM</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#141416',
    },

    // ── Top section ──────────────────────────────────────────
    topSection: {
        flex: 0.65, // Adjusted to make EPG ~27%
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: xdWidth(32),
        overflow: 'hidden',
        position: 'relative',
        paddingTop: xdHeight(50),
    },
    topBgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.25,
    },
    topBgOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20,20,22,0.55)',
    },

    // Right info panel
    infoPanel: {
        flex: 1,
        paddingLeft: xdWidth(40),
        justifyContent: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(10),
        marginBottom: xdHeight(14),
    },
    metaText: {
        fontSize: scale(13),
        color: Colors.gray[400],
        fontWeight: '500',
    },
    metaDot: {
        fontSize: scale(12),
        color: Colors.gray[600],
    },
    showTitle: {
        fontSize: scale(34),
        fontWeight: '800',
        color: Colors.gray[100],
        marginBottom: xdHeight(18),
        letterSpacing: -0.5,
    },
    description: {
        fontSize: scale(13),
        color: Colors.gray[400],
        lineHeight: scale(20),
        marginBottom: xdHeight(24),
    },
    actionRow: {
        flexDirection: 'row',
        gap: xdWidth(12),
    },

    // ── EPG section ───────────────────────────────────────────
    epgSection: {
        flex: 0.35, // Increased to 0.35 (filling the screen bottom) to fix the overflow "overlay"
        paddingHorizontal: xdWidth(32),
        backgroundColor: '#1E1E21',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    epgHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: xdHeight(16),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        marginBottom: xdHeight(16),
    },
    todaySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(8),
        width: xdWidth(100),
    },
    todayText: {
        fontSize: scale(15),
        color: Colors.gray[100],
        fontWeight: '700',
    },
    timeMarkersRow: {
        flexDirection: 'row',
        gap: xdWidth(240),
        flex: 1,
        paddingLeft: xdWidth(20),
    },
    timeMarker: {
        fontSize: scale(13),
        color: Colors.gray[400],
        fontWeight: '500',
    },
    epgRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(12),
    },
    epgLogoCell: {
        width: xdWidth(76),
        height: xdHeight(68),
        backgroundColor: '#FFFFFF',
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    epgLogo: {
        width: xdWidth(50),
        height: xdHeight(34),
    },
    programCard: {
        flex: 1,
        height: xdHeight(68),
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: scale(10),
        paddingHorizontal: xdWidth(16),
        justifyContent: 'center',
        overflow: 'hidden',
    },
    programCardActive: {
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    cardInfo: {
        gap: xdHeight(2),
    },
    cardTitle: {
        fontSize: scale(13),
        fontWeight: '700',
        color: Colors.gray[100],
    },
    cardSub: {
        fontSize: scale(12),
        color: Colors.gray[400],
    },
    progressBarBg: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: xdHeight(68),
        backgroundColor: 'rgba(255,255,255,0.03)',
        zIndex: -1,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
});