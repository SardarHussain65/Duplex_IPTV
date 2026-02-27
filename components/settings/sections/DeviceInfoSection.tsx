import { useTab } from '@/context/TabContext';
import { panelStyles } from '@/styles/settings_panel.styles';
import React from 'react';
import { findNodeHandle, Text, View } from 'react-native';

interface DeviceInfoSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({ startRef, sidebarRef }) => {
    const { settingsTabNode } = useTab();
    return (
        <View style={panelStyles.card}>
            <Text style={panelStyles.cardTitle}>Account Details</Text>
            {[
                ['Mac Address', '31:d8:ea:df:33:45'],
                ['Device Key', '234831'],
                ['Device State', 'Activate'],
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
                        nextFocusUp={settingsTabNode || undefined}
                        nextFocusDown={index === 2 ? findNodeHandle(sidebarRef.current) || undefined : undefined}
                        focusable={true}
                    >
                        <Text style={panelStyles.rowLabel}>{label}</Text>
                        <Text style={panelStyles.rowValue}>{val}</Text>
                    </View>
                );
            })}
        </View>
    );
};
