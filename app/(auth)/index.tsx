import { Colors, scale as s, width } from "@/constants";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View
} from "react-native";


// ─── Free Trial Banner (pure code, no image) ─────────────────────────────────
const FreeTrialBanner = ({ s }: { s: (n: number) => number }) => (
    <View
        style={[
            bannerStyles.wrapper,
            {
                borderRadius: s(10),
                paddingVertical: s(12),
                paddingLeft: s(18),
                marginBottom: s(16),
            },
        ]}
    >

        {/* Text block */}
        <View style={bannerStyles.textBlock}>
            <Text style={[bannerStyles.title, { fontSize: s(14) }]}>
                7-Day Free Trial Available
            </Text>
            <Text style={[bannerStyles.subtitle, { fontSize: s(11) }]}>
                Activate now and enjoy. No credit card required to start trial.
            </Text>
        </View>

        {/* Shield / crown icon on the right */}
        <View style={[bannerStyles.iconWrapper, { width: s(44), height: s(44), borderRadius: s(10) }]}>
            <Image
                source={require("../../assets/images/trail.png")}
                style={{ width: s(44), height: s(44), borderRadius: s(10) }}
                contentFit="contain"
            />
        </View>
    </View>
);

const bannerStyles = StyleSheet.create({
    wrapper: {
        width: "100%",
        backgroundColor: `${Colors.primary[950]}29`,
        flexDirection: "row",
        alignItems: "center",
    },
    accentBar: {
        width: 4,
        alignSelf: "stretch",
        backgroundColor: Colors.primary[800],
    },
    textBlock: {
        flex: 1,
    },
    title: {
        color: Colors.dark[1],
        fontWeight: "700",
        marginBottom: 3,
    },
    subtitle: {
        color: Colors.primary[500],
    },
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
});
// ─────────────────────────────────────────────────────────────────────────────

const ActivationScreen = () => {
    const deviceInfo = useDeviceInfo();
    const isLargeScreen = width >= 900;
    const contentWidth = isLargeScreen ? width * 0.5 : width * 0.92;

    return (
        <View style={styles.container}>
            <View style={[styles.content, { width: contentWidth }]}>
                {/* Logo */}
                <Image
                    source={require("../../assets/images/ActivationImage.png")}
                    style={{ width: s(60), height: s(60), marginBottom: s(10) }}
                    contentFit="contain"
                />

                {/* Title */}
                <Text style={[styles.title, { fontSize: s(20), marginBottom: s(6) }]} onPress={() => router.push("/(auth)/deviceVerification")}>
                    Device Activation
                </Text>

                {/* Instructions */}
                <Text style={[styles.instructions, { fontSize: s(13), lineHeight: s(20), marginBottom: s(14) }]}>
                    Go to Web Portal{" "}
                    <Text style={styles.link}>(www.portal.duplex.tv/activate)</Text>.
                    {" "}Enter your Mac Address and Device ID. Sync Playlist to start watching
                </Text>

                {/* ✅ Free Trial Banner — pure code, no image asset */}
                <FreeTrialBanner s={s} />

                {/* Info Grid */}
                <View
                    style={[
                        styles.infoGrid,
                        { marginBottom: s(16), flexDirection: isLargeScreen ? "row" : "column" },
                    ]}
                >

                    <View style={{ flex: 1 }}>
                        <View style={[styles.infoBox, { padding: s(12), marginBottom: s(10), borderRadius: s(10) }]}>
                            <Text style={[styles.boxLabel, { fontSize: s(12) }]}>Mac Address</Text>
                            <Text style={[styles.boxValue, { fontSize: s(20) }]}>{deviceInfo.macAddress}</Text>
                        </View>
                        <View style={[styles.infoBox, { padding: s(12), borderRadius: s(10) }]}>
                            <View style={styles.boxHeader}>
                                <Ionicons name="key-outline" size={s(14)} color="#9BA1A6" />
                                <Text style={[styles.boxLabel, { fontSize: s(12), marginLeft: s(6) }]}>
                                    Device ID
                                </Text>
                            </View>
                            <Text style={[styles.boxValue, { fontSize: s(20) }]}>{deviceInfo.deviceId}</Text>
                        </View>
                    </View>

                    <View style={[styles.verticalDivider, { marginHorizontal: s(24) }]} />

                    <View style={styles.qrSection}>
                        <Image
                            source={require("../../assets/images/qr.png")}
                            style={{ width: s(120), height: s(120), marginBottom: s(8) }}
                        />
                        <Text style={[styles.qrText, { fontSize: s(13) }]}>Scan to Activate</Text>
                    </View>


                </View>

                {/* Warning */}
                <View style={[styles.warningContainer, { marginBottom: s(14) }]}>
                    <Ionicons name="information-circle-outline" size={s(18)} color="#FF5252" />
                    <Text style={[styles.warningText, { fontSize: s(12), lineHeight: s(18), marginLeft: s(8) }]}>
                        This app does not provide any content such as live channels or VODs.
                        {" "}You must enter your own content to proceed.
                    </Text>
                </View>

                {/* Loading Status */}
                <View style={styles.statusContainer}>
                    <ActivityIndicator size="small" color="#9BA1A6" />
                    <Text style={[styles.statusText, { fontSize: s(14), marginLeft: s(10) }]}>
                        Waiting for activation...
                    </Text>
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
        fontWeight: "600",
        color: Colors.dark[1],
        textAlign: "center",
    },
    instructions: {
        color: Colors.dark[2],
        textAlign: "center",
        paddingHorizontal: 8,
    },
    link: {
        color: Colors.primaryBlue[900],
    },
    infoGrid: {
        width: "100%",
        alignItems: "center",
    },
    infoBox: {
        backgroundColor: Colors.dark[10],
        borderWidth: 1,
        borderColor: Colors.dark[8],
        width: "100%",
    },
    boxHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    boxLabel: {
        color: Colors.dark[3],
        marginBottom: 2,
    },
    boxValue: {
        fontWeight: "700",
        color: Colors.dark[3],
        letterSpacing: 2,
    },
    verticalDivider: {
        width: 1,
        alignSelf: "stretch",
        backgroundColor: Colors.dark[8],
    },
    horizontalDivider: {
        width: "100%",
        height: 1,
        backgroundColor: Colors.dark[8],
    },
    qrSection: {
        alignItems: "center",
        justifyContent: "center",
    },
    qrPlaceholder: {
        backgroundColor: Colors.dark[3],
        padding: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    qrText: {
        color: Colors.dark[3],
    },
    warningContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
        paddingHorizontal: 4,
    },
    warningText: {
        color: Colors.error[400],
        flex: 1,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusText: {
        color: Colors.dark[3],
    },
    bottomIndicator: {
        position: "absolute",
        bottom: 16,
        alignItems: "center",
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.dark[3],
        marginBottom: 6,
    },
    line: {
        width: 2,
        height: 32,
        backgroundColor: Colors.dark[3],
        opacity: 0.4,
    },
});

export default ActivationScreen;


// import ButtonSystemShowcase from "@/components/ui/ButtonExamples";

// export default function Index() {

//     return <ButtonSystemShowcase />
// }
