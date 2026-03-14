/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Series Detail Screen
 *  Poster · Info · Watch Now · Cast · Season tabs · Episodes
 * ─────────────────────────────────────────────────────────────
 */

import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { NavButton } from '@/components/ui/buttons/NavButton';
import { NavIconButton } from '@/components/ui/buttons/NavIconButton';
import { EpisodeCard } from '@/components/ui/cards/EpisodeCard';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

// ── Types ──────────────────────────────────────────────────────
type Episode = {
    id: string;
    number: number;
    title: string;
    description: string;
    duration: string;
    image: string;
    progress?: number; // 0-1, undefined = not started
};

// ── Mock Data ──────────────────────────────────────────────────
const CAST = [
    'Andy Sanberg',
    'Daniel Hayes',
    'Andy Sanberg',
    'Ethan Walker',
    'Ethan Walker',
    'Charlotte Hayes',
    'Olivia Turne',
];

const SEASONS = ['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Season 5', 'Season 6'];

const generateEpisodes = (season: number): Episode[] =>
    Array.from({ length: 10 }, (_, i) => ({
        id: `s${season}e${i + 1}`,
        number: i + 1,
        title: 'Echoes of the Past',
        description:
            'A key piece of evidence in a cold case suddenly resurfaces, bringing back painful memories for those involved.',
        duration: '1h 20m',
        image: [
            'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
            'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
            'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg',
            'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
            'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
        ][i % 5],
        progress: i === 1 ? 0.35 : undefined,
    }));

// ── Screen ─────────────────────────────────────────────────────

export default function SeriesDetailScreen() {
    const router = useRouter();
    const { setIsScrolled, setParentalModalVisible } = useTab();
    const params = useLocalSearchParams<{
        id: string;
        title: string;
        genre: string;
        year: string;
        season: string;
        image: string;
        description: string;
    }>();

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [activeSeason, setActiveSeason] = useState(0);

    useEffect(() => {
        setIsScrolled(false);
        return () => setIsScrolled(false);
    }, []);

    const title = params.title ?? 'Brooklyn Nine-Nine';
    const genre = params.genre ?? 'Action / Thriller';
    const year = params.year ?? '2021';
    const season = params.season ?? 'S4';
    const image = params.image ?? '';
    const description =
        params.description ??
        'Set in a modern city, this series follows a group of individuals whose lives secretly intersect through crime, power, and ambition. Each episode uncovers new layers of mystery, personal conflict, and unexpected alliances. As tensions rise across multiple seasons, hidden motives are revealed, relationships are tested, and one wrong move can change everything forever.';

    const episodes = generateEpisodes(activeSeason + 1);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    const renderEpisodeItem = ({ item }: { item: Episode }) => (
        <EpisodeCard
            key={item.id}
            number={item.number}
            title={item.title}
            description={item.description}
            duration={item.duration}
            image={item.image}
            progress={item.progress}
            onPress={() =>
                router.push({
                    pathname: '/player/[id]',
                    params: {
                        id: item.id,
                        title: item.title,
                        genre,
                        year,
                        duration: item.duration,
                        image: item.image,
                        isSeries: 'true',
                    },
                })
            }
        />
    );

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            {/* ── Full-screen blurred background ── */}
            {image ? (
                <Image
                    source={{ uri: image }}
                    style={styles.bgImage}
                    contentFit="cover"
                    blurRadius={55}
                />
            ) : null}
            <View style={styles.bgOverlay} />

            {/* ── Top: Poster + Info ── */}
            <View style={styles.mainRow}>
                {/* Left: Poster */}
                <View style={styles.posterWrapper}>
                    {image ? (
                        <View>
                            <Image
                                source={{ uri: image }}
                                style={styles.poster}
                                contentFit="cover"
                            />
                            {/* Progress Bar on Poster */}
                            <View style={styles.posterProgressTrack}>
                                <View style={[styles.posterProgressBar, { width: '45%' }]} />
                            </View>
                        </View>
                    ) : (
                        <View style={[styles.poster, styles.posterPlaceholder]} />
                    )}
                </View>

                {/* Right: Info */}
                <View style={styles.infoPanel}>
                    <Text style={styles.metaText}>
                        {genre}{'  •  '}{year}{'  •  '}{season}
                    </Text>
                    <Text style={styles.title}>{title}</Text>

                    {/* Rating + Age */}
                    <View style={styles.ratingRow}>
                        <MaterialCommunityIcons name="star" size={scale(16)} color="#F59E0B" />
                        <Text style={styles.ratingValue}>4.5</Text>
                        <View style={styles.ageBadge}>
                            <Text style={styles.ageText}>13+</Text>
                        </View>
                    </View>

                    <Text style={styles.description} numberOfLines={5}>
                        {description}
                    </Text>

                    {/* Action row */}
                    <View style={styles.actionRow}>
                        <NavButton
                            icon={<MaterialCommunityIcons name="play" size={scale(18)} />}
                            onPress={() =>
                                router.push({
                                    pathname: '/player/[id]',
                                    params: {
                                        id: params.id || 'series',
                                        title,
                                        genre,
                                        year,
                                        duration: season,
                                        image,
                                        isSeries: 'true',
                                    },
                                })
                            }
                        >
                            Continue Watching
                        </NavButton>
                        <NavIconButton
                            icon={
                                <MaterialCommunityIcons
                                    name={isFavorite ? 'heart' : 'heart-outline'}
                                    size={scale(20)}
                                    color={isFavorite ? '#E0334C' : Colors.gray[300]}
                                />
                            }
                            isActive={isFavorite}
                            activeBackgroundColor="#E0334C"
                            onPress={() => setIsFavorite((v) => !v)}
                        />
                        <NavIconButton
                            icon={
                                <MaterialCommunityIcons
                                    name={isLocked ? 'lock' : 'lock-open-outline'}
                                    size={scale(20)}
                                    color={Colors.gray[300]}
                                />
                            }
                            isActive={isLocked}
                            onPress={() => setParentalModalVisible(true)}
                        />
                    </View>

                    {/* Cast */}
                    <View style={styles.castRow}>
                        <Text style={styles.castLabel}>Cast:</Text>
                        <Text style={styles.castNames} numberOfLines={2}>
                            {CAST.join('  •  ')}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ── Season Tabs ── */}
            <View style={styles.divider} />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.seasonsScroll}
                contentContainerStyle={styles.seasonsContent}
            >
                {SEASONS.map((s, i) => (
                    <CategoryButton
                        key={s}
                        isActive={i === activeSeason}
                        onPress={() => setActiveSeason(i)}
                    >
                        {s}
                    </CategoryButton>
                ))}
            </ScrollView>

            {/* ── Episodes List ── */}
            <Text style={styles.episodesHeader}>
                Episodes ({episodes.length})
            </Text>
            <View style={styles.episodesDivider} />

            <FlatList
                key={`episodes-s${activeSeason}`}
                data={episodes}
                keyExtractor={(item) => item.id}
                renderItem={renderEpisodeItem}
                scrollEnabled={false}
                contentContainerStyle={styles.episodesList}
            />
        </ScrollView>
    );
}

// ── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#141416',

    },
    scrollContent: {
        paddingVertical: xdHeight(40),
    },
    bgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: xdHeight(380),
        opacity: 0.28,
    },
    bgOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: xdHeight(380),
        backgroundColor: 'rgba(20,20,22,0.70)',
    },

    // ── Top row ──────────────────────────────────────────────
    mainRow: {
        flexDirection: 'row',
        gap: xdWidth(40),
        paddingHorizontal: xdWidth(40),
        paddingTop: xdHeight(36),
        paddingBottom: xdHeight(30),
    },

    posterWrapper: {
        borderRadius: scale(14),
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
    },
    poster: {
        width: xdWidth(230),
        height: xdHeight(310),
        borderRadius: scale(14),
    },
    posterPlaceholder: {
        backgroundColor: Colors.dark[8],
    },
    posterProgressTrack: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    posterProgressBar: {
        height: '100%',
        backgroundColor: '#E91E63',
    },

    infoPanel: {
        flex: 1,
        paddingTop: xdHeight(10),
    },
    metaText: {
        fontSize: scale(13),
        color: Colors.gray[400],
        fontWeight: '500',
        marginBottom: xdHeight(8),
    },
    title: {
        fontSize: scale(34),
        fontWeight: '800',
        color: Colors.gray[100],
        marginBottom: xdHeight(10),
        letterSpacing: -0.5,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(6),
        marginBottom: xdHeight(14),
    },
    ratingValue: {
        fontSize: scale(14),
        fontWeight: '700',
        color: '#F59E0B',
    },
    ageBadge: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: xdWidth(10),
        paddingVertical: xdHeight(3),
        borderRadius: scale(6),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    ageText: {
        fontSize: scale(11),
        color: Colors.gray[300],
        fontWeight: '600',
    },
    description: {
        fontSize: scale(13),
        color: Colors.gray[400],
        lineHeight: scale(21),
        marginBottom: xdHeight(20),
        maxWidth: xdWidth(540),
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(12),
        marginBottom: xdHeight(20),
    },
    castRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: xdWidth(10),
        maxWidth: xdWidth(540),
    },
    castLabel: {
        fontSize: scale(13),
        fontWeight: '700',
        color: Colors.gray[100],
        paddingTop: 1,
    },
    castNames: {
        flex: 1,
        fontSize: scale(13),
        color: Colors.gray[400],
        lineHeight: scale(21),
    },

    // ── Divider ───────────────────────────────────────────────
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginHorizontal: xdWidth(40),
        marginBottom: xdHeight(18),
    },


    // ── Episodes ──────────────────────────────────────────────
    episodesHeader: {
        fontSize: scale(16),
        fontWeight: '700',
        color: Colors.gray[100],
        paddingHorizontal: xdWidth(40),
        marginBottom: xdHeight(10),
    },
    episodesDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginHorizontal: xdWidth(40),
        marginBottom: xdHeight(4),
    },
    seasonsScroll: {
        marginBottom: xdHeight(22),
    },
    seasonsContent: {
        paddingHorizontal: xdWidth(40),
        gap: xdWidth(10),
    },
    episodesList: {
        paddingBottom: xdHeight(20),
    },
});
