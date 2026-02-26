
/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Live TV Screen
 * ─────────────────────────────────────────────────────────────
 */

import { BackdropCard, EmptyState, SearchBar } from '@/components/ui';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { Colors } from '@/constants';
import { LIVE_TV_CATEGORIES, MOCK_CHANNELS } from '@/constants/appData';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { Channel } from '@/types';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';



// ── Screen ────────────────────────────────────────────────────

export default function LiveTVScreen() {
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        return () => setIsScrolled(false);
    }, [setIsScrolled]);

    const filteredChannels = useMemo(() => {
        let result = MOCK_CHANNELS;

        if (activeCategory !== 'All') {
            result = result.filter(
                (ch) => ch.category.toLowerCase() === activeCategory.toLowerCase()
            );
        }

        if (searchQuery.trim()) {
            result = result.filter((ch) =>
                ch.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [activeCategory, searchQuery]);

    const handleChannelPress = (channel: Channel) => {
        router.push({
            pathname: '/channel/[id]',
            params: {
                id: channel.id,
                name: channel.name,
                category: channel.category,
                image: channel.image,
            },
        });
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    const renderChannel = ({ item }: { item: Channel }) => (
        <BackdropCard
            title={item.name}
            subtitle={item.category}
            image={{ uri: item.image }}
            style={styles.cardSpacing}
            onPress={() => handleChannelPress(item)}
        />
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Hero Section */}
            <View style={styles.heroContainer}>
                <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>
                        What's{' '}
                        <Text style={{ color: Colors.secondary[950] }}>Live Now!</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Jump into live channels and see what's happening right now across
                        news, sports, and entertainment.
                    </Text>
                </View>
                <View style={styles.heroImageWrapper}>
                    <Image
                        source={require('@/assets/images/heroImageLiveTV.png')}
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchWrapper}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            </View>


            {/* Category Filter */}
            <Text style={styles.sectionTitle}>Browse by Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryRow}
            >
                {LIVE_TV_CATEGORIES.map((cat) => (
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

            {/* Channel Count */}
            <Text style={styles.channelCount}>
                {filteredChannels.length} channel{filteredChannels.length !== 1 ? 's' : ''} found
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                key={`livetv-${activeCategory}`}
                data={filteredChannels}
                contentContainerStyle={[styles.content, styles.gridContainer]}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader()}
                renderItem={renderChannel}
                numColumns={4}
                columnWrapperStyle={filteredChannels.length > 1 ? { gap: xdWidth(18) } : null}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EmptyState
                        icon="television"
                        title="No Live TV Found"
                        subtitle="On this categories we can't find any live tv. Try another category"
                    />
                }
            />
        </View>
    );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#141416' },
    content: { paddingHorizontal: xdWidth(32), paddingBottom: xdHeight(40) },
    headerContainer: {
        marginBottom: xdHeight(16),
    },
    heroContainer: {
        flexDirection: 'row',
        height: xdHeight(280),
        marginBottom: xdHeight(24),
        overflow: 'hidden',
        backgroundColor: '#141416',
    },
    gridContainer: {
        padding: xdWidth(16),
    },
    heroOverlay: { width: '45%', justifyContent: 'center', paddingHorizontal: xdWidth(40), zIndex: 1 },
    heroImageWrapper: { width: '55%', height: '100%' },
    heroImage: { opacity: 0.6, width: '100%', height: '100%' },
    heroTitle: { fontSize: scale(32), fontWeight: '800', color: Colors.gray[100], marginBottom: xdHeight(12) },
    heroSubtitle: { fontSize: scale(14), color: Colors.gray[400], maxWidth: xdWidth(480), lineHeight: scale(22) },
    searchWrapper: { marginBottom: xdHeight(32) },
    sectionTitle: { fontSize: scale(18), fontWeight: '700', color: Colors.gray[100], marginBottom: xdHeight(16) },
    categoryRow: { marginBottom: xdHeight(16) },
    channelCount: { fontSize: scale(13), color: Colors.gray[400], marginBottom: xdHeight(16) },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cardSpacing: { marginRight: xdWidth(18), marginBottom: xdHeight(16) },
});