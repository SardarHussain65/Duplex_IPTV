/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Parental Control Screen
 *  Lock icon tab: Sub-filter (Live TV / Movies / Series) + content grid
 *  Matches Figma: "Parental Control" heading + 3 sub-tabs with counts
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Sub-tab definition with mock counts
const SUB_TABS = [
    { id: 'live-tv', label: 'Live TV', count: 65 },
    { id: 'movies', label: 'Movies', count: 34 },
    { id: 'series', label: 'Series', count: 34 },
] as const;
type SubTab = typeof SUB_TABS[number]['id'];

const MOCK_ITEMS = Array.from({ length: 18 }, (_, i) => ({
    id: String(i),
    title: `Blocked Item ${i + 1}`,
    type: i % 3 === 0 ? 'live-tv' : i % 3 === 1 ? 'movies' : 'series',
    duration: '1h 20m',
}));

export default function ParentalControlScreen() {
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('live-tv');

    const filtered = MOCK_ITEMS.filter((item) => item.type === activeSubTab);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Page heading */}
            <Text style={styles.pageTitle}>Parental Control</Text>

            {/* Sub-filter row — matches Figma pill buttons with counts */}
            <View style={styles.subTabRow}>
                {SUB_TABS.map((tab) => (
                    <Text
                        key={tab.id}
                        onPress={() => setActiveSubTab(tab.id)}
                        style={[styles.subTab, activeSubTab === tab.id && styles.subTabActive]}
                    >
                        {tab.label}
                        <Text style={[styles.subTabCount, activeSubTab === tab.id && styles.subTabCountActive]}>
                            {' '}({tab.count})
                        </Text>
                    </Text>
                ))}
            </View>

            {/* Content grid */}
            <View style={styles.grid}>
                {filtered.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardImage} />
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.cardDuration}>{item.duration}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 32, paddingTop: 16 },

    pageTitle: { fontSize: 28, fontWeight: '800', color: Colors.gray[100], marginBottom: 24 },

    subTabRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    subTab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: Colors.dark[8],
        color: Colors.gray[300],
        fontSize: 15,
        fontWeight: '500',
    },
    subTabActive: {
        backgroundColor: Colors.gray[100],
        color: Colors.dark[11],
        fontWeight: '700',
    },
    subTabCount: { color: Colors.gray[500] },
    subTabCountActive: { color: Colors.dark[7] },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    card: { width: 160 },
    cardImage: {
        width: 160,
        height: 240,
        backgroundColor: Colors.dark[8],
        borderRadius: 12,
        marginBottom: 8,
    },
    cardTitle: { color: Colors.gray[100], fontSize: 14, fontWeight: '600', marginBottom: 2 },
    cardDuration: { color: Colors.gray[500], fontSize: 12 },
});
