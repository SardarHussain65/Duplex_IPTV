/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Category Card Component
 *  Card button with icon + title + count
 *  States: Default, Focused, Pressed, Active
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface CategoryCardProps {
    icon: React.ReactNode;
    title: string;
    count?: number;
    isActive?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
    icon,
    title,
    count,
    isActive = false,
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
    } = useButtonState({ isActive, disabled, onPress, onLongPress });

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.sm,
            paddingVertical: Spacing.lg,
            paddingHorizontal: Spacing.xl,
            borderRadius: 12,
            minWidth: 160,
            minHeight: 140,
        };

        switch (state) {
            case 'active':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.primary[950],
                };
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
        switch (state) {
            case 'active':
                return {
                    color: Colors.dark[11],
                    fontSize: 18,
                    fontWeight: '600',
                };
            case 'focused':
                return {
                    color: Colors.gray[100],
                    fontSize: 18,
                    fontWeight: '600',
                };
            case 'pressed':
                return {
                    color: Colors.gray[400],
                    fontSize: 18,
                    fontWeight: '600',
                };
            default:
                return {
                    color: Colors.gray[300],
                    fontSize: 18,
                    fontWeight: '500',
                };
        }
    };

    const getCountStyle = (): TextStyle => {
        return {
            color: state === 'active' ? Colors.dark[11] : Colors.gray[500],
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
                <Text style={getTitleStyle()}>{title}</Text>
                {count !== undefined && (
                    <Text style={getCountStyle()}>({count})</Text>
                )}
            </Pressable>
        </Animated.View>
    );
};
