/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Nav Button Component
 *  Navigation button with icon + text (Movies, Series, etc.)
 *  States: Default, Focused, Pressed, Active
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface NavButtonProps {
    icon: React.ReactNode;
    children: string;
    isActive?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
}

export const NavButton: React.FC<NavButtonProps> = ({
    icon,
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
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: 24,
            minWidth: 120
        };

        switch (state) {
            case 'active':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.primary[950], // Neon green
                    borderWidth: 0,
                };
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[8], // Gray background
                    borderWidth: 2,
                    borderColor: Colors.gray[700], // Subtle border
                    shadowColor: '#ffffff80',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                };
            case 'pressed':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[12], // Darker
                    borderWidth: 0,
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[9], // Dark gray
                    borderWidth: 0,
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        switch (state) {
            case 'active':
                return {
                    color: Colors.dark[11], // Dark text on green background
                    fontSize: 16,
                    fontWeight: '600',
                };
            case 'focused':
                return {
                    color: Colors.gray[100], // White text
                    fontSize: 16,
                    fontWeight: '600',
                };
            case 'pressed':
                return {
                    color: Colors.gray[400], // Dimmed
                    fontSize: 16,
                    fontWeight: '600',
                };
            default:
                return {
                    color: Colors.gray[500], // Light gray
                    fontSize: 16,
                    fontWeight: '500',
                };
        }
    };

    const getIconColor = (): string => {
        switch (state) {
            case 'active':
                return Colors.dark[11]; // Dark icon on green background
            case 'focused':
                return Colors.gray[100]; // White icon
            case 'pressed':
                return Colors.gray[400]; // Dimmed
            default:
                return Colors.gray[500]; // Light gray
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
                {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, {
                    color: getIconColor(),
                })}
                <Text style={getTextStyle()}>{children}</Text>
            </Pressable>
        </Animated.View>
    );
};
