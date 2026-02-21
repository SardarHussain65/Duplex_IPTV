/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Action Outline Button Component
 *  Outline-style button for secondary actions
 *  States: Default, Focused, Pressed
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface ActionOutlineButtonProps {
    children: string;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
}

export const ActionOutlineButton: React.FC<ActionOutlineButtonProps> = ({
    children,
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
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.lg,
            borderRadius: 8,
            borderWidth: 2,
            minWidth: 100,
            alignItems: 'center',
            justifyContent: 'center',
        };

        switch (state) {
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[10],
                    borderColor: Colors.dark[3], // Subtle border
                };
            case 'pressed':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[11],
                    borderColor: Colors.gray[600],
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    borderColor: Colors.gray[600],
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        switch (state) {
            case 'focused':
                return {
                    color: Colors.gray[100],
                    fontSize: 16,
                    fontWeight: '600',
                };
            case 'pressed':
                return {
                    color: Colors.gray[400],
                    fontSize: 16,
                    fontWeight: '600',
                };
            default:
                return {
                    color: Colors.gray[300],
                    fontSize: 16,
                    fontWeight: '500',
                };
        }
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
                focusable={true}
                tvParallaxProperties={{
                    enabled: true,
                    shiftDistanceX: 2,
                    shiftDistanceY: 2,
                    tiltAngle: 0.05,
                    magnification: 1.05,
                }}
            >
                <Text style={getTextStyle()}>{children}</Text>
            </Pressable>
        </Animated.View>
    );
};
