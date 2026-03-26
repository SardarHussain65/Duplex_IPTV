import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { Colors, xdWidth } from '@/constants';
import { useTab } from '@/context/TabContext';
import { useCacheStorage } from '@/hooks/useCacheStorage';
import { panelStyles } from '@/styles/settings_panel.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, findNodeHandle, Text, View } from 'react-native';

interface CacheSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const CacheSection: React.FC<CacheSectionProps> = ({ startRef, sidebarRef }) => {
    const { t } = useTranslation();
    const { settingsTabNode } = useTab();
    const { sizes, isLoading, formatSize, clearAllCache, calculateSizes } = useCacheStorage();

    useFocusEffect(
        React.useCallback(() => {
            calculateSizes();
        }, [calculateSizes])
    );

    const handleClearPress = () => {
        Alert.alert(
            t('common.confirm'),
            t('settings.cacheOptions.clearConfirm'),
            [
                { text: t('enterPin.cancel'), style: 'cancel' },
                {
                    text: t('settings.cacheOptions.clearAll'),
                    style: 'destructive',
                    onPress: clearAllCache
                },
            ]
        );
    };

    const rows = [
        { label: t('settings.cacheOptions.imageCache'), value: formatSize(sizes.imageCache) },
        { label: t('settings.cacheOptions.videoCache'), value: formatSize(sizes.videoCache) },
        { label: t('settings.cacheOptions.epgData'), value: formatSize(sizes.epgData) },
        { label: t('settings.cacheOptions.appData'), value: formatSize(sizes.appData) },
    ];

    return (
        <View>
            <View style={panelStyles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={panelStyles.cardTitle}>{t('settings.cacheOptions.storageUsage')}</Text>
                    {isLoading && <ActivityIndicator size="small" color={Colors.primaryBlue[900]} />}
                </View>

                {rows.map((row) => (
                    <View key={row.label} style={panelStyles.row}>
                        <Text style={panelStyles.rowLabel}>{row.label}</Text>
                        <Text style={panelStyles.rowValue}>{row.value}</Text>
                    </View>
                ))}

                <View style={panelStyles.divider} />
                <View style={panelStyles.row}>
                    <Text style={[panelStyles.rowLabel, { fontWeight: '700', color: Colors.gray[100] }]}>
                        {t('settings.cacheOptions.total')}
                    </Text>
                    <Text style={[panelStyles.rowValue, { color: "#749EED", fontWeight: '700' }]}>
                        {formatSize(sizes.total)}
                    </Text>
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
                style={[panelStyles.clearBtn, { backgroundColor: Colors.error[500] }]}
                onPress={handleClearPress}
                disabled={isLoading}
                icon={<MaterialCommunityIcons name="delete" size={20} color={Colors.dark[1]} />}
                gap={xdWidth(10)}
            >
                {t('settings.cacheOptions.clearAll')}
            </ActionFilledButton>
        </View>
    );
};
