/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Action Filled Button Component
 *  Filled green button for primary CTAs
 *  States: Default, Focused, Pressed
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing, scale } from '@/constants';
import React from 'react';
import { Animated, findNodeHandle, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface ActionFilledButtonProps {
    children: string;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    gap?: number;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
    nativeID?: string;
    nextFocusLeft?: number | 'self';
    nextFocusRight?: number | 'self';
    nextFocusUp?: number | 'self';
    nextFocusDown?: number | 'self';
}

export const ActionFilledButton = React.forwardRef<any, ActionFilledButtonProps>((
    {
        children,
        disabled = false,
        onPress,
        onLongPress,
        icon,
        iconPosition = 'left',
        gap = Spacing.xs,
        textColor,
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
    } = useButtonState({ disabled, onPress, onLongPress });

    const innerRef = React.useRef(null);
    const [handles, setHandles] = React.useState<Record<string, number | undefined>>({});

    React.useEffect(() => {
        if (innerRef.current) {
            const handle = findNodeHandle(innerRef.current);
            setHandles({ self: handle || undefined });
        }
    }, [innerRef.current]);

    const resolveFocus = (val: number | 'self' | undefined) => {
        if (val === 'self') return handles.self;
        return val;
    };

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.lg,
            borderRadius: 8,
            minWidth: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: gap,
            borderWidth: 2,
            borderColor: 'transparent',
        };

        switch (state) {
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[1],
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
        const flattenedStyle = StyleSheet.flatten(style);
        const bg = flattenedStyle?.backgroundColor;
        
        // If background is very dark (like dark[8] or dark[11]), force light text
        const isDarkBg = bg === Colors.dark[8] || bg === Colors.dark[9] || bg === Colors.dark[10] || bg === Colors.dark[11] || bg === Colors.dark[12];
        const isRedBg = bg === Colors.error[500];

        let finalTextColor = textColor;
        if (!finalTextColor) {
            if (isRedBg || isDarkBg) {
                finalTextColor = Colors.dark[1]; // Light text for red/dark backgrounds
            } else if (state === 'focused') {
                finalTextColor = Colors.dark[11]; // Dark text on white focused background
            } else {
                finalTextColor = Colors.dark[11]; // Default dark text
            }
        }

        return {
            color: finalTextColor,
            fontSize: scale(16),
            fontWeight: '600',
            textAlign: 'center',
            textAlignVertical: 'center',
            width: '100%',
        };
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                ref={(node) => {
                    // @ts-ignore
                    innerRef.current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) (ref as any).current = node;
                }}
                onPress={handlePress}
                onLongPress={handleLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                style={[getButtonStyle(), style]}
                testID={testID}
                nativeID={nativeID}
                nextFocusLeft={resolveFocus(nextFocusLeft)}
                nextFocusRight={resolveFocus(nextFocusRight)}
                nextFocusUp={resolveFocus(nextFocusUp)}
                nextFocusDown={resolveFocus(nextFocusDown)}
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
                {iconPosition === 'left' && icon}
                <Text style={getTextStyle()}>{children}</Text>
                {iconPosition === 'right' && icon}
            </Pressable>
        </Animated.View>
    );
});
