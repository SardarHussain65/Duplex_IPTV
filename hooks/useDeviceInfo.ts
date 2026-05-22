import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

export interface DeviceInfo {
    macAddress: string;
    deviceId: string;
    model: string;
    osVersion: string;
}

type MacAddressNativeModule = {
    getMacAddress?: () => Promise<string>;
};

export const MAC_ADDRESS_UNAVAILABLE = 'Unable to get MAC address';

const INVALID_MAC_ADDRESSES = new Set([
    '00:00:00:00:00:00',
    '02:00:00:00:00:00',
    'FF:FF:FF:FF:FF:FF',
    'NOT_AVAILABLE',
]);

const { MacAddressModule } = NativeModules as {
    MacAddressModule?: MacAddressNativeModule;
};

const normalizeMacAddress = (macAddress?: string | null): string | null => {
    const normalized = macAddress?.trim().toUpperCase();
    if (!normalized) return null;
    if (!/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(normalized)) return null;
    if (INVALID_MAC_ADDRESSES.has(normalized)) return null;
    return normalized;
};

export const isValidMacAddress = (macAddress?: string | null): boolean => {
    return normalizeMacAddress(macAddress) !== null;
};

const getNativeAndroidMacAddress = async (): Promise<string | null> => {
    if (Platform.OS !== 'android') return null;

    try {
        const macAddress = await MacAddressModule?.getMacAddress?.();
        return normalizeMacAddress(macAddress);
    } catch (error) {
        console.warn('useDeviceInfo: native MAC lookup failed', error);
        return null;
    }
};

/**
 * Hook to retrieve unique device identifiers and format them for IPTV activation.
 * 
 * Android TV native MAC lookup is best-effort. We intentionally do not generate
 * a fake MAC here; if native lookup fails, the UI shows an unavailable message.
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
                let macAddress: string | null = null;

                if (Platform.OS === 'android') {
                    macAddress = await getNativeAndroidMacAddress();
                    uniqueId = Application.getAndroidId() || '';
                } else if (Platform.OS === 'ios') {
                    uniqueId = await Application.getIosIdForVendorAsync() || '';
                } else {
                    console.warn(`useDeviceInfo: unsupported platform "${Platform.OS}"`);
                }

                const cleanId = uniqueId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

                const formattedDeviceId = !cleanId || cleanId.length < 8
                    ? 'UNKNOWN'
                    : cleanId.substring(0, 4) + '-' + cleanId.substring(cleanId.length - 4);

                setDeviceInfo({
                    macAddress: macAddress || MAC_ADDRESS_UNAVAILABLE,
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
