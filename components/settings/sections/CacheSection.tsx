import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { Colors, xdWidth } from '@/constants';
import { useTab } from '@/context/TabContext';
import { panelStyles } from '@/styles/settings_panel.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { findNodeHandle, Text, View } from 'react-native';

interface CacheSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const CacheSection: React.FC<CacheSectionProps> = ({ startRef, sidebarRef }) => {
    const { settingsTabNode } = useTab();

    return (
        <View>
            <View style={panelStyles.card}>
                <Text style={panelStyles.cardTitle}>Storage Usage</Text>
                {[
                    ['Image Cache', '156 MB'],
                    ['Video Cache', '156 MB'],
                    ['EPF Date', '156 MB'],
                    ['App Data', '156 MB'],
                ].map(([label, val]) => (
                    <View key={label} style={panelStyles.row}>
                        <Text style={panelStyles.rowLabel}>{label}</Text>
                        <Text style={panelStyles.rowValue}>{val}</Text>
                    </View>
                ))}
                <View style={panelStyles.divider} />
                <View style={panelStyles.row}>
                    <Text style={[panelStyles.rowLabel, { fontWeight: '700', color: Colors.gray[100] }]}>Total</Text>
                    <Text style={[panelStyles.rowValue, { color: "#749EED", fontWeight: '700' }]}>1.1 GB</Text>
                </View>
            </View>
            <ActionFilledButton
                ref={(node) => {
                    if (typeof startRef === 'function') (startRef as any)(node);
                    else if (startRef) (startRef as any).current = node;
                }}
                nativeID="settings_content_start"
                nextFocusLeft={findNodeHandle(sidebarRef.current) || undefined}
                nextFocusRight="self"
                nextFocusUp={settingsTabNode || undefined}
                nextFocusDown={findNodeHandle(sidebarRef.current) || undefined}
                style={panelStyles.clearBtn}
                onPress={() => { }}
                icon={<MaterialCommunityIcons name="delete" size={20} color={Colors.dark[1]} />}
                gap={xdWidth(10)}
            >
                Clear All Cache
            </ActionFilledButton>
        </View>
    );
};
