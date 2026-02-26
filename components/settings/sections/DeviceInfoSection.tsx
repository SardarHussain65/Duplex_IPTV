import { panelStyles } from '@/styles/settings_panel.styles';
import React from 'react';
import { findNodeHandle, Text, View } from 'react-native';

interface DeviceInfoSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({ startRef, sidebarRef }) => {
    return (
        <View style={panelStyles.card}>
            <Text style={panelStyles.cardTitle}>Account Details</Text>
            {[
                ['Mac Address', '31:d8:ea:df:33:45'],
                ['Device Key', '234831'],
                ['Device State', 'Activate'],
            ].map(([label, val], index) => (
                <View
                    key={label}
                    style={panelStyles.row}
                    ref={index === 0 ? startRef : null}
                    nativeID={index === 0 ? "settings_content_start" : undefined}
                    nextFocusLeft={index === 0 ? findNodeHandle(sidebarRef.current) || undefined : undefined}
                >
                    <Text style={panelStyles.rowLabel}>{label}</Text>
                    <Text style={panelStyles.rowValue}>{val}</Text>
                </View>
            ))}
        </View>
    );
};
