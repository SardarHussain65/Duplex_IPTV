import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const TEST_MOVIE_URL = 'http://cdn4k.cc:80/movie/Duplexteste3509/391181Hf/406309.mp4';

export default function TestPlayerScreen() {
    console.log('[TestPlayer] Initializing with direct URL:', TEST_MOVIE_URL);

    const player = useVideoPlayer(TEST_MOVIE_URL, (p) => {
        p.loop = false;
        // Using standard buffer settings
        p.bufferOptions = {
            preferredForwardBufferDuration: 30,
        };
        p.play();
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Direct Player Test</Text>
                <Text style={styles.subtitle}>Bypassing Backend Proxy</Text>
                <Text style={styles.url}>{TEST_MOVIE_URL}</Text>
            </View>

            <View style={styles.videoContainer}>
                <VideoView
                    player={player}
                    style={styles.video}
                    contentFit="contain"
                    nativeControls={true}
                />
                
                {player.status === 'loading' && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#E0334C" />
                        <Text style={styles.loadingText}>Buffering Direct Stream...</Text>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.info}>
                    Status: {player.status === 'readyToPlay' ? 'Ready' : player.status}
                </Text>
                <Text style={styles.info}>
                    Buffering: {player.buffering ? 'Yes' : 'No'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        padding: 40,
        backgroundColor: '#141416',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#E0334C',
        marginTop: 4,
    },
    url: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
    },
    footer: {
        padding: 20,
        backgroundColor: '#141416',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    info: {
        color: '#ccc',
        fontSize: 14,
    }
});
