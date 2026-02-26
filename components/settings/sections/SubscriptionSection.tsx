import { Colors } from '@/constants';
import { panelStyles } from '@/styles/settings_panel.styles';
import React from 'react';
import { findNodeHandle, Text, View } from 'react-native';

interface SubscriptionSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ startRef, sidebarRef }) => {
    return (
        <View style={panelStyles.card}>
            <View style={[panelStyles.row, { justifyContent: 'flex-start', alignItems: 'center', gap: 12 }]}>
                <Text style={panelStyles.cardTitle}>Monthly Plan</Text>
                <View style={panelStyles.badge}>
                    <Text style={panelStyles.badgeText}>Active</Text>
                </View>
            </View>
            <View style={panelStyles.divider} />
            {[
                ['Expires', 'Feb 28, 2026'],
                ['Days Remaining', '21 Days'],
            ].map(([label, val], index) => (
                <View
                    key={label}
                    style={panelStyles.row}
                    ref={index === 0 ? startRef : null}
                    nativeID={index === 0 ? "settings_content_start" : undefined}
                    nextFocusLeft={index === 0 ? findNodeHandle(sidebarRef.current) || undefined : undefined}
                >
                    <Text style={panelStyles.rowLabel}>{label}</Text>
                    <Text style={[panelStyles.rowValue, label === 'Days Remaining' && { color: Colors.error[500] }]}>{val}</Text>
                </View>
            ))}
        </View>
    );
};
