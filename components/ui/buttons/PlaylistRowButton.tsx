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
    ...rest
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

    const active = state === 'active' || state === 'focused' || state === 'pressed';


    return (
        <AnimatedPressable
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
                    borderColor: active ? Colors.dark[5] : Colors.dark[8],
                    backgroundColor: active ? Colors.dark[12] : Colors.dark[10],
                    transform: [{ scale: scaleAnim }],
                    opacity: disabled ? 0.4 : 1,
                },
            ]}
            nextFocusLeft={resolveFocus(rest.nextFocusLeft as any)}
            nextFocusRight={resolveFocus(rest.nextFocusRight as any)}
            nextFocusUp={resolveFocus(rest.nextFocusUp as any)}
            nextFocusDown={resolveFocus(rest.nextFocusDown as any)}
        >
            {/* Icon box */}
            <View
                style={[
                    styles.iconBox,
                    {
                        backgroundColor: active ? Colors.dark[5] : Colors.dark[9],
                    },
                ]}
            >
                <Ionicons
                    name="layers-outline"
                    size={20}
                    color={active ? Colors.dark[1] : Colors.dark[4]}
                />
            </View>

            {/* Text */}
            <View style={styles.textBlock}>
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
                        styles.url,
                        { color: active ? Colors.dark[4] : Colors.dark[5] },
                    ]}
                    numberOfLines={1}
                >
                    {url}
                </Text>
            </View>
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
        padding: 14,
        marginBottom: 10,
        width: "100%",
    },
    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },
    textBlock: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        marginBottom: 2,
    },
    url: {
        fontSize: 11,
    },
});
