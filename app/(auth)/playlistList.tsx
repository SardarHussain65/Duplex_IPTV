import { PlaylistRowButton } from "@/components/ui/buttons/playlistButton";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Colors, scale as s } from "../../constants";

// ── Types ─────────────────────────────────────────────────────────────────────
type Playlist = {
    id: string;
    label: string;
    url: string;
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const PLAYLIST_TYPE = "M3U";

const PLAYLISTS: Playlist[] = [
    { id: "1", label: "Playlist 1", url: "https://example.com/live/stream.m3u8" },
    { id: "2", label: "Playlist 2", url: "https://example.com/live/stream.m3u8" },
    { id: "3", label: "Playlist 3", url: "https://example.com/live/stream.m3u8" },
    { id: "4", label: "Playlist 4", url: "https://example.com/live/stream.m3u8" },
    { id: "5", label: "Playlist 5", url: "https://example.com/live/stream.m3u8" },
    { id: "6", label: "Playlist 6", url: "https://example.com/live/stream.m3u8" },
];

// ── Main Screen ───────────────────────────────────────────────────────────────
const PlaylistListScreen = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);


    return (
        <View style={styles.container}>
            <View style={[styles.content]}>

                {/* Logo */}
                <Image
                    source={require("../../assets/images/ActivationImage.png")}
                    style={{ width: s(60), height: s(60), marginBottom: s(20) }}
                    contentFit="contain"
                />

                {/* Title */}
                <Text style={[styles.title, { fontSize: s(24), marginBottom: s(8) }]}>
                    {PLAYLIST_TYPE}
                </Text>

                {/* Subtitle */}
                <Text
                    style={[styles.subtitle, { fontSize: s(14), marginBottom: s(32) }]}
                    onPress={() => router.back()}
                >
                    {PLAYLISTS.length} Playlists
                </Text>

             <View style={{ width: "50%" , height: s(250),}}>
                <FlatList
                    data={PLAYLISTS}
                    contentContainerStyle={{ padding: s(20) }}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <PlaylistRowButton
                            key={item.id}
                            label={item.label}
                            url={item.url}
                            isSelected={selectedId === item.id}
                            onPress={() => setSelectedId(item.id)}
                            hasTVPreferredFocus={index === 0}
                        />
                    )}
                />
             </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        alignItems: "center",
        width: "100%",
    },
    title: {
        color: Colors.dark[1],
        fontWeight: "700",
        textAlign: "center",                
    },

    subtitle: {
        color: "#9CA3AF",
        textAlign: "center",
    },
});

export default PlaylistListScreen;