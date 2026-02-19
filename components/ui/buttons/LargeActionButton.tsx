/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Large Action Button Component
 *  Large button with icon + text for primary actions
 *  States: Default, Focused, Pressed
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface LargeActionButtonProps {
    icon?: React.ReactNode;
    children: string;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
}

export const LargeActionButton: React.FC<LargeActionButtonProps> = ({
    icon,
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.md,
            paddingVertical: Spacing.lg,
            paddingHorizontal: Spacing['2xl'],
            borderRadius: 12,
            minWidth: 200,
            minHeight: 64,
        };

        switch (state) {
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.primary[900],
                    borderWidth: 2,
                    borderColor: Colors.dark[1], // White border
                };
            case 'pressed':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.primary[800],
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: Colors.primary[950],
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        return {
            color: Colors.dark[11],
            fontSize: 20,
            fontWeight: '700',
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
                focusable={true}
                tvParallaxProperties={{
                    enabled: true,
                    shiftDistanceX: 2,
                    shiftDistanceY: 2,
                    tiltAngle: 0.05,
                    magnification: 1.05,
                }}
            >
                {icon && <View>{icon}</View>}
                <Text style={getTextStyle()}>{children}</Text>
            </Pressable>
        </Animated.View>
    );
};
