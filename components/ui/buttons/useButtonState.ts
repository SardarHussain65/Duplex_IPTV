/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Button State Management Hook
 *  Handles all button states: Default, Focused, Pressed, Active
 * ─────────────────────────────────────────────────────────────
 */

import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';

export type ButtonState = 'default' | 'focused' | 'pressed' | 'active';

interface UseButtonStateProps {
    isActive?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
}

interface UseButtonStateReturn {
    state: ButtonState;
    isFocused: boolean;
    isPressed: boolean;
    isActive: boolean;
    scaleAnim: Animated.Value;
    handleFocus: () => void;
    handleBlur: () => void;
    handlePressIn: () => void;
    handlePressOut: () => void;
    handlePress: () => void;
    handleLongPress: () => void;
}

export const useButtonState = ({
    isActive = false,
    disabled = false,
    onPress,
    onLongPress,
}: UseButtonStateProps): UseButtonStateReturn => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Determine current state (priority order: active > pressed > focused > default)
    const getState = (): ButtonState => {
        if (disabled) return 'default';
        if (isActive) return 'active';
        if (isPressed) return 'pressed';
        if (isFocused) return 'focused';
        return 'default';
    };

    const handleFocus = useCallback(() => {
        if (disabled) return;
        setIsFocused(true);
        Animated.spring(scaleAnim, {
            toValue: 1.05,
            useNativeDriver: true,
            friction: 8,
            tension: 100,
        }).start();
    }, [disabled, scaleAnim]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        setIsPressed(false);
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 100,
        }).start();
    }, [scaleAnim]);

    const handlePressIn = useCallback(() => {
        if (disabled) return;
        setIsPressed(true);
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            friction: 8,
            tension: 100,
        }).start();
    }, [disabled, scaleAnim]);

    const handlePressOut = useCallback(() => {
        setIsPressed(false);

        const toValue = isFocused ? 1.05 : 1;

        Animated.spring(scaleAnim, {
            toValue,
            useNativeDriver: true,
            friction: 8,
            tension: 100,
        }).start();

    }, [isFocused, scaleAnim]);


    const handlePress = useCallback(() => {
        if (disabled) return;
        onPress?.();
    }, [disabled, onPress]);

    const handleLongPress = useCallback(() => {
        if (disabled) return;
        onLongPress?.();
    }, [disabled, onLongPress]);

    return {
        state: getState(),
        isFocused,
        isPressed,
        isActive,
        scaleAnim,
        handleFocus,
        handleBlur,
        handlePressIn,
        handlePressOut,
        handlePress,
        handleLongPress,
    };
};
