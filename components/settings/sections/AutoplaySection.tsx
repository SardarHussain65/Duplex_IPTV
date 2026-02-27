import { SettingCard } from '@/components/ui/cards/SettingCard';
import { Colors } from '@/constants';
import { useTab } from '@/context/TabContext';
import React from 'react';
import { findNodeHandle, StyleSheet, Switch, View } from 'react-native';

interface AutoplaySectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const AutoplaySection: React.FC<AutoplaySectionProps> = ({
    startRef,
    sidebarRef,
}) => {
    const { isAutoplayEnabled, setIsAutoplayEnabled, settingsTabNode } = useTab();

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
                title="Enable Autoplay"
                subtitle="Automatically play the next episode after the current one finishes."
                icon={
                    <View pointerEvents="none">
                        <Switch
                            value={isAutoplayEnabled}
                            onValueChange={setIsAutoplayEnabled}
                            trackColor={{ false: Colors.dark[8], true: '#E91E63' }}
                            thumbColor={Colors.gray[100]}
                        />
                    </View>
                }
                iconPosition="right"
                onPress={() => setIsAutoplayEnabled(!isAutoplayEnabled)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
});
