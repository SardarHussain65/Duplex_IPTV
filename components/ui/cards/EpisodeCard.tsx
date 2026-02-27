/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Episode Card Component
 *  Horizontal row for series episodes with focus support
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useButtonState } from '../buttons/useButtonState';

export interface EpisodeCardProps {
    number: number;
    title: string;
    description: string;
    duration: string;
    image: string;
    progress?: number;
    onPress?: () => void;
    style?: ViewStyle;
    variant?: 'full' | 'mini';
    isPlaying?: boolean;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
    number,
    title,
    description,
    duration,
    image,
    progress,
    onPress,
    style,
    variant = 'full',
    isPlaying = false,
}) => {
    const {
        state,
        scaleAnim,
        handleFocus,
        handleBlur,
        handlePressIn,
        handlePressOut,
        handlePress,
    } = useButtonState({ onPress });

    const isFocused = state === 'focused' || state === 'pressed';
    const isMini = variant === 'mini';

    return (
        <View style={style}>
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={[
                    styles.episodeRow,
                    isMini && styles.episodeRowMini,
                    isFocused && isMini && styles.episodeRowMiniFocused,
                ]}
                focusable={true}
            >
                {/* Thumbnail */}
                <View style={[
                    styles.thumbWrapper,
                    isMini && styles.thumbWrapperMini,
                    isFocused && styles.thumbWrapperFocused
                ]}>
                    {/* Episode number badge */}
                    <View style={[styles.epNumBadge, isMini && styles.epNumBadgeMini]}>
                        <Text style={styles.epNumText}>{number}</Text>
                    </View>
                    <Image
                        source={{ uri: image }}
                        style={styles.thumb}
                        contentFit="cover"
                    />
                    {/* Progress bar */}
                    {progress !== undefined && (
                        <View style={styles.progressBg}>
                            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
                        </View>
                    )}
                </View>

                {/* Episode info */}
                <View style={styles.epInfo}>
                    <Text style={[styles.epTitle, isMini && styles.epTitleMini, isFocused && styles.textFocused]}>
                        {title}
                    </Text>
                    {!isMini && (
                        <Text style={styles.epDesc} numberOfLines={2}>
                            {description}
                        </Text>
                    )}
                    <View style={styles.epMetaRow}>
                        <Text style={styles.epDuration}>{duration}</Text>
                        {isMini && isPlaying && <Text style={styles.playingText}>Playing...</Text>}
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    episodeRow: {
        flexDirection: 'row',
        gap: xdWidth(18),
        paddingHorizontal: xdWidth(40),
        paddingVertical: xdHeight(12),
    },
    episodeRowMini: {
        gap: xdWidth(14),
        paddingHorizontal: xdWidth(12),
        paddingVertical: xdHeight(10),
        marginBottom: xdHeight(8),
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    episodeRowMiniFocused: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
    },
    thumbWrapper: {
        position: 'relative',
        borderRadius: scale(10),
        overflow: 'hidden',
        width: xdWidth(178),
        height: xdHeight(100),
        backgroundColor: Colors.dark[8],
        borderWidth: 2,
        borderColor: 'transparent',
    },
    thumbWrapperMini: {
        width: xdWidth(90),
        height: xdHeight(60),
        borderRadius: scale(8),
    },
    thumbWrapperFocused: {
        borderColor: '#3B82F6',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    },
    epNumBadge: {
        position: 'absolute',
        top: xdHeight(6),
        left: xdWidth(8),
        zIndex: 2,
        width: scale(22),
        height: scale(22),
        borderRadius: scale(3),
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    epNumBadgeMini: {
        width: scale(18),
        height: scale(18),
        top: 4,
        left: 4,
    },
    epNumText: {
        fontSize: scale(11),
        fontWeight: '700',
        color: '#fff',
    },
    thumb: {
        width: '100%',
        height: '100%',
    },
    progressBg: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: xdHeight(4),
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E0334C',
    },
    epInfo: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: xdHeight(4),
    },
    epTitle: {
        fontSize: scale(15),
        fontWeight: '700',
        color: Colors.gray[100],
        marginBottom: xdHeight(5),
    },
    epTitleMini: {
        fontSize: scale(12),
        marginBottom: xdHeight(2),
    },
    textFocused: {
        color: '#FFFFFF',
    },
    epDesc: {
        fontSize: scale(12),
        color: Colors.gray[400],
        lineHeight: scale(18),
        marginBottom: xdHeight(6),
    },
    epMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    epDuration: {
        fontSize: scale(12),
        color: Colors.gray[500],
        fontWeight: '500',
    },
    playingText: {
        fontSize: scale(11),
        fontWeight: 'bold',
        color: '#3B82F6',
    },
});
