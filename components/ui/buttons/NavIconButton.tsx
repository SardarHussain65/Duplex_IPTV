/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Nav Icon Button Component
 *  Icon-only button (circular/square) for navigation
 *  States: Default, Focused, Pressed, Active
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import { scale } from '@/constants/scaling';
import React from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface NavIconButtonProps {
    icon: React.ReactNode;
    isActive?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    activeBackgroundColor?: string;
    testID?: string;
    hasTVPreferredFocus?: boolean;
    nextFocusRight?: number;
    nextFocusLeft?: number;
    nextFocusDown?: number;
    innerRef?: React.Ref<any>;
}

export const NavIconButton: React.FC<NavIconButtonProps> = ({
    icon,
    isActive = false,
    disabled = false,
    onPress,
    onLongPress,
    style,
    activeBackgroundColor,
    testID,
    hasTVPreferredFocus = false,
    nextFocusRight,
    nextFocusLeft,
    nextFocusDown,
    innerRef,
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
            width: scale(40),
            height: scale(40),
            borderRadius: scale(20),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'transparent',
        };

        switch (state) {
            case 'active':
                return {
                    ...baseStyle,
                    backgroundColor: activeBackgroundColor ?? Colors.primaryBlue[950], // Blue fill when tab is active
                };
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[8],
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
                ref={innerRef}
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
                nextFocusRight={nextFocusRight}
                nextFocusLeft={nextFocusLeft}
                nextFocusDown={nextFocusDown}
                tvParallaxProperties={{
                    enabled: true,
                    shiftDistanceX: 2,
                    shiftDistanceY: 2,
                    tiltAngle: 0.05,
                    magnification: 1.05,
                }}
            >
                {React.isValidElement(icon)
                    ? React.cloneElement(icon as React.ReactElement<any>, {
                        color: getIconColor(),
                    })
                    : icon}
            </Pressable>
        </Animated.View>
    );
};
