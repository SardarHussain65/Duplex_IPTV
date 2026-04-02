/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Settings Screen
 * ─────────────────────────────────────────────────────────────
 */

import { SettingTabButton } from '@/components/ui/buttons/SettingTabButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { findNodeHandle, ScrollView, StyleSheet, Text, View } from 'react-native';

import i18n from '@/lib/i18n/i18n';
import { useTranslation } from 'react-i18next';

// Section Components
import { AutoplaySection } from '@/components/settings/sections/AutoplaySection';
import { CacheSection } from '@/components/settings/sections/CacheSection';
import { ComingSoonSection } from '@/components/settings/sections/ComingSoonSection';
import { DeviceInfoSection } from '@/components/settings/sections/DeviceInfoSection';
import { LanguageSection } from '@/components/settings/sections/LanguageSection';
import { ParentalControlSection } from '@/components/settings/sections/ParentalControlSection';
import { PlaylistSection } from '@/components/settings/sections/PlaylistSection';
import { SubscriptionSection } from '@/components/settings/sections/SubscriptionSection';
import { WatchHistorySection } from '@/components/settings/sections/WatchHistorySection';

// ── Settings menu items ───────────────────────────────────────
type SettingId =
    | 'language'
    | 'cache'
    | 'device'
    | 'subscription'
    | 'playlist'
    | 'parental'
    | 'watch-history'
    | 'autoplay';

interface SettingItem {
    id: SettingId;
    label: string;
    icon: string;
}

// ── Main component ────────────────────────────────────────────
export default function SettingsScreen() {
    const { t } = useTranslation();
    const { setIsScrolled, setSettingsSidebarNode, settingsContentNode, setSettingsContentNode, settingsTabNode } = useTab();

    const SETTINGS: SettingItem[] = [
        { id: 'language', label: t('settings.language'), icon: 'translate' },
        { id: 'cache', label: t('settings.cache'), icon: 'database' },
        { id: 'device', label: t('settings.device'), icon: 'monitor' },
        { id: 'subscription', label: t('settings.subscription'), icon: 'crown-outline' },
        { id: 'playlist', label: t('settings.playlist'), icon: 'playlist-edit' },
        { id: 'parental', label: t('settings.parental'), icon: 'account-circle-outline' },
        { id: 'watch-history', label: t('settings.watchHistory'), icon: 'history' },
        { id: 'autoplay', label: t('settings.autoplay'), icon: 'redo-variant' },
    ];

    const GET_SECTION_INFO = (id: SettingId): { title: string; subtitle: string } => {
        switch (id) {
            case 'language': return { title: t('settings.language'), subtitle: t('settings.selectLanguage') };
            case 'cache': return { title: t('settings.cache'), subtitle: t('settings.cacheSubtitle') };
            case 'device': return { title: t('settings.device'), subtitle: t('settings.deviceSubtitle') };
            case 'subscription': return { title: t('settings.subscription'), subtitle: t('settings.subscriptionSubtitle') };
            case 'playlist': return { title: t('settings.playlist'), subtitle: t('settings.playlistSubtitle') };
            case 'parental': return { title: t('settings.parental'), subtitle: t('settings.parentalSubtitle') };
            case 'watch-history': return { title: t('settings.watchHistory'), subtitle: t('settings.watchHistorySubtitle') };
            case 'autoplay': return { title: t('settings.autoplay'), subtitle: t('settings.autoplaySubtitle') };
            default: return { title: '', subtitle: '' };
        }
    };

    const [activeSection, setActiveSection] = useState<SettingId>('language');
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const contentStartRef = useRef(null);
    const activeTabRef = useRef(null);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (activeTabRef.current) {
                // @ts-ignore
                activeTabRef.current.focus?.();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
        return () => setIsScrolled(false);
    }, [setIsScrolled]);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    // Stable node handle capturing
    React.useEffect(() => {
        if (activeTabRef.current) {
            setSettingsSidebarNode(findNodeHandle(activeTabRef.current));
        }
    }, [activeSection, activeTabRef.current]);

    React.useEffect(() => {
        if (contentStartRef.current) {
            setSettingsContentNode(findNodeHandle(contentStartRef.current));
        }
    }, [activeSection, contentStartRef.current]);

    const getPanelBody = () => {
        const props = { startRef: contentStartRef, sidebarRef: activeTabRef };
        switch (activeSection) {
            case 'language':
                return <LanguageSection selected={selectedLanguage} onSelect={setSelectedLanguage} {...props} />;
            case 'cache':
                return <CacheSection {...props} />;
            case 'device':
                return <DeviceInfoSection {...props} />;
            case 'subscription':
                return <SubscriptionSection {...props} />;
            case 'playlist':
                return <PlaylistSection {...props} />;
            case 'parental':
                return <ParentalControlSection {...props} />;
            case 'watch-history':
                return <WatchHistorySection {...props} />;
            case 'autoplay':
                return <AutoplaySection {...props} />;
            default:
                return <ComingSoonSection />;
        }
    };

    const active = GET_SECTION_INFO(activeSection);

    return (
        <View style={styles.container}>
            {/* Left sidebar */}
            <ScrollView
                style={styles.sidebar}
                contentContainerStyle={styles.sidebarContent}
                removeClippedSubviews={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {SETTINGS.map((item, index) => (
                    <SettingTabButton
                        key={item.id}
                        ref={activeSection === item.id ? activeTabRef : null}
                        nativeID={`sidebar_${item.id}`}
                        nextFocusRight={settingsContentNode || undefined}
                        nextFocusUp={index === 0 ? (settingsTabNode || undefined) : undefined}
                        nextFocusDown={index === SETTINGS.length - 1 ? findNodeHandle(activeTabRef.current) || undefined : undefined}
                        icon={<MaterialCommunityIcons name={item.icon as any} size={24} />}
                        isActive={activeSection === item.id}
                        onPress={() => setActiveSection(item.id)}
                        testID={`settings-${item.id}`}
                    >
                        {item.label}
                    </SettingTabButton>
                ))}
            </ScrollView>

            {/* Right content panel */}
            <ScrollView
                style={styles.panel}
                contentContainerStyle={styles.panelContent}
                removeClippedSubviews={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.panelTitle}>{active.title}</Text>
                <Text style={styles.panelSubtitle}>{active.subtitle}</Text>
                <View style={styles.panelDivider} />
                {getPanelBody()}
            </ScrollView>
        </View>
    );
}

// ── Screen styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.dark[11],
    },

    // Sidebar
    sidebar: {
        width: xdWidth(280),
        flexGrow: 0,
        flexShrink: 0,
    },
    sidebarContent: {
        paddingTop: xdHeight(120),
        paddingBottom: 40,
        paddingHorizontal: 16,
        gap: 12,

    },

    // Right panel
    panel: {
        flex: 1,
        backgroundColor: Colors.dark[11],
    },
    panelContent: {
        paddingTop: xdHeight(120),
        paddingHorizontal: 48,
        paddingBottom: 40,
    },
    panelTitle: { fontSize: scale(24), fontWeight: '700', color: Colors.gray[100], marginBottom: 8 },
    panelSubtitle: { fontSize: scale(14), color: Colors.dark[2], marginBottom: 18 },
    panelDivider: { height: 1, backgroundColor: Colors.dark[8], marginBottom: 32, opacity: 0.5 },
});
