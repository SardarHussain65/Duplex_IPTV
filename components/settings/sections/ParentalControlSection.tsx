import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { SettingCard } from '@/components/ui/cards/SettingCard';
import { EnterPinModal } from '@/components/ui/modals/EnterPinModal';
import { SetPinModal } from '@/components/ui/modals/SetPinModal';
import { Colors } from '@/constants';
import { useTab } from '@/context/TabContext';
import { panelStyles } from '@/styles/settings_panel.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { findNodeHandle, StyleSheet, Switch, Text, View } from 'react-native';

interface ParentalControlSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const ParentalControlSection: React.FC<ParentalControlSectionProps> = ({
    startRef,
    sidebarRef,
}) => {
    const {
        isParentalControlEnabled,
        setIsParentalControlEnabled,
        parentalPin,
        setParentalPin,
    } = useTab();

    const [isSetModalVisible, setSetModalVisible] = useState(false);
    const [isEnterModalVisible, setEnterModalVisible] = useState(false);
    const [pendingAction, setPendingAction] = useState<'enable' | 'change' | null>(null);

    const handleSwitchChange = (val: boolean) => {
        if (val) {
            if (!parentalPin) {
                setPendingAction('enable');
                setSetModalVisible(true);
            } else {
                setIsParentalControlEnabled(true);
            }
        } else {
            setIsParentalControlEnabled(false);
        }
    };

    const handleChangePin = () => {
        setPendingAction('change');
        setEnterModalVisible(true);
    };

    return (
        <View style={{ gap: 20 }}>
            <SettingCard
                ref={startRef}
                nativeID="settings_content_start"
                nextFocusLeft={findNodeHandle(sidebarRef.current) || undefined}
                title="Enable Parental Control"
                subtitle="Require PIN to access restricted content"
                icon={
                    <View pointerEvents="none">
                        <Switch
                            value={isParentalControlEnabled}
                            onValueChange={setIsParentalControlEnabled}
                            trackColor={{ false: Colors.dark[8], true: '#E91E63' }}
                            thumbColor={Colors.gray[100]}
                        />
                    </View>
                }
                iconPosition="right"
                onPress={() => handleSwitchChange(!isParentalControlEnabled)}
            />

            {isParentalControlEnabled && (
                <View style={[panelStyles.card, { paddingBottom: 16 }]}>
                    <Text style={panelStyles.cardTitle}>Pin Setting</Text>
                    <Text style={panelStyles.rowLabel}>Current Pin</Text>
                    <View style={styles.pinRow}>
                        <View style={styles.pinDisplay}>
                            <Text style={styles.pinText}>****</Text>
                        </View>
                        <ActionFilledButton
                            onPress={handleChangePin}
                            style={styles.changeBtn}
                            icon={<MaterialCommunityIcons name="lock-outline" size={20} color={Colors.dark[11]} />}
                            gap={6}
                            textColor={Colors.dark[11]}
                        >
                            Change Pin
                        </ActionFilledButton>
                    </View>
                </View>
            )}

            <SetPinModal
                visible={isSetModalVisible}
                onClose={() => {
                    setSetModalVisible(false);
                    setPendingAction(null);
                }}
                onSave={(newPin) => {
                    setParentalPin(newPin);
                    setSetModalVisible(false);
                    if (pendingAction === 'enable') {
                        setIsParentalControlEnabled(true);
                    }
                    setPendingAction(null);
                }}
            />

            <EnterPinModal
                visible={isEnterModalVisible}
                onClose={() => {
                    setEnterModalVisible(false);
                    setPendingAction(null);
                }}
                expectedPin={parentalPin || '0000'}
                title="Enter Current Password"
                buttonText="Next"
                onSuccess={() => {
                    setEnterModalVisible(false);
                    // Since it's changing pin, show set pin modal next
                    setTimeout(() => {
                        setSetModalVisible(true);
                    }, 300); // slight delay for smooth transition
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    pinRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    pinDisplay: {
        flex: 1,
        height: 48,
        backgroundColor: Colors.dark[10],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.dark[7],
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    pinText: {
        color: Colors.gray[100],
        fontSize: 18,
        letterSpacing: 4,
    },
    changeBtn: {
        height: 48,
        paddingHorizontal: 16,
        backgroundColor: Colors.gray[100],
    },
});
