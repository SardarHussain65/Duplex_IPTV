/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Series Screen
 *  Hero banner · Search · Category filter · Poster grid
 * ─────────────────────────────────────────────────────────────
 */

import { BackdropCard, CategoryLockedState, EmptyState, SearchBar, HeroSkeleton, PosterGridSkeleton, PosterCardSkeleton, Skeleton, CategoryButtonSkeleton, NavButton, CategoryButton } from '@/components/ui';
import { RecentlyWatchedRow } from '@/components/shared/RecentlyWatchedRow';
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
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    findNodeHandle
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTab } from '@/context/TabContext';
import { useSeries } from '@/hooks/useSeries';
import { usePlaylistChannels, useParentalControlPin } from '@/lib/api';
import { useCategories } from '@/lib/api/hooks/useCategories';
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
        handleWatchNow,
        goToHero,
        handleScroll,
    } = useSeries();
    const { setSearchBarNode, settingsTabNode, searchBarNode } = useTab();
    const { lockCategory, unlockCategory, renameCategory, getCategoryLabel } = useCategoryManagement();
    const isFocused = useIsFocused();
    const { verifyPin } = useParentalControlPin();
    const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);

    // only send to API when ✓ is pressed
    const [inputValue, setInputValue] = useState('');
    const [committedSearch, setCommittedSearch] = useState('');

    const { data: categoriesData, isFetching: isCategoriesFetching, isLoading: isCategoriesLoading } = useCategories({
        playlistId: activePlaylistId || '',
        contentType: 'SERIES',
        enabled: !!activePlaylistId && isFocused
    });

    const activeCategoryData = categoriesData?.items?.find(c => c.name === activeCategory);
    const isCurrentCategoryLocked = activeCategory !== 'All' && !!activeCategoryData?.isCategoryLocked;

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
        category: activeCategory === 'All' ? null : activeCategory,
        search: committedSearch,
        enabled: !!activePlaylistId && !isCurrentCategoryLocked && isFocused
    });


    const series: Series[] = useMemo(() => {
        if (!apiData?.pages) return [];
        const seenIds = new Set<string>();
        const result: Series[] = [];

        apiData.pages.forEach((page) => {
            page.items.forEach((item) => {
                // Use streamHash or a combination of name and category as a unique identifier
                const seriesId = item.streamHash || `${item.name}-${item.category}`;
                
                if (!seenIds.has(seriesId)) {
                    seenIds.add(seriesId);
                    result.push({
                        id: seriesId,
                        name: item.name,
                        category: item.category,
                        year: "2024",
                        season: item.category || "Season 1",
                        logo: item.tvgLogo,
                        description: item.name,
                        streamHash: item.streamHash || '',
                        tvgId: item.tvgId,
                        contentType: item.contentType,
                        seriesTitle: item.name,
                        episodes: item.ep || [],
                    });
                }
            });
        });
        return result;
    }, [apiData]);



    const categories = useMemo(() => {
        if (!categoriesData?.items) return ['All'];
        const apiCats = categoriesData.items.map(c => c.name);
        return ['All', ...apiCats];
    }, [categoriesData]);




    const filteredSeries = series;

    const [bannerSeries, setBannerSeries] = useState<Series[]>([]);

    // Pick 10 random series for the banner once data is loaded
    useEffect(() => {
        if (series.length > 0 && bannerSeries.length === 0) {
            const shuffled = [...series].sort(() => 0.5 - Math.random());
            setBannerSeries(shuffled.slice(0, 10));
        }
    }, [series, bannerSeries.length]);

    // 10 second auto-cycle timer
    useEffect(() => {
        if (bannerSeries.length === 0) return;

        const interval = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % bannerSeries.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [bannerSeries.length, setHeroIndex]);


    const currentHero = bannerSeries.length > 0 
        ? bannerSeries[heroIndex] || bannerSeries[0]
        : HERO_SERIES_SLIDES[heroIndex] || HERO_SERIES_SLIDES[0];

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
        const handle = requestIdleCallback(() => {
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
        return () => cancelIdleCallback(handle);
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

    const handlePinSuccess = useCallback(async () => {
        if (categoryToManage) {
            setPinModalVisible(false);
            try {
                const catData = categoriesData?.items?.find(c => c.name === categoryToManage);
                const isLocked = !!catData?.isCategoryLocked;
                if (isLocked) {
                    await unlockCategory(categoryToManage, "SERIES");
                } else {
                    await lockCategory(categoryToManage, "SERIES");
                }
            } catch (err) {
                console.error("Failed to update category lock:", err);
            }
        }
    }, [categoryToManage, lockCategory, unlockCategory, categoriesData]);

    const handleRenameSave = useCallback(async (newName: string) => {
        if (categoryToManage) {
            try {
                await renameCategory(categoryToManage, newName, "SERIES");
            } catch (err) {
                console.error("Failed to rename category:", err);
            }
        }
        setRenameModalVisible(false);
    }, [categoryToManage, renameCategory]);

    const renderSeriesItem = useCallback(({ item, index }: { item: Series; index: number }) => (
        <PosterCard
            innerRef={(ref) => { if (ref) seriesRefs.current[index] = ref; }}
            image={item.logo}
            title={item.name}
            subtitle={item.season}
            width={xdWidth(136)}
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
                    source={{ uri: currentHero.logo }}
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
                        {currentHero.category}{'  •  '}{currentHero.year}{'  •  '}{currentHero.season}
                    </Text>
                    <Text style={styles.heroTitle}>{currentHero.name}</Text>
                    <Text style={styles.heroDesc} numberOfLines={2}>
                        {currentHero.description}
                    </Text>

                    {/* CTA Buttons */}
                    <View style={styles.heroBtns}>
                        <NavButton
                            icon={<MaterialCommunityIcons name="play" size={scale(18)} />}
                            onPress={() => handleWatchNow(currentHero)}
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
                    {(bannerSeries.length > 0 ? bannerSeries : HERO_SERIES_SLIDES).map((_, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => goToHero(i)}
                            style={[styles.dot, i === heroIndex && styles.dotActive]}
                        />
                    ))}
                </View>
            </View>

            {/* ── Recently Watched ── */}
            <RecentlyWatchedRow type="SERIES" />

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
                    
                    // Find the category object to check its backend lock status
                    const catData = categoriesData?.items?.find(c => c.name === cat);
                    const isLocked = catData?.isCategoryLocked ?? false;

                    return (
                        <CategoryButton
                            key={cat}
                            ref={isFirst ? categoryAllRef : (isLast ? lastCategoryRef : undefined)}
                            isActive={activeCategory === cat}
                            onPress={() => setActiveCategory(cat)}
                            onLongPress={() => handleCategoryLongPress(cat)}
                            isLocked={isLocked}
                            isUpdating={isCategoriesFetching && categoryToManage === cat}
                            style={{ marginRight: xdWidth(8) }}
                            nextFocusLeft={isFirst ? (searchBarNode || undefined) : undefined}
                            nextFocusUp={isFirst ? (searchBarNode || undefined) : undefined}
                            nextFocusRight={isLast ? firstSeriesNode : undefined}
                            nextFocusDown={firstSeriesNode}
                        >
                            {catData?.renamedCategory || cat}
                        </CategoryButton>
                    );
                })}
            </ScrollView>
        </View>
    );

    // Memoized header — stable reference prevents full header reconciliation on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Memoized header — stable reference prevents full header reconciliation on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const listHeader = useMemo(() => renderHeader(), [
        currentHero, heroIndex, handleSeriesPress, inputValue,
        settingsTabNode, categoryAllNode, searchBarNode, categories, activeCategory,
        firstSeriesNode, getCategoryLabel, handleCategoryLongPress,
        filteredSeries.length, isCategoriesFetching, categoryToManage,
    ]);

    if (isLoading && bannerSeries.length === 0) {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content, styles.gridContainer]}
                showsVerticalScrollIndicator={false}
            >
                <HeroSkeleton />
                <View style={{ marginBottom: xdHeight(32) }}>
                    <Skeleton width="100%" height={xdHeight(50)} borderRadius={12} />
                </View>
                <View style={{ flexDirection: 'row', marginBottom: xdHeight(24) }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <CategoryButtonSkeleton key={i} />
                    ))}
                </View>
                <PosterGridSkeleton rows={3} columns={6} />
            </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
            {/* ── Poster Grid — FlatList nested inside ScrollView ── */}
            <FlatList
                key="series-grid"
                data={(isCurrentCategoryLocked || isCategoriesFetching) ? [] : filteredSeries}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={listHeader}
                renderItem={renderSeriesItem}
                numColumns={6}
                contentContainerStyle={[styles.content, styles.gridContainer, { flexGrow: 1 }]}
                columnWrapperStyle={filteredSeries.length > 1 ? styles.columnWrapper : undefined}
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
                        <View style={styles.footerLoader}>
                            <View style={styles.footerGrid}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <PosterCardSkeleton key={i} />
                                ))}
                            </View>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    isLoading || isCategoriesFetching ? (
                        <PosterGridSkeleton rows={3} columns={6} />
                    ) : isCurrentCategoryLocked ? (
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
                isLocked={!!categoryToManage && !!categoriesData?.items?.find(c => c.name === categoryToManage)?.isCategoryLocked}
                categoryName={categoriesData?.items?.find(c => c.name === categoryToManage)?.renamedCategory || categoryToManage || ''}
            />

            <RenameCategoryModal
                visible={isRenameModalVisible}
                onClose={() => setRenameModalVisible(false)}
                onSave={handleRenameSave}
                currentName={categoriesData?.items?.find(c => c.name === categoryToManage)?.renamedCategory || categoryToManage || ''}
            />

            <EnterPinModal
                visible={isPinModalVisible}
                onClose={() => setPinModalVisible(false)}
                onSuccess={handlePinSuccess}
                onVerify={verifyPin}
                title={categoryToManage && categoriesData?.items?.find(c => c.name === categoryToManage)?.isCategoryLocked ? 'Enter PIN to Unlock' : 'Enter PIN to Lock'}
            />
        </View>
    );
}
