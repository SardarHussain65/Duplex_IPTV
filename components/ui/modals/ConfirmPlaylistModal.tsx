import { ChangePlayList } from '@/assets/icons';
import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { ActionOutlineButton } from '@/components/ui/buttons/ActionOutlineButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface ConfirmPlaylistModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmPlaylistModal: React.FC<ConfirmPlaylistModalProps> = ({
    visible,
    onClose,
    onConfirm,
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
                    <View style={styles.iconContainer}>
                        <ChangePlayList width={xdWidth(48)} height={xdHeight(48)} />
                    </View>

                    <Text style={styles.title}>Change Playlist?</Text>
                    <Text style={styles.subtitle}>Switching will reload all content. Continue?</Text>

                    <View style={styles.buttonRow}>
                        <View style={styles.btnWrapper}>
                            <ActionOutlineButton onPress={onClose} style={styles.btn}>
                                Cancel
                            </ActionOutlineButton>
                        </View>
                        <View style={styles.btnWrapper}>
                            <ActionFilledButton onPress={onConfirm} style={styles.btn}>
                                Confirm
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
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: xdWidth(480),
        backgroundColor: Colors.dark[9],
        borderRadius: scale(12),
        padding: scale(40),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark[8],
    },
    iconContainer: {
        marginBottom: xdHeight(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: scale(20),
        fontWeight: '600',
        color: Colors.gray[100],
        marginBottom: xdHeight(12),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: scale(14),
        color: Colors.gray[400],
        marginBottom: xdHeight(32),
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: xdWidth(16),
        width: '100%',
    },
    btnWrapper: {
        flex: 1,
    },
    btn: {
        width: '100%',
        height: xdHeight(48),
    },
});
