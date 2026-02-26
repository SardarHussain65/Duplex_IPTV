/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — History Card Component
 *  Specialized landscape card for watch history
 *  Layout: Left image (with progress) | Right metadata
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import React from 'react';
import {
    Animated,
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { useButtonState } from '../buttons/useButtonState';

export interface HistoryCardProps {
    image?: ImageSourcePropType | string;
    title: string;
    date: string;
    duration: string;
    progress: number; // 0 to 1
    onPress?: () => void;
    style?: ViewStyle;
}

const WIDTH = xdWidth(250);
const HEIGHT = xdHeight(100);
const IMAGE_WIDTH = xdWidth(120);

export const HistoryCard: React.FC<HistoryCardProps> = ({
    image,
    title,
    date,
    duration,
    progress,
    onPress,
    style,
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

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={[
                    styles.card,
                    isFocused && styles.cardFocused
                ]}
            >
                {/* Left: Image with Progress */}
                <View style={[styles.imageContainer, { width: IMAGE_WIDTH }]}>
                    {image ? (
                        <Image
                            source={typeof image === 'string' ? { uri: image } : image}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.placeholder} />
                    )}
                    {/* Progress Bar at Bottom of Image */}
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                    </View>
                </View>

                {/* Right: Metadata */}
                <View style={styles.content}>
                    <Text style={styles.date}>{date}</Text>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    <Text style={styles.duration}>{duration}</Text>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: WIDTH,
        height: HEIGHT,
        flexDirection: 'row',
        backgroundColor: Colors.dark[10],
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardFocused: {
        borderColor: Colors.gray[100],
        backgroundColor: Colors.dark[8],
    },
    imageContainer: {
        height: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        backgroundColor: Colors.dark[8],
    },
    progressTrack: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#E91E63', // Same as screenshot pink/red
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    date: {
        fontSize: scale(10),
        color: Colors.gray[400],
        marginBottom: 2,
    },
    title: {
        fontSize: scale(14),
        fontWeight: '700',
        color: Colors.gray[100],
        lineHeight: 18,
    },
    duration: {
        fontSize: scale(11),
        color: Colors.gray[500],
        marginTop: 4,
    },
});
