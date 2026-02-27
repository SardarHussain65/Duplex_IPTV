import { ActionFilledButton } from '@/components/ui/buttons/ActionFilledButton';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';
import { HistoryCard } from '@/components/ui/cards/HistoryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, FAVORITE_CATEGORIES } from '@/constants';
import { xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { findNodeHandle, FlatList, StyleSheet, View } from 'react-native';

interface HistoryItem {
    id: string;
    title: string;
    date: string;
    duration: string;
    progress: number;
    image: string;
    type: 'Live TV' | 'Movies' | 'Series';
}

const MOCK_HISTORY: HistoryItem[] = [
    {
        id: '1',
        title: 'Brooklyn Nine-Nine',
        date: '02-10-25',
        duration: '1h 20m',
        progress: 0.8,
        image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
        type: 'Live TV'
    },
    {
        id: '2',
        title: 'Brooklyn Nine-Nine',
        date: '02-10-25',
        duration: '1h 20m',
        progress: 0.8,
        image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        type: 'Live TV'
    },
    {
        id: '3',
        title: 'Brooklyn Nine-Nine',
        date: '02-10-25',
        duration: '1h 20m',
        progress: 0.8,
        image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
        type: 'Live TV'
    },
    {
        id: '4',
        title: 'Brooklyn Nine-Nine',
        date: '02-10-25',
        duration: '1h 20m',
        progress: 0.8,
        image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        type: 'Live TV'
    },
    {
        id: '5',
        title: '96 Minutes',
        date: '02-10-25',
        duration: '1h 48m',
        progress: 0.5,
        image: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg',
        type: 'Movies'
    }
];

interface WatchHistorySectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

export const WatchHistorySection: React.FC<WatchHistorySectionProps> = ({
    startRef,
    sidebarRef,
}) => {
    const { settingsTabNode, isParentalControlEnabled } = useTab();
    const [activeTab, setActiveTab] = useState<'Live TV' | 'Movies' | 'Series'>('Live TV');

    const filteredHistory = MOCK_HISTORY.filter(item => item.type === activeTab);

    return (
        <View style={styles.container}>
            {/* Header with Clear Button */}
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
                    nextFocusDown={!isParentalControlEnabled ? findNodeHandle(sidebarRef.current) || undefined : undefined}
                    style={styles.clearBtn}
                    onPress={() => { }}
                    icon={<MaterialCommunityIcons name="delete" size={20} color={Colors.dark[1]} />}
                    gap={xdWidth(10)}
                >
                    Clear All History
                </ActionFilledButton>
            </View>

            {/* Category Filter */}
            <View style={styles.tabs}>
                {FAVORITE_CATEGORIES.map((cat, index) => (
                    <CategoryButton
                        key={cat.label}
                        icon={cat.icon}
                        isActive={activeTab === cat.label}
                        onPress={() => setActiveTab(cat.label)}
                        style={{ marginRight: xdWidth(12) }}
                        nextFocusRight={index === FAVORITE_CATEGORIES.length - 1 ? 'self' : undefined}
                        nextFocusUp={settingsTabNode || undefined}
                    >
                        {cat.label} ({cat.label === 'Live TV' ? 65 : cat.label === 'Movies' ? 34 : 0})
                    </CategoryButton>
                ))}
            </View>

            {/* History Grid */}
            <FlatList
                data={filteredHistory}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => (
                    <HistoryCard
                        title={item.title}
                        date={item.date}
                        duration={item.duration}
                        progress={item.progress}
                        image={item.image}
                        style={styles.card}
                        nextFocusRight={(index % 2 === 1) ? 'self' : undefined}
                        nextFocusDown={index >= filteredHistory.length - 2 ? findNodeHandle(sidebarRef.current) || undefined : undefined}
                    />
                )}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                scrollEnabled={false}
                ListEmptyComponent={
                    <EmptyState
                        icon="lock-outline"
                        title="No Watch History Yet"
                        subtitle="You haven't watched any content yet. Start watching to see your activity here."
                        style={styles.emptyState}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: xdHeight(20),
    },
    clearBtn: {
        backgroundColor: Colors.error[500],
        paddingHorizontal: xdWidth(20),
    },
    tabs: {
        flexDirection: 'row',
        gap: xdWidth(12),
        marginBottom: xdHeight(32),
    },
    tab: {
        minWidth: xdWidth(120),
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
        padding: xdWidth(20),
    },
});
