/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Setting Card Component
 *  Card-style button with icon + title + subtitle
 *  States: Default, Focused, Pressed
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import { scale } from '@/constants/scaling';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useButtonState } from '../buttons/useButtonState';

export interface SettingCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    isActive?: boolean;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
    nativeID?: string;
    nextFocusLeft?: number;
    nextFocusRight?: number;
    nextFocusUp?: number;
    nextFocusDown?: number;
    disableScale?: boolean;
}

export const SettingCard = React.forwardRef<any, SettingCardProps>((
    {
        icon,
        title,
        subtitle,
        isActive = false,
        iconPosition = 'left',
        disabled = false,
        onPress,
        onLongPress,
        style,
        testID,
        nativeID,
        nextFocusLeft,
        nextFocusRight,
        nextFocusUp,
        nextFocusDown,
        disableScale = false,
    },
    ref
) => {
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

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.md,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            borderRadius: 12,
            minHeight: 80,
        };

        switch (state) {
            case 'active':
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[8]
                };
            case 'pressed':
                return { ...baseStyle, backgroundColor: Colors.dark[11] };
            default:
                return { ...baseStyle, backgroundColor: Colors.dark[10] };
        }
    };

    const getTitleStyle = (): TextStyle => ({
        color: Colors.gray[100],
        fontSize: scale(18),
        fontWeight: '700',
    });

    const getSubtitleStyle = (): TextStyle => ({
        color: Colors.gray[400],
        fontSize: scale(14),
        fontWeight: '500',
    });

    return (
        <Animated.View style={[{ transform: [{ scale: disableScale ? 1 : scaleAnim }] }, style]}>
            <Pressable
                ref={ref}
                onPress={handlePress}
                onLongPress={handleLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                style={[getButtonStyle()]}
                testID={testID}
                nativeID={nativeID}
                nextFocusLeft={nextFocusLeft}
                nextFocusRight={nextFocusRight}
                nextFocusUp={nextFocusUp}
                nextFocusDown={nextFocusDown}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${title}, ${subtitle}`}
                hasTVPreferredFocus={false}
                focusable={true}
                tvParallaxProperties={{
                    enabled: true,
                    shiftDistanceX: 2,
                    shiftDistanceY: 2,
                    tiltAngle: 0.05,
                    magnification: 1.1,
                }}
            >
                {iconPosition === 'left' && icon && (
                    <View style={{ marginRight: Spacing.sm }}>{icon}</View>
                )}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={getTitleStyle()} numberOfLines={1}>{title}</Text>
                    <Text style={getSubtitleStyle()} numberOfLines={1}>{subtitle}</Text>
                </View>
                {iconPosition === 'right' && icon && (
                    <View style={{ marginLeft: Spacing.sm }}>{icon}</View>
                )}
                {isActive && iconPosition === 'left' && (
                    <MaterialCommunityIcons name="check" size={24} color={Colors.gray[100]} />
                )}
            </Pressable>
        </Animated.View>
    );
});
