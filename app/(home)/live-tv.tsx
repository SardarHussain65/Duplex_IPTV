
/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Live TV Screen
 * ─────────────────────────────────────────────────────────────
 */

import { BackdropCard, EmptyState, SearchBar } from '@/components/ui';
import ButtonSystemShowcase from '@/components/ui/ButtonExamples';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// ── Types ─────────────────────────────────────────────────────

type Channel = {
    id: string;
    name: string;
    category: string;
    image: string;
};

// ── Category filter data ──────────────────────────────────────
const CATEGORIES = [
    'All', 'Featured', 'Sport', 'Entertainment',
    'Movies', 'Kids', 'Music', 'Classics', 'News', 'Religious',
];

// ── Realistic IPTV Channel Data ───────────────────────────────
const MOCK_CHANNELS: Channel[] = [
    { id: '1', name: 'Global Bangla', category: 'Featured', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: '2', name: 'O Joo', category: 'Entertainment', image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg' },
    { id: '3', name: 'Globe News', category: 'News', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
    { id: '4', name: 'TMO', category: 'Music', image: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg' },
    { id: '5', name: 'Salin TV', category: 'Entertainment', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
    { id: '6', name: 'Asshukur', category: 'Religious', image: 'https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg' },
    { id: '7', name: 'ESPN Live', category: 'Sport', image: 'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg' },
    { id: '8', name: 'Star Sports', category: 'Sport', image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg' },
    { id: '9', name: 'Cartoon World', category: 'Kids', image: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg' },
    { id: '10', name: 'Toon Blast', category: 'Kids', image: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
    { id: '11', name: 'CineMax', category: 'Movies', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { id: '12', name: 'FilmBox', category: 'Movies', image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
    { id: '13', name: 'Gold Classics', category: 'Classics', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: '14', name: 'Retro Cinema', category: 'Classics', image: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg' },
    { id: '15', name: 'MTV Hits', category: 'Music', image: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg' },
    { id: '16', name: 'BBC World', category: 'News', image: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg' },
    { id: '17', name: 'Star Plus', category: 'Featured', image: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg' },
    { id: '18', name: 'Peace TV', category: 'Religious', image: 'https://image.tmdb.org/t/p/w500/nkayOAUBUu4mMvyNf9iHSUiPjF1.jpg' },
];

// ── Screen ────────────────────────────────────────────────────

export default function LiveTVScreen() {
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        return () => setIsScrolled(false);
    }, [setIsScrolled]);

    const filteredChannels = useMemo(() => {
        let result = MOCK_CHANNELS;

        if (activeCategory !== 'All') {
            result = result.filter(
                (ch) => ch.category.toLowerCase() === activeCategory.toLowerCase()
            );
        }

        if (searchQuery.trim()) {
            result = result.filter((ch) =>
                ch.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [activeCategory, searchQuery]);

    const handleChannelPress = (channel: Channel) => {
        router.push({
            pathname: '/ChannelDetailScreen',
            params: {
                id: channel.id,
                name: channel.name,
                category: channel.category,
                image: channel.image,
            },
        });
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            {/* Hero Section */}
            <View style={styles.heroContainer}>
                <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>
                        What's{' '}
                        <Text style={{ color: Colors.secondary[950] }}>Live Now!</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Jump into live channels and see what's happening right now across
                        news, sports, and entertainment.
                    </Text>
                </View>
                <View style={styles.heroImageWrapper}>
                    <Image
                        source={require('@/assets/images/heroImageLiveTV.png')}
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchWrapper}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            <ButtonSystemShowcase />

            {/* Category Filter */}
            <Text style={styles.sectionTitle}>Browse by Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryRow}
            >
                {CATEGORIES.map((cat) => (
                    <CategoryButton
                        key={cat}
                        isActive={activeCategory === cat}
                        onPress={() => setActiveCategory(cat)}
                        style={{ marginRight: xdWidth(8) }}
                    >
                        {cat}
                    </CategoryButton>
                ))}
            </ScrollView>

            {/* Channel Count */}
            <Text style={styles.channelCount}>
                {filteredChannels.length} channel{filteredChannels.length !== 1 ? 's' : ''} found
            </Text>

            {/* Channel Grid */}
            {filteredChannels.length > 0 ? (
                <View style={styles.grid}>
                    {filteredChannels.map((ch) => (
                        <BackdropCard
                            key={ch.id}
                            title={ch.name}
                            subtitle={ch.category}
                            image={{ uri: ch.image }}
                            style={styles.cardSpacing}
                            onPress={() => handleChannelPress(ch)}
                        />
                    ))}
                </View>
            ) : (
                <EmptyState
                    icon="television"
                    title="No Live TV Found"
                    subtitle="On this categories we can't find any live tv. Try another category"
                />
            )}
        </ScrollView>
    );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#141416' },
    content: { paddingHorizontal: xdWidth(32), paddingBottom: xdHeight(40) },
    heroContainer: {
        flexDirection: 'row',
        height: xdHeight(280),
        marginBottom: xdHeight(24),
        overflow: 'hidden',
        backgroundColor: '#141416',
    },
    heroOverlay: { width: '45%', justifyContent: 'center', paddingHorizontal: xdWidth(40), zIndex: 1 },
    heroImageWrapper: { width: '55%', height: '100%' },
    heroImage: { opacity: 0.6, width: '100%', height: '100%' },
    heroTitle: { fontSize: scale(32), fontWeight: '800', color: Colors.gray[100], marginBottom: xdHeight(12) },
    heroSubtitle: { fontSize: scale(14), color: Colors.gray[400], maxWidth: xdWidth(480), lineHeight: scale(22) },
    searchWrapper: { marginBottom: xdHeight(32) },
    sectionTitle: { fontSize: scale(18), fontWeight: '700', color: Colors.gray[100], marginBottom: xdHeight(16) },
    categoryRow: { marginBottom: xdHeight(16) },
    channelCount: { fontSize: scale(13), color: Colors.gray[400], marginBottom: xdHeight(16) },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: xdWidth(18) },
    cardSpacing: { marginRight: xdWidth(16), marginBottom: xdHeight(16) },
});