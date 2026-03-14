import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { ActionOutlineButton } from '@/components/ui/buttons/ActionOutlineButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';

interface RenameCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (newName: string) => void;
    currentName: string;
}

export const RenameCategoryModal: React.FC<RenameCategoryModalProps> = ({
    visible,
    onClose,
    onSave,
    currentName,
}) => {
    const [newName, setNewName] = useState(currentName);

    useEffect(() => {
        if (visible) {
            setNewName(currentName);
        }
    }, [visible, currentName]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>Rename Category</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Enter category name"
                            placeholderTextColor={Colors.dark[6]}
                            autoFocus
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        <View style={styles.btnWrapper}>
                            <ActionOutlineButton onPress={onClose} style={[styles.button, { borderRadius: scale(10) }]}>
                                Cancel
                            </ActionOutlineButton>
                        </View>
                        <View style={styles.btnWrapper}>
                            <ActionFilledButton
                                onPress={() => onSave(newName)}
                                style={[styles.button, { backgroundColor: Colors.gray[100], borderRadius: scale(10) }]}
                                disabled={!newName.trim()}
                                textColor={Colors.dark[11]}
                            >
                                Save Changes
                            </ActionFilledButton>
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
        width: xdWidth(540),
        backgroundColor: '#1E222D',
        borderRadius: scale(16),
        padding: scale(40),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    title: {
        fontSize: scale(24),
        fontWeight: '700',
        color: Colors.gray[100],
        marginBottom: xdHeight(32),
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: xdHeight(32),
    },
    label: {
        fontSize: scale(14),
        color: Colors.dark[3],
        marginBottom: xdHeight(12),
        fontWeight: '500',
    },
    input: {
        backgroundColor: Colors.dark[10],
        borderWidth: 1,
        borderColor: Colors.dark[8],
        borderRadius: scale(8),
        paddingHorizontal: xdWidth(16),
        height: xdHeight(50),
        color: Colors.dark[1],
        fontSize: scale(16),
    },
    buttonRow: {
        flexDirection: 'row',
        gap: xdWidth(16),
    },
    btnWrapper: {
        flex: 1,
    },
    button: {
        width: '100%',
        height: xdHeight(50),
    },
});
