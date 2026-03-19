
/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Live TV Screen
 * ─────────────────────────────────────────────────────────────
 */

import { BackdropCard, CategoryLockedState, EmptyState, SearchBar } from '@/components/ui';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { EnterPinModal, ManageCategoryModal, RenameCategoryModal } from '@/components/ui/modals';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useCategoryManagement } from '@/context/CategoryManagementContext';
import { useTab } from '@/context/TabContext';
import { usePlaylistChannels } from '@/lib/api';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { Channel } from '@/types';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View, findNodeHandle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

// ── Screen ────────────────────────────────────────────────────

export default function LiveTVScreen() {
    const router = useRouter();
    const { setIsScrolled, setSearchBarNode, settingsTabNode, searchBarNode } = useTab();
    const { isCategoryLocked, lockCategory, unlockCategory, renameCategory, getCategoryLabel } = useCategoryManagement();
    const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);

    const {
        data: apiData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = usePlaylistChannels({
        playlistId: activePlaylistId || '',
        limit: 30,
        contentType: 'LIVE',
        enabled: !!activePlaylistId
    });

    const channels: Channel[] = useMemo(() => {
        if (!apiData?.pages) return [];
        return apiData.pages.flatMap((page) =>
            page.items.map((item) => ({
                id: item.streamHash,
                name: item.name,
                category: item.category,
                image: item.tvgLogo,
            }))
        );
    }, [apiData]);

    const categories = useMemo(() => {
        const uniqueCats = Array.from(new Set(channels.map((ch: Channel) => ch.category)));
        return ['All', ...uniqueCats];
    }, [channels]);

    const recentlyWatched = useMemo(() => {
        // For now, if we have real channels, use the first few as 'recently watched' 
        // to maintain UI consistency, or we could keep mock data if preferred.
        // Let's use real channels if available.
        return channels.slice(0, 5).map((ch, idx) => ({
            ...ch,
            progress: [0.45, 0.2, 0.8, 0.1, 0.65][idx] || 0.5
        }));
    }, [channels]);

    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryAllNode, setCategoryAllNode] = useState<number | undefined>(undefined);
    const [lastCategoryNode, setLastCategoryNode] = useState<number | undefined>(undefined);
    const [firstChannelNode, setFirstChannelNode] = useState<number | undefined>(undefined);

    const [isManageModalVisible, setManageModalVisible] = useState(false);
    const [isRenameModalVisible, setRenameModalVisible] = useState(false);
    const [isPinModalVisible, setPinModalVisible] = useState(false);
    const [categoryToManage, setCategoryToManage] = useState<string | null>(null);

    // Track nodes for the first few items to handle row wrapping (up to 24 items / 6 rows)
    const [channelNodes, setChannelNodes] = useState<Record<number, number>>({});

    const searchRef = useRef<any>(null);
    const categoryAllRef = useRef<any>(null);
    const lastCategoryRef = useRef<any>(null);
    const channelRefs = useRef<Record<number, any>>({});

    const filteredChannels = useMemo(() => {
        let result = channels;

        if (activeCategory !== 'All') {
            result = result.filter(
                (ch: Channel) => ch.category.toLowerCase() === activeCategory.toLowerCase()
            );
        }

        if (searchQuery.trim()) {
            result = result.filter((ch: Channel) =>
                ch.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [activeCategory, searchQuery, channels]);

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
                const idx = Number.parseInt(key, 10);
                if (idx >= filteredChannels.length) return;
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

    const handleCategoryLongPress = (category: string) => {
        setCategoryToManage(category);
        setManageModalVisible(true);
    };

    const handleLockToggle = () => {
        setManageModalVisible(false);
        setPinModalVisible(true);
    };

    const handleRenamePress = () => {
        setManageModalVisible(false);
        setRenameModalVisible(true);
    };

    const handlePinSuccess = () => {
        if (categoryToManage) {
            if (isCategoryLocked(categoryToManage)) {
                unlockCategory(categoryToManage);
            } else {
                lockCategory(categoryToManage);
            }
        }
        setPinModalVisible(false);
    };

    const handleRenameSave = (newName: string) => {
        if (categoryToManage) {
            renameCategory(categoryToManage, newName);
        }
        setRenameModalVisible(false);
    };

    const renderChannel = ({ item, index }: { item: Channel; index: number }) => {
        const isRowStart = index % 4 === 0;
        const isRowEnd = index % 4 === 3;

        return (
            <BackdropCard
                innerRef={(ref) => {
                    if (ref) channelRefs.current[index] = ref;
                    else delete channelRefs.current[index];
                }}
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
            {/* ── Recently Watched ── */}
            {recentlyWatched.length > 0 && (
                <View style={{ marginBottom: xdHeight(32) }}>
                    <Text style={styles.sectionTitle}>Recently Watched</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginHorizontal: -xdWidth(40) }}
                        contentContainerStyle={{ paddingHorizontal: xdWidth(40) }}
                    >
                        {recentlyWatched.map((channel, index) => (
                            <BackdropCard
                                key={`recent-${channel.id}`}
                                image={{ uri: channel.image }}
                                progress={channel.progress}
                                width={xdWidth(170)}
                                height={xdHeight(96)}
                                style={{ marginRight: xdWidth(12) }}
                                onPress={() => handleChannelPress(channel)}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}

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
                            nextFocusRight={isLast ? firstChannelNode : undefined}
                            nextFocusDown={firstChannelNode}
                        >
                            {getCategoryLabel(cat)}
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

    const isCurrentCategoryLocked = activeCategory !== 'All' && isCategoryLocked(activeCategory);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary[500]} />
                <Text style={{ color: Colors.gray[400], marginTop: xdHeight(16) }}>Loading Channels...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                key="livetv-grid"
                data={isCurrentCategoryLocked ? [] : filteredChannels}
                contentContainerStyle={[styles.content, styles.gridContainer, { flexGrow: 1 }]}
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
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() =>
                    isFetchingNextPage ? (
                        <View style={{ paddingVertical: xdHeight(20), alignItems: 'center' }}>
                            <ActivityIndicator size="small" color={Colors.primary[500]} />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    isCurrentCategoryLocked ? (
                        <CategoryLockedState />
                    ) : (
                        <EmptyState
                            icon="television"
                            title="No Live TV Found"
                            subtitle="On this categories we can't find any live tv. Try another category"
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
                onVerify={async (pin: string) => pin === "1234"} // Default PIN for category management
                title={categoryToManage && isCategoryLocked(categoryToManage) ? 'Enter PIN to Unlock' : 'Enter PIN to Lock'}
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