import { EnterPinModal } from "@/components/ui/modals/EnterPinModal";
import { Colors, scale as s, width } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface Playlist {
    id: string;
    name: string;
    urlOrInfo: string;
    type: "Playlist URL" | "Xtreme Codes";
    isProtected?: boolean;
}

const MOCK_PLAYLISTS: Playlist[] = [
    {
        id: "1",
        name: "Playlist 1",
        urlOrInfo: "This playlist is protected.",
        type: "Playlist URL",
        isProtected: true,
    },
    {
        id: "2",
        name: "Playlist 2",
        urlOrInfo: "https://example.com/live/stream.m3u8",
        type: "Playlist URL",
    },
    {
        id: "3",
        name: "Playlist 3",
        urlOrInfo: "https://example.com/live/stream.m3u8",
        type: "Xtreme Codes",
    },
];

const PlaylistCard = ({ item, isFocused, onFocus, onPress }: {
    item: Playlist;
    isFocused: boolean;
    onFocus: () => void;
    onPress: () => void;
}) => (
    <Pressable
        onFocus={onFocus}
        onPress={onPress}
        style={[
            styles.card,
            {
                backgroundColor: isFocused ? Colors.dark[8] : Colors.dark[10],
                borderColor: isFocused ? Colors.dark[5] : Colors.dark[8],
                padding: s(16),
                borderRadius: s(12),
                marginBottom: s(12),
            },
        ]}
    >
        <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
                <Ionicons name="layers-outline" size={s(20)} color={isFocused ? "#FFFFFF" : "#9BA1A6"} />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { fontSize: s(16), color: isFocused ? "#FFFFFF" : "#FFFFFF" }]}>
                    {item.name}
                </Text>
                <Text style={[styles.cardSubtitle, { fontSize: s(12), color: isFocused ? "#E5E7EB" : "#9CA3AF" }]} numberOfLines={1}>
                    {item.urlOrInfo}
                </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: Colors.dark[7] }]}>
                <Ionicons name={item.type === "Xtreme Codes" ? "flash-outline" : "list-outline"} size={s(10)} color="#9BA1A6" />
                <Text style={[styles.tagText, { fontSize: s(10) }]}>{item.type}</Text>
            </View>
        </View>
    </Pressable>
);

const PlaylistSourceScreen = () => {
    const router = useRouter();
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const [pendingPlaylistId, setPendingPlaylistId] = useState<string | null>(null);
    const isLargeScreen = width >= 900;

    const handlePlaylistPress = (item: Playlist) => {
        if (item.isProtected) {
            setPendingPlaylistId(item.id);
            setPinModalVisible(true);
        } else {
            router.push("/(home)/(tabs)");
        }
    };

    const handlePinSuccess = () => {
        setPinModalVisible(false);
        setPendingPlaylistId(null);
        router.push("/(home)/(tabs)");
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, { width: isLargeScreen ? width * 0.75 : width * 0.92 }]}>
                {/* Header */}
                <Image
                    source={require("../../assets/images/ActivationImage.png")}
                    style={{ width: s(60), height: s(60), marginBottom: s(20) }}
                    contentFit="contain"
                />
                <Text style={[styles.title, { fontSize: s(24), marginBottom: s(8) }]}>
                    Select Playlist Source
                </Text>
                <Text style={[styles.subtitle, { fontSize: s(14), marginBottom: s(40) }]}>
                    Select an existing playlist or add a new Xtream Codes playlist to configure your device.
                </Text>

                <View style={styles.mainArea}>
                    {/* Left: Playlists List */}
                    <View style={styles.listContainer}>
                        <FlatList
                            data={MOCK_PLAYLISTS}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <PlaylistCard
                                    item={item}
                                    isFocused={focusedIndex === index}
                                    onFocus={() => setFocusedIndex(index)}
                                    onPress={() => handlePlaylistPress(item)}
                                />
                            )}
                            contentContainerStyle={{ paddingRight: s(20) }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.verticalDivider} />

                    {/* Right: Add New */}
                    <View style={styles.addContainer}>
                        <Pressable
                            onPress={() => router.push("/(auth)/xtremeSetup")}
                            onFocus={() => setFocusedIndex(-1)}
                            style={({ focused }) => [
                                styles.addCircle,
                                {
                                    width: s(120),
                                    height: s(120),
                                    borderRadius: s(60),
                                    backgroundColor: focused ? Colors.dark[8] : "transparent",
                                    borderColor: focused ? Colors.dark[5] : Colors.dark[8],
                                    borderWidth: 1.5,
                                    borderStyle: focused ? "solid" : "dashed",
                                },
                            ]}
                        >
                            <Ionicons name="add" size={s(40)} color="#FFFFFF" />
                        </Pressable>
                        <Text style={[styles.addText, { fontSize: s(16), marginTop: s(12) }]}>Add</Text>
                        <Text style={[styles.addSubtitle, { fontSize: s(12) }]}>Xtreme Codes Playlist</Text>
                    </View>
                </View>

                {/* PIN Modal */}
                <EnterPinModal
                    visible={pinModalVisible}
                    onClose={() => setPinModalVisible(false)}
                    onSuccess={handlePinSuccess}
                    expectedPin="0000"
                    title="Enter PIN"
                    buttonText="Continue"
                />
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
        paddingHorizontal: s(20),
    },
    mainArea: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: s(20),
    },
    listContainer: {
        flex: 1.2,
        maxHeight: s(300),
    },
    verticalDivider: {
        width: 1,
        height: s(200),
        backgroundColor: Colors.dark[8],
        marginHorizontal: s(40),
    },
    addContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        borderWidth: 1.5,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardIconBox: {
        width: s(40),
        height: s(40),
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: s(8),
        alignItems: "center",
        justifyContent: "center",
        marginRight: s(12),
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: "600",
    },
    cardSubtitle: {
        marginTop: s(2),
    },
    tag: {
        position: "absolute",
        top: s(-8),
        right: s(-8),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: s(8),
        paddingVertical: s(4),
        borderRadius: s(4),
        gap: s(4),
    },
    tagText: {
        color: "#9BA1A6",
        fontWeight: "500",
    },
    addCircle: {
        alignItems: "center",
        justifyContent: "center",
    },
    addText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    addSubtitle: {
        color: "#9CA3AF",
    },
});

export default PlaylistSourceScreen;
