/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Keyboard Button Component
 *  On-screen keyboard button for numbers/characters
 *  States: Default, Focused, Pressed
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface KeyboardButtonProps {
    children: string | number;
    disabled?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    testID?: string;
}

export const KeyboardButton: React.FC<KeyboardButtonProps> = ({
    children,
    disabled = false,
    onPress,
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
    } = useButtonState({ disabled, onPress });

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            width: 56,
            height: 56,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        };

        switch (state) {
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[8],
                    borderWidth: 2,
                    borderColor: Colors.gray[700],
                };
            case 'pressed':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[11],
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[9],
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        switch (state) {
            case 'focused':
                return {
                    color: Colors.gray[100],
                    fontSize: 24,
                    fontWeight: '600',
                };
            case 'pressed':
                return {
                    color: Colors.gray[400],
                    fontSize: 24,
                    fontWeight: '600',
                };
            default:
                return {
                    color: Colors.gray[300],
                    fontSize: 24,
                    fontWeight: '500',
                };
        }
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPress={handlePress}
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
