/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Action Outline Button Component
 *  Outline-style button for secondary actions
 *  States: Default, Focused, Pressed
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing, scale } from '@/constants';
import React from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface ActionOutlineButtonProps {
    children: React.ReactNode;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: StyleProp<ViewStyle>;
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
        const baseTextStyle: TextStyle = {
            fontSize: scale(16),
            fontWeight: '600',
            textAlign: 'center',
            textAlignVertical: 'center',
            width: '100%',
        };

        switch (state) {
            case 'focused':
                return {
                    ...baseTextStyle,
                    color: Colors.gray[100],
                };
            case 'pressed':
                return {
                    ...baseTextStyle,
                    color: Colors.gray[400],
                };
            default:
                return {
                    ...baseTextStyle,
                    color: Colors.gray[300],
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
                {typeof children === 'string' ? (
                    <Text style={getTextStyle()}>{children}</Text>
                ) : (
                    children
                )}
            </Pressable>
        </Animated.View>
    );
};
