import { BackdropCard, EmptyState, PosterCard, Skeleton, CategoryButtonSkeleton, PosterGridSkeleton, BackdropGridSkeleton, CategoryButton } from '@/components/ui';
import { Colors } from '@/constants';
import { FAVORITE_CATEGORIES } from '@/constants/appData';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { FavoriteItem, FavoriteType } from '@/types';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, findNodeHandle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '@/lib/api';

// ── Screen ────────────────────────────────────────────────────

export default function FavoritesScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const [activeTab, setActiveTab] = useState<FavoriteType>('Live TV');

    const { useGetFavorites } = useFavorites();

    const apiTabMap: Record<FavoriteType, string> = {
        'Live TV': 'LIVE',
        'Movies': 'MOVIE',
        'Series': 'SERIES'
    };

    const { data, loading, error } = useGetFavorites({
        type: apiTabMap[activeTab]
    });

    useEffect(() => {
        return () => setIsScrolled(false);
    }, [setIsScrolled]);

    const { settingsTabNode } = useTab();

    // ── Focus Tracking ───────────────────────────────────────────
    const [categoryAllNode, setCategoryAllNode] = useState<number | undefined>(undefined);
    const [lastCategoryNode, setLastCategoryNode] = useState<number | undefined>(undefined);
    const [firstItemNode, setFirstItemNode] = useState<number | undefined>(undefined);
    const [itemNodes, setItemNodes] = useState<Record<number, number>>({});

    const categoryAllRef = useRef<any>(null);
    const lastCategoryRef = useRef<any>(null);
    const itemRefs = useRef<Record<number, any>>({});

    const filteredItems: FavoriteItem[] = useMemo(() => {
        if (!data?.getFavorites?.items) return [];

        return data.getFavorites.items
            .filter((item) => item && item.metadata) // Filter out items with null or missing metadata
            .map((item) => {
                const meta = item.metadata!;
                return {
                    id: item.id,
                    name: meta.name || '',
                    type: activeTab, // Use current tab type for local UI consistency
                    logo: meta.tvgLogo || meta.logoUrl || '', // Fallback for image
                    category: meta.genre || meta.category || '',
                    year: meta.releaseYear?.toString() || '',
                    duration: '', 
                    description: '', 
                    streamHash: meta.streamHash || '',
                    tvgId: meta.tvgId || '',
                };
            });
    }, [data, activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (categoryAllRef.current) {
                const node = findNodeHandle(categoryAllRef.current);
                if (node) setCategoryAllNode(node);
            }
            if (lastCategoryRef.current) {
                const node = findNodeHandle(lastCategoryRef.current);
                if (node) setLastCategoryNode(node);
            }

            const newNodes: Record<number, number> = {};
            let firstNode: number | undefined = undefined;
            Object.keys(itemRefs.current).forEach((key) => {
                const idx = parseInt(key);
                const node = findNodeHandle(itemRefs.current[idx]);
                if (node) {
                    newNodes[idx] = node;
                    if (idx === 0) firstNode = node;
                }
            });
            setItemNodes(newNodes);
            if (firstNode) setFirstItemNode(firstNode);
        }, 1200);
        return () => clearTimeout(timer);
    }, [activeTab, filteredItems]);

    const getCount = (type: FavoriteType) => {
        if (!data?.getFavorites) return 0;
        const favs = data.getFavorites;
        if (type === 'Live TV') return favs.totalLive || 0;
        if (type === 'Movies') return favs.totalMovies || 0;
        if (type === 'Series') return favs.totalSeries || 0;
        return 0;
    };

    const handlePress = (item: FavoriteItem) => {
        if (item.type === 'Live TV') {
            router.push({
                pathname: '/channel/[id]',
                params: {
                    id: item.id,
                    name: item.name,
                    category: item.category || '',
                    logo: item.logo,
                    streamHash: item.streamHash,
                    tvgId: item.tvgId,
                },
            });
        } else if (item.type === 'Movies') {
            router.push({
                pathname: '/movie/[id]',
                params: {
                    id: item.id,
                    name: item.name,
                    category: item.category || '',
                    year: item.year || '',
                    duration: item.duration || '',
                    logo: item.logo,
                    description: item.description || '',
                    streamHash: item.streamHash,
                    tvgId: item.tvgId,
                },
            });
        } else {
            router.push({
                pathname: '/series-detail/[id]',
                params: {
                    id: item.id,
                    name: item.name,
                    category: item.category || '',
                    year: item.year || '',
                    season: item.season || '',
                    logo: item.logo,
                    description: item.description || '',
                    streamHash: item.streamHash,
                    tvgId: item.tvgId,
                },
            });
        }
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    const posterColumns = 6;
    const backdropColumns = 5;
    const numColumns = activeTab === 'Live TV' ? backdropColumns : posterColumns;

    const renderItem = ({ item, index }: { item: FavoriteItem; index: number }) => {
        const isBackdrop = activeTab === 'Live TV';
        const cols = isBackdrop ? 5 : 6;

        if (isBackdrop) {
            return (
                <BackdropCard
                    innerRef={(ref) => { if (ref) itemRefs.current[index] = ref; }}
                    title={item.name}
                    image={item.logo}
                    width={xdWidth(160)}
                    height={xdHeight(90)}
                    style={styles.cardSpacing}
                    onPress={() => handlePress(item)}
                    nextFocusUp={index < cols ? lastCategoryNode : itemNodes[index - cols]}
                    nextFocusDown={itemNodes[index + cols]}
                    nextFocusLeft={index === 0 ? lastCategoryNode : itemNodes[index - 1]}
                    nextFocusRight={index === filteredItems.length - 1 ? undefined : itemNodes[index + 1]}
                />
            );
        }

        return (
            <PosterCard
                innerRef={(ref) => { if (ref) itemRefs.current[index] = ref; }}
                title={item.name}
                subtitle={(item as any).subtitle}
                image={item.logo}
                width={xdWidth(132)}
                style={styles.cardSpacing}
                onPress={() => handlePress(item)}
                nextFocusUp={index < cols ? lastCategoryNode : itemNodes[index - cols]}
                nextFocusDown={itemNodes[index + cols]}
                nextFocusLeft={index === 0 ? lastCategoryNode : itemNodes[index - 1]}
                nextFocusRight={index === filteredItems.length - 1 ? undefined : itemNodes[index + 1]}
            />
        );
    };

    const renderCategoryLabel = (cat: FavoriteType) => {
        const labelMap: Record<FavoriteType, string> = {
            'Live TV': t('common.liveTv'),
            'Movies': t('common.movies'),
            'Series': t('common.series')
        };
        return (
            <Text>
                {labelMap[cat] || cat}
                <Text style={{ opacity: 0.6, fontSize: scale(12) }}> {`(${getCount(cat)})`}</Text>
            </Text>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Page Title */}
            <Text style={styles.pageTitle}>{t('favorites.title')}</Text>

            {/* Category Filter */}
            <View style={styles.categoryRow}>
                {FAVORITE_CATEGORIES.map((cat, index) => {
                    const isFirst = index === 0;
                    const isLast = index === FAVORITE_CATEGORIES.length - 1;
                    return (
                        <CategoryButton
                            key={cat.label}
                            ref={isFirst ? categoryAllRef : (isLast ? lastCategoryRef : undefined)}
                            icon={cat.icon}
                            isActive={activeTab === cat.label}
                            onPress={() => setActiveTab(cat.label)}
                            style={{ marginRight: xdWidth(12) }}
                            nextFocusLeft={isFirst ? (settingsTabNode || undefined) : undefined}
                            nextFocusUp={isFirst ? (settingsTabNode || undefined) : undefined}
                            nextFocusRight={isLast ? firstItemNode : undefined}
                            nextFocusDown={firstItemNode}
                        >
                            {renderCategoryLabel(cat.label)}
                        </CategoryButton>
                    );
                })}
            </View>
        </View>
    );

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <EmptyState
                    icon="alert-circle-outline"
                    title={t('common.error')}
                    subtitle={error.message}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {loading && !data ? (
                <View style={[styles.content, styles.gridContainer]}>
                    <Skeleton width="40%" height={scale(22)} borderRadius={8} style={{ marginBottom: xdHeight(16) }} />
                    <View style={styles.categoryRow}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <CategoryButtonSkeleton key={i} />
                        ))}
                    </View>
                    {activeTab === 'Live TV' ? (
                        <BackdropGridSkeleton rows={3} columns={5} />
                    ) : (
                        <PosterGridSkeleton rows={3} columns={6} />
                    )}
                </View>
            ) : (
                <FlatList
                    key={`fav-${activeTab}-${numColumns}`}
                    data={filteredItems}
                    contentContainerStyle={[styles.content, styles.gridContainer]}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={renderItem}
                    numColumns={numColumns}
                    columnWrapperStyle={{ gap: xdWidth(activeTab === 'Live TV' ? 16 : 12) }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    windowSize={5}
                    removeClippedSubviews={false}
                    ListEmptyComponent={
                        <EmptyState
                            icon="heart-outline"
                            title={t('favorites.emptyTitle')}
                            subtitle={t('favorites.emptySubtitle')}
                            style={styles.emptyState}
                        />
                    }
                />
            )}
        </View>
    );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#141416' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
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
        paddingHorizontal: xdWidth(40),
    },
    categoryRow: {
        flexDirection: 'row',
        marginBottom: xdHeight(32),
    },
    cardSpacing: {
        marginBottom: xdHeight(16),
    },
    emptyState: {
        marginTop: xdHeight(40),
    },
});
