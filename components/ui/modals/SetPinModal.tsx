/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Set Pin Modal Component
 *  Modal to set a new 4-digit PIN for parental control
 * ─────────────────────────────────────────────────────────────
 */

import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { ActionOutlineButton } from '@/components/ui/buttons/ActionOutlineButton';
import { KeyboardButton } from '@/components/ui/buttons/KeyboardButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface SetPinModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (pin: string) => void;
}

export const SetPinModal: React.FC<SetPinModalProps> = ({ visible, onClose, onSave }) => {
    const [pin, setPin] = useState<string>('');

    const handleNumberPress = (num: number) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
        }
    };

    const handleSave = () => {
        if (pin.length === 4) {
            onSave(pin);
            setPin('');
        }
    };

    const handleCancel = () => {
        onClose();
        setPin('');
    };

    const renderPinDots = () => {
        const dots = [];
        for (let i = 0; i < 4; i++) {
            dots.push(
                <View key={i} style={[styles.pinBox, pin.length > i && styles.pinBoxFilled]}>
                    <Text style={styles.pinDot}>{pin.length > i ? '•' : '-'}</Text>
                </View>
            );
        }
        return dots;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>Set a New Pin</Text>

                    <View style={styles.pinContainer}>
                        {renderPinDots()}
                    </View>

                    <View style={styles.keyboard}>
                        <View style={styles.keyboardRow}>
                            {[0, 1, 2, 3, 4].map(num => (
                                <KeyboardButton key={num} onPress={() => handleNumberPress(num)} style={styles.key}>
                                    {num}
                                </KeyboardButton>
                            ))}
                        </View>
                        <View style={styles.keyboardRow}>
                            {[5, 6, 7, 8, 9].map(num => (
                                <KeyboardButton key={num} onPress={() => handleNumberPress(num)} style={styles.key}>
                                    {num}
                                </KeyboardButton>
                            ))}
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <View style={styles.btnWrapper}>
                            <ActionOutlineButton onPress={handleCancel} style={styles.btn}>
                                Cancel
                            </ActionOutlineButton>
                        </View>
                        <View style={styles.btnWrapper}>
                            <ActionFilledButton onPress={handleSave} style={styles.btn} disabled={pin.length < 4}>
                                Save
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
        width: xdWidth(480),
        backgroundColor: Colors.dark[11],
        borderRadius: scale(16),
        padding: scale(40),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark[8],
    },
    title: {
        fontSize: scale(20),
        fontWeight: '600',
        color: Colors.gray[100],
        marginBottom: xdHeight(32),
    },
    pinContainer: {
        flexDirection: 'row',
        gap: xdWidth(12),
        marginBottom: xdHeight(32),
    },
    pinBox: {
        width: xdWidth(60),
        height: xdHeight(60),
        backgroundColor: Colors.dark[10],
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: Colors.dark[7],
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinBoxFilled: {
        borderColor: Colors.gray[500],
    },
    pinDot: {
        fontSize: scale(24),
        color: Colors.gray[300],
        fontWeight: '700',
    },
    keyboard: {
        gap: xdHeight(12),
        marginBottom: xdHeight(40),
        alignItems: 'center',
    },
    keyboardRow: {
        flexDirection: 'row',
        gap: xdWidth(12),
    },
    key: {
        width: xdWidth(54),
        height: xdWidth(54),
        borderRadius: scale(8),
        backgroundColor: Colors.dark[9],
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
