import { NavIconButton } from '@/components/ui';
import { EpisodeCard } from '@/components/ui/cards/EpisodeCard';
import { SettingCard } from '@/components/ui/cards/SettingCard';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { useStreamUrl } from '@/lib/api/hooks/useStreamUrl';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AudioTrack, SubtitleTrack, useVideoPlayer, VideoView } from 'expo-video';
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

    // ── UI state ──────────────────────────────────────────
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [progress, setProgress] = useState(0); // 0-1
    const [viewMode, setViewMode] = useState<ViewMode>('normal');
    const [settingsPanel, setSettingsPanel] = useState<SettingsPanel>('main');
    const [selectedCaption, setSelectedCaption] = useState('Off');
    const [selectedLanguage, setSelectedLanguage] = useState('Default');
    const [availableAudioTracks, setAvailableAudioTracks] = useState<AudioTrack[]>([]);
    const [availableSubtitleTracks, setAvailableSubtitleTracks] = useState<SubtitleTrack[]>([]);
    const [currentAudioTrack, setCurrentAudioTrack] = useState<AudioTrack | null>(null);
    const [currentSubtitleTrack, setCurrentSubtitleTrack] = useState<SubtitleTrack | null>(null);

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
        }, 5000);
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

    // ── expo-video logic ──────────────────────────────────────
    const { data: streamUrl, isLoading: isStreamLoading } = useStreamUrl(
        params.streamHash || null,
        true
    );

    const videoSource = streamUrl
        ? streamUrl
        : params.streamHash
            ? null // Wait for fetch
            : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = true;
        player.play();
    });

    // Use player state instead of manual local state mirrors where possible
    const [isBuffering, setIsBuffering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTimeMs, setCurrentTimeMs] = useState(0);
    const [durationMs, setDurationMs] = useState(0);

    const isSeekingRef = useRef(false);

    useEffect(() => {
        // Periodically update UI state from player properties
        const interval = setInterval(() => {
            if (!isSeekingRef.current) {
                const current = player.currentTime * 1000;
                const total = player.duration * 1000;

                setCurrentTimeMs(current);
                setDurationMs(total);
                setIsPlaying(player.playing);
                setIsBuffering(player.status === 'loading');

                // Update tracks
                setAvailableAudioTracks(player.availableAudioTracks);
                setAvailableSubtitleTracks(player.availableSubtitleTracks);
                setCurrentAudioTrack(player.audioTrack);
                setCurrentSubtitleTrack(player.subtitleTrack);

                // Update labels
                setSelectedLanguage(player.audioTrack?.label || 'Default');
                setSelectedCaption(player.subtitleTrack?.label || 'Off');

                if (total > 0) {
                    setProgress(current / total);
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [player]);

    const handleSeek = (newProgress: number) => {
        player.currentTime = newProgress * player.duration;
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
    const totalFmt = fmt(durationMs);
    const currentFmt = fmt(currentTimeMs);

    const toggleSettings = () => {
        setViewMode(v => v === 'settings' ? 'normal' : 'settings');
    };

    const toggleEpisodes = () => {
        setViewMode(v => v === 'episodes' ? 'normal' : 'episodes');
    };

    const handleSkipPrevious = () => {
        if (isSeries && currentEpisodeIndex > 0) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
            player.currentTime = 0;
            player.play();
        } else {
            // Skip backward 10s
            player.seekBy(-10);
        }
    };

    const handleSkipNext = () => {
        if (isSeries && currentEpisodeIndex < episodes.length - 1) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
            player.currentTime = 0;
            player.play();
        } else {
            // Skip forward 10s
            player.seekBy(10);
        }
    };

    const handleSelectEpisode = useCallback((episodeIndex: number) => {
        setCurrentEpisodeIndex(episodeIndex);
        player.currentTime = 0;
        player.play();
        setViewMode('normal');
    }, [player]);

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
                            <VideoView
                                player={player}
                                style={styles.videoBg}
                                contentFit="cover"
                                nativeControls={false}
                                fullscreenOptions={{ enable: false }}
                                allowsPictureInPicture={false}
                            />
                        )}
                        {!videoSource && (
                            <View style={[styles.videoBg, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ color: '#fff' }}>{isStreamLoading ? 'Loading Stream...' : 'No Stream Available'}</Text>
                            </View>
                        )}

                        {(isStreamLoading || isBuffering) && (
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
                                    {isSeries ? `Brooklyn Nine-Nine • S1 • EP ${currentEpisodeIndex + 1}` : `${genre} • ${year} • ${duration}`}
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
                                            setCurrentTimeMs(val * (player.duration * 1000));
                                        }}
                                        onSlidingComplete={(val) => {
                                            handleSeek(val);
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
                                            onPress={() => isPlaying ? player.pause() : player.play()}
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
                                            isActive={viewMode === 'settings' && settingsPanel === 'caption'}
                                            onPress={() => {
                                                setViewMode('settings');
                                                setSettingsPanel('caption');
                                            }}
                                        />
                                        <NavIconButton
                                            icon={<MaterialCommunityIcons name="translate" size={scale(20)} />}
                                            isActive={viewMode === 'settings' && settingsPanel === 'language'}
                                            onPress={() => {
                                                setViewMode('settings');
                                                setSettingsPanel('language');
                                            }}
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
                                            isActive={viewMode === 'settings' && settingsPanel === 'main'}
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
                                            subtitle={selectedLanguage}
                                            onPress={() => setSettingsPanel('language')}
                                        />
                                    </View>
                                )}

                                {settingsPanel === 'caption' && (
                                    <View style={styles.settingsList}>
                                        <SettingCard
                                            icon={
                                                <MaterialCommunityIcons
                                                    name={currentSubtitleTrack === null ? 'check-circle' : 'circle-outline'}
                                                    size={scale(22)}
                                                    color={currentSubtitleTrack === null ? '#fff' : '#666'}
                                                />
                                            }
                                            title="Off"
                                            subtitle={currentSubtitleTrack === null ? 'Selected' : ''}
                                            onPress={() => {
                                                player.subtitleTrack = null;
                                                setSettingsPanel('main');
                                            }}
                                        />
                                        {availableSubtitleTracks.map((track, idx) => (
                                            <SettingCard
                                                key={`${track.language}-${idx}`}
                                                icon={
                                                    <MaterialCommunityIcons
                                                        name={currentSubtitleTrack?.label === track.label ? 'check-circle' : 'circle-outline'}
                                                        size={scale(22)}
                                                        color={currentSubtitleTrack?.label === track.label ? '#fff' : '#666'}
                                                    />
                                                }
                                                title={track.label || track.language || `Track ${idx + 1}`}
                                                subtitle={currentSubtitleTrack?.label === track.label ? 'Selected' : ''}
                                                onPress={() => {
                                                    player.subtitleTrack = track;
                                                    setSettingsPanel('main');
                                                }}
                                            />
                                        ))}
                                    </View>
                                )}

                                {settingsPanel === 'language' && (
                                    <View style={styles.settingsList}>
                                        {availableAudioTracks.map((track, idx) => (
                                            <SettingCard
                                                key={`${track.language}-${idx}`}
                                                icon={
                                                    <MaterialCommunityIcons
                                                        name={currentAudioTrack?.label === track.label ? 'check-circle' : 'circle-outline'}
                                                        size={scale(22)}
                                                        color={currentAudioTrack?.label === track.label ? '#fff' : '#666'}
                                                    />
                                                }
                                                title={track.label || track.language || `Track ${idx + 1}`}
                                                subtitle={currentAudioTrack?.label === track.label ? 'Selected' : ''}
                                                onPress={() => {
                                                    player.audioTrack = track;
                                                    setSettingsPanel('main');
                                                }}
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
