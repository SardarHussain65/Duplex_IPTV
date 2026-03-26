import { Colors } from '@/constants';
import { scale } from '@/constants/scaling';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Animated, findNodeHandle, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

interface PlaylistRowButtonProps {
    disabled?: boolean;
    label: string;
    url?: string;
    isSelected?: boolean;
    isPinRequired?: boolean;
    onPress: () => void;
    hasTVPreferredFocus?: boolean;
    nextFocusUp?: number | 'self';
    nextFocusDown?: number | 'self';
    nextFocusLeft?: number | 'self';
    nextFocusRight?: number | 'self';
    style?: ViewStyle;
}

export const PlaylistRowButton = forwardRef<any, PlaylistRowButtonProps>(({
    disabled,
    label,
    url,
    isSelected,
    isPinRequired,
    onPress,
    hasTVPreferredFocus,
    nextFocusUp,
    nextFocusDown,
    nextFocusLeft,
    nextFocusRight,
    style
}, ref) => {
    const {
        state,
        scaleAnim,
        handleFocus,
        handleBlur,
        handlePressIn,
        handlePressOut,
        handlePress,
    } = useButtonState({ isActive: isSelected, disabled, onPress });

    const innerRef = useRef(null);
    const [handles, setHandles] = useState<Record<string, number | undefined>>({});

    useEffect(() => {
        if (innerRef.current) {
            const handle = findNodeHandle(innerRef.current);
            setHandles({ self: handle || undefined });
        }
    }, [innerRef.current]);

    const resolveFocus = (val: number | 'self' | undefined) => {
        if (val === 'self') return handles.self;
        return val;
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
            <Pressable
                ref={(node) => {
                    // @ts-ignore
                    innerRef.current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) (ref as any).current = node;
                }}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                hasTVPreferredFocus={hasTVPreferredFocus}
                nextFocusUp={resolveFocus(nextFocusUp)}
                nextFocusDown={resolveFocus(nextFocusDown)}
                nextFocusLeft={resolveFocus(nextFocusLeft)}
                nextFocusRight={resolveFocus(nextFocusRight)}
                style={[
                    styles.container,
                    state === 'focused' && styles.focused,
                    isSelected && styles.selected,
                    disabled && styles.disabled,
                ]}
            >
                <View style={styles.iconBox}>
                    <Ionicons
                        name={isPinRequired ? "lock-closed-outline" : "layers-outline"}
                        size={scale(20)}
                        color={state === 'focused' ? Colors.gray[100] : Colors.gray[300]}
                    />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.label, state === 'focused' && styles.focusedText]}>{label}</Text>
                    <Text style={styles.url} numberOfLines={1}>
                        {isPinRequired ? "This playlist is protected." : (url || "No URL provided")}
                    </Text>
                </View>
                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={scale(20)} color={Colors.primary[500]} />
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(12),
        backgroundColor: Colors.dark[9],
        borderRadius: scale(12),
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    focused: {
        borderColor: Colors.gray[100],
        backgroundColor: Colors.dark[8],
    },
    focusedText: {
        color: Colors.primary[500],
    },
    selected: {
        backgroundColor: Colors.dark[7],
    },
    disabled: {
        opacity: 0.5,
    },
    iconBox: {
        width: scale(40),
        height: scale(40),
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: scale(16),
        fontWeight: '600',
        color: '#FFFFFF',
    },
    url: {
        fontSize: scale(12),
        color: Colors.gray[400],
        marginTop: scale(2),
    },
    selectedIndicator: {
        marginLeft: scale(8),
    },
});
