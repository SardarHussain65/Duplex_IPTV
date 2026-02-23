/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Movie Detail Screen
 *  Poster · Info · Watch Now · Cast
 * ─────────────────────────────────────────────────────────────
 */

import { NavButton } from '@/components/ui/buttons/NavButton';
import { NavIconButton } from '@/components/ui/buttons/NavIconButton';
import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

// ── Mock cast data ─────────────────────────────────────────────
const CAST = [
    'Andy Sanberg',
    'Daniel Hayes',
    'Andy Sanberg',
    'Ethan Walker',
    'Ethan Walker',
    'Charlotte Hayes',
    'Olivia Turne',
];

// ── Screen ─────────────────────────────────────────────────────

export default function MovieDetailScreen() {
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const params = useLocalSearchParams<{
        id: string;
        title: string;
        genre: string;
        year: string;
        duration: string;
        image: string;
        description: string;
    }>();

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const { setParentalModalVisible } = useTab();

    useEffect(() => {
        setIsScrolled(false);
        return () => setIsScrolled(false);
    }, []);

    const title = params.title ?? '96 Minutes';
    const genre = params.genre ?? 'Action / Thriller';
    const year = params.year ?? '2021';
    const duration = params.duration ?? '1h 48m';
    const image = params.image ?? '';
    const description =
        params.description ??
        'A skilled investigator is pulled into a high-risk case after a series of unexplained crimes disturb the city. As the pressure mounts, hidden connections begin to surface, revealing a powerful network working behind the scenes. With limited time and rising danger, every decision pushes him closer to the truth, forcing him to choose between justice, sacrifice, and survival before everything falls apart.';

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    return (
        <View style={styles.screen}>
            {/* ── Full-screen blurred background ── */}
            {image ? (
                <Image
                    source={{ uri: image }}
                    style={styles.bgImage}
                    contentFit="cover"
                    blurRadius={60}
                />
            ) : null}
            <View style={styles.bgOverlay} />

            {/* ── Main content row ── */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={styles.mainRow}>
                    {/* Left: Poster */}
                    <View style={styles.posterWrapper}>
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.poster}
                                contentFit="cover"
                            />
                        ) : (
                            <View style={[styles.poster, styles.posterPlaceholder]} />
                        )}
                    </View>

                    {/* Right: Info panel */}
                    <View style={styles.infoPanel}>
                        {/* Meta */}
                        <Text style={styles.metaText}>
                            {genre}{'  •  '}{year}{'  •  '}{duration}
                        </Text>

                        {/* Title */}
                        <Text style={styles.title}>{title}</Text>

                        {/* Rating + Age badge */}
                        <View style={styles.ratingRow}>
                            <MaterialCommunityIcons name="star" size={scale(16)} color="#F59E0B" />
                            <Text style={styles.ratingValue}>4.5</Text>
                            <View style={styles.ageBadge}>
                                <Text style={styles.ageText}>13+</Text>
                            </View>
                        </View>

                        {/* Description */}
                        <Text style={styles.description} numberOfLines={6}>
                            {description}
                        </Text>

                        {/* Action buttons */}
                        <View style={styles.actionRow}>
                            <NavButton
                                icon={<MaterialCommunityIcons name="play" size={scale(18)} />}
                                onPress={() =>
                                    router.push({
                                        pathname: '/VideoPlayerScreen',
                                        params: {
                                            title,
                                            genre,
                                            year,
                                            duration,
                                            image,
                                        },
                                    })
                                }
                            >
                                Watch now
                            </NavButton>

                            <NavIconButton
                                icon={
                                    <MaterialCommunityIcons
                                        name={isFavorite ? 'heart' : 'heart-outline'}
                                        size={scale(20)}
                                        color={isFavorite ? '#E0334C' : Colors.gray[300]}
                                    />
                                }
                                isActive={isFavorite}
                                activeBackgroundColor="#E0334C"
                                onPress={() => setIsFavorite((v) => !v)}
                            />
                            <NavIconButton
                                icon={
                                    <MaterialCommunityIcons
                                        name={isLocked ? 'lock' : 'lock-open-outline'}
                                        size={scale(20)}
                                        color={Colors.gray[300]}
                                    />
                                }
                                isActive={isLocked}
                                onPress={() => setParentalModalVisible(true)}
                            />
                        </View>

                        {/* Cast */}
                        <View style={styles.castRow}>
                            <Text style={styles.castLabel}>Cast:</Text>
                            <Text style={styles.castNames} numberOfLines={2}>
                                {CAST.join('  •  ')}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#141416',
        paddingVertical: xdHeight(40),

    },
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3,
    },
    bgOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20,20,22,0.72)',
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: xdWidth(40),
        paddingVertical: xdHeight(40),
    },

    mainRow: {
        flexDirection: 'row',
        gap: xdWidth(40),
        alignItems: 'flex-start',
    },

    // Poster
    posterWrapper: {
        borderRadius: scale(14),
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
    },
    poster: {
        width: xdWidth(230),
        height: xdHeight(310),
        borderRadius: scale(14),
    },
    posterPlaceholder: {
        backgroundColor: Colors.dark[8],
    },

    // Info panel
    infoPanel: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: xdHeight(10),
    },
    metaText: {
        fontSize: scale(13),
        color: Colors.gray[400],
        fontWeight: '500',
        marginBottom: xdHeight(8),
    },
    title: {
        fontSize: scale(34),
        fontWeight: '800',
        color: Colors.gray[100],
        marginBottom: xdHeight(10),
        letterSpacing: -0.5,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(6),
        marginBottom: xdHeight(14),
    },
    ratingValue: {
        fontSize: scale(14),
        fontWeight: '700',
        color: '#F59E0B',
    },
    ageBadge: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: xdWidth(10),
        paddingVertical: xdHeight(3),
        borderRadius: scale(6),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    ageText: {
        fontSize: scale(11),
        color: Colors.gray[300],
        fontWeight: '600',
    },
    description: {
        fontSize: scale(13),
        color: Colors.gray[400],
        lineHeight: scale(21),
        marginBottom: xdHeight(22),
        maxWidth: xdWidth(540),
    },

    // Action buttons
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: xdWidth(12),
        marginBottom: xdHeight(22),
    },

    // Cast
    castRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: xdWidth(10),
        maxWidth: xdWidth(540),
    },
    castLabel: {
        fontSize: scale(13),
        fontWeight: '700',
        color: Colors.gray[100],
        paddingTop: 1,
    },
    castNames: {
        flex: 1,
        fontSize: scale(13),
        color: Colors.gray[400],
        lineHeight: scale(21),
    },
});
