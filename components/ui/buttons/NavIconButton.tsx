/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Nav Icon Button Component
 *  Icon-only button (circular/square) for navigation
 *  States: Default, Focused, Pressed
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import React from 'react';
import { Animated, Pressable, View, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface NavIconButtonProps {
    icon: React.ReactNode;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
}

export const NavIconButton: React.FC<NavIconButtonProps> = ({
    icon,
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
            width: 48,
            height: 48,
            borderRadius: 24,
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
                    shadowColor: '#ffffff50',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
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
            </Pressable>
        </Animated.View>
    );
};
