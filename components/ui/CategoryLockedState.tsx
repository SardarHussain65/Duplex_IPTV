import { ActionOutlineButton } from '@/components/ui/buttons/ActionOutlineButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CategoryLockedStateProps {
    onLongPress?: () => void;
}

export const CategoryLockedState: React.FC<CategoryLockedStateProps> = ({ onLongPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <MaterialCommunityIcons name="lock-outline" size={scale(80)} color={Colors.gray[100]} />
                </View>
                <Text style={styles.title}>Category Locked</Text>
                <Text style={styles.subtitle}>Long press the category to unlock it.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    iconWrapper: {
        marginBottom: xdHeight(32),
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: scale(24),
        fontWeight: '700',
        color: Colors.gray[100],
        marginBottom: xdHeight(12),
    },
    subtitle: {
        fontSize: scale(16),
        color: Colors.gray[400],
        textAlign: 'center',
        maxWidth: xdWidth(400),
        lineHeight: scale(22),
    },
});
