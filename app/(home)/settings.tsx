/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Settings Screen
 *  Settings icon tab: Left sidebar + right content panel
 *  Matches Figma: Language · Cache & Storage · Device Info ·
 *  Subscription · Playlist Management · Parental Control ·
 *  Watch History · Autoplay Settings
 * ─────────────────────────────────────────────────────────────
 */

import { SettingTabButton } from '@/components/ui/buttons/SettingTabButton';
import { Colors } from '@/constants';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// ── Icon helpers ─────────────────────────────────────────────
const I = (d: string, color: string) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d={d} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

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
    icon: (color: string) => React.ReactNode;
}

const SETTINGS: SettingItem[] = [
    {
        id: 'language',
        label: 'Language',
        icon: (c) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={c} strokeWidth={1.8} />
                <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={c} strokeWidth={1.8} />
            </Svg>
        ),
    },
    {
        id: 'cache',
        label: 'Cache & Storage',
        icon: (c) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1v7z" stroke={c} strokeWidth={1.8} />
            </Svg>
        ),
    },
    {
        id: 'device',
        label: 'Device Info',
        icon: (c) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Rect x={2} y={3} width={20} height={14} rx={2} stroke={c} strokeWidth={1.8} />
                <Path d="M8 21h8M12 17v4" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
        ),
    },
    {
        id: 'subscription',
        label: 'Subscription',
        icon: (c) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        ),
    },
    {
        id: 'playlist',
        label: 'Playlist Management',
        icon: (c) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={5} cy={19} r={2} stroke={c} strokeWidth={1.8} />
                <Path d="M5 17V5l7-1v2" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
        ),
    },
    {
        id: 'parental',
        label: 'Parental Control',
        icon: (c) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={11} width={18} height={11} rx={2} stroke={c} strokeWidth={1.8} />
                <Path d="M7 11V7a5 5 0 0110 0v4" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
        ),
    },
    {
        id: 'watch-history',
        label: 'Watch History',
        icon: (c) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M3 3v5h5M12 7v5l4 2" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        ),
    },
    {
        id: 'autoplay',
        label: 'Autoplay Settings',
        icon: (c) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M17 2l4 4-4 4" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M3 11V9a4 4 0 014-4h14M7 22l-4-4 4-4" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M21 13v2a4 4 0 01-4 4H3" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        ),
    },
];

// ── Panel stylesheet — declared FIRST so PANEL_CONTENT can reference it ──
const panel = StyleSheet.create({
    options: { gap: 12 },
    option: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: Colors.dark[8],
        borderRadius: 12,
        color: Colors.gray[100],
        fontSize: 16,
        fontWeight: '500',
    },
    card: {
        backgroundColor: Colors.dark[8],
        borderRadius: 16,
        padding: 24,
        gap: 14,
    },
    cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.gray[100] },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    rowLabel: { fontSize: 15, color: Colors.gray[400] },
    rowValue: { fontSize: 15, color: Colors.gray[100] },
    divider: { height: 1, backgroundColor: Colors.dark[7] },
    clearBtn: {
        marginTop: 8,
        backgroundColor: Colors.error[600],
        color: Colors.gray[100],
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    comingSoon: { color: Colors.gray[500], fontSize: 16 },
});

// ── Right panel content per setting ─────────────────────────
const PANEL_CONTENT: Record<SettingId, { title: string; subtitle: string; body: React.ReactNode }> = {
    language: {
        title: 'Language',
        subtitle: 'Select your preferred app language',
        body: (
            <View style={panel.options}>
                {['English', 'Arabic', 'French', 'Spanish', 'German', 'Turkish'].map((lang) => (
                    <Text key={lang} style={panel.option}>{lang}</Text>
                ))}
            </View>
        ),
    },
    cache: {
        title: 'Cache & Storage',
        subtitle: 'Manage app cache and storage usage',
        body: (
            <View style={panel.card}>
                <Text style={panel.cardTitle}>Storage Usage</Text>
                {[
                    ['Image Cache', '156 MB'],
                    ['Video Cache', '156 MB'],
                    ['EPF Date', '156 MB'],
                    ['App Data', '156 MB'],
                ].map(([label, val]) => (
                    <View key={label} style={panel.row}>
                        <Text style={panel.rowLabel}>{label}</Text>
                        <Text style={panel.rowValue}>{val}</Text>
                    </View>
                ))}
                <View style={panel.divider} />
                <View style={panel.row}>
                    <Text style={[panel.rowLabel, { fontWeight: '700', color: Colors.gray[100] }]}>Total</Text>
                    <Text style={[panel.rowValue, { color: Colors.primaryBlue[950], fontWeight: '700' }]}>1.1 GB</Text>
                </View>
                <Text style={panel.clearBtn}>🗑  Clear All Cache</Text>
            </View>
        ),
    },
    device: {
        title: 'Device Info',
        subtitle: 'Information about your current device',
        body: (
            <View style={panel.card}>
                {[
                    ['Device Model', 'Apple TV 4K'],
                    ['OS Version', 'tvOS 17.0'],
                    ['App Version', '1.0.0'],
                    ['Build', '2024.1'],
                ].map(([label, val]) => (
                    <View key={label} style={panel.row}>
                        <Text style={panel.rowLabel}>{label}</Text>
                        <Text style={panel.rowValue}>{val}</Text>
                    </View>
                ))}
            </View>
        ),
    },
    subscription: {
        title: 'Subscription',
        subtitle: 'Manage your subscription plan',
        body: <Text style={panel.comingSoon}>Subscription management coming soon.</Text>,
    },
    playlist: {
        title: 'Playlist Management',
        subtitle: 'Add, remove, and manage your playlists',
        body: <Text style={panel.comingSoon}>No playlists added yet.</Text>,
    },
    parental: {
        title: 'Parental Control',
        subtitle: 'Set PIN and restrict content',
        body: <Text style={panel.comingSoon}>Parental control settings coming soon.</Text>,
    },
    'watch-history': {
        title: 'Watch History',
        subtitle: 'View and manage your watch history',
        body: <Text style={panel.comingSoon}>Your watch history will appear here.</Text>,
    },
    autoplay: {
        title: 'Autoplay Settings',
        subtitle: 'Configure autoplay behaviour',
        body: <Text style={panel.comingSoon}>Autoplay settings coming soon.</Text>,
    },
};

// ── Main component ────────────────────────────────────────────
export default function SettingsScreen() {
    const [activeSection, setActiveSection] = useState<SettingId>('cache');
    const active = PANEL_CONTENT[activeSection];

    return (
        <View style={styles.container}>
            {/* Left sidebar */}
            <ScrollView style={styles.sidebar} contentContainerStyle={styles.sidebarContent}>
                {SETTINGS.map((item) => (
                    <SettingTabButton
                        key={item.id}
                        icon={item.icon(activeSection === item.id ? Colors.dark[11] : Colors.gray[100])}
                        isActive={activeSection === item.id}
                        onPress={() => setActiveSection(item.id)}
                        testID={`settings-${item.id}`}
                    >
                        {item.label}
                    </SettingTabButton>
                ))}
            </ScrollView>

            {/* Right content panel */}
            <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
                <Text style={styles.panelTitle}>{active.title}</Text>
                <Text style={styles.panelSubtitle}>{active.subtitle}</Text>
                <View style={styles.panelDivider} />
                {active.body}
            </ScrollView>
        </View>
    );
}

// ── Screen styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row' },

    // Sidebar
    sidebar: { width: 280, borderRightWidth: 1, borderRightColor: Colors.dark[8] },
    sidebarContent: { paddingVertical: 16, paddingHorizontal: 16, gap: 4 },

    // Right panel
    panel: { flex: 1 },
    panelContent: { padding: 40 },
    panelTitle: { fontSize: 28, fontWeight: '800', color: Colors.gray[100], marginBottom: 8 },
    panelSubtitle: { fontSize: 15, color: Colors.gray[500], marginBottom: 24 },
    panelDivider: { height: 1, backgroundColor: Colors.dark[8], marginBottom: 28 },
});
