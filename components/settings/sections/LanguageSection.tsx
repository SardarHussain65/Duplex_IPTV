import { SettingCard } from '@/components/ui/cards/SettingCard';
import { Colors } from '@/constants';
import { useTab } from '@/context/TabContext';
import { panelStyles } from '@/styles/settings_panel.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { findNodeHandle, View } from 'react-native';
import i18n from '@/lib/i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

interface LanguageSectionProps {
    selected: string;
    onSelect: (val: string) => void;
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const LanguageSection: React.FC<LanguageSectionProps> = ({
    selected,
    onSelect,
    startRef,
    sidebarRef,
}) => {
    const { t } = useTranslation();
    const { settingsTabNode } = useTab();

    const handleLanguageChange = async (lang: string) => {
        onSelect(lang);
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem('app_language', lang);
    };

    return (
        <View style={panelStyles.options}>
            <SettingCard
                ref={(node) => {
                    if (typeof startRef === 'function') (startRef as any)(node);
                    else if (startRef) (startRef as any).current = node;
                }}
                nativeID="settings_content_start"
                nextFocusLeft={findNodeHandle(sidebarRef.current) || undefined}
                nextFocusUp={settingsTabNode || undefined}
                nextFocusDown={findNodeHandle(sidebarRef.current) || undefined}
                icon={selected === 'en' ? <MaterialCommunityIcons name="check" size={20} color={Colors.gray[100]} /> : null}
                iconPosition="right"
                title="English"
                subtitle={t('languages.en')}
                style={panelStyles.languageCard}
                isActive={selected === 'en'}
                onPress={() => handleLanguageChange('en')}
                testID="lang-en"
            />
            <SettingCard
                nextFocusLeft={findNodeHandle(sidebarRef.current) || undefined}
                nextFocusRight="self"
                nextFocusUp={settingsTabNode || undefined}
                nextFocusDown={findNodeHandle(sidebarRef.current) || undefined}
                icon={selected === 'de' ? <MaterialCommunityIcons name="check" size={20} color={Colors.gray[100]} /> : null}
                iconPosition="right"
                title="Deutsch"
                subtitle={t('languages.de')}
                style={panelStyles.languageCard}
                isActive={selected === 'de'}
                onPress={() => handleLanguageChange('de')}
                testID="lang-de"
            />
            <SettingCard
                nextFocusLeft={findNodeHandle(sidebarRef.current) || undefined}
                nextFocusRight="self"
                nextFocusUp={settingsTabNode || undefined}
                nextFocusDown={findNodeHandle(sidebarRef.current) || undefined}
                icon={selected === 'es' ? <MaterialCommunityIcons name="check" size={20} color={Colors.gray[100]} /> : null}
                iconPosition="right"
                title="Español"
                subtitle={t('languages.es')}
                style={panelStyles.languageCard}
                isActive={selected === 'es'}
                onPress={() => handleLanguageChange('es')}
                testID="lang-es"
            />
        </View>
    );
};
