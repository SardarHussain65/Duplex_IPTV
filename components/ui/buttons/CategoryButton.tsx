import { Colors, Spacing } from '@/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, findNodeHandle, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import { useButtonState } from './useButtonState';

export interface CategoryButtonProps {
    children: React.ReactNode;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    isActive?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    style?: ViewStyle;
    testID?: string;
    nativeID?: string;
    nextFocusLeft?: number | 'self';
    nextFocusRight?: number | 'self';
    nextFocusUp?: number | 'self';
    nextFocusDown?: number | 'self';
}

export const CategoryButton = React.forwardRef<any, CategoryButtonProps>(({
    children,
    icon,
    isActive = false,
    disabled = false,
    onPress,
    onLongPress,
    style,
    testID,
    nativeID,
    nextFocusLeft,
    nextFocusRight,
    nextFocusUp,
    nextFocusDown,
}, ref) => {
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
        // ... (rest of getButtonStyle remains same)
        const baseStyle: ViewStyle = {
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: 10,
            minWidth: 80,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: 'transparent',
            flexDirection: 'row',
        };

        if (isActive) {
            return {
                ...baseStyle,
                backgroundColor: Colors.gray[100],
            };
        }

        switch (state) {
            case 'focused':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[8],
                    borderColor: Colors.gray[700],
                    shadowColor: '#ffffff40',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                };
            case 'pressed':
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[11],
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: Colors.dark[9],
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        if (isActive) {
            return {
                color: Colors.dark[11],
                fontSize: 14,
                fontWeight: '700',
            };
        }

        switch (state) {
            case 'focused':
                return {
                    color: Colors.gray[100],
                    fontSize: 14,
                    fontWeight: '600',
                };
            case 'pressed':
                return {
                    color: Colors.gray[400],
                    fontSize: 14,
                    fontWeight: '500',
                };
            default:
                return {
                    color: Colors.gray[300],
                    fontSize: 14,
                    fontWeight: '500',
                };
        }
    };

    const getIconColor = () => {
        if (isActive) return Colors.dark[11];
        if (state === 'focused') return Colors.gray[100];
        return Colors.gray[300];
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
                {icon && (
                    <MaterialCommunityIcons
                        name={icon}
                        size={18}
                        color={getIconColor()}
                        style={{ marginRight: 8 }}
                    />
                )}
                <Text style={getTextStyle()}>{children}</Text>
            </Pressable>
        </Animated.View>
    );
});
