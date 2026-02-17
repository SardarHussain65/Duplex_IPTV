/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Setting Card Component
 *  Card-style button with icon + title + subtitle
 *  States: Default, Focused, Pressed
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface SettingCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
}

export const SettingCard: React.FC<SettingCardProps> = ({
    icon,
    title,
    subtitle,
    disabled = false,
    onPress,
    onLongPress,
    style,
    testID,
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
    } = useButtonState({ disabled, onPress, onLongPress });

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
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[8],
                    borderWidth: 2,
                    borderColor: Colors.primary[950],
                };
            case 'pressed':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[11],
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[10],
                };
        }
    };

    const getTitleStyle = (): TextStyle => {
        return {
            color: state === 'focused' ? Colors.gray[100] : Colors.gray[300],
            fontSize: 18,
            fontWeight: '600',
        };
    };

    const getSubtitleStyle = (): TextStyle => {
        return {
            color: state === 'pressed' ? Colors.gray[600] : Colors.gray[500],
            fontSize: 14,
            fontWeight: '400',
        };
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPress={handlePress}
                onLongPress={handleLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                style={[getButtonStyle(), style]}
                testID={testID}
                hasTVPreferredFocus={false}
                tvParallaxProperties={{
                    enabled: true,
                    shiftDistanceX: 2,
                    shiftDistanceY: 2,
                    tiltAngle: 0.05,
                    magnification: 1.05,
                }}
            >
                <View>{icon}</View>
                <View style={{ flex: 1 }}>
                    <Text style={getTitleStyle()}>{title}</Text>
                    <Text style={getSubtitleStyle()}>{subtitle}</Text>
                </View>
            </Pressable>
        </Animated.View>
    );
};
