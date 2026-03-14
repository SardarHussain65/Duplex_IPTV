import { useTab } from '@/context/TabContext';
import { panelStyles } from '@/styles/settings_panel.styles';
import React, { useEffect, useRef, useState } from 'react';
import { findNodeHandle, Text, View } from 'react-native';

interface DeviceInfoSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

interface DeviceInfoRowProps {
    label: string;
    val: string;
    index: number;
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
    settingsTabNode: number | null;
}

const DeviceInfoRow: React.FC<DeviceInfoRowProps> = ({
    label,
    val,
    index,
    startRef,
    sidebarRef,
    settingsTabNode,
}) => {
    const rowRef = useRef<any>(null);
    const [handle, setHandle] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (rowRef.current) {
            setHandle(findNodeHandle(rowRef.current) || undefined);
        }
    }, []);

    return (
        <View
            key={label}
            ref={(node) => {
                rowRef.current = node;
                if (index === 0) {
                    if (typeof startRef === 'function') (startRef as any)(node);
                    else if (startRef) (startRef as any).current = node;
                }
            }}
            style={panelStyles.row}
            nativeID={index === 0 ? 'settings_content_start' : undefined}
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
};

export const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({ startRef, sidebarRef }) => {
    const { settingsTabNode } = useTab();
    return (
        <View style={panelStyles.card}>
            <Text style={panelStyles.cardTitle}>Account Details</Text>
            {[
                ['Mac Address', '31:d8:ea:df:33:45'],
                ['Device Key', '234831'],
                ['Device State', 'Activate'],
            ].map(([label, val], index) => (
                <DeviceInfoRow
                    key={label}
                    label={label}
                    val={val}
                    index={index}
                    startRef={startRef}
                    sidebarRef={sidebarRef}
                    settingsTabNode={settingsTabNode}
                />
            ))}
        </View>
    );
};
