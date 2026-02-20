/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Series Screen
 *  Tab 3: Search bar · Category filter · Series poster grid
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const CATEGORIES = ['All', 'Featured', 'Drama', 'Comedy', 'Crime', 'Sci-Fi', 'Documentary', 'Reality'];

const MOCK_SERIES = Array.from({ length: 18 }, (_, i) => ({
    id: String(i),
    title: `Series Title ${i + 1}`,
    seasons: `${Math.floor(Math.random() * 5) + 1} seasons`,
}));

export default function SeriesScreen() {
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Text style={styles.searchPlaceholder}>🔍  Search for Series....</Text>
            </View>

            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
                {CATEGORIES.map((cat) => (
                    <Text
                        key={cat}
                        onPress={() => setActiveCategory(cat)}
                        style={[styles.pill, activeCategory === cat && styles.pillActive]}
                    >
                        {cat}
                    </Text>
                ))}
            </ScrollView>

            {/* Section Header */}
            <Text style={styles.sectionTitle}>All Series</Text>

            {/* Series Grid */}
            <View style={styles.grid}>
                {MOCK_SERIES.map((series) => (
                    <View key={series.id} style={styles.seriesCard}>
                        <View style={styles.posterPlaceholder} />
                        <Text style={styles.seriesTitle} numberOfLines={1}>{series.title}</Text>
                        <Text style={styles.seriesSeasons}>{series.seasons}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 32, paddingTop: 16 },

    searchBar: {
        backgroundColor: Colors.dark[8],
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    searchPlaceholder: { color: Colors.gray[500], fontSize: 16 },

    categoryRow: { marginBottom: 24 },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: Colors.dark[8],
        color: Colors.gray[300],
        fontSize: 15,
        fontWeight: '500',
        marginRight: 10,
    },
    pillActive: {
        backgroundColor: Colors.gray[100],
        color: Colors.dark[11],
        fontWeight: '700',
    },

    sectionTitle: { fontSize: 22, fontWeight: '700', color: Colors.gray[100], marginBottom: 16 },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    seriesCard: { width: 160 },
    posterPlaceholder: {
        width: 160,
        height: 240,
        backgroundColor: Colors.dark[8],
        borderRadius: 12,
        marginBottom: 8,
    },
    seriesTitle: { color: Colors.gray[100], fontSize: 14, fontWeight: '600', marginBottom: 2 },
    seriesSeasons: { color: Colors.gray[500], fontSize: 12 },
});
