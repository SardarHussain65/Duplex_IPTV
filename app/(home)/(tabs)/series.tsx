/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Series Screen
 *  Hero banner · Search · Category filter · Poster grid
 * ─────────────────────────────────────────────────────────────
 */

import { CategoryLockedState, EmptyState, SearchBar } from '@/components/ui';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { NavButton } from '@/components/ui/buttons/NavButton';
import { BackdropCard } from '@/components/ui/cards/BackdropCard';
import { PosterCard } from '@/components/ui/cards/PosterCard';
import { EnterPinModal, ManageCategoryModal, RenameCategoryModal } from '@/components/ui/modals';
import { HERO_SERIES_SLIDES } from '@/constants/appData';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useCategoryManagement } from '@/context/CategoryManagementContext';
import { Series } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    FlatList,
    InteractionManager,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    findNodeHandle,
    ActivityIndicator
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTab } from '@/context/TabContext';
import { useSeries } from '@/hooks/useSeries';
import { usePlaylistChannels } from '@/lib/api';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { styles } from '@/styles/series.styles';
import { useTranslation } from 'react-i18next';

// ── Screen ─────────────────────────────────────────────────────

export default function SeriesScreen() {
    const { t } = useTranslation();
    const {
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        heroIndex,
        setHeroIndex,
        handleSeriesPress,
        handleScroll,
    } = useSeries();
    const { setSearchBarNode, settingsTabNode, searchBarNode } = useTab();
    const { isCategoryLocked, lockCategory, unlockCategory, renameCategory, getCategoryLabel } = useCategoryManagement();
    const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);

    // only send to API when ✓ is pressed
    const [inputValue, setInputValue] = useState('');
    const [committedSearch, setCommittedSearch] = useState('');

    const {
        data: apiData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = usePlaylistChannels({
        playlistId: activePlaylistId || '',
        limit: 48,
        contentType: 'SERIES',
        search: committedSearch,
        enabled: !!activePlaylistId
    });

    const series: Series[] = useMemo(() => {
        if (!apiData?.pages) return [];
        return apiData.pages.flatMap((page) =>
            page.items.map((item) => ({
                id: item.streamHash,
                title: item.name,
                genre: item.category,
                year: "2024",
                season: item.category || "Season 1",
                image: item.tvgLogo,
                description: item.name,
                streamHash: item.streamHash,
            }))
        );
    }, [apiData]);

    const categories = useMemo(() => {
        const uniqueCats = Array.from(new Set(series.map((s) => s.genre)));
        return ['All', ...uniqueCats];
    }, [series]);

    const recentlyWatched = useMemo(() => {
        return series.slice(0, 5).map((s, idx) => ({
            ...s,
            progress: [0.45, 0.2, 0.8, 0.1, 0.65][idx] || 0.5
        }));
    }, [series]);

    const filteredSeries = useMemo(() => {
        // Text search is handled by the backend via the `search` query param.
        // Only category filtering is done client-side here.
        if (activeCategory === 'All') return series;
        return series.filter(
            (s) => s.genre.toLowerCase() === activeCategory.toLowerCase()
        );
    }, [activeCategory, series]);

    const currentHero = HERO_SERIES_SLIDES[heroIndex] || HERO_SERIES_SLIDES[0];

    const [isManageModalVisible, setManageModalVisible] = useState(false);
    const [isRenameModalVisible, setRenameModalVisible] = useState(false);
    const [isPinModalVisible, setPinModalVisible] = useState(false);
    const [categoryToManage, setCategoryToManage] = useState<string | null>(null);

    // ── Focus Tracking ───────────────────────────────────────────
    const [categoryAllNode, setCategoryAllNode] = useState<number | undefined>(undefined);
    const [lastCategoryNode, setLastCategoryNode] = useState<number | undefined>(undefined);
    const [firstSeriesNode, setFirstSeriesNode] = useState<number | undefined>(undefined);
    const [seriesNodes, setSeriesNodes] = useState<Record<number, number>>({});

    const searchRef = useRef<any>(null);
    const categoryAllRef = useRef<any>(null);
    const lastCategoryRef = useRef<any>(null);
    const seriesRefs = useRef<Record<number, any>>({});

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            if (searchRef.current) {
                const node = findNodeHandle(searchRef.current);
                if (node) setSearchBarNode(node);
            }
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
            Object.keys(seriesRefs.current).forEach((key) => {
                const idx = parseInt(key);
                const node = findNodeHandle(seriesRefs.current[idx]);
                if (node) {
                    newNodes[idx] = node;
                    if (idx === 0) firstNode = node;
                }
            });
            setSeriesNodes(newNodes);
            if (firstNode) setFirstSeriesNode(firstNode);
        });
        return () => task.cancel();
    }, [activeCategory, filteredSeries]);

    const handleCategoryLongPress = useCallback((category: string) => {
        setCategoryToManage(category);
        setManageModalVisible(true);
    }, []);

    const handleLockToggle = useCallback(() => {
        setManageModalVisible(false);
        setPinModalVisible(true);
    }, []);

    const handleRenamePress = useCallback(() => {
        setManageModalVisible(false);
        setRenameModalVisible(true);
    }, []);

    const handlePinSuccess = useCallback(() => {
        if (categoryToManage) {
            if (isCategoryLocked(categoryToManage)) {
                unlockCategory(categoryToManage);
            } else {
                lockCategory(categoryToManage);
            }
        }
        setPinModalVisible(false);
    }, [categoryToManage, isCategoryLocked, lockCategory, unlockCategory]);

    const handleRenameSave = useCallback((newName: string) => {
        if (categoryToManage) {
            renameCategory(categoryToManage, newName);
        }
        setRenameModalVisible(false);
    }, [categoryToManage, renameCategory]);

    const renderSeriesItem = useCallback(({ item, index }: { item: Series; index: number }) => (
        <PosterCard
            innerRef={(ref) => { if (ref) seriesRefs.current[index] = ref; }}
            image={item.image}
            title={item.title}
            subtitle={item.season}
            width={xdWidth(132)}
            onPress={() => handleSeriesPress(item)}
            style={styles.cardSpacing}
            nextFocusUp={index < 6 ? lastCategoryNode : seriesNodes[index - 6]}
            nextFocusDown={seriesNodes[index + 6]}
            nextFocusLeft={index === 0 ? lastCategoryNode : seriesNodes[index - 1]}
            nextFocusRight={index === filteredSeries.length - 1 ? undefined : seriesNodes[index + 1]}
        />
    ), [handleSeriesPress, lastCategoryNode, seriesNodes, filteredSeries.length]);

    const renderHeader = () => (
        <View style={styles.headerContainer}>
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
                            {t('common.watchNow')}
                        </NavButton>
                        <NavButton
                            icon={<MaterialCommunityIcons name="information-outline" size={scale(18)} />}
                            onPress={() => handleSeriesPress(currentHero)}
                        >
                            {t('common.learnMore')}
                        </NavButton>
                    </View>
                </View>

                {/* Carousel Dots */}
                <View style={styles.dotsRow}>
                    {HERO_SERIES_SLIDES.map((_, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setHeroIndex(i)}
                            style={[styles.dot, i === heroIndex && styles.dotActive]}
                        />
                    ))}
                </View>
            </View>

            {/* ── Recently Watched ── */}
            {recentlyWatched.length > 0 && (
                <View style={{ marginBottom: xdHeight(32) }}>
                    <Text style={styles.sectionTitle}>{t('common.recentlyWatched')}</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginHorizontal: -xdWidth(40) }}
                        contentContainerStyle={{ paddingHorizontal: xdWidth(40) }}
                    >
                        {recentlyWatched.map((seriesItem, index) => (
                            <BackdropCard
                                key={`recent-${seriesItem.id}`}
                                image={{ uri: seriesItem.image }}
                                progress={seriesItem.progress}
                                width={xdWidth(170)}
                                height={xdHeight(96)}
                                style={{ marginRight: xdWidth(12) }}
                                onPress={() => handleSeriesPress(seriesItem)}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* ── Search Bar ── */}
            <View style={styles.searchWrapper}>
                <SearchBar
                    innerRef={searchRef}
                    value={inputValue}
                    onChangeText={setInputValue}
                    onSubmit={(text) => setCommittedSearch(text)}
                    placeholder={t('series.searchPlaceholder')}
                    nextFocusLeft={settingsTabNode || undefined}
                    nextFocusUp={settingsTabNode || undefined}
                    nextFocusRight={categoryAllNode}
                    nextFocusDown={categoryAllNode}
                />
            </View>

            {/* ── Category Filter ── */}
            <Text style={styles.sectionTitle}>{t('common.browseCategories')}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryRow}
                contentContainerStyle={styles.categoryContent}
            >
                {categories.map((cat, index) => {
                    const isFirst = index === 0;
                    const isLast = index === categories.length - 1;
                    return (
                        <CategoryButton
                            key={cat}
                            ref={isFirst ? categoryAllRef : (isLast ? lastCategoryRef : undefined)}
                            isActive={activeCategory === cat}
                            onPress={() => setActiveCategory(cat)}
                            onLongPress={() => handleCategoryLongPress(cat)}
                            isLocked={isCategoryLocked(cat)}
                            style={{ marginRight: xdWidth(8) }}
                            nextFocusLeft={isFirst ? (searchBarNode || undefined) : undefined}
                            nextFocusUp={isFirst ? (searchBarNode || undefined) : undefined}
                            nextFocusRight={isLast ? firstSeriesNode : undefined}
                            nextFocusDown={firstSeriesNode}
                        >
                            {getCategoryLabel(cat)}
                        </CategoryButton>
                    );
                })}
            </ScrollView>
        </View>
    );

    // Memoized header — stable reference prevents full header reconciliation on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const listHeader = useMemo(() => renderHeader(), [
        currentHero, heroIndex, recentlyWatched, handleSeriesPress, inputValue,
        settingsTabNode, categoryAllNode, searchBarNode, categories, activeCategory,
        firstSeriesNode, isCategoryLocked, getCategoryLabel, handleCategoryLongPress,
        filteredSeries.length,
    ]);

    const isCurrentCategoryLocked = activeCategory !== 'All' && isCategoryLocked(activeCategory);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ color: '#9DA3B4', marginTop: xdHeight(16) }}>{t('series.loading')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ── Poster Grid — FlatList nested inside ScrollView ── */}
            <FlatList
                key="series-grid"
                data={isCurrentCategoryLocked ? [] : filteredSeries}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={listHeader}
                renderItem={renderSeriesItem}
                numColumns={6}
                contentContainerStyle={[styles.content, styles.gridContainer, { flexGrow: 1 }]}
                columnWrapperStyle={filteredSeries.length > 1 ? { gap: xdWidth(12) } : undefined}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                initialNumToRender={48}
                maxToRenderPerBatch={24}
                updateCellsBatchingPeriod={100}
                windowSize={21}
                removeClippedSubviews={true}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={2.0}
                ListFooterComponent={() =>
                    isFetchingNextPage ? (
                        <View style={{ paddingVertical: xdHeight(20), alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#FFD700" />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    isCurrentCategoryLocked ? (
                        <CategoryLockedState />
                    ) : (
                        <EmptyState
                            icon="television-play"
                            title={t('series.noSeriesFound')}
                            subtitle={t('series.noSeriesSubtitle')}
                        />
                    )
                }
            />



            {/* Modals */}
            <ManageCategoryModal
                visible={isManageModalVisible}
                onClose={() => setManageModalVisible(false)}
                onLockPress={handleLockToggle}
                onRenamePress={handleRenamePress}
                isLocked={!!categoryToManage && isCategoryLocked(categoryToManage)}
                categoryName={categoryToManage || ''}
            />

            <RenameCategoryModal
                visible={isRenameModalVisible}
                onClose={() => setRenameModalVisible(false)}
                onSave={handleRenameSave}
                currentName={categoryToManage || ''}
            />

            <EnterPinModal
                visible={isPinModalVisible}
                onClose={() => setPinModalVisible(false)}
                onSuccess={handlePinSuccess}
                onVerify={async (pin: string) => pin === "1234"}
                title={categoryToManage && isCategoryLocked(categoryToManage) ? 'Enter PIN to Unlock' : 'Enter PIN to Lock'}
            />
        </View>
    );
}
