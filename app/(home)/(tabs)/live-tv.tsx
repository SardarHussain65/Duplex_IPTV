
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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View, findNodeHandle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';




// ── Screen ────────────────────────────────────────────────────

export default function LiveTVScreen() {
    const router = useRouter();
    const { setIsScrolled, setSearchBarNode, settingsTabNode, searchBarNode } = useTab();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryAllNode, setCategoryAllNode] = useState<number | undefined>(undefined);
    const [lastCategoryNode, setLastCategoryNode] = useState<number | undefined>(undefined);
    const [firstChannelNode, setFirstChannelNode] = useState<number | undefined>(undefined);

    // Track nodes for the first few items to handle row wrapping (up to 24 items / 6 rows)
    const [channelNodes, setChannelNodes] = useState<Record<number, number>>({});

    const searchRef = useRef<any>(null);
    const categoryAllRef = useRef<any>(null);
    const lastCategoryRef = useRef<any>(null);
    const channelRefs = useRef<Record<number, any>>({});

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

            // Map the first 24 channel nodes for row wrapping
            const newNodes: Record<number, number> = {};
            let firstNode: number | undefined = undefined;

            Object.keys(channelRefs.current).forEach((key) => {
                const idx = parseInt(key);
                const node = findNodeHandle(channelRefs.current[idx]);
                if (node) {
                    newNodes[idx] = node;
                    if (idx === 0) firstNode = node;
                }
            });

            setChannelNodes(newNodes);
            if (firstNode) setFirstChannelNode(firstNode);
        }, 1200); // Increased delay for better stability in list rendering
        return () => clearTimeout(timer);
    }, [activeCategory, filteredChannels]); // Added filteredChannels to dependency to re-resolve if list changes

    useEffect(() => {
        return () => setIsScrolled(false);
    }, [setIsScrolled]);

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

    const renderChannel = ({ item, index }: { item: Channel; index: number }) => {
        const isRowStart = index % 4 === 0;
        const isRowEnd = index % 4 === 3;

        return (
            <BackdropCard
                innerRef={(ref) => { if (ref) channelRefs.current[index] = ref; }}
                title={item.name}
                subtitle={item.category}
                image={{ uri: item.image }}
                width={xdWidth(160)}
                height={xdHeight(90)}
                style={styles.cardSpacing}
                onPress={() => handleChannelPress(item)}
                // Up navigation: first row goes to categories, others go to previous row item
                nextFocusUp={index < 5 ? lastCategoryNode : channelNodes[index - 5]}
                // Down navigation: explicitly point to next row item if available
                nextFocusDown={channelNodes[index + 5]}
                // Left navigation: ONLY the very first item wraps back to category menu.
                // Others go to the previous item, which implicitly handles row wrapping.
                nextFocusLeft={index === 0 ? lastCategoryNode : channelNodes[index - 1]}
                // Right navigation: last item of row wraps to first item of next row
                nextFocusRight={index === filteredChannels.length - 1 ? undefined : channelNodes[index + 1]}
            />
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Hero Section */}
            <View style={styles.heroContainer}>
                <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>
                        What's Live{' '}
                        <Text style={{ color: Colors.secondary[900] }}>Now!</Text>
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
                    <Svg style={StyleSheet.absoluteFillObject}>
                        <Defs>
                            {/* Horizontal Gradient (Right-to-Left) */}
                            <LinearGradient id="rightToLeft" x1="1" y1="0" x2="0" y2="0">
                                <Stop offset="0" stopColor="#141416" stopOpacity="1" />
                                <Stop offset="0.5" stopColor="#141416" stopOpacity="0.6" />
                                <Stop offset="1" stopColor="#141416" stopOpacity="0.6" />
                            </LinearGradient>
                        </Defs>
                        {/* Apply right fade */}
                        <Rect x="0" y="0" width="100%" height="100%" fill="url(#rightToLeft)" />
                    </Svg>
                </View>

            </View>
            {/* Search Bar */}
            <View style={styles.searchWrapper}>
                <SearchBar
                    innerRef={searchRef}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    nextFocusLeft={settingsTabNode || undefined}
                    nextFocusUp={settingsTabNode || undefined}
                    nextFocusRight={categoryAllNode}
                    nextFocusDown={categoryAllNode}
                />
            </View>


            {/* Category Filter */}
            <Text style={styles.sectionTitle}>Browse by Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryRow}
            >
                {LIVE_TV_CATEGORIES.map((cat, index) => {
                    const isFirst = index === 0;
                    const isLast = index === LIVE_TV_CATEGORIES.length - 1;
                    return (
                        <CategoryButton
                            key={cat}
                            ref={isFirst ? categoryAllRef : (isLast ? lastCategoryRef : undefined)}
                            isActive={activeCategory === cat}
                            onPress={() => setActiveCategory(cat)}
                            style={{ marginRight: xdWidth(8) }}
                            nextFocusLeft={isFirst ? (searchBarNode || undefined) : undefined}
                            nextFocusUp={isFirst ? (searchBarNode || undefined) : undefined}
                            nextFocusRight={isLast ? firstChannelNode : undefined}
                            nextFocusDown={firstChannelNode}
                        >
                            {cat}
                        </CategoryButton>
                    );
                })}
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
                key={`livetv-${activeCategory}-${searchQuery}-5`}
                data={filteredChannels}
                contentContainerStyle={[styles.content, styles.gridContainer]}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader()}
                renderItem={(props) => renderChannel({ ...props })}
                numColumns={5}
                columnWrapperStyle={filteredChannels.length > 1 ? { gap: xdWidth(16) } : null}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                initialNumToRender={12} // Render enough to cover typical off-screen start
                windowSize={5} // Keep more items in memory
                removeClippedSubviews={false} // Crucial for TV focus to find off-screen items
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
    content: { paddingBottom: xdHeight(40) },
    headerContainer: {
        marginBottom: xdHeight(16),
    },
    heroContainer: {
        flexDirection: 'row',
        height: xdHeight(280),
        marginBottom: xdHeight(24),
        overflow: 'hidden',
        backgroundColor: '#141416',
        marginHorizontal: -xdWidth(40),
    },
    gridContainer: {
        paddingHorizontal: xdWidth(40),
    },
    heroOverlay: { width: '45%', justifyContent: 'center', paddingHorizontal: xdWidth(40), zIndex: 1, paddingTop: xdHeight(50) },

    heroImageWrapper: { width: '55%', height: '100%', position: 'relative' },
    heroImage: { opacity: 0.8, width: '100%', height: '100%' },

    heroTitle: { fontSize: scale(32), fontWeight: '800', color: Colors.gray[100], marginBottom: xdHeight(12) },
    heroSubtitle: { fontSize: scale(14), color: Colors.dark[3], maxWidth: xdWidth(480), lineHeight: scale(22) },
    searchWrapper: { marginBottom: xdHeight(32) },
    sectionTitle: { fontSize: scale(18), fontWeight: '700', color: Colors.gray[100], marginBottom: xdHeight(16), marginLeft: xdWidth(0) },
    categoryRow: { marginBottom: xdHeight(16) },
    channelCount: { fontSize: scale(13), color: Colors.gray[400], marginBottom: xdHeight(16) },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cardSpacing: { marginBottom: xdHeight(16) },

});