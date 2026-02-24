/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Series Screen
 *  Hero banner · Search · Category filter · Poster grid
 * ─────────────────────────────────────────────────────────────
 */

import { EmptyState, SearchBar } from '@/components/ui';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { NavButton } from '@/components/ui/buttons/NavButton';
import { PosterCard } from '@/components/ui/cards/PosterCard';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

// ── Types ──────────────────────────────────────────────────────
type Series = {
    id: string;
    title: string;
    genre: string;
    year: string;
    season: string;
    image: string;
    description: string;
};

// ── Hero Slides ────────────────────────────────────────────────
const HERO_SLIDES: Series[] = [
    {
        id: 'h1',
        title: '96 Minutes',
        genre: 'Action / Thriller',
        year: '2021',
        season: 'S4',
        description:
            'A relentless detective unravels a web of secrets as he hunts a mysterious assassin lurking in the shadows.',
        image: 'https://image.tmdb.org/t/p/original/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
    },
    {
        id: 'h2',
        title: 'Brooklyn Nine-Nine',
        genre: 'Comedy / Crime',
        year: '2013',
        season: 'S6',
        description:
            'A talented but immature detective of the 99th precinct must adjust when a new commanding officer arrives.',
        image: 'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
    },
    {
        id: 'h3',
        title: 'The Wrecking Crew',
        genre: 'Action / Drama',
        year: '2022',
        season: 'S4',
        description:
            'A spec-ops team takes on high-risk missions across conflict zones while dealing with personal demons.',
        image: 'https://image.tmdb.org/t/p/original/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg',
    },
    {
        id: 'h4',
        title: 'Young Sheldon',
        genre: 'Comedy / Family',
        year: '2017',
        season: 'S2',
        description:
            'The early life of Sheldon Cooper is explored as a child genius navigating childhood in East Texas.',
        image: 'https://image.tmdb.org/t/p/original/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    },
];

// ── Series Grid Data ───────────────────────────────────────────
const MOCK_SERIES: Series[] = [
    { id: '1', title: 'Naruto Shippu...', genre: 'Drama', year: '2007', season: 'S2', description: '', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: '2', title: 'Brooklyn Nin...', genre: 'Comedy', year: '2013', season: 'S6', description: '', image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg' },
    { id: '3', title: 'Sesame stree...', genre: 'Comedy', year: '2020', season: 'S5', description: '', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
    { id: '4', title: 'Young Sheldo...', genre: 'Comedy', year: '2017', season: 'S2', description: '', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
    { id: '5', title: 'The Wrecking...', genre: 'Drama', year: '2022', season: 'S4', description: '', image: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg' },
    { id: '6', title: 'Paw Patrol', genre: 'Comedy', year: '2013', season: 'S6', description: '', image: 'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg' },
    { id: '7', title: 'Breaking Bad', genre: 'Thriller', year: '2008', season: 'S5', description: '', image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg' },
    { id: '8', title: 'True Detective', genre: 'Thriller', year: '2014', season: 'S4', description: '', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { id: '9', title: 'The Mandalorian', genre: 'Drama', year: '2019', season: 'S3', description: '', image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
    { id: '10', title: 'Stranger Things', genre: 'Drama', year: '2016', season: 'S4', description: '', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: '11', title: 'The Crown', genre: 'Drama', year: '2016', season: 'S6', description: '', image: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg' },
    { id: '12', title: 'Ted Lasso', genre: 'Comedy', year: '2020', season: 'S3', description: '', image: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg' },
];

const CATEGORIES = ['Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Adventure'];

// ── Screen ─────────────────────────────────────────────────────

export default function SeriesScreen() {
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const [activeCategory, setActiveCategory] = useState('Drama');
    const [searchQuery, setSearchQuery] = useState('');
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        return () => setIsScrolled(false);
    }, []);

    const currentHero = HERO_SLIDES[heroIndex];

    const handleSeriesPress = (series: Series) => {
        router.push({
            pathname: '/SeriesDetailScreen',
            params: {
                id: series.id,
                title: series.title,
                genre: series.genre,
                year: series.year,
                season: series.season,
                image: series.image,
                description: series.description,
            },
        });
    };

    const filteredSeries = useMemo(() => {
        let result = MOCK_SERIES;
        if (searchQuery.trim()) {
            result = result.filter((s) =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [searchQuery]);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    const renderSeriesItem = ({ item }: { item: Series }) => (
        <PosterCard
            image={item.image}
            title={item.title}
            subtitle={item.season}
            onPress={() => handleSeriesPress(item)}
            style={styles.cardSpacing}
        />
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            {/* ── Hero Banner ── */}
            <View style={styles.heroContainer}>
                {/* Background image */}
                <Image
                    source={{ uri: currentHero.image }}
                    style={styles.heroBg}
                    contentFit="cover"
                />

                <Svg style={StyleSheet.absoluteFillObject}>
                    <Defs>
                        <LinearGradient id="leftGrad" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor="#141416" stopOpacity="1" />
                            <Stop offset="0.55" stopColor="#141416" stopOpacity="0.7" />
                            <Stop offset="1" stopColor="#141416" stopOpacity="0" />
                        </LinearGradient>
                        <LinearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#141416" stopOpacity="0" />
                            <Stop offset="0.6" stopColor="#141416" stopOpacity="0.75" />
                            <Stop offset="1" stopColor="#141416" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#leftGrad)" />
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#bottomGrad)" />
                </Svg>

                {/* Dark gradient overlay */}

                {/* Text content */}
                <View style={styles.heroContent}>
                    <Text style={styles.heroMeta}>
                        {currentHero.genre}{'  •  '}{currentHero.year}{'  •  '}{currentHero.season}
                    </Text>
                    <Text style={styles.heroTitle}>{currentHero.title}</Text>
                    <Text style={styles.heroDesc} numberOfLines={2}>
                        {currentHero.description}
                    </Text>

                    {/* CTA Buttons */}
                    <View style={styles.heroBtns}>
                        <NavButton
                            icon={<MaterialCommunityIcons name="play" size={scale(18)} />}
                            onPress={() => handleSeriesPress(currentHero)}
                        >
                            Watch now
                        </NavButton>
                        <NavButton
                            icon={<MaterialCommunityIcons name="information-outline" size={scale(18)} />}
                            onPress={() => handleSeriesPress(currentHero)}
                        >
                            Learn More
                        </NavButton>
                    </View>
                </View>

                {/* Carousel Dots */}
                <View style={styles.dotsRow}>
                    {HERO_SLIDES.map((_, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setHeroIndex(i)}
                            style={[styles.dot, i === heroIndex && styles.dotActive]}
                        />
                    ))}
                </View>
            </View>

            {/* ── Search Bar ── */}
            <View style={styles.searchWrapper}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search for series...."
                />
            </View>

            {/* ── Category Filter ── */}
            <Text style={styles.sectionTitle}>Browse by Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryRow}
                contentContainerStyle={styles.categoryContent}
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

            {/* ── Poster Grid — FlatList nested inside ScrollView ── */}
            <FlatList
                key={`series-grid-${activeCategory}-${searchQuery}`}
                data={filteredSeries}
                keyExtractor={(item) => item.id}
                renderItem={renderSeriesItem}
                numColumns={5}
                scrollEnabled={false}
                contentContainerStyle={styles.gridContainer}
                columnWrapperStyle={filteredSeries.length > 1 ? styles.columnWrapper : null}
                ListEmptyComponent={
                    <EmptyState
                        icon="television-play"
                        title="No Series Found"
                        subtitle="On this categories we can't find any series. Try another category"
                    />
                }
            />
        </ScrollView>
    );
}

// ── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141416',
    },
    content: {
        paddingBottom: xdHeight(40),
    },

    // Hero
    heroContainer: {
        height: xdHeight(380),
        position: 'relative',
        justifyContent: 'flex-end',
        marginBottom: xdHeight(28),
    },
    heroBg: {
        ...StyleSheet.absoluteFillObject,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20,20,22,0.62)',
    },
    heroContent: {
        paddingHorizontal: xdWidth(40),
        paddingBottom: xdHeight(50),
    },
    heroMeta: {
        fontSize: scale(13),
        color: Colors.gray[400],
        fontWeight: '500',
        marginBottom: xdHeight(8),
    },
    heroTitle: {
        fontSize: scale(36),
        fontWeight: '800',
        color: Colors.gray[100],
        marginBottom: xdHeight(10),
        letterSpacing: -0.5,
    },
    heroDesc: {
        fontSize: scale(13),
        color: Colors.gray[400],
        lineHeight: scale(20),
        maxWidth: xdWidth(420),
        marginBottom: xdHeight(22),
    },
    heroBtns: {
        flexDirection: 'row',
        gap: xdWidth(14),
    },

    // Carousel dots
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: xdWidth(8),
        paddingBottom: xdHeight(16),
    },
    dot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
        backgroundColor: '#FFFFFF',
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
    },

    // Search
    searchWrapper: {
        paddingHorizontal: xdWidth(32),
        marginBottom: xdHeight(24),
    },

    // Categories
    sectionTitle: {
        fontSize: scale(18),
        fontWeight: '700',
        color: Colors.gray[100],
        marginBottom: xdHeight(14),
        paddingHorizontal: xdWidth(32),
    },
    categoryRow: {
        marginBottom: xdHeight(20),
    },
    categoryContent: {
        paddingHorizontal: xdWidth(32),
    },

    // Grid
    gridContainer: {
        paddingHorizontal: xdWidth(32),
    },
    columnWrapper: {
        gap: xdWidth(20),
    },
    cardSpacing: {
        marginBottom: xdHeight(16),
    },
});
