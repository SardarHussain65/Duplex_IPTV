import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { SettingCard } from '@/components/ui/cards/SettingCard';
import { EnterPinModal } from '@/components/ui/modals/EnterPinModal';
import { SetPinModal } from '@/components/ui/modals/SetPinModal';
import { Colors } from '@/constants';
import { useTab } from '@/context/TabContext';
import { useParentalControlPin } from '@/lib/api';
import { panelStyles } from '@/styles/settings_panel.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { findNodeHandle, StyleSheet, Switch, Text, View } from 'react-native';

interface ParentalControlSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const ParentalControlSection: React.FC<ParentalControlSectionProps> = ({
    startRef,
    sidebarRef,
}) => {
    const { t } = useTranslation();
    const {
        isParentalControlEnabled,
        setIsParentalControlEnabled,
        settingsTabNode,
    } = useTab();

    const { setPin, verifyPin, isRestricted, hasPinEverBeenSet, toggleLoading, toggleParentalControl, isToggling } = useParentalControlPin();

    const [isSetModalVisible, setSetModalVisible] = useState(false);
    const [isEnterModalVisible, setEnterModalVisible] = useState(false);
    const [pendingAction, setPendingAction] = useState<'enable' | 'change' | null>(null);

    const handleSwitchChange = async (val: boolean) => {
        if (val) {
            // Show SetPinModal ONLY if no PIN has ever been set (API returned null)
            if (!hasPinEverBeenSet) {
                setPendingAction('enable');
                setSetModalVisible(true);
            } else {
                // PIN exists — call toggle directly
                await toggleParentalControl();
            }
        } else {
            // Turning OFF: call the API toggle
            await toggleParentalControl();
        }
    };

    const handleChangePin = () => {
        setPendingAction('change');
        setEnterModalVisible(true);
    };

    // Show PIN settings card when a PIN has been set on the backend
    const showPinSettings = isRestricted;

    return (
        <View style={{ gap: 20 }}>
            <SettingCard
                ref={(node) => {
                    if (typeof startRef === 'function') (startRef as any)(node);
                    else if (startRef) (startRef as any).current = node;
                }}
                nativeID="settings_content_start"
                nextFocusLeft={findNodeHandle(sidebarRef.current) || undefined}
                nextFocusRight="self"
                nextFocusUp={settingsTabNode || undefined}
                nextFocusDown={!showPinSettings ? findNodeHandle(sidebarRef.current) || undefined : undefined}
                title={t('settings.parentalOptions.enable')}
                subtitle={t('settings.parentalOptions.enableSub')}
                icon={
                    <View pointerEvents="none">
                        <Switch
                            value={isRestricted}
                            onValueChange={() => { }}
                            trackColor={{ false: Colors.dark[8], true: '#E91E63' }}
                            thumbColor={Colors.gray[100]}
                        />
                    </View>
                }
                iconPosition="right"
                onPress={() => handleSwitchChange(!isRestricted)}
            />

            {showPinSettings && (
                <View style={[panelStyles.card, { paddingBottom: 16 }]}>
                    <Text style={panelStyles.cardTitle}>{t('settings.parentalOptions.pinSetting')}</Text>
                    <Text style={panelStyles.rowLabel}>{t('settings.parentalOptions.currentPin')}</Text>
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
                            nextFocusRight="self"
                            nextFocusDown={findNodeHandle(sidebarRef.current) || undefined}
                        >
                            {t('settings.parentalOptions.changePin')}
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
                onSave={async (newPin) => {
                    try {
                        await setPin(newPin);
                        // isRestricted auto-updates via refetchToggle in the hook
                        setSetModalVisible(false);
                        if (pendingAction === 'enable') {
                            setIsParentalControlEnabled(true);
                        }
                        setPendingAction(null);
                    } catch {
                        // error handled in hook
                    }
                }}
            />

            <EnterPinModal
                visible={isEnterModalVisible}
                onClose={() => {
                    setEnterModalVisible(false);
                    setPendingAction(null);
                }}
                onSuccess={() => {
                    setEnterModalVisible(false);
                    // Since it's changing pin, show set pin modal next
                    setTimeout(() => {
                        setSetModalVisible(true);
                    }, 300); // slight delay for smooth transition
                }}
                onVerify={async (pin: string) => {
                    return verifyPin(pin);
                }}
                title={t('settings.parentalOptions.enterCurrentPin')}
                buttonText={t('common.next')}
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
        width: 150,
        paddingHorizontal: 16,
        backgroundColor: Colors.gray[100],
    },
});
