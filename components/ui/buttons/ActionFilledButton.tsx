/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Action Filled Button Component
 *  Filled green button for primary CTAs
 *  States: Default, Focused, Pressed
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface ActionFilledButtonProps {
    children: string;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
}

export const ActionFilledButton: React.FC<ActionFilledButtonProps> = ({
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
            minWidth: 100,
            alignItems: 'center',
            justifyContent: 'center',
        };

        switch (state) {
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[1],
                    borderWidth: 2,
                    borderColor: Colors.dark[7], // White/Very light border
                };
            case 'pressed':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[4],
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[3],
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        return {
            color: Colors.dark[11],
            fontSize: 16,
            fontWeight: '600',
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
                <Text style={getTextStyle()}>{children}</Text>
            </Pressable>
        </Animated.View>
    );
};
