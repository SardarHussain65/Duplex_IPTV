/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Top Navigation Bar
 *  Persistent overlay nav bar across all screens (except player).
 *  Layout: Logo | [Live TV · Movies · Series · Favorite] | [🔒 ⚙]
 * ─────────────────────────────────────────────────────────────
 */

import { FavoritesIcon, LiveTVIcon, MoviesIcon, ParentalControlIcon, SeriesIcon, SettingIcon } from '@/assets/icons';
import { NavButton } from '@/components/ui/buttons/NavButton';
import { NavIconButton } from '@/components/ui/buttons/NavIconButton';
import { PlaylistSidebarModal } from '@/components/ui/modals';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View, findNodeHandle } from 'react-native';
import { useTranslation } from 'react-i18next';

// ── Tab Definitions ───────────────────────────────────────────

type TabId =
    | 'live-tv'
    | 'movies'
    | 'series'
    | 'favorites'
    | 'parental-control'
    | 'settings';

// Map route prefixes → which tab appears active.
const ROUTE_TAB_MAP: { prefix: string; tab: TabId }[] = [
    { prefix: '/channel', tab: 'live-tv' },
    { prefix: '/live-tv', tab: 'live-tv' },
    { prefix: '/movie', tab: 'movies' },
    { prefix: '/movies', tab: 'movies' },
    { prefix: '/series-detail', tab: 'series' },
    { prefix: '/series', tab: 'series' },
    { prefix: '/favorites', tab: 'favorites' },
    { prefix: '/parental-control', tab: 'parental-control' },
    { prefix: '/settings', tab: 'settings' },
];

// ── Component ─────────────────────────────────────────────────

export const TopNavBar: React.FC = () => {
    const { t } = useTranslation();
    const { isScrolled, setIsScrolled, searchBarNode, setSettingsTabNode, settingsSidebarNode } = useTab();
    const router = useRouter();
    const pathname = usePathname();
    const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);

    const TEXT_TABS: { id: TabId; label: string; icon: ReactNode; route: string }[] = [
        { id: 'live-tv', label: t('common.liveTv'), icon: <LiveTVIcon />, route: '/live-tv' },
        { id: 'movies', label: t('common.movies'), icon: <MoviesIcon />, route: '/movies' },
        { id: 'series', label: t('common.series'), icon: <SeriesIcon />, route: '/series' },
        { id: 'favorites', label: t('common.favorites'), icon: <FavoritesIcon />, route: '/favorites' },
    ];

    const ICON_TABS: { id: TabId; icon: ReactNode; route: string }[] = [
        { id: 'parental-control', icon: <ParentalControlIcon />, route: '/parental-control' },
        { id: 'settings', icon: <SettingIcon />, route: '/settings' },
    ];

    const getActiveTab = (): TabId => {
        for (const { prefix, tab } of ROUTE_TAB_MAP) {
            if (pathname.startsWith(prefix)) return tab;
        }
        return 'live-tv';
    };

    const activeTab = getActiveTab();

    // Use a robust ref to get the node handle to avoid inline-ref recreating
    const settingsRef = useRef<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (settingsRef.current) {
                const node = findNodeHandle(settingsRef.current);
                if (node) setSettingsTabNode(node);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [activeTab, isScrolled]);

    const handleTabPress = (tab: typeof TEXT_TABS[0] | typeof ICON_TABS[0]) => {
        setIsScrolled(false);
        router.replace(tab.route as any);
    };

    return (
        <View style={[styles.container, isScrolled && styles.containerScrolled]}>
            {/* Logo */}
            <Image
                source={require('@/assets/images/ActivationImage.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Text tabs */}
            <View style={styles.tabGroup}>
                {TEXT_TABS.map((tab, index) => (
                    <NavButton
                        key={tab.id}
                        icon={tab.icon}
                        isActive={activeTab === tab.id}
                        onPress={() => handleTabPress(tab)}
                        hasTVPreferredFocus={activeTab === tab.id}
                        testID={`nav-tab-${tab.id}`}
                    >
                        {tab.label}
                    </NavButton>
                ))}
            </View>

            {/* Icon tabs */}
            <View style={styles.iconGroup}>
                <NavIconButton
                    icon={<Ionicons name="layers-outline" size={scale(18)} />}
                    isActive={false}
                    onPress={() => setIsPlaylistModalVisible(true)}
                    testID="nav-tab-playlist"
                />
                {ICON_TABS.map((tab, index) => {
                    const isLastTab = index === ICON_TABS.length - 1;
                    return (
                        <NavIconButton
                            key={tab.id}
                            innerRef={isLastTab ? settingsRef : undefined}
                            icon={tab.icon}
                            isActive={activeTab === tab.id}
                            onPress={() => handleTabPress(tab)}
                            testID={`nav-tab-${tab.id}`}
                            nextFocusRight={isLastTab ? (searchBarNode || undefined) : undefined}
                            nextFocusDown={tab.id === 'settings' ? (settingsSidebarNode || undefined) : undefined}
                        />
                    );
                })}
            </View>

            <PlaylistSidebarModal
                visible={isPlaylistModalVisible}
                onClose={() => setIsPlaylistModalVisible(false)}
            />
        </View>
    );
};

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: xdWidth(32),
        paddingVertical: xdHeight(12),
    },
    containerScrolled: {
        backgroundColor: 'rgba(20, 20, 22, 0.85)',
    },
    logo: {
        width: xdWidth(32),
        height: xdHeight(32),
        marginRight: '20%',
    },
    tabGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(6),
        flex: 1,
    },
    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(10),
    },
});
