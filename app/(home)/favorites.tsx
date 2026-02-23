/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Favorites Screen
 *  Tab 4: Favorite channels, movies, and series
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const SUB_TABS = ['All', 'Live TV', 'Movies', 'Series'] as const;
type SubTab = typeof SUB_TABS[number];

const MOCK_FAVORITES = Array.from({ length: 12 }, (_, i) => ({
    id: String(i),
    title: `Favorite Item ${i + 1}`,
    type: i % 3 === 0 ? 'Live TV' : i % 3 === 1 ? 'Movies' : 'Series',
}));

export default function FavoritesScreen() {
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('All');

    const filtered = activeSubTab === 'All'
        ? MOCK_FAVORITES
        : MOCK_FAVORITES.filter((f) => f.type === activeSubTab);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Page Title */}
            <Text style={styles.pageTitle}>My Favorites</Text>

            {/* Sub-tab filter */}
            <View style={styles.subTabRow}>
                {SUB_TABS.map((tab) => (
                    <Text
                        key={tab}
                        onPress={() => setActiveSubTab(tab)}
                        style={[styles.subTab, activeSubTab === tab && styles.subTabActive]}
                    >
                        {tab}
                    </Text>
                ))}
            </View>

            {/* Empty state */}
            {filtered.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubText}>Add items to your favorites to see them here</Text>
                </View>
            )}

            {/* Favorites grid */}
            <View style={styles.grid}>
                {filtered.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardImage} />
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.cardType}>{item.type}</Text>
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

    emptyState: { alignItems: 'center', paddingVertical: 80 },
    emptyText: { fontSize: 22, fontWeight: '700', color: Colors.gray[300], marginBottom: 8 },
    emptySubText: { fontSize: 15, color: Colors.gray[500] },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    card: { width: 160 },
    cardImage: {
        width: 160,
        height: 120,
        backgroundColor: Colors.dark[8],
        borderRadius: 12,
        marginBottom: 8,
    },
    cardTitle: { color: Colors.gray[100], fontSize: 14, fontWeight: '600', marginBottom: 2 },
    cardType: { color: Colors.gray[500], fontSize: 12 },
});
