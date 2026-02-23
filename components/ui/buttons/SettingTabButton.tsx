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
}

export const SettingTabButton: React.FC<SettingTabButtonProps> = ({
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
            justifyContent: 'flex-start',
            gap: Spacing.md,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.xl,
            borderRadius: 12,
            minWidth: 200,
        };

        const isHighlighted = state === 'focused' || isActive;

        if (isHighlighted) {
            return {
                ...baseStyle,
                backgroundColor: Colors.primary[950],
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
            color: isHighlighted ? Colors.dark[11] : Colors.gray[100],
            fontSize: 18,
            fontWeight: '600',
        };
    };

    const getIconColor = (): string => {
        const isHighlighted = state === 'focused' || isActive;

        return isHighlighted ? Colors.dark[11] : Colors.gray[100];
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
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
};
