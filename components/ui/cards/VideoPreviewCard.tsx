import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { ResizeMode, Video } from 'expo-av';
import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DUMMY_VIDEO_URI =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

interface VideoPreviewCardProps {
    title: string;
    channelName: string;
    channelImage: string;
    date: string;
    episode: string;
    timeLeft: string;
    onExpandPress: () => void;
}



export const VideoPreviewCard: React.FC<VideoPreviewCardProps> = ({
    title,
    onExpandPress,
}) => {
    const videoRef = useRef<Video>(null);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onExpandPress}
            style={cardStyles.card}
        >
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
        </TouchableOpacity>
    );
};

const cardStyles = StyleSheet.create({
    card: {
        width: xdWidth(480), // Increased from 390
        height: xdHeight(270), // Increased from 220
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
