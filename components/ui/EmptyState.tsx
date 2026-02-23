import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface EmptyStateProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    subtitle: string;
    style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, style }) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name={icon} size={scale(64)} color={Colors.gray[100]} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: xdHeight(60),
        paddingHorizontal: xdWidth(40),
    },
    iconWrapper: {
        marginBottom: xdHeight(20),
    },
    title: {
        fontSize: scale(24),
        fontWeight: '700',
        color: Colors.gray[100],
        marginBottom: xdHeight(12),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: scale(14),
        color: Colors.gray[400],
        textAlign: 'center',
        lineHeight: scale(22),
        maxWidth: xdWidth(500),
    },
});
