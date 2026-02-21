/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Search Bar Component
 *  Search input with icon
 *  States: Default, Focused
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TextStyle, View, ViewStyle } from 'react-native';

export interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onSubmit?: (text: string) => void;
    style?: ViewStyle;
    testID?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search for series...',
    value,
    onChangeText,
    onSubmit,
    style,
    testID,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const containerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xxs,
        borderRadius: 8,
        backgroundColor: isFocused ? Colors.dark[8] : Colors.dark[10],
        borderWidth: 2,
        borderColor: isFocused ? Colors.gray[700] : 'transparent',

    };

    const inputStyle: TextStyle = {
        flex: 1,
        color: Colors.gray[100],
        fontSize: 16,
        fontWeight: '500',
    };

    return (
        <View style={[containerStyle, style]} testID={testID} focusable={true}>
            <Ionicons
                name="search"
                size={20}
                color={isFocused ? Colors.gray[100] : Colors.gray[400]}
            />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={() => onSubmit?.(value || '')}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor={isFocused ? Colors.dark[1] : Colors.dark[3]}
                style={inputStyle}
                tvParallaxProperties={{
                    enabled: true,
                    shiftDistanceX: 2,
                    shiftDistanceY: 2,
                    tiltAngle: 0.05,
                    magnification: 1.02,
                }}
            />
        </View>
    );
};
