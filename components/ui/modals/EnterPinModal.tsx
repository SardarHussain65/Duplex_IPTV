import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { ActionOutlineButton } from '@/components/ui/buttons/ActionOutlineButton';
import { KeyboardButton } from '@/components/ui/buttons/KeyboardButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface EnterPinModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    expectedPin: string;
    title?: string;
    buttonText?: string;
}

export const EnterPinModal: React.FC<EnterPinModalProps> = ({
    visible,
    onClose,
    onSuccess,
    expectedPin,
    title = 'Enter PIN to Continue',
    buttonText = 'Continue'
}) => {
    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleNumberPress = (num: number) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
            setError(null);
        }
    };

    const handleContinue = () => {
        if (pin === expectedPin) {
            onSuccess();
            setPin('');
        } else {
            setError('Incorrect PIN. Please try again.');
            setPin('');
        }
    };

    const handleCancel = () => {
        onClose();
        setPin('');
        setError(null);
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

    const numbers = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 0]
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>{title}</Text>

                    <View style={styles.pinContainer}>
                        {renderPinDots()}
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

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
                            <ActionFilledButton onPress={handleContinue} style={styles.btn} disabled={pin.length < 4}>
                                {buttonText}
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
    errorText: {
        color: '#ff4444',
        fontSize: scale(14),
        marginBottom: xdHeight(16),
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
