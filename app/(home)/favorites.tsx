import { BackdropCard, EmptyState, PosterCard } from '@/components/ui';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

// ── Types ─────────────────────────────────────────────────────

type FavoriteType = 'Live TV' | 'Movies' | 'Series';

interface FavoriteItem {
    id: string;
    title: string;
    type: FavoriteType;
    image: string;
    subtitle?: string;
    genre?: string;
    year?: string;
    duration?: string;
    season?: string;
    description?: string;
}

// ── Mock Data ─────────────────────────────────────────────────

const MOCK_FAVORITES: FavoriteItem[] = [
    // Live TV
    { id: '1', title: 'Salin TV', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', genre: 'Entertainment' },
    { id: '2', title: 'Global Bangle', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', genre: 'Featured' },
    { id: '3', title: 'O Joo', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', genre: 'Entertainment' },
    { id: '4', title: 'Globe News', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', genre: 'News' },
    { id: '5', title: 'TMO', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg', genre: 'Music' },
    // Movies
    { id: '8', title: 'Defaulter', type: 'Movies', subtitle: '1h 20m', image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', genre: 'Action', year: '2022', duration: '1h 20m', description: 'Defaulter action.' },
    { id: '9', title: 'Zootopia 2', type: 'Movies', subtitle: '1h 20m', image: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', genre: 'Animation', year: '2024', duration: '1h 20m', description: 'Zootopia 2 fun.' },
    { id: '10', title: 'Shadow P...', type: 'Movies', subtitle: '1h 20m', image: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', genre: 'Comedy', year: '2020', duration: '1h 20m', description: 'Shadow P comedy.' },
    { id: '11', title: 'David', type: 'Movies', subtitle: '1h 20m', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', genre: 'Thriller', year: '2021', duration: '1h 20m', description: 'David thriller.' },
    // Series
    { id: '14', title: 'Sesame Street', type: 'Series', subtitle: 'S5', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', genre: 'Kids', year: '2020', season: 'S5', description: 'Sesame street.' },
    { id: '15', title: 'Young Sheldon', type: 'Series', subtitle: 'S2', image: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg', genre: 'Comedy', year: '2017', season: 'S2', description: 'Young sheldon.' },
    { id: '16', title: 'The Wrecking...', type: 'Series', subtitle: 'S4', image: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', genre: 'Action', year: '2022', season: 'S4', description: 'Wrecking crew.' },
    { id: '17', title: 'Paw Patrol', type: 'Series', subtitle: 'S6', image: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg', genre: 'Kids', year: '2013', season: 'S6', description: 'Paw patrol.' },
];

const CATEGORIES: { label: FavoriteType; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { label: 'Live TV', icon: 'television' },
    { label: 'Movies', icon: 'movie-outline' },
    { label: 'Series', icon: 'play-box-outline' },
];

// ── Screen ────────────────────────────────────────────────────

export default function FavoritesScreen() {
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const [activeTab, setActiveTab] = useState<FavoriteType>('Live TV');

    useEffect(() => {
        return () => setIsScrolled(false);
    }, [setIsScrolled]);

    const filteredItems = MOCK_FAVORITES.filter(item => item.type === activeTab);

    const getCount = (type: FavoriteType) => {
        return MOCK_FAVORITES.filter(item => item.type === type).length;
    };

    const handlePress = (item: FavoriteItem) => {
        if (item.type === 'Live TV') {
            router.push({
                pathname: '/ChannelDetailScreen',
                params: {
                    id: item.id,
                    name: item.title,
                    category: item.genre || '',
                    image: item.image,
                },
            });
        } else if (item.type === 'Movies') {
            router.push({
                pathname: '/MovieDetailScreen',
                params: {
                    id: item.id,
                    title: item.title,
                    genre: item.genre || '',
                    year: item.year || '',
                    duration: item.duration || '',
                    image: item.image,
                    description: item.description || '',
                },
            });
        } else {
            router.push({
                pathname: '/SeriesDetailScreen',
                params: {
                    id: item.id,
                    title: item.title,
                    genre: item.genre || '',
                    year: item.year || '',
                    season: item.season || '',
                    image: item.image,
                    description: item.description || '',
                },
            });
        }
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    const posterColumns = 5;
    const backdropColumns = 4;
    const numColumns = activeTab === 'Live TV' ? backdropColumns : posterColumns;

    const renderItem = ({ item }: { item: FavoriteItem }) =>
        activeTab === 'Live TV' ? (
            <BackdropCard
                title={item.title}
                image={item.image}
                style={styles.cardSpacing}
                onPress={() => handlePress(item)}
            />
        ) : (
            <PosterCard
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                style={styles.cardSpacing}
                onPress={() => handlePress(item)}
            />
        );

    const renderCategoryLabel = (cat: FavoriteType) => {
        return (
            <Text>
                {cat}
                <Text style={{ opacity: 0.6, fontSize: scale(12) }}> {`(${getCount(cat)})`}</Text>
            </Text>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            {/* Page Title */}
            <Text style={styles.pageTitle}>Favorites</Text>

            {/* Category Filter */}
            <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => (
                    <CategoryButton
                        key={cat.label}
                        icon={cat.icon}
                        isActive={activeTab === cat.label}
                        onPress={() => setActiveTab(cat.label)}
                        style={{ marginRight: xdWidth(12) }}
                    >
                        {renderCategoryLabel(cat.label)}
                    </CategoryButton>
                ))}
            </View>

            {/* Content Grid — FlatList nested inside ScrollView (scrollEnabled=false) */}
            <FlatList
                key={`fav-${activeTab}-${numColumns}`}
                data={filteredItems}
                contentContainerStyle={styles.gridContainer}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={numColumns}
                columnWrapperStyle={{ gap: xdWidth(activeTab === 'Live TV' ? 18 : 20) }}
                scrollEnabled={false}
                ListEmptyComponent={
                    <EmptyState
                        icon="heart-outline"
                        title="No Favorites Yet"
                        subtitle="You haven't added any to your favorites."
                        style={styles.emptyState}
                    />
                }
            />
        </ScrollView>
    );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#141416' },
    content: {
        paddingHorizontal: xdWidth(32),
        paddingTop: xdHeight(90),
        paddingBottom: xdHeight(40),
    },
    pageTitle: {
        fontSize: scale(22),
        fontWeight: '700',
        color: Colors.gray[100],
        marginBottom: xdHeight(10),
    },
    gridContainer: {
        padding: xdWidth(16),
    },
    categoryRow: {
        flexDirection: 'row',
        marginBottom: xdHeight(32),
    },
    cardSpacing: {
        marginRight: xdWidth(18),
        marginBottom: xdHeight(16),
    },
    emptyState: {
        marginTop: xdHeight(40),
    },
});
