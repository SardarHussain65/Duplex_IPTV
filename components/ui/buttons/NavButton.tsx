/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Nav Button Component
 *  Navigation button with icon + text (Movies, Series, etc.)
 *  States: Default, Focused, Pressed, Active
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
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
    hasTVPreferredFocus?: boolean;
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
    hasTVPreferredFocus = false,
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
            gap: xdWidth(8),
            paddingVertical: xdHeight(8),
            paddingHorizontal: xdWidth(12),
            borderRadius: scale(20),
            minWidth: xdWidth(90)
        };

        switch (state) {
            case 'active':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.primaryBlue[950],
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
                    color: Colors.dark[1],
                    fontSize: scale(12),
                    fontWeight: '500',
                };
            case 'focused':
                return {
                    color: Colors.dark[1],
                    fontSize: scale(14),
                    fontWeight: '600',
                };
            case 'pressed':
                return {
                    color: Colors.dark[1],
                    fontSize: scale(12),
                    fontWeight: '500',
                };
            default:
                return {
                    color: Colors.dark[2],
                    fontSize: scale(12),
                    fontWeight: '500',
                };
        }
    };

    const getIconColor = (): string => {
        switch (state) {
            case 'active':
                return Colors.dark[1]; // Dark icon on green background
            case 'focused':
                return Colors.dark[1]; // White icon
            case 'pressed':
                return Colors.dark[1]; // Dimmed
            default:
                return Colors.dark[2]; // Light gray
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
                hasTVPreferredFocus={hasTVPreferredFocus}
                focusable={!disabled}
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
