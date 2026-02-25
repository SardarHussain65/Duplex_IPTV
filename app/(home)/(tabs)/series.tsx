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
import React from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

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

    const renderSeriesItem = ({ item }: { item: Series }) => (
        <PosterCard
            image={item.image}
            title={item.title}
            subtitle={item.season}
            onPress={() => handleSeriesPress(item)}
            style={styles.cardSpacing}
        />
    );

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
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search for series...."
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
                {SERIES_CATEGORIES.map((cat) => (
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
        </View>
    );

    return (
        <View style={styles.container}>
            {/* ── Poster Grid — FlatList nested inside ScrollView ── */}
            <FlatList
                key={`series-grid-${activeCategory}-${searchQuery}`}
                data={filteredSeries}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={renderSeriesItem}
                numColumns={5}
                contentContainerStyle={[styles.content, styles.gridContainer]}
                columnWrapperStyle={filteredSeries.length > 1 ? styles.columnWrapper : undefined}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
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
