import { Colors } from '@/constants';
import { useTab } from '@/context/TabContext';
import { panelStyles } from '@/styles/settings_panel.styles';
import React from 'react';
import { findNodeHandle, Text, View } from 'react-native';

interface SubscriptionSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ startRef, sidebarRef }) => {
    const { settingsTabNode } = useTab();
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
            ].map(([label, val], index) => {
                const rowRef = React.useRef(null);
                const [handle, setHandle] = React.useState<number | undefined>(undefined);

                React.useEffect(() => {
                    if (rowRef.current) {
                        setHandle(findNodeHandle(rowRef.current) || undefined);
                    }
                }, [rowRef.current]);

                return (
                    <View
                        key={label}
                        ref={(node) => {
                            // @ts-ignore
                            rowRef.current = node;
                            if (index === 0) {
                                if (typeof startRef === 'function') (startRef as any)(node);
                                else if (startRef) (startRef as any).current = node;
                            }
                        }}
                        style={panelStyles.row}
                        nativeID={index === 0 ? "settings_content_start" : undefined}
                        nextFocusLeft={index === 0 ? findNodeHandle(sidebarRef.current) || undefined : undefined}
                        nextFocusRight={handle}
                        nextFocusUp={index === 0 ? (settingsTabNode || undefined) : undefined}
                        nextFocusDown={index === 1 ? findNodeHandle(sidebarRef.current) || undefined : undefined}
                        focusable={true}
                    >
                        <Text style={panelStyles.rowLabel}>{label}</Text>
                        <Text style={[panelStyles.rowValue, label === 'Days Remaining' && { color: Colors.error[500] }]}>{val}</Text>
                    </View>
                );
            })}
        </View>
    );
};
