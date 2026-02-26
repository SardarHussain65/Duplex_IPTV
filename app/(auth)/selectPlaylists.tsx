import { PlaylistButton } from "@/components/ui/buttons/PlaylistButton";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, scale as s, width } from "../../constants";

type PlaylistType = "m3u" | "m3u8" | "xtream";

const PLAYLIST_OPTIONS: {
    id: PlaylistType;
    label: string;
    count: number;
}[] = [
        { id: "m3u", label: "M3U", count: 6 },
        { id: "m3u8", label: "M3U8", count: 3 },
        { id: "xtream", label: "Xtream Code", count: 3 },
    ];

const SelectPlaylistScreen = () => {
    const [selected, setSelected] = useState<PlaylistType>("m3u");

    const isLarge = width >= 900;
    const circleSize = s(isLarge ? 130 : 90);

    return (
        <View style={styles.container}>
            <View style={[styles.content, { width: isLarge ? width * 0.6 : width * 0.92 }]}>
                {/* Logo */}
                <Image
                    source={require("../../assets/images/ActivationImage.png")}
                    style={{ width: s(60), height: s(60), marginBottom: s(20) }}
                    contentFit="contain"
                />

                {/* Title */}
                <Text style={[styles.title, { fontSize: s(24), marginBottom: s(8) }]} onPress={() => router.replace("/playlistList")}>
                    Select Playlist Source
                </Text>

                {/* Subtitle */}
                <Text style={[styles.subtitle, { fontSize: s(14), marginBottom: s(50) }]}>
                    Choose the type of playlist you want to use
                </Text>

                {/* Options Row */}
                <View style={styles.optionsRow} >
                    {PLAYLIST_OPTIONS.map((option, index) => (
                        <PlaylistButton
                            key={option.id}
                            label={option.label}
                            count={option.count}
                            isSelected={selected === option.id}
                            onPress={() => setSelected(option.id)}
                            circleSize={circleSize}
                            hasTVPreferredFocus={index === 0}

                        />
                    ))}
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
    },
    title: {
        color: "#FFFFFF",
        fontWeight: "700",
        textAlign: "center",
    },
    subtitle: {
        color: "#9CA3AF",
        textAlign: "center",
    },
    optionsRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: s(40),
    },
});

export default SelectPlaylistScreen;