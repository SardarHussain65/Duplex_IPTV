import { BackdropCard, EmptyState, EnterPinModal, PosterCard } from '@/components/ui';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, findNodeHandle } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useParentalControls } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────

type ParentalType = 'Live TV' | 'Movies' | 'Series';

interface LockedItem {
    id: string;
    title: string;
    type: ParentalType;
    image: string;
    subtitle?: string;
    genre?: string;
    year?: string;
    duration?: string;
    season?: string;
    description?: string;
    streamHash?: string;
    tvgId?: string;
}

const CATEGORIES: { label: ParentalType; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { label: 'Live TV', icon: 'television' },
    { label: 'Movies', icon: 'movie-outline' },
    { label: 'Series', icon: 'play-box-outline' },
];

export default function ParentalControlScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { setIsScrolled, isParentalUnlocked, setParentalUnlocked, parentalPin } = useTab();
    const [activeSubTab, setActiveSubTab] = useState<ParentalType>('Live TV');

    const { useGetParentalControls } = useParentalControls();

    const apiTabMap: Record<ParentalType, string> = {
        'Live TV': 'LIVE',
        'Movies': 'MOVIE',
        'Series': 'SERIES'
    };

    const { data, loading, error } = useGetParentalControls({
        type: apiTabMap[activeSubTab]
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
    
    const filteredItems: LockedItem[] = useMemo(() => {
        if (!data?.getParentalControls?.items) return [];

        return data.getParentalControls.items
            .filter((item) => item && item.metadata)
            .map((item) => {
                const meta = item.metadata!;
                return {
                    id: item.id,
                    title: meta.name || '',
                    type: activeSubTab,
                    image: meta.tvgLogo || '',
                    genre: meta.genre || meta.category || '',
                    year: meta.releaseYear?.toString() || '',
                    duration: '', 
                    description: '', 
                    streamHash: meta.streamHash || '',
                    tvgId: meta.tvgId || '',
                } as LockedItem;
            });
    }, [data, activeSubTab]);

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
    }, [activeSubTab, isParentalUnlocked, filteredItems]);


    const getCount = (type: ParentalType) => {
        if (!data?.getParentalControls) return 0;
        const pc = data.getParentalControls;
        if (type === 'Live TV') return pc.totalLive || 0;
        if (type === 'Movies') return pc.totalMovies || 0;
        if (type === 'Series') return pc.totalSeries || 0;
        return 0;
    };

    const handlePress = (item: LockedItem) => {
        let pathname = '';
        if (item.type === 'Live TV') pathname = `/channel/${item.id}`;
        else if (item.type === 'Movies') pathname = `/movie/${item.id}`;
        else pathname = `/series-detail/${item.id}`;

        router.push({
            pathname,
            params: {
                id: item.id,
                title: item.title,
                name: item.title,
                genre: item.genre || '',
                year: item.year || '',
                duration: item.duration || '',
                season: item.season || '',
                image: item.image,
                logo: item.image,
                description: item.description || '',
                streamHash: item.streamHash || '',
                tvgId: item.tvgId || '',
            },
        } as any);
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    const posterColumns = 6;
    const backdropColumns = 5;
    const numColumns = activeSubTab === 'Live TV' ? backdropColumns : posterColumns;

    const renderItem = ({ item, index }: { item: LockedItem; index: number }) => {
        const isBackdrop = activeSubTab === 'Live TV';
        const cols = isBackdrop ? 5 : 6;

        if (isBackdrop) {
            return (
                <BackdropCard
                    innerRef={(ref) => { if (ref) itemRefs.current[index] = ref; }}
                    title={item.title}
                    image={item.image}
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
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
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

    const renderCategoryLabel = (cat: ParentalType) => {
        const labelMap: Record<ParentalType, string> = {
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

    const handleCancelUnlock = () => {
        // If cancelled, go back to live-tv or previous tab
        router.replace('/live-tv');
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.pageTitle}>{t('parentalControl.title')}</Text>

            <View style={styles.categoryRow}>
                {CATEGORIES.map((cat, index) => {
                    const isFirst = index === 0;
                    const isLast = index === CATEGORIES.length - 1;
                    return (
                        <CategoryButton
                            key={cat.label}
                            ref={isFirst ? categoryAllRef : (isLast ? lastCategoryRef : undefined)}
                            icon={cat.icon}
                            isActive={activeSubTab === cat.label}
                            onPress={() => setActiveSubTab(cat.label)}
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
            <EnterPinModal
                visible={!isParentalUnlocked}
                onClose={handleCancelUnlock}
                onSuccess={() => setParentalUnlocked(true)}
                onVerify={async (pin) => pin === parentalPin}
            />

            {loading && !data ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                </View>
            ) : (
                <FlatList
                    key={`parental-${activeSubTab}-${numColumns}`}
                    data={filteredItems}
                    contentContainerStyle={styles.content}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={(props) => renderItem({ ...props })}
                    numColumns={numColumns}
                    columnWrapperStyle={{ gap: xdWidth(activeSubTab === 'Live TV' ? 16 : 12) }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    removeClippedSubviews={false}
                    ListEmptyComponent={
                        <EmptyState
                            icon="lock-outline"
                            title={t('parentalControl.emptyTitle')}
                            subtitle={t('parentalControl.emptySubtitle')}
                            style={styles.emptyState}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#141416' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: xdWidth(40),
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
    categoryRow: {
        flexDirection: 'row',
        marginBottom: xdHeight(32),
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cardSpacing: {
        marginBottom: xdHeight(16),
    },
    emptyState: {
        marginTop: xdHeight(40),
    },
});
