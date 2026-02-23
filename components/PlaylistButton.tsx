import { Colors } from "@/constants";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { PlaylistFocusIcon, PlaylistIcon } from "../assets/icons";
import { useButtonState } from "./ui/buttons/useButtonState";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PlaylistButtonProps {
    label: string;
    count: number;
    isSelected?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    circleSize?: number;
    hasTVPreferredFocus?: boolean;
}

export const PlaylistButton: React.FC<PlaylistButtonProps> = ({
    label,
    count,
    isSelected = false,
    disabled = false,
    onPress,
    circleSize = 100, // Pass raw number, we scale it here or in styles
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
    } = useButtonState({ isActive: isSelected, disabled, onPress });

    const active = state === 'focused' || state === 'active';
    const sSize = circleSize; // Assuming circleSize passed is already scaled or handles itself

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onFocus={handleFocus}
            onBlur={handleBlur}
            focusable={true}
            hasTVPreferredFocus={hasTVPreferredFocus}
            style={[
                styles.pressable,
                {
                    width: sSize,
                    transform: [{ scale: scaleAnim }],
                }
            ]}
            accessible={true}
            isTVSelectable={true}
            disabled={disabled}
        >
            <View
                style={[
                    styles.circle,
                    {
                        width: sSize,
                        height: sSize,
                        borderRadius: sSize / 2,
                        backgroundColor: active ? Colors.dark[12] : undefined,
                        borderColor: active ? Colors.dark[5] : Colors.dark[8],

                    },
                ]}
            >
                {active ? (
                    <PlaylistFocusIcon width={sSize * 0.55} height={sSize * 0.55} />
                ) : (
                    <PlaylistIcon width={sSize * 0.55} height={sSize * 0.55} />
                )}
            </View>

            <Text
                style={[
                    styles.label,
                    {
                        color: active ? Colors.dark[1] : Colors.dark[4],
                        fontWeight: active ? "600" : "400",
                    },
                ]}
            >
                {label}
            </Text>

            <Text
                style={[
                    styles.count,
                    {
                        color: active ? Colors.dark[4] : Colors.dark[5],
                    },
                ]}
            >
                {count} {count === 1 ? 'Playlist' : 'Playlists'}
            </Text>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    pressable: {
        alignItems: "center",
        justifyContent: "center",
    },
    circle: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        marginBottom: 12,
    },
    label: {
        textAlign: "center",
        fontSize: 16,
        marginBottom: 4,
    },
    count: {
        textAlign: "center",
        fontSize: 12,
    },
});
