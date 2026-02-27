import { SettingCard } from '@/components/ui/cards/SettingCard';
import { Colors } from '@/constants';
import { useTab } from '@/context/TabContext';
import { panelStyles } from '@/styles/settings_panel.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
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
    const { settingsTabNode } = useTab();

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
                icon={selected === 'English' ? <MaterialCommunityIcons name="check" size={20} color={Colors.gray[100]} /> : null}
                iconPosition="right"
                title="English"
                subtitle="English"
                style={panelStyles.languageCard}
                isActive={selected === 'English'}
                onPress={() => onSelect('English')}
                testID="lang-en"
            />
            <SettingCard
                nextFocusLeft={findNodeHandle(sidebarRef.current) || undefined}
                nextFocusRight="self"
                nextFocusUp={settingsTabNode || undefined}
                nextFocusDown={findNodeHandle(sidebarRef.current) || undefined}
                icon={selected === 'German' ? <MaterialCommunityIcons name="check" size={20} color={Colors.gray[100]} /> : null}
                iconPosition="right"
                title="German"
                subtitle="Deutsh"
                style={panelStyles.languageCard}
                isActive={selected === 'German'}
                onPress={() => onSelect('German')}
                testID="lang-de"
            />
        </View>
    );
};
