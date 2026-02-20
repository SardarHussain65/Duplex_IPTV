/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Movies Screen
 *  Tab 2: Search bar · Category filter · Movie poster grid
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const CATEGORIES = ['All', 'Featured', 'Action', 'Comedy', 'Drama', 'Thriller', 'Animation', 'Horror'];

const MOCK_MOVIES = Array.from({ length: 18 }, (_, i) => ({
    id: String(i),
    title: `Movie Title ${i + 1}`,
    duration: '1h 20m',
}));

export default function MoviesScreen() {
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Text style={styles.searchPlaceholder}>🔍  Search for Movies....</Text>
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
            <Text style={styles.sectionTitle}>All Movies</Text>

            {/* Movie Grid (poster aspect ratio ~2:3) */}
            <View style={styles.grid}>
                {MOCK_MOVIES.map((movie) => (
                    <View key={movie.id} style={styles.movieCard}>
                        <View style={styles.posterPlaceholder} />
                        <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>
                        <Text style={styles.movieDuration}>{movie.duration}</Text>
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
    movieCard: { width: 160 },
    posterPlaceholder: {
        width: 160,
        height: 240,
        backgroundColor: Colors.dark[8],
        borderRadius: 12,
        marginBottom: 8,
    },
    movieTitle: { color: Colors.gray[100], fontSize: 14, fontWeight: '600', marginBottom: 2 },
    movieDuration: { color: Colors.gray[500], fontSize: 12 },
});
