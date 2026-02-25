/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Top Navigation Bar
 *  Persistent overlay nav bar across all screens (except player).
 *  Layout: Logo | [Live TV · Movies · Series · Favorite] | [🔒 ⚙]
 * ─────────────────────────────────────────────────────────────
 */

import { NavButton } from '@/components/ui/buttons/NavButton';
import { NavIconButton } from '@/components/ui/buttons/NavIconButton';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

// ── Tab Definitions ───────────────────────────────────────────

type TabId =
    | 'live-tv'
    | 'movies'
    | 'series'
    | 'favorites'
    | 'parental-control'
    | 'settings';

const TEXT_TABS: { id: TabId; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; route: string }[] = [
    { id: 'live-tv', label: 'Live TV', icon: 'television-play', route: '/live-tv' },
    { id: 'movies', label: 'Movies', icon: 'movie', route: '/movies' },
    { id: 'series', label: 'Series', icon: 'view-list', route: '/series' },
    { id: 'favorites', label: 'Favorite', icon: 'heart', route: '/favorites' },
];

const ICON_TABS: { id: TabId; icon: keyof typeof MaterialCommunityIcons.glyphMap; route: string }[] = [
    { id: 'parental-control', icon: 'lock', route: '/parental-control' },
    { id: 'settings', icon: 'cog', route: '/settings' },
];

// Map route prefixes → which tab appears active.
// Longer/more specific prefixes must come first.
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
    const { isScrolled, setIsScrolled } = useTab();
    const router = useRouter();
    const pathname = usePathname();

    const getActiveTab = (): TabId => {
        for (const { prefix, tab } of ROUTE_TAB_MAP) {
            if (pathname.startsWith(prefix)) return tab;
        }
        return 'live-tv';
    };

    const activeTab = getActiveTab();

    const handleTabPress = (tab: { id: TabId; route: string }) => {
        setIsScrolled(false);
        router.replace({ pathname: tab.route as any });
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
                        icon={<MaterialCommunityIcons name={tab.icon} size={scale(18)} />}
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
                {ICON_TABS.map((tab) => (
                    <NavIconButton
                        key={tab.id}
                        icon={<MaterialCommunityIcons name={tab.icon} size={scale(18)} />}
                        isActive={activeTab === tab.id}
                        onPress={() => handleTabPress(tab)}
                        testID={`nav-tab-${tab.id}`}
                    />
                ))}
            </View>
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
