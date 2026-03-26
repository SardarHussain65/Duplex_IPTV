import { ActionFilledButton, ActionOutlineButton } from "@/components/ui/buttons";
import { Colors, scale as s, width } from "@/constants";
import { useCreatePlaylist } from "@/lib/api/hooks/useCreatePlaylist";
import { useDeviceStore } from "@/lib/store/useDeviceStore";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

const XtremeSetup = () => {
    const router = useRouter();
    const { createPlaylist, loading } = useCreatePlaylist();
    const deviceId = useDeviceStore((state) => state.id);
    const setActivePlaylistId = useDeviceStore((state) => state.setActivePlaylistId);

    const isLargeScreen = width >= 900;
    const contentWidth = isLargeScreen ? width * 0.5 : width * 0.92;

    const [playlistName, setPlaylistName] = useState("");
    const [serverUrl, setServerUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const isFormValid = playlistName.trim() !== "" &&
        serverUrl.trim() !== "" &&
        username.trim() !== "" &&
        password.trim() !== "" &&
        !loading;

    const handleConfirm = async () => {
        if (isFormValid && deviceId) {
            try {
                const newPlaylist = await createPlaylist({
                    deviceId,
                    isPinRequired: false,
                    name: playlistName,
                    type: "XC",
                    url: serverUrl,
                    username,
                    password,
                });
                if (newPlaylist?.id) {
                    setActivePlaylistId(newPlaylist.id);
                }
                router.push("/(auth)/deviceVerification");
            } catch (error: any) {
                Alert.alert("Error", error.message || "Failed to add playlist");
            }
        } else if (!deviceId) {
            Alert.alert("Error", "Device ID not found. Please try again.");
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <ScrollView
                style={{ flex: 1, backgroundColor: Colors.dark.background }}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.content, { width: contentWidth }]}>
                    {/* Logo */}
                    <Image
                        source={require("../../assets/images/ActivationImage.png")}
                        style={{ width: s(60), height: s(60), marginBottom: s(20) }}
                        contentFit="contain"
                    />

                    {/* Title */}
                    <Text style={[styles.title, { fontSize: s(20), marginBottom: s(6) }]}>
                        Add Xtreme Codes Playlist
                    </Text>

                    {/* Subtitle */}
                    <Text style={[styles.subtitle, { fontSize: s(13), marginBottom: s(24) }]}>
                        Enter the playlist credentials to add up in the device.
                    </Text>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { fontSize: s(12) }]}>Playlist Name</Text>
                            <TextInput
                                style={[styles.input, { fontSize: s(14), height: s(46) }]}
                                placeholder="Enter Playlist Name"
                                placeholderTextColor={Colors.dark[6]}
                                value={playlistName}
                                onChangeText={setPlaylistName}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { fontSize: s(12) }]}>Server/DNS</Text>
                            <TextInput
                                style={[styles.input, { fontSize: s(14), height: s(46) }]}
                                placeholder="Enter URL"
                                placeholderTextColor={Colors.dark[6]}
                                value={serverUrl}
                                onChangeText={setServerUrl}
                                autoCapitalize="none"
                                keyboardType="url"
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { fontSize: s(12) }]}>Username</Text>
                            <TextInput
                                style={[styles.input, { fontSize: s(14), height: s(46) }]}
                                placeholder="Enter Username"
                                placeholderTextColor={Colors.dark[6]}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { fontSize: s(12) }]}>Password</Text>
                            <TextInput
                                style={[styles.input, { fontSize: s(14), height: s(46) }]}
                                placeholder="Enter Password"
                                placeholderTextColor={Colors.dark[6]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!loading}
                            />
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={[styles.actionsContainer, { marginTop: s(20) }]}>
                        <View style={{ flex: 1, marginRight: s(12) }}>
                            <ActionOutlineButton
                                onPress={handleCancel}
                                disabled={loading}
                                style={{
                                    backgroundColor: '#1C1C1E',
                                    borderColor: '#3A3A3C',
                                    height: s(48),
                                    borderRadius: s(10),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                Cancel
                            </ActionOutlineButton>
                        </View>

                        <View style={{ flex: 1.5 }}>
                            <ActionFilledButton
                                onPress={handleConfirm}
                                disabled={!isFormValid}
                                style={{
                                    backgroundColor: isFormValid ? '#FFFFFF' : Colors.dark[8],
                                    height: s(48),
                                    borderRadius: s(10),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                                textColor={isFormValid ? '#000000' : Colors.dark[6]}
                            >
                                {loading ? (
                                    <ActivityIndicator color={Colors.dark[1]} />
                                ) : (
                                    "Confirm"
                                )}
                            </ActionFilledButton>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        backgroundColor: Colors.dark.background,
    },
    content: {
        alignItems: "center",
    },
    title: {
        fontWeight: "700",
        color: Colors.dark[1],
        textAlign: "center",
    },
    subtitle: {
        color: Colors.dark[6],
        textAlign: "center",
    },
    form: {
        width: "100%",
    },
    inputGroup: {
        marginBottom: 16,
        width: "100%",
    },
    label: {
        color: Colors.dark[3],
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        backgroundColor: Colors.dark[10],
        borderWidth: 1,
        borderColor: Colors.dark[8],
        borderRadius: 8,
        paddingHorizontal: 16,
        color: Colors.dark[1],
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    }
});

export default XtremeSetup;
