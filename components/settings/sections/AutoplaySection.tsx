import { SettingCard } from '@/components/ui/cards/SettingCard';
import { Colors } from '@/constants';
import { useTab } from '@/context/TabContext';
import React from 'react';
import { findNodeHandle, StyleSheet, Switch, View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAutoplay } from '@/lib/api/hooks/useAutoplay';

interface AutoplaySectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const AutoplaySection: React.FC<AutoplaySectionProps> = ({
    startRef,
    sidebarRef,
}) => {
    const { t } = useTranslation();
    const { isAutoplayEnabled, settingsTabNode } = useTab();
    const { toggleAutoplay, isToggling, loading } = useAutoplay();

    const handleToggle = async () => {
        try {
            await toggleAutoplay(!isAutoplayEnabled);
        } catch (error) {
            // Error is logged in the hook
        }
    };

    return (
        <View style={styles.container}>
            <SettingCard
                ref={(node) => {
                    if (typeof startRef === 'function') (startRef as any)(node);
                    else if (startRef) (startRef as any).current = node;
                }}
                nativeID="settings_content_start"
                nextFocusLeft={findNodeHandle(sidebarRef.current) || undefined}
                nextFocusRight="self"
                nextFocusUp={settingsTabNode || undefined}
                nextFocusDown={findNodeHandle(sidebarRef.current) || undefined}
                title={t('settings.autoplayOptions.enable')}
                subtitle={t('settings.autoplayOptions.enableSub')}
                icon={
                    <View pointerEvents="none" style={styles.iconContainer}>
                        {isToggling || loading ? (
                            <ActivityIndicator size="small" color="#E91E63" />
                        ) : (
                            <Switch
                                value={isAutoplayEnabled}
                                onValueChange={handleToggle}
                                trackColor={{ false: Colors.dark[8], true: '#E91E63' }}
                                thumbColor={Colors.gray[100]}
                            />
                        )}
                    </View>
                }
                iconPosition="right"
                onPress={handleToggle}
                disabled={isToggling || loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    iconContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
