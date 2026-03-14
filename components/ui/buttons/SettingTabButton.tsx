/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Setting Tab Button Component
 *  Tab button with icon + text for settings
 *  States: Default, Focused, Active
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import React from 'react';
import { Animated, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface SettingTabButtonProps {
    icon: React.ReactNode;
    children: string;
    isActive?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
    nativeID?: string;
    nextFocusLeft?: number;
    nextFocusRight?: number;
    nextFocusUp?: number;
    nextFocusDown?: number;
}

export const SettingTabButton = React.forwardRef<any, SettingTabButtonProps>((
    {
        icon,
        children,
        isActive = false,
        disabled = false,
        onPress,
        onLongPress,
        style,
        testID,
        nativeID,
        nextFocusLeft,
        nextFocusRight,
        nextFocusUp,
        nextFocusDown,
    },
    ref
) => {
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
            justifyContent: 'flex-start',
            gap: Spacing.lg,
            paddingVertical: 10,
            paddingHorizontal: Spacing.sm,
            borderRadius: 12,
            width: '100%',
        };

        const isHighlighted = state === 'focused' || isActive;

        if (isHighlighted) {
            return {
                ...baseStyle,
                backgroundColor: Colors.dark[8],
                borderWidth: 1,
                borderColor: Colors.dark[7],
            };
        }

        return {
            ...baseStyle,
            backgroundColor: 'transparent',
        };
    };

    const getTextStyle = (): TextStyle => {
        const isHighlighted = state === 'focused' || isActive;

        return {
            color: Colors.gray[100],
            fontSize: 18,
            fontWeight: isHighlighted ? '700' : '500',
        };
    };

    const getIconColor = (): string => {
        return Colors.gray[100];
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                ref={ref}
                onPress={handlePress}
                onLongPress={handleLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onFocus={() => {
                    handleFocus();
                    if (!disabled && onPress) {
                        onPress();
                    }
                }}
                onBlur={handleBlur}
                disabled={disabled}
                style={[getButtonStyle(), style]}
                testID={testID}
                nativeID={nativeID}
                nextFocusLeft={nextFocusLeft}
                nextFocusRight={nextFocusRight}
                nextFocusUp={nextFocusUp}
                nextFocusDown={nextFocusDown}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={children}
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
                {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, {
                    color: getIconColor(),
                })}
                <Text style={getTextStyle()}>{children}</Text>
            </Pressable>
        </Animated.View>
    );
});
