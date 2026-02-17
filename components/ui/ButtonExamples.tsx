/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Button System Showcase
 *  All 12 professional button components with state examples
 * ─────────────────────────────────────────────────────────────
 */

import {
    ActionFilledButton,
    ActionOutlineButton,
    CategoryButton,
    CategoryCard,
    KeyboardButton,
    LargeActionButton,
    NavButton,
    NavIconButton,
    SearchBar,
    SettingCard,
    SettingTabButton
} from '@/components/ui';
import { Colors, Spacing } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ButtonSystemShowcase() {
    const [activeNav, setActiveNav] = useState('movies');
    const [activeCategory, setActiveCategory] = useState('featured');
    const [activeSetting, setActiveSetting] = useState('parental');
    const [searchValue, setSearchValue] = useState('');
    const [pinValue, setPinValue] = useState('1234');

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.mainTitle}>Duplex IPTV - Button System</Text>
            <Text style={styles.subtitle}>12 Professional Components • 4 States Each</Text>

            {/* ── 1. NAV BUTTONS ──────────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. Nav Buttons</Text>
                <Text style={styles.description}>Navigation with icon + text</Text>

                <View style={styles.row}>
                    <NavButton
                        icon={<Ionicons name="film" size={20} />}
                        isActive={activeNav === 'movies'}
                        onPress={() => setActiveNav('movies')}
                    >
                        Movies
                    </NavButton>

                    <NavButton
                        icon={<Ionicons name="tv" size={20} />}
                        isActive={activeNav === 'series'}
                        onPress={() => setActiveNav('series')}
                    >
                        Series
                    </NavButton>

                    <NavButton
                        icon={<Ionicons name="heart" size={20} />}
                        isActive={activeNav === 'favorites'}
                        onPress={() => setActiveNav('favorites')}
                    >
                        Favorites
                    </NavButton>
                </View>
            </View>

            {/* ── 2. NAV ICON BUTTONS ────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Nav Icon Buttons</Text>
                <Text style={styles.description}>Icon-only circular buttons</Text>

                <View style={styles.row}>
                    <NavIconButton
                        icon={<Ionicons name="lock-closed" size={24} color={Colors.gray[300]} />}
                        onPress={() => console.log('Lock')}
                    />

                    <NavIconButton
                        icon={<Ionicons name="settings" size={24} color={Colors.gray[300]} />}
                        onPress={() => console.log('Settings')}
                    />

                    <NavIconButton
                        icon={<Ionicons name="person" size={24} color={Colors.gray[300]} />}
                        onPress={() => console.log('Profile')}
                    />
                </View>
            </View>

            {/* ── 3. CATEGORY BUTTONS ────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>3. Category Buttons</Text>
                <Text style={styles.description}>Text-only category pills</Text>

                <View style={styles.row}>
                    <CategoryButton
                        isActive={activeCategory === 'featured'}
                        onPress={() => setActiveCategory('featured')}
                    >
                        Featured
                    </CategoryButton>

                    <CategoryButton
                        isActive={activeCategory === 'action'}
                        onPress={() => setActiveCategory('action')}
                    >
                        Action
                    </CategoryButton>

                    <CategoryButton
                        isActive={activeCategory === 'comedy'}
                        onPress={() => setActiveCategory('comedy')}
                    >
                        Comedy
                    </CategoryButton>
                </View>
            </View>

            {/* ── 4. ACTION OUTLINE BUTTONS ──────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>4. Action Outline Buttons</Text>
                <Text style={styles.description}>Secondary actions with border</Text>

                <View style={styles.row}>
                    <ActionOutlineButton onPress={() => console.log('Cancel')}>
                        Cancel
                    </ActionOutlineButton>

                    <ActionOutlineButton onPress={() => console.log('More Info')}>
                        More Info
                    </ActionOutlineButton>
                </View>
            </View>

            {/* ── 5. ACTION FILLED BUTTONS ───────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>5. Action Filled Buttons</Text>
                <Text style={styles.description}>Primary CTAs with green background</Text>

                <View style={styles.row}>
                    <ActionFilledButton onPress={() => console.log('Watch Now')}>
                        Watch Now
                    </ActionFilledButton>

                    <ActionFilledButton onPress={() => console.log('Subscribe')}>
                        Subscribe
                    </ActionFilledButton>
                </View>
            </View>

            {/* ── 6. SETTING TAB BUTTONS ─────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>6. Setting Tab Buttons</Text>
                <Text style={styles.description}>Settings tabs with icon + text</Text>

                <View style={styles.row}>
                    <SettingTabButton
                        icon={<Ionicons name="shield-checkmark" size={20} />}
                        isActive={activeSetting === 'parental'}
                        onPress={() => setActiveSetting('parental')}
                    >
                        Parental Control
                    </SettingTabButton>

                    <SettingTabButton
                        icon={<Ionicons name="language" size={20} />}
                        isActive={activeSetting === 'language'}
                        onPress={() => setActiveSetting('language')}
                    >
                        Language
                    </SettingTabButton>
                </View>
            </View>

            {/* ── 7. SEARCH BAR ──────────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>7. Search Bar</Text>
                <Text style={styles.description}>Search input with icon</Text>

                <SearchBar
                    placeholder="Search for series..."
                    value={searchValue}
                    onChangeText={setSearchValue}
                    onSubmit={(text) => console.log('Search:', text)}
                />
            </View>

            {/* ── 9. KEYBOARD BUTTONS ────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>9. Keyboard Buttons</Text>
                <Text style={styles.description}>On-screen keyboard</Text>

                <View style={styles.row}>
                    <KeyboardButton onPress={() => console.log('1')}>1</KeyboardButton>
                    <KeyboardButton onPress={() => console.log('2')}>2</KeyboardButton>
                    <KeyboardButton onPress={() => console.log('3')}>3</KeyboardButton>
                </View>
                <View style={styles.row}>
                    <KeyboardButton onPress={() => console.log('4')}>4</KeyboardButton>
                    <KeyboardButton onPress={() => console.log('5')}>5</KeyboardButton>
                    <KeyboardButton onPress={() => console.log('6')}>6</KeyboardButton>
                </View>
            </View>

            {/* ── 10. SETTING CARDS ──────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>10. Setting Cards</Text>
                <Text style={styles.description}>Settings with icon + title + subtitle</Text>

                <SettingCard
                    icon={<Ionicons name="language" size={32} color={Colors.gray[300]} />}
                    title="English"
                    subtitle="Language"
                    onPress={() => console.log('Language')}
                    style={{ marginBottom: Spacing.sm }}
                />

                <SettingCard
                    icon={<Ionicons name="shield-checkmark" size={32} color={Colors.gray[300]} />}
                    title="Parental Control"
                    subtitle="Manage content restrictions"
                    onPress={() => console.log('Parental')}
                />
            </View>

            {/* ── 11. CATEGORY CARDS ─────────────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>11. Category Cards</Text>
                <Text style={styles.description}>Categories with icon + title + count</Text>

                <View style={styles.row}>
                    <CategoryCard
                        icon={<Ionicons name="film" size={48} color={Colors.gray[300]} />}
                        title="Movies"
                        count={34}
                        onPress={() => console.log('Movies')}
                    />

                    <CategoryCard
                        icon={<Ionicons name="tv" size={48} color={Colors.gray[300]} />}
                        title="Series"
                        count={18}
                        isActive
                        onPress={() => console.log('Series')}
                    />
                </View>
            </View>

            {/* ── 12. LARGE ACTION BUTTONS ───────────────────────────── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>12. Large Action Buttons</Text>
                <Text style={styles.description}>Large primary CTAs</Text>

                <LargeActionButton
                    icon={<Ionicons name="play" size={24} color={Colors.dark[11]} />}
                    onPress={() => console.log('Get Started')}
                >
                    Get Started
                </LargeActionButton>
            </View>

            <View style={{ height: Spacing['3xl'] }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        padding: Spacing.xl,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.gray[100],
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray[400],
        marginBottom: Spacing['2xl'],
    },
    section: {
        marginBottom: Spacing['2xl'],
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.gray[100],
        marginBottom: Spacing.xs,
    },
    description: {
        fontSize: 14,
        color: Colors.gray[400],
        marginBottom: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.sm,
        flexWrap: 'wrap',
    },
});
