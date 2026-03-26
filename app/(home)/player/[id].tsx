/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Video Player Screen
 *  Full-screen player with controls, progress bar & settings
 * ─────────────────────────────────────────────────────────────
 */

import { NavIconButton } from '@/components/ui';
import { EpisodeCard } from '@/components/ui/cards/EpisodeCard';
import { SettingCard } from '@/components/ui/cards/SettingCard';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { useStreamUrl } from '@/lib/api/hooks/useStreamUrl';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    StyleSheet,
    Text,
    useTVEventHandler,
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
        title: string;
        genre: string;
        year: string;
        duration: string;
        image: string;
        isSeries?: string;
        streamHash?: string;
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
    const [progress, setProgress] = useState(0); // 0-1
    const [viewMode, setViewMode] = useState<ViewMode>('normal');
    const [settingsPanel, setSettingsPanel] = useState<SettingsPanel>('main');
    const [selectedCaption, setSelectedCaption] = useState('Off');
    const [selectedLanguage, setSelectedLanguage] = useState('German');
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const episodes = generateEpisodes();

    // ── Controls Visibility logic ──────────────────────────────
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pauseButtonRef = useRef<any>(null);

    const resetControlsTimer = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }, []);

    // Handle TV interactions
    useTVEventHandler((evt) => {
        if (evt && evt.eventType !== 'blur' && evt.eventType !== 'focus') {
            resetControlsTimer();
        }
    });

    useEffect(() => {
        resetControlsTimer(); // Initial show
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [resetControlsTimer]);

    // Handle focus when controls are shown
    useEffect(() => {
        if (showControls && pauseButtonRef.current) {
            const timer = setTimeout(() => {
                pauseButtonRef.current?.setNativeProps({ hasTVPreferredFocus: true });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showControls]);

    // Shrink animation for video
    const shrinkAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(shrinkAnim, {
            toValue: viewMode === 'normal' ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [viewMode]);

    const videoRef = useRef<Video>(null);
    const [videoDurationMs, setVideoDurationMs] = useState(0);
    const [currentTimeMs, setCurrentTimeMs] = useState(0);

    // Refs so seek callbacks always read current values (avoids stale closure)
    const videoDurationMsRef = useRef(0);
    const isSeekingRef = useRef(false);

    // true until first playback status arrives; also true while buffering after seek
    const [isBuffering, setIsBuffering] = useState(true);
    // mirrors actual playback state from expo-av (separate from the shouldPlay prop)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const onPlaybackStatusUpdate = useCallback((status: any) => {
        if (!status.isLoaded) {
            // Still loading the source — keep spinner
            return;
        }
        setIsBuffering(!!status.isBuffering);
        setIsVideoPlaying(!!status.isPlaying);
        if (!isSeekingRef.current) {
            const dur = status.durationMillis || 0;
            const pos = status.positionMillis || 0;
            videoDurationMsRef.current = dur;
            setVideoDurationMs(dur);
            setCurrentTimeMs(pos);
            setProgress(pos / (dur || 1));
        }
    }, []);

    const handleSeek = async (newProgress: number) => {
        if (videoRef.current) {
            await videoRef.current.setPositionAsync(newProgress * videoDurationMsRef.current);
        }
    };

    // Time formatting
    const fmt = (ms: number) => {
        const s = Math.floor(ms / 1000);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        return `${m}:${String(sec).padStart(2, '0')}`;
    };
    const totalFmt = fmt(videoDurationMs);
    const currentFmt = fmt(currentTimeMs);

    const toggleSettings = () => {
        setViewMode(v => v === 'settings' ? 'normal' : 'settings');
    };

    const toggleEpisodes = () => {
        setViewMode(v => v === 'episodes' ? 'normal' : 'episodes');
    };

    const handleSkipPrevious = async () => {
        if (isSeries && currentEpisodeIndex > 0) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
            setProgress(0);
            setIsPlaying(true);
        } else if (videoRef.current) {
            // Skip backward 10s for movies
            const status = await videoRef.current.getStatusAsync();
            if (status.isLoaded) {
                const newPos = Math.max(0, status.positionMillis - 10000);
                await videoRef.current.setPositionAsync(newPos);
            }
        }
    };

    const handleSkipNext = async () => {
        if (isSeries && currentEpisodeIndex < episodes.length - 1) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
            setProgress(0);
            setIsPlaying(true);
        } else if (videoRef.current) {
            // Skip forward 10s for movies
            const status = await videoRef.current.getStatusAsync();
            if (status.isLoaded) {
                const newPos = Math.min(videoDurationMs, status.positionMillis + 10000);
                await videoRef.current.setPositionAsync(newPos);
            }
        }
    };

    // ── Player cleanup ────────────────────────────────────────
    // Unload the stream on unmount to stop HLS buffering and free memory.
    useEffect(() => {
        return () => {
            videoRef.current?.unloadAsync().catch(() => null);
        };
    }, []);

    const { data: streamUrl, isLoading: isStreamLoading } = useStreamUrl(
        params.streamHash || null,
        true
    );

    // If streamHash is provided, try to use it. Only use dummy as a last resort if it fails or isn't provided.
    const videoSource = streamUrl
        ? { uri: streamUrl }
        : params.streamHash
            ? null // Wait for fetch
            : { uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' };

    const handleSelectEpisode = useCallback((episodeIndex: number) => {
        setCurrentEpisodeIndex(episodeIndex);
        setProgress(0);
        setIsPlaying(true);
        setViewMode('normal');
    }, []);

    const renderEpisodeItem = useCallback(({ item, index }: { item: Episode, index: number }) => (
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
    ), [currentEpisodeIndex, handleSelectEpisode]);

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
                        {videoSource && (
                            <Video
                                ref={videoRef}
                                source={videoSource}
                                style={styles.videoBg}
                                resizeMode={ResizeMode.COVER}
                                shouldPlay={isPlaying}
                                isLooping
                                useNativeControls={false}
                                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                            // bufferConfig is only supported by react-native-video (not expo-av).
                            // TODO: add low-latency buffer tuning when migrating to react-native-video.
                            />
                        )}
                        {!videoSource && (
                            <View style={[styles.videoBg, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ color: '#fff' }}>{isStreamLoading ? 'Loading Stream...' : 'No Stream Available'}</Text>
                            </View>
                        )}
                        {/* Spinner: only when genuinely stuck (buffering but NOT playing).
                             HLS streams set isBuffering=true even while playing normally
                             (continuous look-ahead). We filter that out with !isVideoPlaying. */}
                        {(isStreamLoading || (isBuffering && !isVideoPlaying)) && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#E0334C" />
                            </View>
                        )}

                        <View style={styles.vignette} />

                        {/* Controls (only show in normal mode) */}
                        <View
                            style={[
                                styles.overlayControls,
                                !showControls && { opacity: 0, pointerEvents: 'none' }
                            ]}
                        >
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
                                    <Slider
                                        style={styles.slider}
                                        value={progress}
                                        minimumValue={0}
                                        maximumValue={1}
                                        step={0.001}
                                        minimumTrackTintColor="#E0334C"
                                        maximumTrackTintColor="rgba(255,255,255,0.2)"
                                        thumbTintColor="#E0334C"
                                        onSlidingStart={() => { isSeekingRef.current = true; }}
                                        onValueChange={(val) => {
                                            setProgress(val);
                                            setCurrentTimeMs(val * videoDurationMsRef.current);
                                        }}
                                        onSlidingComplete={async (val) => {
                                            await handleSeek(val);
                                            isSeekingRef.current = false;
                                        }}
                                    />
                                    <Text style={styles.timeLabel}>{currentFmt} / {totalFmt}</Text>
                                </View>

                                <View style={styles.btnsRow}>
                                    <View style={styles.transportBtns}>
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name="skip-previous" size={scale(24)} />}
                                            onPress={handleSkipPrevious}
                                            disabled={isSeries && currentEpisodeIndex === 0}
                                        />
                                        <NavIconButton
                                            innerRef={pauseButtonRef}
                                            icon={<MaterialCommunityIcons name={isPlaying ? 'pause' : 'play'} size={scale(24)} />}
                                            onPress={() => setIsPlaying(!isPlaying)}
                                            style={styles.playBtn}
                                            hasTVPreferredFocus={showControls}
                                        />
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name="skip-next" size={scale(24)} />}
                                            onPress={handleSkipNext}
                                            disabled={isSeries && currentEpisodeIndex === episodes.length - 1}
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
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
    slider: {
        flex: 1,
        height: 40,        // tall enough for comfortable touch/D-pad target
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
