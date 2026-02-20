/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Category Button Component
 *  Text-only category button (Featured, etc.)
 *  States: Default, Focused, Pressed, Active
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface CategoryButtonProps {
    children: string;
    isActive?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
    children,
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
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: 10,
            minWidth: 80,
            alignItems: 'center',
            justifyContent: 'center',
        };

        switch (state) {
            case 'active':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[1],
                };
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[8],
                    borderWidth: 2,
                    borderColor: Colors.gray[700], // Subtle border
                    shadowColor: '#ffffff40',
                    shadowOffset: { width: 0, height: 2 },
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

    const getTextStyle = (): TextStyle => {
        switch (state) {
            case 'active':
                return {
                    color: Colors.dark[12],
                    fontSize: 14,
                    fontWeight: '600',
                };
            case 'focused':
                return {
                    color: Colors.gray[100],
                    fontSize: 14,
                    fontWeight: '600',
                };
            case 'pressed':
                return {
                    color: Colors.gray[400],
                    fontSize: 14,
                    fontWeight: '500',
                };
            default:
                return {
                    color: Colors.gray[300],
                    fontSize: 14,
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
