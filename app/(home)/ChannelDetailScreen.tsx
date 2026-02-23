/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Channel Detail Screen
 * ─────────────────────────────────────────────────────────────
 */

import { NavIconButton } from '@/components/ui/buttons/NavIconButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

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

const generateEPG = (channelName: string): EPGSlot[] => [
    {
        id: '1',
        title: `${channelName} Morning Show`,
        startTime: '1:00 PM',
        endTime: '1:30 PM',
        isLive: false,
        widthFactor: 180,
    },
    {
        id: '2',
        title: 'The World Poker Toure',
        startTime: '1:30 PM',
        endTime: '2:00 PM',
        isLive: true,
        widthFactor: 340,
    },
    {
        id: '3',
        title: 'The World Poker Toure',
        startTime: '2:00 PM',
        endTime: '2:30 PM',
        isLive: false,
        widthFactor: 280,
    },
    {
        id: '4',
        title: 'Late Night Special',
        startTime: '2:30 PM',
        endTime: '3:30 PM',
        isLive: false,
        widthFactor: 240,
    },
];

// ── VideoPreviewCard ───────────────────────────────────────────

interface VideoPreviewCardProps {
    title: string;
    channelName: string;
    channelImage: string;
    date: string;
    episode: string;
    timeLeft: string;
    onExpandPress: () => void;
}

const VideoPreviewCard: React.FC<VideoPreviewCardProps> = ({
    title,
    channelImage,
    onExpandPress,
}) => {
    const videoRef = useRef<Video>(null);

    return (
        <View style={cardStyles.card}>

            {/* ── Inline Video fills the card ── */}
            <Video
                ref={videoRef}
                source={{ uri: DUMMY_VIDEO_URI }}
                style={StyleSheet.absoluteFill}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
                useNativeControls={false}
            />

            {/* Dark vignette so text is readable */}
            <View style={cardStyles.vignette} />

            {/* Title top-left */}
            <Text style={cardStyles.title} numberOfLines={1}>
                {title}
            </Text>

            {/* Live badge bottom-left */}
            <View style={cardStyles.liveBadge}>
                <View style={cardStyles.liveDot} />
                <Text style={cardStyles.liveText}>Live</Text>
            </View>

            {/* Expand button bottom-right — navigates to VideoPlayerScreen */}
            <View style={cardStyles.expandBtn}>
                <NavIconButton
                    icon={
                        <MaterialCommunityIcons
                            name="arrow-expand-all"
                            size={scale(18)}
                            color="#fff"
                        />
                    }
                    onPress={onExpandPress}
                />
            </View>
        </View>
    );
};

// ── Card styles ────────────────────────────────────────────────

const cardStyles = StyleSheet.create({
    card: {
        width: xdWidth(390),
        height: xdHeight(220),
        borderRadius: scale(18),
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#111',
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    title: {
        position: 'absolute',
        top: xdHeight(14),
        left: xdWidth(16),
        right: xdWidth(60),
        fontSize: scale(13),
        fontWeight: '600',
        color: '#fff',
    },
    liveBadge: {
        position: 'absolute',
        bottom: xdHeight(16),
        left: xdWidth(16),
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(6),
        backgroundColor: 'rgba(0,0,0,0.55)',
        paddingHorizontal: xdWidth(10),
        paddingVertical: xdHeight(4),
        borderRadius: scale(20),
    },
    liveDot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#E0334C',
    },
    liveText: {
        fontSize: scale(12),
        fontWeight: '600',
        color: '#fff',
    },
    expandBtn: {
        position: 'absolute',
        bottom: xdHeight(10),
        right: xdWidth(12),
    },
});

// ── Screen ────────────────────────────────────────────────────

export default function ChannelDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        id: string;
        name: string;
        category: string;
        image: string;
    }>();

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const { setIsScrolled, setParentalModalVisible } = useTab();

    useEffect(() => {
        setIsScrolled(false);
        return () => setIsScrolled(false);
    }, []);

    const channelName = params.name ?? 'SalinTV';
    const channelImage = params.image ?? '';

    const epgSlots = generateEPG(channelName);
    const liveSlot = epgSlots.find((s) => s.isLive);

    const programme = {
        showTitle: liveSlot?.title ?? 'The World Poker Toure',
        description:
            'A relentless detective is drawn into a dangerous investigation after a series of mysterious killings shake the city. As he follows a trail of cryptic clues, he uncovers a hidden network operating in the shadows. With time running out and.',
        date: 'Aug 7, 2026',
        episode: 'E20',
        timeLeft: '1h 20m',
        progress: 0.35,
    };

    const handleExpand = () => {
        router.push({
            pathname: '/VideoPlayerScreen',
            params: {
                title: programme.showTitle,
                genre: channelName,
                year: programme.date,
                duration: programme.timeLeft,
                image: channelImage,
            },
        });
    };

    return (
        <View style={styles.screen}>
            {/* ── Top Section ── */}
            <View style={styles.topSection}>

                {/* Full-width blurred background image */}
                {channelImage ? (
                    <Image
                        source={{ uri: channelImage }}
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
                    channelImage={channelImage}
                    date={programme.date}
                    episode={programme.episode}
                    timeLeft={programme.timeLeft}
                    onExpandPress={handleExpand}
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
                        <Text style={styles.metaText}>{programme.timeLeft} left</Text>
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
                            onPress={() => setIsFavorite(v => !v)}
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
                    <View style={styles.timeMarkersRow}>
                        {['1:30', '2:00', '2:30'].map((t) => (
                            <Text key={t} style={styles.timeMarker}>
                                {t}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.epgNavBtns}>
                        <TouchableOpacity style={styles.epgNavBtn}>
                            <MaterialCommunityIcons name="chevron-left" size={scale(20)} color={Colors.gray[400]} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.epgNavBtn}>
                            <MaterialCommunityIcons name="chevron-right" size={scale(20)} color={Colors.gray[400]} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* EPG Row */}
                <View style={styles.epgRow}>
                    {/* Channel logo */}
                    <View style={styles.epgLogoCell}>
                        <Image
                            source={{ uri: channelImage }}
                            style={styles.epgLogo}
                            contentFit="contain"
                        />
                    </View>

                    {/* Scrollable slots */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.epgSlotsScroll}
                        contentContainerStyle={styles.epgSlotsContent}
                    >
                        {epgSlots.map((slot) => (
                            <TouchableOpacity
                                key={slot.id}
                                activeOpacity={0.75}
                                style={[
                                    styles.epgSlot,
                                    slot.isLive && styles.epgSlotLive,
                                    { width: xdWidth(slot.widthFactor) },
                                ]}
                            >
                                <View style={styles.slotTextContainer}>
                                    <Text
                                        style={[
                                            styles.epgSlotTitle,
                                            slot.isLive && styles.epgSlotTitleLive,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {slot.title}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.epgSlotTime,
                                            slot.isLive && styles.epgSlotTimeLive,
                                        ]}
                                    >
                                        {slot.isLive
                                            ? `20m left`
                                            : `${slot.startTime} - ${slot.endTime}`}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
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
        flex: 0.68,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: xdWidth(32),
        paddingVertical: xdHeight(80),
        overflow: 'hidden',
        position: 'relative',
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
        flex: 0.45,
        paddingHorizontal: xdWidth(32),
        paddingTop: xdHeight(4),
    },
    epgHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingVertical: xdHeight(4),
        marginVertical: xdHeight(6),
    },
    timeMarkersRow: {
        flexDirection: 'row',
        paddingHorizontal: xdWidth(40),
        gap: xdWidth(300),
        flex: 1,
    },
    timeMarker: {
        fontSize: scale(14),
        color: Colors.gray[400],
        fontWeight: '500',
    },
    epgNavBtns: {
        flexDirection: 'row',
        gap: xdWidth(10),
    },
    epgNavBtn: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    epgRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(16),
    },
    epgLogoCell: {
        width: xdWidth(100),
        height: xdHeight(64),
        backgroundColor: '#FFFFFF',
        borderRadius: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    epgLogo: {
        width: xdWidth(60),
        height: xdHeight(40),
    },
    epgSlotsScroll: {
        flex: 1,
    },
    epgSlotsContent: {
        gap: xdWidth(12),
        alignItems: 'center',
    },
    epgSlot: {
        height: xdHeight(64),
        backgroundColor: '#232328',
        borderRadius: scale(10),
        paddingHorizontal: xdWidth(16),
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    epgSlotLive: {
        backgroundColor: '#323238',
        borderColor: 'rgba(255,255,255,0.1)',
    },
    slotTextContainer: {
        justifyContent: 'center',
    },
    epgSlotTitle: {
        fontSize: scale(13),
        fontWeight: '600',
        color: Colors.gray[400],
        marginBottom: xdHeight(2),
    },
    epgSlotTitleLive: {
        color: Colors.gray[100],
    },
    epgSlotTime: {
        fontSize: scale(12),
        color: Colors.gray[500],
    },
    epgSlotTimeLive: {
        color: Colors.gray[400],
    },
});