/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Media Card Examples
 *  Showcase for all specialized Media Card components
 * ─────────────────────────────────────────────────────────────
 */

import { Colors, Spacing } from '@/constants';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BackdropCard, CoverCard, PosterCard, SquareCard } from './cards';

const SAMPLE_POSTER = 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg';
const SAMPLE_BACKDROP = 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg';

export const CardExamples: React.FC = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.mainTitle}>Media Card System</Text>
            <Text style={styles.subtitle}>Individual specialized components</Text>

            {/* ── 1. POSTER CARD ────────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. Poster Card (Portrait)</Text>
                <Text style={styles.description}>160x240 aspect ratio for movies/series</Text>
                <View style={styles.row}>
                    <PosterCard
                        image={SAMPLE_POSTER}
                        title="Young Sheldon"
                        subtitle="2017 • 7 Seasons"
                        onPress={() => console.log('Poster Press')}
                    />
                    <PosterCard
                        image={SAMPLE_POSTER}
                        title="Active State"
                        subtitle="Full Opacity"
                        isActive
                    />
                </View>
            </View>

            {/* ── 2. BACKDROP CARD ──────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Backdrop Card (Landscape)</Text>
                <Text style={styles.description}>240x135 aspect ratio for episodes or live TV</Text>
                <View style={styles.row}>
                    <BackdropCard
                        image={SAMPLE_BACKDROP}
                        title="The Wildness of the West"
                        subtitle="E04 • Season 1"
                        onPress={() => console.log('Backdrop Press')}
                    />
                </View>
            </View>

            {/* ── 3. SQUARE CARD ────────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>3. Square Card</Text>
                <Text style={styles.description}>120x120 aspect ratio for channels or logos</Text>
                <View style={styles.row}>
                    <SquareCard
                        title="Channel 5"
                        onPress={() => console.log('Square Press')}
                    />
                    <SquareCard
                        title="Active Square"
                        isActive
                    />
                </View>
            </View>

            {/* ── 4. COVER CARD ─────────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>4. Cover Card</Text>
                <Text style={styles.description}>200x300 large portrait card</Text>
                <View style={styles.row}>
                    <CoverCard
                        image={SAMPLE_POSTER}
                        title="Movie Cover"
                        onPress={() => console.log('Cover Press')}
                    />
                </View>
            </View>

            {/* ── 5. STATE LOGIC DEMO ────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>5. State Logic Demo</Text>
                <Text style={styles.description}>Demonstrating Opacity and Focus scaling</Text>
                <View style={styles.row}>
                    <View style={styles.stack}>
                        <PosterCard
                            image={SAMPLE_POSTER}
                            title="Default (0.7 Opacity)"
                        />
                        <Text style={styles.label}>Default</Text>
                    </View>

                    <View style={styles.stack}>
                        <PosterCard
                            image={SAMPLE_POSTER}
                            isActive
                            title="Active (1.0 Opacity)"
                        />
                        <Text style={styles.label}>Active</Text>
                    </View>

                    <View style={styles.stack}>
                        {/* Simulating focus by overriding style for demo purposes isn't easy with Pressable, 
                            but D-pad interaction in simulator will show it. */}
                        <PosterCard
                            image={SAMPLE_POSTER}
                            title="Focus in Simulator"
                        />
                        <Text style={styles.label}>Use D-pad to test Focus</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        padding: Spacing.xl,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.gray[100],
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray[400],
        marginBottom: Spacing['2xl'],
    },
    section: {
        marginBottom: Spacing['2xl'],
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.gray[100],
        marginBottom: Spacing.xs,
    },
    description: {
        fontSize: 14,
        color: Colors.gray[400],
        marginBottom: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.xl,
        flexWrap: 'wrap',
    },
    stack: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    label: {
        fontSize: 12,
        color: Colors.gray[400],
        fontWeight: '500',
    },
});
