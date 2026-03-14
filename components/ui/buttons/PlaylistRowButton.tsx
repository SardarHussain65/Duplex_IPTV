import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Animated,
    findNodeHandle,
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useButtonState } from "./useButtonState";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface PlaylistRowButtonProps extends Omit<PressableProps, 'style' | 'onPress' | 'nextFocusLeft' | 'nextFocusRight' | 'nextFocusUp' | 'nextFocusDown'> {
    label: string;
    url: string;
    isSelected?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    hasTVPreferredFocus?: boolean;
    nextFocusLeft?: any;
    nextFocusRight?: any;
    nextFocusUp?: any;
    nextFocusDown?: any;
}

// ── AnimatedPressable (same pattern as PlaylistButton) ────────────────────────
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Component ─────────────────────────────────────────────────────────────────
export const PlaylistRowButton = React.forwardRef<View, PlaylistRowButtonProps>(({
    label,
    url,
    isSelected = false,
    disabled = false,
    onPress,
    hasTVPreferredFocus = false,
    nextFocusLeft,
    nextFocusRight,
    nextFocusUp,
    nextFocusDown,
    ...restProps
}, ref) => {
    const {
        isFocused,
        isPressed,
        scaleAnim,
        handleFocus,
        handleBlur,
        handlePressIn,
        handlePressOut,
        handlePress,
    } = useButtonState({ isActive: isSelected, disabled, onPress });

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

    // highlighted = item has keyboard/TV focus or is being pressed
    const highlighted = isFocused || isPressed;


    return (
        <AnimatedPressable
            {...restProps}
            ref={(node) => {
                // @ts-ignore
                innerRef.current = node;
                if (typeof ref === 'function') (ref as any)(node);
                else if (ref) (ref as any).current = node;
            }}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onFocus={handleFocus}
            onBlur={handleBlur}
            focusable={!disabled}
            hasTVPreferredFocus={hasTVPreferredFocus}
            disabled={disabled}
            accessible={true}
            isTVSelectable={!disabled}
            style={[
                styles.pressable,
                {
                    borderColor: highlighted ? Colors.gray[100] : 'transparent',
                    backgroundColor: highlighted ? Colors.dark[9] : 'transparent',
                    opacity: disabled ? 0.4 : 1,
                },
            ]}
            nextFocusLeft={resolveFocus(nextFocusLeft as any)}
            nextFocusRight={resolveFocus(nextFocusRight as any)}
            nextFocusUp={resolveFocus(nextFocusUp as any)}
            nextFocusDown={resolveFocus(nextFocusDown as any)}
        >
            {/* Icon box */}
            <View
                style={[
                    styles.iconBox,
                    {
                        backgroundColor: highlighted ? Colors.dark[5] : Colors.dark[10],
                    },
                ]}
            >
                <Ionicons
                    name="layers-outline"
                    size={20}
                    color={highlighted ? Colors.gray[100] : Colors.dark[4]}
                />
            </View>

            {/* Text */}
            <View style={styles.textBlock}>
                <Text
                    style={[
                        styles.label,
                        {
                            color: Colors.gray[100],
                            fontWeight: highlighted ? "600" : "500",
                        },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {label}
                </Text>
                <Text
                    style={[
                        styles.url,
                        { color: Colors.gray[400] },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {url}
                </Text>
            </View>

            {/* Checkmark — visible only when this item is selected */}
            {isSelected && (
                <Ionicons
                    name="checkmark"
                    size={20}
                    color={Colors.gray[100]}
                    style={{ marginLeft: 8 }}
                />
            )}
        </AnimatedPressable>
    );
});

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    pressable: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        width: "100%",
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    textBlock: {
        flex: 1,
        overflow: 'hidden',
        paddingRight: 8,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
    },
    url: {
        fontSize: 11,
    },
});
