/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Movies Screen
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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

// ── Types ──────────────────────────────────────────────────────
type Movie = {
    id: string;
    title: string;
    genre: string;
    year: string;
    duration: string;
    image: string;
    description: string;
};

// ── Hero Slides ────────────────────────────────────────────────
const HERO_SLIDES: Movie[] = [
    {
        id: 'h1',
        title: 'Shadow Hunter',
        genre: 'Action / Thriller',
        year: '2021',
        duration: '1h 48m',
        description:
            'A relentless detective unravels a web of secrets as he hunts a mysterious assassin lurking in the shadows.',
        image: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    },
    {
        id: 'h2',
        title: 'Greenland 2',
        genre: 'Action / Drama',
        year: '2022',
        duration: '2h 05m',
        description:
            'A family scrambles for survival as a catastrophic comet event threatens to end life on Earth.',
        image: 'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
    },
    {
        id: 'h3',
        title: 'Zootopia 2',
        genre: 'Animation / Comedy',
        year: '2024',
        duration: '1h 58m',
        description:
            'Judy and Nick return for a brand-new adventure across the wild districts of Zootopia.',
        image: 'https://image.tmdb.org/t/p/original/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    },
    {
        id: 'h4',
        title: 'The SpongeBob Movie',
        genre: 'Animation / Family',
        year: '2020',
        duration: '1h 31m',
        description:
            'SpongeBob and friends must save Bikini Bottom from a diabolical plan that threatens their world.',
        image: 'https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    },
];

// ── Movie Grid Data ────────────────────────────────────────────
const MOCK_MOVIES: Movie[] = [
    { id: '1', title: 'Rick and Morty', genre: 'All', year: '2021', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: '2', title: 'Last Horizon', genre: 'Drama', year: '2020', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg' },
    { id: '3', title: 'Shadow P...', genre: 'Comedy', year: '2022', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
    { id: '4', title: 'Zootopia 2', genre: 'All', year: '2024', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
    { id: '5', title: 'Shadow P...', genre: 'Comedy', year: '2020', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg' },
    { id: '6', title: 'David', genre: 'Thriller', year: '2021', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg' },
    { id: '7', title: 'CineMax Presents', genre: 'Drama', year: '2023', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg' },
    { id: '8', title: 'FilmBox Noir', genre: 'Thriller', year: '2022', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { id: '9', title: 'Gold Classics', genre: 'Comedy', year: '2019', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
    { id: '10', title: 'Retro Cinema', genre: 'Drama', year: '2018', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: '11', title: 'BBC Exclusive', genre: 'Thriller', year: '2021', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg' },
    { id: '12', title: 'Star Chronicles', genre: 'Comedy', year: '2022', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg' },
];

const CATEGORIES = ['All', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Adventure'];

// ── Screen ─────────────────────────────────────────────────────

export default function MoviesScreen() {
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        return () => setIsScrolled(false);
    }, []);

    const scrollX = useRef(new Animated.Value(0)).current;
    const heroScrollRef = useRef<ScrollView>(null);

    const filteredMovies = useMemo(() => {
        let result = MOCK_MOVIES;
        if (activeCategory !== 'All') {
            result = result.filter((m) => m.genre === activeCategory);
        }
        if (searchQuery.trim()) {
            result = result.filter((m) =>
                m.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [activeCategory, searchQuery]);

    const currentHero = HERO_SLIDES[heroIndex];

    const handleMoviePress = (movie: Movie) => {
        router.push({
            pathname: '/MovieDetailScreen',
            params: {
                id: movie.id,
                title: movie.title,
                genre: movie.genre,
                year: movie.year,
                duration: movie.duration,
                image: movie.image,
                description: movie.description,
            },
        });
    };

    const goToHero = (index: number) => {
        setHeroIndex(index);
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60)); // Small threshold to show background early
    };

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
                {/* Left → transparent gradient */}
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

                {/* Text content */}
                <View style={styles.heroContent}>
                    <Text style={styles.heroMeta}>
                        {currentHero.genre}{'  •  '}{currentHero.year}{'  •  '}{currentHero.duration}
                    </Text>
                    <Text style={styles.heroTitle}>{currentHero.title}</Text>
                    <Text style={styles.heroDesc} numberOfLines={2}>
                        {currentHero.description}
                    </Text>

                    {/* CTA Buttons */}
                    <View style={styles.heroBtns}>
                        <NavButton
                            icon={<MaterialCommunityIcons name="play" size={scale(18)} />}
                            onPress={() => handleMoviePress(currentHero)}
                        >
                            Watch now
                        </NavButton>
                        <NavButton
                            icon={<MaterialCommunityIcons name="information-outline" size={scale(18)} />}
                            onPress={() => handleMoviePress(currentHero)}
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
                            onPress={() => goToHero(i)}
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
                    placeholder="Search for movies...."
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

            {/* ── Poster Grid ── */}
            {filteredMovies.length > 0 ? (
                <View style={styles.grid}>
                    {filteredMovies.map((movie) => (
                        <PosterCard
                            key={movie.id}
                            image={movie.image}
                            title={movie.title}
                            subtitle={movie.duration}
                            onPress={() => handleMoviePress(movie)}
                        />
                    ))}
                </View>
            ) : (
                <EmptyState
                    icon="movie-open"
                    title="No Movies Found"
                    subtitle="On this categories we can't find any movie. Try another category"
                />
            )}
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: xdWidth(14),
        paddingHorizontal: xdWidth(32),
    },
});
