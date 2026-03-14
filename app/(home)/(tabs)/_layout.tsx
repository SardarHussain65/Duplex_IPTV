/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Tabs Layout
 *  Manages the 6 top-level tabs: Live TV, Movies, Series,
 *  Favorites, Parental Control, Settings.
 *
 *  The tab bar UI is deliberately NOT rendered here —
 *  the TopNavBar is overlaid at the parent Stack level so it
 *  appears on both tab screens AND detail screens.
 * ─────────────────────────────────────────────────────────────
 */

import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            // The visual nav bar is an absolute overlay in the parent (home)/_layout.
            // We suppress the default tab bar completely.
            tabBar={() => null}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="live-tv" />
            <Tabs.Screen name="movies" />
            <Tabs.Screen name="series" />
            <Tabs.Screen name="favorites" />
            <Tabs.Screen name="parental-control" />
            <Tabs.Screen name="settings" />
        </Tabs>
    );
}
