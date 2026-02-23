import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { ActionOutlineButton } from '@/components/ui/buttons/ActionOutlineButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

export const ParentalPinModal: React.FC = () => {
    const { isParentalModalVisible, setParentalModalVisible, setActiveTab } = useTab();

    const handleOpenSettings = () => {
        setParentalModalVisible(false);
        setActiveTab('settings');
        // Logic to switch to parental section inside settings could be added here if needed
    };

    return (
        <Modal
            visible={isParentalModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setParentalModalVisible(false)}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    {/* Icon with Shield */}
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="account-group" size={scale(40)} color={Colors.gray[100]} />
                        <View style={styles.shieldBadge}>
                            <MaterialCommunityIcons name="shield-check" size={scale(14)} color={Colors.primaryBlue[950]} />
                        </View>
                    </View>

                    <Text style={styles.title}>Set Up Parental PIN</Text>
                    <Text style={styles.subtitle}>
                        To use parental lock, you need to create a PIN code first.{"\n"}
                        Open Settings and set your PIN to continue.
                    </Text>

                    <View style={styles.buttonRow}>
                        <View style={styles.btnWrapper}>
                            <ActionOutlineButton
                                onPress={() => setParentalModalVisible(false)}
                                style={styles.btn}
                            >
                                Cancel
                            </ActionOutlineButton>
                        </View>
                        <View style={styles.btnWrapper}>
                            <ActionFilledButton
                                onPress={handleOpenSettings}
                                style={styles.btn}
                            >
                                Open Settings
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
        backgroundColor: Colors.dark[10],
        borderRadius: scale(20),
        padding: scale(32),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark[8],
    },
    iconContainer: {
        marginBottom: xdHeight(20),
        position: 'relative',
    },
    shieldBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: Colors.dark[10],
        borderRadius: scale(10),
        padding: 2,
    },
    title: {
        fontSize: scale(22),
        fontWeight: '700',
        color: Colors.gray[500],
        marginBottom: xdHeight(12),
    },
    subtitle: {
        fontSize: scale(14),
        color: Colors.gray[400],
        textAlign: 'center',
        lineHeight: scale(20),
        marginBottom: xdHeight(24),
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
        minWidth: 0,
    },
});
