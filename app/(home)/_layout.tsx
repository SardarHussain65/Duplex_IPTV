/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Home Layout
 *  Outer Stack shell for the home section.
 *
 *  Architecture:
 *  ┌─────────────────────────────────────────────┐
 *  │  Stack (this file)                          │
 *  │  ┌──────────────────────────────────────┐   │
 *  │  │  (tabs) — Tabs navigator             │   │
 *  │  │   live-tv / movies / series /        │   │
 *  │  │   favorites / parental / settings    │   │
 *  │  └──────────────────────────────────────┘   │
 *  │  channel/[id]  ← pushed on top of tabs      │
 *  │  movie/[id]    ← pushed on top of tabs      │
 *  │  series-detail/[id]                         │
 *  │  player/[id]   ← nav bar hidden here        │
 *  │                                             │
 *  │  ┌───────────────────────────────────────┐  │
 *  │  │ TopNavBar (position: absolute, z:100)│  │
 *  │  │ Visible on ALL screens except player │  │
 *  │  └───────────────────────────────────────┘  │
 *  └─────────────────────────────────────────────┘
 * ─────────────────────────────────────────────────────────────
 */

import { TopNavBar } from "@/components/navigation/TopNavBar";
import { TabContextProvider } from "@/context/TabContext";
import { Stack, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";

export const HomeLayout = () => {
    const pathname = usePathname();

    // Hide nav bar only when the video player is active.
    const isPlayer = pathname.startsWith('/player');

    return (
        <TabContextProvider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Stack screenOptions={{ headerShown: false }}>
                        {/* Tab shell — Tabs navigator lives here */}
                        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />

                        {/* Detail screens — pushed on top, nav bar still visible */}
                        <Stack.Screen name="channel/[id]" />
                        <Stack.Screen name="movie/[id]" />
                        <Stack.Screen name="series-detail/[id]" />

                        {/* Player — nav bar hidden */}
                        <Stack.Screen name="player/[id]" />
                    </Stack>
                </View>

                {!isPlayer && (
                    <View style={styles.navWrapper}>
                        <TopNavBar />
                    </View>
                )}
            </View>
        </TabContextProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141416',
    },
    content: {
        flex: 1,
    },
    navWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
});

export default HomeLayout;