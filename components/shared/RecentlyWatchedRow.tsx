import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useWatchHistory } from '@/lib/api';
import { WatchHistoryItem } from '@/lib/api/types';
import { BackdropCard } from '@/components/ui';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { Colors } from '@/constants';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

interface RecentlyWatchedRowProps {
    type: 'LIVE' | 'MOVIE' | 'SERIES';
    title?: string;
    onItemPress?: (item: WatchHistoryItem) => void;
}

export const RecentlyWatchedRow: React.FC<RecentlyWatchedRowProps> = ({
    type,
    title,
    onItemPress,
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { useGetWatchHistory } = useWatchHistory();

    // Fetch history for the specific type
    const { data, loading, refetch } = useGetWatchHistory({
        type,
        limit: 10,
    });

    // Refetch history whenever the screen gains focus (e.g. coming back from DetailScreen)
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const items = data?.getWatchHistory?.items ?? [];

    const handlePress = useCallback((item: WatchHistoryItem) => {
        if (onItemPress) {
            onItemPress(item);
            return;
        }

        // Default navigation logic based on type
        const metadata = item.metadata || {};
        if (type === 'LIVE') {
            router.push({
                pathname: '/channel/[id]',
                params: {
                    id: item.id,
                    name: item.name,
                    category: metadata.category || '',
                    logo: metadata.tvgLogo || '',
                    streamHash: item.externalId,
                    tvgId: metadata.tvgId || '',
                    contentType: 'LIVE',
                },
            });
        } else if (type === 'MOVIE') {
            router.push({
                pathname: '/movie/[id]',
                params: {
                    id: item.id,
                    name: item.name,
                    category: metadata.category || '',
                    year: metadata.releaseYear ? String(metadata.releaseYear) : '2024',
                    duration: metadata.genre || '2h', // Genre often used as duration in movies listing
                    logo: metadata.tvgLogo || '',
                    description: item.name,
                    streamHash: item.externalId,
                    tvgId: metadata.tvgId || '',
                    contentType: 'MOVIE',
                    startTime: item.currentTime,
                },
            });
        } else if (type === 'SERIES') {
            router.push({
                pathname: '/series-detail/[id]',
                params: {
                    id: item.id,
                    name: item.name,
                    category: metadata.category || '',
                    year: metadata.releaseYear ? String(metadata.releaseYear) : '2024',
                    logo: metadata.tvgLogo || '',
                    streamHash: item.externalId,
                    tvgId: metadata.tvgId || '',
                    contentType: 'SERIES',
                    startTime: item.currentTime,
                },
            });
        }
    }, [onItemPress, router, type]);

    if (loading || items.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{title || t('common.recentlyWatched')}</Text>
            <FlatList
                data={items}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `recent-${item.id}`}
                style={styles.horizontalScrollOuter}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <BackdropCard
                        title={item.name}
                        subtitle={item.metadata?.category}
                        image={{ uri: item.metadata?.tvgLogo || '' }}
                        progress={type === 'LIVE' ? undefined : (item.watchedPercent ?? 0) / 100}
                        width={xdWidth(170)}
                        height={xdHeight(96)}
                        style={styles.card}
                        onPress={() => handlePress(item)}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: xdHeight(32),
    },
    sectionTitle: {
        fontSize: scale(18),
        fontWeight: '700',
        color: Colors.gray[100],
        marginBottom: xdHeight(16),
    },
    horizontalScrollOuter: {
        marginHorizontal: -xdWidth(40),
    },
    listContent: {
        paddingHorizontal: xdWidth(40),
    },
    card: {
        marginRight: xdWidth(12),
    },
});
