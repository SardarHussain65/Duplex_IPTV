/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Video Player Screen
 *  Full-screen player with controls, progress bar & settings
 * ─────────────────────────────────────────────────────────────
 */

import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// ── Types ──────────────────────────────────────────────────────
type SettingsPanel = null | 'main' | 'caption' | 'language';
type ViewMode = 'normal' | 'settings' | 'episodes';

type Episode = {
    id: string;
    number: number;
    title: string;
    description: string;
    duration: string;
    image: string;
    progress?: number;
};

// ── Mock Episodes ──────────────────────────────────────────────
const generateEpisodes = (): Episode[] =>
    Array.from({ length: 10 }, (_, i) => ({
        id: `ep${i + 1}`,
        number: i + 1,
        title: 'Echoes of the Past',
        description: 'A key piece of evidence in a cold case suddenly resurfaces...',
        duration: '1h 20m',
        image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
        progress: i === 0 ? 0.35 : undefined,
    }));

// ── Screen ─────────────────────────────────────────────────────
export default function VideoPlayerScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        id?: string;
        title: string;
        genre: string;
        year: string;
        duration: string;
        image: string;
        isSeries?: string;
    }>();

    const title = params.title ?? 'The World Poker Toure';
    const genre = params.genre ?? 'Action / Thriller';
    const year = params.year ?? '2021';
    const duration = params.duration ?? '1h 48m';
    const image = params.image ?? '';
    const isSeries = params.isSeries === 'true';

    // ── Player state ──────────────────────────────────────────
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [progress, setProgress] = useState(0.42); // 0-1
    const [viewMode, setViewMode] = useState<ViewMode>('normal');
    const [settingsPanel, setSettingsPanel] = useState<SettingsPanel>('main');
    const [selectedCaption, setSelectedCaption] = useState('Off');
    const [selectedLanguage, setSelectedLanguage] = useState('German');
    const episodes = generateEpisodes();

    // Shrink animation for video
    const shrinkAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(shrinkAnim, {
            toValue: viewMode === 'normal' ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [viewMode]);

    // Simulate playback progress
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setProgress((p) => Math.min(p + 0.0005, 1));
            }, 500);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying]);

    // Time formatting
    const totalSecs = 6752;
    const currentSecs = Math.floor(progress * totalSecs);
    const fmt = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        return `${m}:${String(sec).padStart(2, '0')}`;
    };
    const totalFmt = '1:52:32';
    const currentFmt = fmt(currentSecs);

    const toggleSettings = () => {
        setViewMode(v => v === 'settings' ? 'normal' : 'settings');
    };

    const toggleEpisodes = () => {
        setViewMode(v => v === 'episodes' ? 'normal' : 'episodes');
    };

    const videoWidth = shrinkAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['100%', '64%'],
    });

    const videoTranslateX = shrinkAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -xdWidth(20)],
    });

    return (
        <View style={styles.screen}>
            {/* ── Split Layout Container ── */}
            <View style={styles.mainContainer}>

                {/* Left Side: Video Player (Shrinkable) */}
                <Animated.View style={[
                    styles.videoContainer,
                    {
                        width: videoWidth as any,
                        transform: [{ translateX: videoTranslateX }]
                    }
                ]}>
                    <View style={styles.videoWrapper}>
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.videoBg}
                                contentFit="cover"
                            />
                        ) : (
                            <View style={[styles.videoBg, { backgroundColor: '#0a0a0a' }]} />
                        )}
                        <View style={styles.vignette} />

                        {/* Controls (only show in normal mode or as mini controls) */}
                        <View style={styles.overlayControls}>
                            {/* Top Info */}
                            <View style={styles.topInfo}>
                                <Text style={styles.videoTitle}>{title}</Text>
                                <Text style={styles.videoMeta}>
                                    {isSeries ? 'Brooklyn Nine-Nine • S1 • EP 1' : `${genre} • ${year} • ${duration}`}
                                </Text>
                            </View>

                            {/* Bottom controls */}
                            <View style={styles.controlsBar}>
                                <View style={styles.progressRow}>
                                    <View style={styles.progressBg}>
                                        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
                                        <View style={[styles.progressKnob, { left: `${progress * 100}%` as any }]} />
                                    </View>
                                    <Text style={styles.timeLabel}>{currentFmt} / {totalFmt}</Text>
                                </View>

                                <View style={styles.btnsRow}>
                                    <View style={styles.transportBtns}>
                                        <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.7}>
                                            <MaterialCommunityIcons name="skip-previous" size={scale(24)} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.ctrlBtn, styles.playBtn]}
                                            activeOpacity={0.7}
                                            onPress={() => setIsPlaying(!isPlaying)}
                                        >
                                            <MaterialCommunityIcons name={isPlaying ? 'pause' : 'play'} size={scale(24)} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.7}>
                                            <MaterialCommunityIcons name="skip-next" size={scale(24)} color="#fff" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.auxBtns}>
                                        {isSeries && (
                                            <TouchableOpacity
                                                style={[styles.auxBtn, viewMode === 'episodes' && styles.auxBtnActive]}
                                                activeOpacity={0.7}
                                                onPress={toggleEpisodes}
                                            >
                                                <MaterialCommunityIcons name="format-list-bulleted" size={scale(20)} color={viewMode === 'episodes' ? "#fff" : "#888"} />
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity style={styles.auxBtn} activeOpacity={0.7}>
                                            <MaterialCommunityIcons name="closed-caption-outline" size={scale(20)} color="#888" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.auxBtn, isLocked && styles.auxBtnActive]} activeOpacity={0.7} onPress={() => setIsLocked(!isLocked)}>
                                            <MaterialCommunityIcons name={isLocked ? "lock" : "lock-open-outline"} size={scale(20)} color="#888" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.auxBtn, isFavorite && styles.auxBtnFav]} activeOpacity={0.7} onPress={() => setIsFavorite(!isFavorite)}>
                                            <MaterialCommunityIcons name={isFavorite ? "heart" : "heart-outline"} size={scale(20)} color={isFavorite ? "#E0334C" : "#888"} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.auxBtn, viewMode === 'settings' && styles.auxBtnActive]}
                                            activeOpacity={0.7}
                                            onPress={toggleSettings}
                                        >
                                            <MaterialCommunityIcons name="cog-outline" size={scale(20)} color={viewMode === 'settings' ? "#fff" : "#888"} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Right Side Panel */}
                {viewMode !== 'normal' && (
                    <View style={styles.rightPanel}>
                        {viewMode === 'settings' ? (
                            <View style={styles.settingsContent}>
                                <Text style={styles.panelTitle}>Setting</Text>
                                <View style={styles.panelDivider} />

                                {settingsPanel === 'main' && (
                                    <>
                                        <TouchableOpacity style={[styles.panelRow, styles.panelRowActive]} onPress={() => setSettingsPanel('caption')}>
                                            <View style={styles.panelRowLeft}>
                                                <MaterialCommunityIcons name="closed-caption-outline" size={scale(20)} color="#fff" />
                                                <View style={styles.panelRowText}>
                                                    <Text style={styles.panelRowTitle}>Caption</Text>
                                                    <Text style={styles.panelRowSub}>{selectedCaption}</Text>
                                                </View>
                                            </View>
                                            <MaterialCommunityIcons name="chevron-right" size={scale(20)} color="#888" />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.panelRow} onPress={() => setSettingsPanel('language')}>
                                            <View style={styles.panelRowLeft}>
                                                <MaterialCommunityIcons name="translate" size={scale(20)} color="#ccc" />
                                                <View style={styles.panelRowText}>
                                                    <Text style={styles.panelRowTitle}>Language</Text>
                                                    <Text style={styles.panelRowSub}>Not Available</Text>
                                                </View>
                                            </View>
                                            <MaterialCommunityIcons name="chevron-right" size={scale(20)} color="#888" />
                                        </TouchableOpacity>
                                    </>
                                )}

                                {settingsPanel === 'caption' && (
                                    <View>
                                        {['Off', 'English', 'Hindi'].map((opt) => (
                                            <TouchableOpacity
                                                key={opt}
                                                style={[styles.optionRow, selectedCaption === opt && styles.optionRowActive]}
                                                onPress={() => { setSelectedCaption(opt); setSettingsPanel('main'); }}
                                            >
                                                <Text style={[styles.optionText, selectedCaption === opt && styles.optionTextActive]}>{opt}</Text>
                                                {selectedCaption === opt && <MaterialCommunityIcons name="check" size={scale(16)} color="#fff" />}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                {settingsPanel === 'language' && (
                                    <View>
                                        {['English', 'German', 'Hindi'].map((opt) => (
                                            <TouchableOpacity
                                                key={opt}
                                                style={[styles.optionRow, selectedLanguage === opt && styles.optionRowActive]}
                                                onPress={() => { setSelectedLanguage(opt); setSettingsPanel('main'); }}
                                            >
                                                <Text style={[styles.optionText, selectedLanguage === opt && styles.optionTextActive]}>{opt}</Text>
                                                {selectedLanguage === opt && <MaterialCommunityIcons name="check" size={scale(16)} color="#fff" />}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View style={styles.episodesPanel}>
                                <Text style={styles.panelTitle}>Episodes ({episodes.length})</Text>
                                <View style={styles.panelDivider} />
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {episodes.map((ep, i) => (
                                        <TouchableOpacity key={ep.id} style={styles.epRow}>
                                            <View style={styles.epThumbWrapper}>
                                                <View style={styles.epBadge}><Text style={styles.epBadgeText}>{ep.number}</Text></View>
                                                <Image source={{ uri: ep.image }} style={styles.epThumb} />
                                            </View>
                                            <View style={styles.epInfo}>
                                                <Text style={styles.epTitle}>{ep.title}</Text>
                                                <View style={styles.epMetaRow}>
                                                    <Text style={styles.epDuration}>{ep.duration}</Text>
                                                    {i === 0 && <Text style={styles.playingText}>Playing...</Text>}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#141416',
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: xdWidth(40),
    },
    videoContainer: {
        height: xdHeight(450),
        borderRadius: scale(20),
        overflow: 'hidden',
    },
    videoWrapper: {
        flex: 1,
        position: 'relative',
    },
    videoBg: {
        ...StyleSheet.absoluteFillObject,
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    overlayControls: {
        ...StyleSheet.absoluteFillObject,
        padding: scale(24),
        justifyContent: 'space-between',
    },
    topInfo: {
        gap: 4,
    },
    videoTitle: {
        fontSize: scale(20),
        fontWeight: 'bold',
        color: '#fff',
    },
    videoMeta: {
        fontSize: scale(12),
        color: '#ccc',
    },
    controlsBar: {
        width: '100%',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    progressBg: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E0334C',
        borderRadius: 3,
    },
    progressKnob: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E0334C',
        top: -3,
        marginLeft: -6,
    },
    timeLabel: {
        fontSize: scale(11),
        color: '#fff',
        minWidth: 90,
        textAlign: 'right',
    },
    btnsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transportBtns: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ctrlBtn: {
        width: scale(40),
        height: scale(40),
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    auxBtns: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    auxBtn: {
        width: scale(40),
        height: scale(40),
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    auxBtnActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    auxBtnFav: {
        backgroundColor: 'rgba(224,51,76,0.15)',
    },

    // Right Panel
    rightPanel: {
        width: '32%',
        height: xdHeight(450),
        paddingLeft: xdWidth(20),
    },
    settingsContent: {
        flex: 1,
    },
    episodesPanel: {
        flex: 1,
    },
    panelTitle: {
        fontSize: scale(16),
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    panelDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 16,
    },
    panelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    panelRowActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    panelRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    panelRowText: {
        gap: 2,
    },
    panelRowTitle: {
        fontSize: scale(13),
        fontWeight: '600',
        color: '#fff',
    },
    panelRowSub: {
        fontSize: scale(11),
        color: '#888',
    },

    // Options
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    optionRowActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    optionText: {
        fontSize: scale(13),
        color: '#888',
    },
    optionTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },

    // Episodes
    epRow: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 16,
    },
    epThumbWrapper: {
        width: xdWidth(90),
        height: xdHeight(60),
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    epThumb: {
        width: '100%',
        height: '100%',
    },
    epBadge: {
        position: 'absolute',
        top: 4,
        left: 4,
        zIndex: 2,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    epBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    epInfo: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    epTitle: {
        fontSize: scale(12),
        fontWeight: '600',
        color: '#fff',
    },
    epMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    epDuration: {
        fontSize: scale(11),
        color: '#666',
    },
    playingText: {
        fontSize: scale(11),
        fontWeight: 'bold',
        color: '#3B82F6',
    }
});
