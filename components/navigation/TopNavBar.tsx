/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Top Navigation Bar
 *  Persistent header bar across all tab screens.
 *  Contains: Logo · Live TV · Movies · Series · Favorite · Lock · Settings
 *  All 6 items (including icon buttons) behave as tabs.
 * ─────────────────────────────────────────────────────────────
 */

import { NavButton } from '@/components/ui/buttons/NavButton';
import { NavIconButton } from '@/components/ui/buttons/NavIconButton';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { Tab, useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';


// ── Nav Tab Definitions ───────────────────────────────────────

const NAV_TABS: { id: Tab; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { id: 'live-tv', label: 'Live TV', icon: 'television-play' },
    { id: 'movies', label: 'Movies', icon: 'movie' },
    { id: 'series', label: 'Series', icon: 'view-list' },
    { id: 'favorites', label: 'Favorite', icon: 'heart' },
];

// ── Component ─────────────────────────────────────────────────

export const TopNavBar: React.FC = () => {
    const { activeTab, setActiveTab, isScrolled, setIsScrolled, setParentalModalVisible } = useTab();
    const router = useRouter();
    const pathname = usePathname();

    const handleTabPress = (tabId: Tab) => {
        setActiveTab(tabId);
        setIsScrolled(false);
        // If we are not on the main screen (index), navigate back to it
        if (pathname !== '/') {
            router.replace('/');
        }
    };

    return (
        <View style={[styles.container, isScrolled && styles.containerScrolled]}>
            {/* Logo */}
            <Image
                source={require('@/assets/images/ActivationImage.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Text tabs: Live TV, Movies, Series, Favorite */}
            <View style={styles.tabGroup}>
                {NAV_TABS.map((tab, index) => (
                    <NavButton
                        key={tab.id}
                        icon={<MaterialCommunityIcons name={tab.icon} size={scale(18)} />}
                        isActive={activeTab === tab.id}
                        onPress={() => handleTabPress(tab.id)}
                        hasTVPreferredFocus={index === 0}
                        testID={`nav-tab-${tab.id}`}
                    >
                        {tab.label}
                    </NavButton>
                ))}
            </View>

            {/* Icon tabs: Parental Control (Lock) + Settings */}
            <View style={styles.iconGroup}>
                <NavIconButton
                    icon={<MaterialCommunityIcons name="lock" size={scale(18)} />}
                    isActive={activeTab === 'parental-control'}
                    onPress={() => handleTabPress('parental-control')}
                    testID="nav-tab-parental-control"
                />
                <NavIconButton
                    icon={<MaterialCommunityIcons name="cog" size={scale(18)} />}
                    isActive={activeTab === 'settings'}
                    onPress={() => handleTabPress('settings')}
                    testID="nav-tab-settings"
                />
            </View>
        </View>
    );
};

// ── Styles ───────────────────────────────────────────────────

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
        marginRight: "20%",
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

