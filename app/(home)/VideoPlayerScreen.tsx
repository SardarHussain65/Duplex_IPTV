/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Video Player Screen
 *  Full-screen player with controls, progress bar & settings
 * ─────────────────────────────────────────────────────────────
 */

import { NavIconButton } from '@/components/ui';
import { SettingCard } from '@/components/ui/buttons/SettingCard';
import { EpisodeCard } from '@/components/ui/cards/EpisodeCard';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    StyleSheet,
    Text,
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
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
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

    const handleSkipPrevious = () => {
        if (isSeries && currentEpisodeIndex > 0) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
            setProgress(0);
            setIsPlaying(true);
        }
    };

    const handleSkipNext = () => {
        if (isSeries && currentEpisodeIndex < episodes.length - 1) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
            setProgress(0);
            setIsPlaying(true);
        }
    };

    const handleSelectEpisode = (episodeIndex: number) => {
        setCurrentEpisodeIndex(episodeIndex);
        setProgress(0);
        setIsPlaying(true);
        setViewMode('normal');
    };

    const renderEpisodeItem = ({ item, index }: { item: Episode, index: number }) => (
        <EpisodeCard
            key={item.id}
            variant="mini"
            number={item.number}
            title={item.title}
            description={item.description}
            duration={item.duration}
            image={item.image}
            progress={item.progress}
            isPlaying={index === currentEpisodeIndex}
            onPress={() => handleSelectEpisode(index)}
        />
    );

    const { setParentalModalVisible } = useTab();

    const videoWidth = shrinkAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['100%', '68%'],
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
                    }
                ]}>
                    <View style={styles.videoWrapper}>
                        <Video
                            source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                            style={styles.videoBg}
                            resizeMode={ResizeMode.COVER}
                            shouldPlay={isPlaying}
                            isLooping
                            useNativeControls={false}
                        />
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
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name="skip-previous" size={scale(24)} />}
                                            onPress={handleSkipPrevious}
                                            disabled={!isSeries || currentEpisodeIndex === 0}
                                        />
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name={isPlaying ? 'pause' : 'play'} size={scale(24)} />}
                                            onPress={() => setIsPlaying(!isPlaying)}
                                            style={styles.playBtn}
                                        />
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name="skip-next" size={scale(24)} />}
                                            onPress={handleSkipNext}
                                            disabled={!isSeries || currentEpisodeIndex === episodes.length - 1}
                                        />
                                    </View>

                                    <View style={styles.auxBtns}>
                                        {isSeries && (
                                            <NavIconButton
                                                icon={<MaterialCommunityIcons name="format-list-bulleted" size={scale(20)} />}
                                                isActive={viewMode === 'episodes'}
                                                onPress={toggleEpisodes}
                                            />
                                        )}
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name="closed-caption-outline" size={scale(20)} />}
                                        />
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name={isLocked ? "lock" : "lock-open-outline"} size={scale(20)} />}
                                            isActive={isLocked}
                                            onPress={() => setParentalModalVisible(true)}
                                        />
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name={isFavorite ? "heart" : "heart-outline"} size={scale(20)} />}
                                            isActive={isFavorite}
                                            activeBackgroundColor={isFavorite ? "rgba(224,51,76,0.15)" : undefined}
                                            onPress={() => setIsFavorite(!isFavorite)}
                                        />
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name="cog-outline" size={scale(20)} />}
                                            isActive={viewMode === 'settings'}
                                            onPress={toggleSettings}
                                        />
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
                                    <View style={styles.settingsList}>
                                        <SettingCard
                                            icon={<MaterialCommunityIcons name="closed-caption-outline" size={scale(22)} color="#fff" />}
                                            title="Caption"
                                            subtitle={selectedCaption}
                                            onPress={() => setSettingsPanel('caption')}
                                        />
                                        <SettingCard
                                            icon={<MaterialCommunityIcons name="translate" size={scale(22)} color="#ccc" />}
                                            title="Language"
                                            subtitle="Not Available"
                                            onPress={() => setSettingsPanel('language')}
                                        />
                                    </View>
                                )}

                                {settingsPanel === 'caption' && (
                                    <View style={styles.settingsList}>
                                        {['Off', 'English', 'Hindi'].map((opt) => (
                                            <SettingCard
                                                key={opt}
                                                icon={
                                                    <MaterialCommunityIcons
                                                        name={selectedCaption === opt ? 'check-circle' : 'circle-outline'}
                                                        size={scale(22)}
                                                        color={selectedCaption === opt ? '#fff' : '#666'}
                                                    />
                                                }
                                                title={opt}
                                                subtitle={selectedCaption === opt ? 'Selected' : ''}
                                                onPress={() => { setSelectedCaption(opt); setSettingsPanel('main'); }}
                                            />
                                        ))}
                                    </View>
                                )}

                                {settingsPanel === 'language' && (
                                    <View style={styles.settingsList}>
                                        {['English', 'German', 'Hindi'].map((opt) => (
                                            <SettingCard
                                                key={opt}
                                                icon={
                                                    <MaterialCommunityIcons
                                                        name={selectedLanguage === opt ? 'check-circle' : 'circle-outline'}
                                                        size={scale(22)}
                                                        color={selectedLanguage === opt ? '#fff' : '#666'}
                                                    />
                                                }
                                                title={opt}
                                                subtitle={selectedLanguage === opt ? 'Selected' : ''}
                                                onPress={() => { setSelectedLanguage(opt); setSettingsPanel('main'); }}
                                            />
                                        ))}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View style={styles.episodesPanel}>
                                <Text style={styles.panelTitle}>Episodes ({episodes.length})</Text>
                                <View style={styles.panelDivider} />
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={episodes}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderEpisodeItem}
                                />
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
    },
    videoContainer: {
        height: '100%',
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
    playBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    auxBtns: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    // Right Panel
    rightPanel: {
        width: '32%',
        height: '100%',
        paddingLeft: xdWidth(20),
        paddingRight: xdWidth(32),
        paddingVertical: xdHeight(40),
        backgroundColor: '#141416',
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
    settingsList: {
        gap: 10,
    },

    epRowActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.4)',
    }
});
