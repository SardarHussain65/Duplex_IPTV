import { useTab } from '@/context/TabContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import FavoritesScreen from './favorites';
import LiveTVScreen from './live-tv';
import MoviesScreen from './movies';
import ParentalControlScreen from './parental-control';
import SeriesScreen from './series';
import SettingsScreen from './settings';

export default function HomeIndex() {
    const { activeTab } = useTab();

    return (
        <View style={styles.container}>
            {activeTab === 'live-tv' && <LiveTVScreen />}
            {activeTab === 'movies' && <MoviesScreen />}
            {activeTab === 'series' && <SeriesScreen />}
            {activeTab === 'favorites' && <FavoritesScreen />}
            {activeTab === 'parental-control' && <ParentalControlScreen />}
            {activeTab === 'settings' && <SettingsScreen />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141416',
    },
});
