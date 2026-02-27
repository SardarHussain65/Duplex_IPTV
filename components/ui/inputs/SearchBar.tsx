/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Search Bar Component
 *  Search input with icon
 *  States: Default, Focused
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Pressable, TextInput, TextStyle, ViewStyle } from 'react-native';

export interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onSubmit?: (text: string) => void;
    style?: ViewStyle;
    testID?: string;
    innerRef?: React.Ref<any>;
    nextFocusLeft?: number;
    nextFocusUp?: number;
    nextFocusRight?: number;
    nextFocusDown?: number;
    hasTVPreferredFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search for series...',
    value,
    onChangeText,
    onSubmit,
    style,
    testID,
    innerRef,
    nextFocusLeft,
    nextFocusUp,
    nextFocusRight,
    nextFocusDown,
    hasTVPreferredFocus = false,
}) => {
    const [isContainerFocused, setIsContainerFocused] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const isFocused = isContainerFocused || isInputFocused;

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
        <Pressable
            ref={innerRef}
            testID={testID}
            style={[containerStyle, style]}
            onFocus={() => setIsContainerFocused(true)}
            onBlur={() => setIsContainerFocused(false)}
            onPress={() => inputRef.current?.focus()}
            hasTVPreferredFocus={hasTVPreferredFocus}
            nextFocusLeft={nextFocusLeft}
            nextFocusUp={nextFocusUp}
            nextFocusRight={nextFocusRight}
            nextFocusDown={nextFocusDown}
        >
            <Ionicons
                name="search"
                size={20}
                color={isFocused ? Colors.gray[100] : Colors.gray[400]}
            />
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={() => onSubmit?.(value || '')}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder={placeholder}
                placeholderTextColor={isFocused ? Colors.dark[1] : Colors.dark[3]}
                style={inputStyle}
                focusable={false}
            />
        </Pressable>
    );
};
