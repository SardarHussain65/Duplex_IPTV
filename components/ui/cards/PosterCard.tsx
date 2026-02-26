/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Poster Card Component
 *  Specialized 160x240 portrait card for movies and series
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
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

export interface PosterCardProps {
    image?: ImageSourcePropType | string;
    title?: string;
    subtitle?: string;
    isActive?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
}

const WIDTH = 160;
const HEIGHT = 240;

export const PosterCard: React.FC<PosterCardProps> = ({
    image,
    title,
    subtitle,
    isActive = false,
    disabled = false,
    onPress,
    onLongPress,
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
        handleLongPress,
    } = useButtonState({ isActive, disabled, onPress, onLongPress });

    const isFocused = state === 'focused' || state === 'pressed';
    const isVisible = isFocused || isActive;

    const cardStyle: ViewStyle = {
        width: WIDTH,
        height: HEIGHT,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: isFocused ? 2 : 0,
        borderColor: '#FFFFFF',
        backgroundColor: Colors.dark[10],
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isFocused ? 0.6 : 0,
        shadowRadius: 10,
        elevation: isFocused ? 7 : 0,
        opacity: isVisible ? 0.9 : 0.7,
    };

    return (
        <View style={[styles.container, { width: WIDTH }]}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    style={[cardStyle, style]}
                >
                    {image ? (
                        <Image
                            source={typeof image === 'string' ? { uri: image } : image}
                            style={[styles.image, { opacity: isVisible ? 1 : 0.8 }]}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <View style={styles.placeholderIcon} />
                        </View>
                    )}
                </Pressable>
            </Animated.View>

            {(title || subtitle) && (
                <View style={[styles.info, { opacity: isVisible ? 1 : 0.7 }]}>
                    {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
                    {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        backgroundColor: Colors.dark[8],
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderIcon: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundColor: Colors.dark[7],
    },
    info: {
        marginTop: Spacing.xs,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.gray[100],
    },
    subtitle: {
        fontSize: 12,
        color: Colors.gray[400],
        marginTop: 2,
    },
});
