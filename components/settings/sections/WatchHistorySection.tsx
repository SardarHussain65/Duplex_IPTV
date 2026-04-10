/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Watch History Section (Settings)
 *  Displays the user's watch history from the backend API,
 *  filtered by type (Live TV / Movies / Series).
 *  Progress bar hidden for LIVE items — watchedPercent is null.
 * ─────────────────────────────────────────────────────────────
 */

import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { HistoryCard } from '@/components/ui/cards/HistoryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { HistoryGridSkeleton, CategoryButtonSkeleton } from '@/components/ui';
import { Colors, FAVORITE_CATEGORIES } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { useWatchHistory } from '@/lib/api';
import type { WatchHistoryItem } from '@/lib/api/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, findNodeHandle, FlatList, StyleSheet, Text, View } from 'react-native';

// ── Tab type (matches UI label ↔ API type) ────────────────────
type HistoryTab = 'Live TV' | 'Movies' | 'Series';

const TAB_TO_API: Record<HistoryTab, 'LIVE' | 'MOVIE' | 'SERIES'> = {
    'Live TV': 'LIVE',
    'Movies': 'MOVIE',
    'Series': 'SERIES',
};

// ── Helpers ───────────────────────────────────────────────────

/** Format ISO date to DD-MM-YY */
const formatDate = (iso: string): string => {
    try {
        const d = new Date(iso);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    } catch {
        return '';
    }
};

/** Format seconds to "Xh Ym" or "Ym" — returns '' for null (LIVE) */
const formatDuration = (seconds: number | null): string => {
    if (seconds == null || seconds <= 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
};

// ── Props ─────────────────────────────────────────────────────
interface WatchHistorySectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

// ── Component ─────────────────────────────────────────────────
export const WatchHistorySection: React.FC<WatchHistorySectionProps> = ({
    startRef,
    sidebarRef,
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { settingsTabNode } = useTab();
    const [activeTab, setActiveTab] = useState<HistoryTab>('Live TV');

    const { useGetWatchHistory, clearHistory } = useWatchHistory();

    // ── Global Counts Query ──────────────────────────────────
    // This query DOES NOT filter by type, so it returns totals for all categories
    const { data: totalsData, refetch: refetchTotals } = useGetWatchHistory({
        limit: 1, // We only need the totals
    });

    // ── Main Paginated Items Query ────────────────────────────
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const { data, loading, refetch, fetchMore } = useGetWatchHistory({
        type: TAB_TO_API[activeTab],
        limit: 10,
        page: 1,
    });

    const items: WatchHistoryItem[] = data?.getWatchHistory?.items ?? [];

    // ── Count display (from Global Totals query) ─────────────
    const getCount = (tab: HistoryTab): number => {
        const totals = totalsData?.getWatchHistory;
        if (!totals) return 0;
        if (tab === 'Live TV') return totals.totalLive ?? 0;
        if (tab === 'Movies') return totals.totalMovies ?? 0;
        if (tab === 'Series') return totals.totalSeries ?? 0;
        return 0;
    };

    const labelMap: Record<string, string> = {
        'Live TV': t('common.liveTv'),
        'Movies': t('common.movies'),
        'Series': t('common.series'),
    };

    // ── Clear All ─────────────────────────────────────────────
    // The backend mutation for clearing history is not in the API yet.
    // Show a placeholder alert until it is available.
    const handleClearAll = () => {
        const categoryLabel = labelMap[activeTab];
        Alert.alert(
            `${t('settings.historyOptions.clearAll')} (${categoryLabel})`,
            t('settings.historyOptions.clearConfirmMsg', {
                defaultValue: `This will remove all ${categoryLabel} watch history for the current playlist.`,
            }),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.confirm'),
                    style: 'destructive',
                    onPress: async () => {
                        await clearHistory(TAB_TO_API[activeTab]); // Clears history for the current tab
                        refetch();
                        refetchTotals();
                    },
                },
            ]
        );
    };

    // ── Navigation ────────────────────────────────────────────
    const handlePress = (item: WatchHistoryItem) => {
        const metadata = item.metadata || {};
        const commonParams = {
            id: item.id,
            name: item.name,
            category: metadata.category || '',
            logo: metadata.tvgLogo || '',
            streamHash: item.externalId,
            tvgId: metadata.tvgId || '',
            contentType: item.type,
        };

        if (item.type === 'LIVE') {
            router.push({
                pathname: '/channel/[id]',
                params: commonParams,
            });
        } else if (item.type === 'MOVIE') {
            router.push({
                pathname: '/movie/[id]',
                params: {
                    ...commonParams,
                    year: metadata.releaseYear ? String(metadata.releaseYear) : '2024',
                    duration: metadata.genre || '2h',
                    description: item.name,
                    startTime: item.currentTime,
                },
            });
        } else if (item.type === 'SERIES') {
            router.push({
                pathname: '/series-detail/[id]',
                params: {
                    ...commonParams,
                    year: metadata.releaseYear ? String(metadata.releaseYear) : '2024',
                    startTime: item.currentTime,
                },
            });
        }
    };

    // ── Infinite Scroll ───────────────────────────────────────
    const handleLoadMore = async () => {
        if (loading || isFetchingMore) return;
        const total = getCount(activeTab);
        if (items.length >= total) return; // No more items

        try {
            setIsFetchingMore(true);
            const nextPage = Math.floor(items.length / 10) + 1;
            await fetchMore({
                variables: {
                    filters: {
                        playlistId: totalsData?.getWatchHistory?.items?.[0]?.metadata?.streamHash?.split(':')[0], // dummy, but needed or just use your store
                        type: TAB_TO_API[activeTab],
                        page: nextPage,
                        limit: 10,
                    }
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                        getWatchHistory: {
                            ...fetchMoreResult.getWatchHistory,
                            items: [
                                ...prev.getWatchHistory.items,
                                ...fetchMoreResult.getWatchHistory.items,
                            ],
                        },
                    };
                }
            });
        } finally {
            setIsFetchingMore(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* ── Header: Clear button ── */}
            <View style={styles.header}>
                <ActionFilledButton
                    ref={(node) => {
                        if (typeof startRef === 'function') (startRef as any)(node);
                        else if (startRef) (startRef as any).current = node;
                    }}
                    nativeID="settings_content_start"
                    nextFocusLeft={findNodeHandle(sidebarRef.current) || undefined}
                    nextFocusRight="self"
                    nextFocusUp={settingsTabNode || undefined}
                    style={styles.clearBtn}
                    onPress={handleClearAll}
                    icon={<MaterialCommunityIcons name="trash-can-outline" size={scale(18)} color="#fff" />}
                    gap={xdWidth(8)}
                >
                    <Text style={styles.clearBtnText}>{t('settings.historyOptions.clearAll')}</Text>
                </ActionFilledButton>
            </View>

            {/* ── Category Filter ── */}
            <View style={styles.tabs}>
                {FAVORITE_CATEGORIES.map((cat, index) => (
                    <CategoryButton
                        key={cat.label}
                        icon={cat.icon}
                        isActive={activeTab === cat.label}
                        onPress={() => setActiveTab(cat.label as HistoryTab)}
                        style={{ marginRight: xdWidth(12) }}
                        nextFocusRight={index === FAVORITE_CATEGORIES.length - 1 ? 'self' : undefined}
                        nextFocusUp={settingsTabNode || undefined}
                    >
                        {`${labelMap[cat.label]} (${getCount(cat.label as HistoryTab)})`}
                    </CategoryButton>
                ))}
            </View>

            {/* ── Loading spinner ── */}
            {loading && items.length === 0 && (
                <View style={styles.loadingContainer}>
                    <HistoryGridSkeleton rows={3} />
                </View>
            )}

            {/* ── History Grid ── */}
            {!loading || items.length > 0 ? (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item, index }) => {
                        const isLive = item.type === 'LIVE';
                        // watchedPercent is 0–100 from server; HistoryCard expects 0–1
                        const progress = isLive
                            ? 0                                          // no bar for live
                            : (item.watchedPercent ?? 0) / 100;

                        return (
                            <HistoryCard
                                title={item.name}
                                date={formatDate(item.lastWatchedAt)}
                                duration={
                                    isLive
                                        ? t('detail.live')               // "Live" label
                                        : formatDuration(item.duration)  // e.g. "1h 28m"
                                }
                                progress={progress}
                                image={item.metadata?.tvgLogo ?? undefined}
                                style={styles.card}
                                onPress={() => handlePress(item)}
                                nextFocusRight={(index % 2 === 1) ? 'self' : undefined}
                                nextFocusDown={
                                    index >= items.length - 2
                                        ? findNodeHandle(sidebarRef.current) || undefined
                                        : undefined
                                }
                            />
                        );
                    }}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    scrollEnabled={false} // Handled by parent ScrollView usually, but FlatList on TV is better scrollable
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isFetchingMore ? (
                            <View style={styles.footerLoader}>
                                <ActivityIndicator color={Colors.primary[500]} />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <EmptyState
                            icon="history"
                            title={t('settings.historyOptions.noHistory')}
                            subtitle={t('settings.historyOptions.noHistorySub')}
                            style={styles.emptyState}
                        />
                    }
                />
            ) : null}
        </View>
    );
};

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'visible',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
        top: -xdHeight(85),
        right: xdWidth(10),
        zIndex: 10,
    },
    clearBtn: {
        backgroundColor: Colors.error[500],
        paddingHorizontal: xdWidth(16),
        height: xdHeight(45),
        borderRadius: scale(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearBtnText: {
        fontSize: scale(14),
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: xdWidth(8),
    },
    tabs: {
        flexDirection: 'row',
        gap: xdWidth(12),
        marginBottom: xdHeight(32),
    },
    loadingContainer: {
        paddingVertical: xdHeight(60),
        alignItems: 'center',
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
    listContent: {
        paddingBottom: xdHeight(60),
        paddingHorizontal: xdWidth(10),
        paddingTop: xdHeight(10),
    },
    footerLoader: {
        paddingVertical: xdHeight(30),
        alignItems: 'center',
    },
});
