import { BackdropCard, EmptyState, PosterCard } from '@/components/ui';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { Colors } from '@/constants';
import { FAVORITE_CATEGORIES, MOCK_FAVORITES } from '@/constants/appData';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { FavoriteItem, FavoriteType } from '@/types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';



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
                pathname: '/channel/[id]',
                params: {
                    id: item.id,
                    name: item.title,
                    category: item.genre || '',
                    image: item.image,
                },
            });
        } else if (item.type === 'Movies') {
            router.push({
                pathname: '/movie/[id]',
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
                pathname: '/series-detail/[id]',
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

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Page Title */}
            <Text style={styles.pageTitle}>Favorites</Text>

            {/* Category Filter */}
            <View style={styles.categoryRow}>
                {FAVORITE_CATEGORIES.map((cat) => (
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
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                key={`fav-${activeTab}-${numColumns}`}
                data={filteredItems}
                contentContainerStyle={[styles.content, styles.gridContainer]}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={renderItem}
                numColumns={numColumns}
                columnWrapperStyle={{ gap: xdWidth(activeTab === 'Live TV' ? 18 : 20) }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EmptyState
                        icon="heart-outline"
                        title="No Favorites Yet"
                        subtitle="You haven't added any to your favorites."
                        style={styles.emptyState}
                    />
                }
            />
        </View>
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
    headerContainer: {
        marginBottom: xdHeight(16),
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
