import { CategoryButton, CategoryButtonSkeleton, EmptyState, HistoryCard, HistoryGridSkeleton, Skeleton } from '@/components/ui';
import { Colors, FAVORITE_CATEGORIES } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { useWatchHistory } from '@/lib/api';
import type { WatchHistoryItem } from '@/lib/api/types';
import type { FavoriteType } from '@/types';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View, findNodeHandle } from 'react-native';

type RecentWatchTab = FavoriteType;

const TAB_TO_API: Record<RecentWatchTab, 'LIVE' | 'MOVIE' | 'SERIES'> = {
    'Live TV': 'LIVE',
    'Movies': 'MOVIE',
    'Series': 'SERIES',
};

const formatDate = (iso?: string): string => {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
};

const formatDuration = (seconds: number | null, liveLabel: string): string => {
    if (seconds == null || seconds <= 0) return liveLabel;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

export default function RecentWatchScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { setIsScrolled, settingsTabNode } = useTab();
    const [activeTab, setActiveTab] = useState<RecentWatchTab>('Live TV');
    const { useGetWatchHistory } = useWatchHistory();

    const { data: totalsData } = useGetWatchHistory({
        limit: 1,
    });

    const { data, loading, error } = useGetWatchHistory({
        type: TAB_TO_API[activeTab],
        limit: 12,
        page: 1,
    });

    useEffect(() => {
        return () => setIsScrolled(false);
    }, [setIsScrolled]);

    const [lastCategoryNode, setLastCategoryNode] = useState<number | undefined>(undefined);
    const [firstItemNode, setFirstItemNode] = useState<number | undefined>(undefined);
    const [itemNodes, setItemNodes] = useState<Record<number, number>>({});

    const firstCategoryRef = useRef<any>(null);
    const lastCategoryRef = useRef<any>(null);
    const itemRefs = useRef<Record<number, any>>({});

    const items = data?.getWatchHistory?.items ?? [];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (lastCategoryRef.current) {
                const node = findNodeHandle(lastCategoryRef.current);
                if (node) setLastCategoryNode(node);
            }

            const nextNodes: Record<number, number> = {};
            let firstNode: number | undefined;

            Object.keys(itemRefs.current).forEach((key) => {
                const index = Number.parseInt(key, 10);
                const node = findNodeHandle(itemRefs.current[index]);
                if (node) {
                    nextNodes[index] = node;
                    if (index === 0) firstNode = node;
                }
            });

            setItemNodes(nextNodes);
            if (firstNode) setFirstItemNode(firstNode);
        }, 500);

        return () => clearTimeout(timer);
    }, [activeTab, items.length]);

    const getCount = (tab: RecentWatchTab): number => {
        const totals = totalsData?.getWatchHistory;
        if (!totals) return 0;
        if (tab === 'Live TV') return totals.totalLive ?? 0;
        if (tab === 'Movies') return totals.totalMovies ?? 0;
        return totals.totalSeries ?? 0;
    };

    const labelMap: Record<RecentWatchTab, string> = {
        'Live TV': t('common.liveTv'),
        'Movies': t('common.movies'),
        'Series': t('common.series'),
    };

    const handlePress = (item: WatchHistoryItem) => {
        const metadata = item.metadata || {};
        const commonParams = {
            id: item.id,
            name: item.name,
            category: metadata.category || metadata.genre || '',
            logo: metadata.tvgLogo || '',
            streamUrl: item.externalId,
            tvgId: metadata.tvgId || '',
            contentType: item.type,
        };

        if (item.type === 'LIVE') {
            router.push({
                pathname: '/channel/[id]',
                params: commonParams,
            });
            return;
        }

        if (item.type === 'MOVIE') {
            router.push({
                pathname: '/movie/[id]',
                params: {
                    ...commonParams,
                    year: metadata.releaseYear ? String(metadata.releaseYear) : '2024',
                    duration: metadata.genre || '',
                    description: item.name,
                    startTime: item.currentTime != null ? String(item.currentTime) : '0',
                },
            });
            return;
        }

        router.push({
            pathname: '/series-detail/[id]',
            params: {
                ...commonParams,
                year: metadata.releaseYear ? String(metadata.releaseYear) : '2024',
                season: '',
                description: item.name,
                startTime: item.currentTime != null ? String(item.currentTime) : '0',
            },
        });
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    const renderCategoryLabel = (tab: RecentWatchTab) => (
        <Text>
            {labelMap[tab]}
            <Text style={{ opacity: 0.6, fontSize: scale(12) }}> {`(${getCount(tab)})`}</Text>
        </Text>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.pageTitle}>{t('recentWatch.title')}</Text>
            <View style={styles.categoryRow}>
                {FAVORITE_CATEGORIES.map((tab, index) => {
                    const isFirst = index === 0;
                    const isLast = index === FAVORITE_CATEGORIES.length - 1;

                    return (
                        <CategoryButton
                            key={tab.label}
                            ref={isFirst ? firstCategoryRef : (isLast ? lastCategoryRef : undefined)}
                            icon={tab.icon}
                            isActive={activeTab === tab.label}
                            onPress={() => setActiveTab(tab.label)}
                            style={{ marginRight: xdWidth(12) }}
                            nextFocusLeft={isFirst ? (settingsTabNode || undefined) : undefined}
                            nextFocusUp={isFirst ? (settingsTabNode || undefined) : undefined}
                            nextFocusRight={isLast ? firstItemNode : undefined}
                            nextFocusDown={firstItemNode}
                        >
                            {renderCategoryLabel(tab.label)}
                        </CategoryButton>
                    );
                })}
            </View>
        </View>
    );

    const renderItem = ({ item, index }: { item: WatchHistoryItem; index: number }) => {
        const columns = 2;
        const isLive = item.type === 'LIVE';
        const progress = isLive ? 0 : (item.watchedPercent ?? 0) / 100;

        return (
            <HistoryCard
                innerRef={(ref) => {
                    if (ref) itemRefs.current[index] = ref;
                    else delete itemRefs.current[index];
                }}
                image={item.metadata?.tvgLogo ?? undefined}
                title={item.name}
                date={formatDate(item.lastWatchedAt)}
                duration={formatDuration(item.duration, t('detail.live'))}
                progress={progress}
                style={styles.card}
                onPress={() => handlePress(item)}
                nextFocusUp={index < columns ? lastCategoryNode : itemNodes[index - columns]}
                nextFocusDown={itemNodes[index + columns]}
                nextFocusLeft={index % columns === 0 ? lastCategoryNode : itemNodes[index - 1]}
                nextFocusRight={index === items.length - 1 ? undefined : itemNodes[index + 1]}
            />
        );
    };

    if (error) {
        return (
            <View style={[styles.container, styles.centered]}>
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
                        {Array.from({ length: 3 }).map((_, index) => (
                            <CategoryButtonSkeleton key={index} />
                        ))}
                    </View>
                    <HistoryGridSkeleton rows={4} />
                </View>
            ) : (
                <FlatList
                    key={`recent-watch-${activeTab}`}
                    data={items}
                    contentContainerStyle={[styles.content, styles.gridContainer, { flexGrow: 1 }]}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={12}
                    windowSize={7}
                    removeClippedSubviews={false}
                    ListEmptyComponent={
                        <EmptyState
                            icon="history"
                            title={t('recentWatch.emptyTitle')}
                            subtitle={t('recentWatch.emptySubtitle')}
                            style={styles.emptyState}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141416',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingTop: xdHeight(90),
        paddingBottom: xdHeight(40),
    },
    gridContainer: {
        paddingHorizontal: xdWidth(40),
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
    categoryRow: {
        flexDirection: 'row',
        marginBottom: xdHeight(32),
    },
    columnWrapper: {
        gap: xdWidth(20),
        marginBottom: xdHeight(20),
    },
    card: {
        flex: 1,
    },
    emptyState: {
        marginTop: xdHeight(40),
    },
});
