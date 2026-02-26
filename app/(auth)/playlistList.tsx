import { PlaylistRowButton } from "@/components/ui/buttons/PlaylistRowButton";
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
    { id: "2", label: "Playlist 2", url: "https://example.com/live/stream.m3u8" }
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
                    style={{ width: s(60), height: s(60), marginBottom: s(24) }}
                    contentFit="contain"
                />

                {/* Title */}
                <Text style={[styles.title, { fontSize: s(24), marginBottom: s(6) }]} onPress={() => router.replace("/(home)/(tabs)/live-tv")}>
                    {PLAYLIST_TYPE}
                </Text>

                {/* Subtitle */}
                <Text
                    style={[styles.subtitle, { fontSize: s(14), marginBottom: s(20) }]}
                >
                    {PLAYLISTS.length} Playlists
                </Text>

                <View style={{ width: "50%" }}>
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
                                onPress={() => {
                                    setSelectedId(item.id);
                                    // router.push("/(home)");
                                }}
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