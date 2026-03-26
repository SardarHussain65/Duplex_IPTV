import { Colors } from '@/constants';
import { scale } from '@/constants/scaling';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface PlaylistRowButtonProps {
    disabled?: boolean;
    label: string;
    url?: string;
    isSelected?: boolean;
    isPinRequired?: boolean;
    onPress: () => void;
    hasTVPreferredFocus?: boolean;
    nextFocusUp?: number;
    nextFocusDown?: number;
    nextFocusLeft?: number;
    nextFocusRight?: number;
    style?: ViewStyle;
}

export const PlaylistRowButton = forwardRef<View, PlaylistRowButtonProps>(({
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
    return (
        <Pressable
            ref={ref}
            onPress={onPress}
            disabled={disabled}
            hasTVPreferredFocus={hasTVPreferredFocus}
            nextFocusUp={nextFocusUp}
            nextFocusDown={nextFocusDown}
            nextFocusLeft={nextFocusLeft}
            nextFocusRight={nextFocusRight}
            style={({ focused }) => [
                styles.container,
                focused && styles.focused,
                isSelected && styles.selected,
                disabled && styles.disabled,
                style
            ]}
        >
            <View style={styles.iconBox}>
                <Ionicons
                    name={isPinRequired ? "lock-closed-outline" : "layers-outline"}
                    size={scale(20)}
                    color={Colors.gray[300]}
                />
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
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
