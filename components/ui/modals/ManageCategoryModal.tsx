import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { ActionOutlineButton } from '@/components/ui/buttons/ActionOutlineButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface ManageCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onLockPress: () => void;
    onRenamePress: () => void;
    isLocked: boolean;
    categoryName: string;
}

export const ManageCategoryModal: React.FC<ManageCategoryModalProps> = ({
    visible,
    onClose,
    onLockPress,
    onRenamePress,
    isLocked,
    categoryName,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <View style={styles.iconGrid}>
                        <View style={styles.iconRow}>
                            <View style={[styles.iconSquare, { backgroundColor: Colors.gray[100] }]} />
                            <View style={[styles.iconSquare, { backgroundColor: Colors.primaryBlue[600] }]} />
                        </View>
                        <View style={styles.iconRow}>
                            <View style={[styles.iconSquare, { backgroundColor: Colors.gray[100] }]} />
                            <View style={[styles.iconSquare, { backgroundColor: Colors.gray[100] }]} />
                        </View>
                    </View>

                    <Text style={styles.title}>Manage Category</Text>
                    <Text style={styles.subtitle}>What would you like to do with this category?</Text>

                    <View style={styles.buttonRow}>
                        <View style={styles.btnWrapper}>
                            <ActionFilledButton
                                onPress={onLockPress}
                                style={[styles.button, { backgroundColor: Colors.gray[100], borderRadius: scale(10) }]}
                                textColor={Colors.dark[11]}
                            >
                                {isLocked ? 'Unlock Category' : 'Lock Category'}
                            </ActionFilledButton>
                        </View>

                        <View style={styles.btnWrapper}>
                            <ActionFilledButton
                                onPress={onRenamePress}
                                style={[styles.button, { backgroundColor: Colors.dark[8], borderRadius: scale(10) }]}
                                textColor={Colors.dark[1]}
                            >
                                Rename Category
                            </ActionFilledButton>
                        </View>

                        <View style={styles.btnWrapper}>
                            <ActionOutlineButton
                                onPress={onClose}
                                style={[styles.button, { borderRadius: scale(10) }]}
                            >
                                Cancel
                            </ActionOutlineButton>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: xdWidth(640),
        backgroundColor: '#1E222D', // Slightly blueish dark as per reference
        borderRadius: scale(16),
        padding: scale(46),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    iconGrid: {
        marginBottom: xdHeight(24),
        gap: scale(4),
    },
    iconRow: {
        flexDirection: 'row',
        gap: scale(4),
    },
    iconSquare: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(4),
    },
    title: {
        fontSize: scale(28),
        fontWeight: '700',
        color: Colors.gray[100],
        marginBottom: xdHeight(16),
    },
    subtitle: {
        fontSize: scale(16),
        color: Colors.gray[400],
        marginBottom: xdHeight(36),
        textAlign: 'center',
        fontWeight: '500',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: xdWidth(12),
        width: '100%',
    },
    btnWrapper: {
        flex: 1,
    },
    button: {
        width: '100%',
        height: xdHeight(50),
    },
});
