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
import { HERO_SERIES_SLIDES, SERIES_CATEGORIES } from '@/constants/appData';
import { scale, xdWidth } from '@/constants/scaling';
import { Series } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    findNodeHandle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTab } from '@/context/TabContext';
import { useSeries } from '@/hooks/useSeries';
import { styles } from '@/styles/series.styles';

// ── Screen ─────────────────────────────────────────────────────

export default function SeriesScreen() {
    const {
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        heroIndex,
        setHeroIndex,
        currentHero,
        handleSeriesPress,
        filteredSeries,
        handleScroll,
    } = useSeries();
    const { setSearchBarNode, settingsTabNode, searchBarNode } = useTab();

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
        const timer = setTimeout(() => {
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
        }, 1200);
        return () => clearTimeout(timer);
    }, [activeCategory, filteredSeries]);

    const renderSeriesItem = ({ item, index }: { item: Series; index: number }) => {
        const isRowEnd = index % 5 === 4;

        return (
            <PosterCard
                innerRef={(ref) => { if (ref) seriesRefs.current[index] = ref; }}
                image={item.image}
                title={item.title}
                subtitle={item.season}
                onPress={() => handleSeriesPress(item)}
                style={styles.cardSpacing}
                // Up navigation: first row goes to categories
                nextFocusUp={index < 5 ? lastCategoryNode : seriesNodes[index - 5]}
                nextFocusDown={seriesNodes[index + 5]}
                // Left navigation: ONLY index 0 wraps back to category menu
                nextFocusLeft={index === 0 ? lastCategoryNode : seriesNodes[index - 1]}
                // Right navigation: wrap row-by-row
                nextFocusRight={isRowEnd ? seriesNodes[index + 1] : seriesNodes[index + 1]}
            />
        );
    };

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
                    {HERO_SERIES_SLIDES.map((_, i) => (
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
                    innerRef={searchRef}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search for series...."
                    nextFocusLeft={settingsTabNode || undefined}
                    nextFocusUp={settingsTabNode || undefined}
                    nextFocusRight={categoryAllNode}
                    nextFocusDown={categoryAllNode}
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
                {SERIES_CATEGORIES.map((cat, index) => {
                    const isFirst = index === 0;
                    const isLast = index === SERIES_CATEGORIES.length - 1;
                    return (
                        <CategoryButton
                            key={cat}
                            ref={isFirst ? categoryAllRef : (isLast ? lastCategoryRef : undefined)}
                            isActive={activeCategory === cat}
                            onPress={() => setActiveCategory(cat)}
                            style={{ marginRight: xdWidth(8) }}
                            nextFocusLeft={isFirst ? (searchBarNode || undefined) : undefined}
                            nextFocusUp={isFirst ? (searchBarNode || undefined) : undefined}
                            nextFocusRight={isLast ? firstSeriesNode : undefined}
                            nextFocusDown={firstSeriesNode}
                        >
                            {cat}
                        </CategoryButton>
                    );
                })}
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* ── Poster Grid — FlatList nested inside ScrollView ── */}
            <FlatList
                key={`series-grid-${activeCategory}`}
                data={filteredSeries}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader()}
                renderItem={(props) => renderSeriesItem({ ...props })}
                numColumns={5}
                contentContainerStyle={[styles.content, styles.gridContainer]}
                columnWrapperStyle={filteredSeries.length > 1 ? styles.columnWrapper : undefined}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                windowSize={5}
                removeClippedSubviews={false}
                ListEmptyComponent={
                    <EmptyState
                        icon="television-play"
                        title="No Series Found"
                        subtitle="On this categories we can't find any series. Try another category"
                    />
                }
            />
        </View>
    );
}
