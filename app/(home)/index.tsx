import { Tab, useTab } from '@/context/TabContext';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import FavoritesScreen from './favorites';
import LiveTVScreen from './live-tv';
import MoviesScreen from './movies';
import ParentalControlScreen from './parental-control';
import SeriesScreen from './series';
import SettingsScreen from './settings';

export default function HomeIndex() {
    const { activeTab } = useTab();

    // Keep track of which tabs have been visited to mount them lazily
    const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(new Set([activeTab]));

    // Update visited tabs when activeTab changes
    if (!visitedTabs.has(activeTab)) {
        setVisitedTabs(prev => new Set(prev).add(activeTab));
    }

    const renderTab = (tabId: Tab, Component: React.ComponentType) => {
        if (!visitedTabs.has(tabId)) {
            return null;
        }

        return (
            <View
                key={tabId}
                style={[
                    styles.screenWrapper,
                    { display: activeTab === tabId ? 'flex' : 'none' }
                ]}
            >
                <Component />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderTab('live-tv', LiveTVScreen)}
            {renderTab('movies', MoviesScreen)}
            {renderTab('series', SeriesScreen)}
            {renderTab('favorites', FavoritesScreen)}
            {renderTab('parental-control', ParentalControlScreen)}
            {renderTab('settings', SettingsScreen)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141416',
    },
    screenWrapper: {
        flex: 1,
    },
});
