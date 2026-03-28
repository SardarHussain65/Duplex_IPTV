import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export interface DeviceInfo {
    macAddress: string;
    deviceId: string;
    model: string;
    osVersion: string;
}

/**
 * Hook to retrieve unique device identifiers and format them for IPTV activation.
 * 
 * Note: Modern Android/iOS don't allow access to real MAC addresses. 
 * We use stable unique IDs formatted like MAC addresses for consistent identification.
 */
export const useDeviceInfo = () => {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        macAddress: 'LOADING...',
        deviceId: 'LOADING...',
        model: 'LOADING...',
        osVersion: 'LOADING...',
    });

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            try {
                let uniqueId = '';

                if (Platform.OS === 'android') {
                    uniqueId = Application.getAndroidId() || '';
                } else if (Platform.OS === 'ios') {
                    uniqueId = await Application.getIosIdForVendorAsync() || '';
                } else {
                    console.warn(`useDeviceInfo: unsupported platform "${Platform.OS}"`);
                }

                // 1. Format "Mac Address" from unique ID
                // Take first 12 chars and format: XX:XX:XX:XX:XX:XX
                const cleanId = uniqueId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                const base = cleanId.padEnd(12, '0').substring(0, 12);
                const formattedMac = base.match(/.{1,2}/g)?.join(':') || '00:00:00:00:00:00';

                // 2. Format "Device ID"
                // Take a stable portion or the whole ID (shortened for UI)
                const formattedDeviceId = !cleanId || cleanId.length < 8
                    ? 'UNKNOWN'
                    : cleanId.substring(0, 4) + '-' + cleanId.substring(cleanId.length - 4);

                setDeviceInfo({
                    macAddress: `DPX-${formattedMac}`,
                    deviceId: formattedDeviceId,
                    model: Device.modelName || 'Unknown Device',
                    osVersion: `${Device.osName} ${Device.osVersion}`,
                });
            } catch (error) {
                console.error('Error fetching device info:', error);
                setDeviceInfo({
                    macAddress: 'ERROR',
                    deviceId: 'ERROR',
                    model: 'ERROR',
                    osVersion: 'ERROR',
                });
            }
        };

        fetchDeviceInfo();
    }, []);

    return deviceInfo;
};
