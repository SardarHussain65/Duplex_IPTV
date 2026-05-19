import { SettingCard } from '@/components/ui/cards/SettingCard';
import { Colors } from '@/constants';
import { useTab } from '@/context/TabContext';
import i18n from '@/lib/i18n/i18n';
import { panelStyles } from '@/styles/settings_panel.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { findNodeHandle, View } from 'react-native';

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
                icon={selected === 'pt' ? <MaterialCommunityIcons name="check" size={20} color={Colors.gray[100]} /> : null}
                iconPosition="right"
                title="Português (Brasil)"
                subtitle={t('languages.pt')}
                style={panelStyles.languageCard}
                isActive={selected === 'pt'}
                onPress={() => handleLanguageChange('pt')}
                testID="lang-pt"
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

        </View>
    );
};
