import { useDeviceInfo } from '@/hooks/useDeviceInfo';
import { useTab } from '@/context/TabContext';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { panelStyles } from '@/styles/settings_panel.styles';
import React, { useEffect, useRef, useState } from 'react';
import { findNodeHandle, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

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
            nextFocusDown={index === 4 ? findNodeHandle(sidebarRef.current) || undefined : undefined}
            focusable={true}
        >
            <Text style={panelStyles.rowLabel}>{label}</Text>
            <Text style={panelStyles.rowValue}>{val}</Text>
        </View>
    );
};

export const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({ startRef, sidebarRef }) => {
    const { t } = useTranslation();
    const { settingsTabNode } = useTab();
    const deviceInfo = useDeviceInfo();
    const { deviceKey, deviceStatus } = useDeviceStore();

    const infoRows = [
        { label: t('settings.deviceOptions.macAddress'), value: deviceInfo.macAddress },
        { label: t('settings.deviceOptions.deviceKey'), value: deviceKey || 'N/A' },
        { label: t('settings.deviceOptions.deviceStatus'), value: deviceStatus || 'N/A' },
        { label: t('settings.deviceOptions.model'), value: deviceInfo.model },
        { label: t('settings.deviceOptions.systemVersion'), value: deviceInfo.osVersion },
    ];

    return (
        <View style={panelStyles.card}>
            <Text style={panelStyles.cardTitle}>{t('settings.deviceOptions.accountDetails')}</Text>
            {infoRows.map((row, index) => (
                <DeviceInfoRow
                    key={row.label}
                    label={row.label}
                    val={row.value}
                    index={index}
                    startRef={startRef}
                    sidebarRef={sidebarRef}
                    settingsTabNode={settingsTabNode}
                />
            ))}
        </View>
    );
};
