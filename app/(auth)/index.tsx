import { ActionFilledButton, ActionOutlineButton } from "@/components/ui/buttons";
import { Colors, scale as s, width } from "@/constants";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import { useGenerateDeviceId } from "@/lib/api";
import { useDeviceStore } from "@/lib/store/useDeviceStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    BackHandler,
    StyleSheet,
    Text,
    View
} from "react-native";
import QRCode from 'react-native-qrcode-svg';

type ScreenState = 'intro' | 'trial' | 'expired' | 'blocked';


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
            <Text style={[bannerStyles.subtitle, { fontSize: s(12) }]}>
                Enjoy your 7-day free trial! Activation will be required when the trial ends.
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
    const { generateDeviceId, deviceId, deviceKey, loading: deviceIdLoading } = useGenerateDeviceId();
    const { isTrial, hasUsedTrial, subscription } = useDeviceStore();
    const isLargeScreen = width >= 900;
    const contentWidth = isLargeScreen ? width * 0.5 : width * 0.92;

    // Derived state from store/API
    const [screenState, setScreenState] = useState<ScreenState>(isTrial ? 'trial' : 'intro');

    useEffect(() => {
        if (deviceInfo.macAddress && 
            deviceInfo.macAddress !== 'LOADING...' && 
            deviceInfo.macAddress !== 'ERROR') {
            generateDeviceId(deviceInfo.macAddress);
        }
    }, [deviceInfo.macAddress]);

    useEffect(() => {
        if (isTrial) {
            setScreenState('trial');
        } else {
            setScreenState('intro');
        }
    }, [isTrial]);

    const calculateExpiryDays = () => {
        if (!subscription?.endDate) return 0;
        const end = new Date(subscription.endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const expiryDays = calculateExpiryDays();

    const handleContinue = () => {
        if (screenState === 'trial') {
            router.push("/(auth)/playlistSource");
        } else {
            router.push("/(auth)/deviceVerification");
        }
    };

    const handleExit = () => {
        BackHandler.exitApp();
    };

    const renderHeader = () => {
        switch (screenState) {
            case 'trial':
                return `Your subscription will expire in ${expiryDays} days`;
            case 'expired':
                return "License Expired!";
            case 'blocked':
                return "Device Blocked!";
            default:
                return "Your MAC is Activated!";
        }
    };

    const renderInstructions = () => {
        if (screenState === 'expired') {
            return (
                <Text style={[styles.instructions, { fontSize: s(13), lineHeight: s(18), marginBottom: s(24) }]}>
                    Please contact your license reseller to activate Or visit{" "}
                    <Text style={styles.link}>www.duplexnew.tv/activate</Text> for more info.{"\n"}
                    <Text style={{ color: Colors.dark[3] }}>You can activate 6-Months | 1 Year | Lifetime plan.</Text>
                </Text>
            );
        }
        if (screenState === 'blocked') {
            return (
                <Text style={[styles.instructions, { fontSize: s(14), lineHeight: s(20), marginBottom: s(24) }]}>
                    Please contact your license reseller/admin to unblock your device.
                </Text>
            );
        }
        return (
            <Text style={[styles.instructions, { fontSize: s(14), lineHeight: s(20), marginBottom: s(14) }]}>
                Visit our website <Text style={styles.link}>www.duplexnew.tv/manageplaylists</Text> to add/manage playlists.{" "}
            </Text>
        );
    };

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
                <Text style={[styles.title, { fontSize: s(20), marginBottom: s(6) }]} onPress={() => router.replace("/deviceVerification")}>
                    {renderHeader()}
                </Text>

                {/* Instructions */}
                {renderInstructions()}

                {/* ✅ Free Trial Banner — shown only in intro state */}
                {screenState === 'intro' && <FreeTrialBanner s={s} />}

                {/* Info Grid */}
                {screenState !== 'blocked' && (
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
                                <Text style={[styles.boxValue, { fontSize: s(20) }]}>
                                    {deviceIdLoading ? "LOADING..." : (deviceKey || "N/A")}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.verticalDivider, { marginHorizontal: s(24) }]} />

                        <View style={styles.qrSection}>
                            <View style={{
                                padding: s(8),
                                backgroundColor: '#FFFFFF',
                                borderRadius: s(8),
                                marginBottom: s(8)
                            }}>
                                <QRCode
                                    value={`https://duplex-iptv-website.vercel.app/?mac=${deviceInfo.macAddress}&deviceid=${deviceKey || ''}`}
                                    size={s(110)}
                                    backgroundColor="white"
                                    color="black"
                                />
                            </View>
                            <Text style={[styles.qrText, { fontSize: s(13) }]}>Scan to add playlist</Text>
                        </View>
                    </View>
                )}

                {/* Warning / Secondary Info */}
                <View style={[styles.warningContainer, { marginBottom: s(14) }]}>
                    {screenState === 'intro' ? (
                        <>
                            <Ionicons name="information-circle-outline" size={s(18)} color="#FF5252" />
                            <Text style={[styles.warningText, { fontSize: s(12), lineHeight: s(18), marginLeft: s(8) }]}>
                                This app does not provide any content such as live channels or VODs.
                                {" "}You must enter your own content to proceed.
                            </Text>
                        </>
                    ) : (
                        screenState !== 'blocked' && (
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <Text style={[styles.instructions, { fontSize: s(13) }]}>
                                    Visit our website <Text style={styles.link}>www.duplexnew.tv/manageplaylists</Text> to add/manage playlists.
                                </Text>
                            </View>
                        )
                    )}
                </View>

                {/* Actions */}
                <View style={[styles.actionsContainer, { marginTop: s(10) }]}>
                    {screenState === 'intro' ? (
                        <>
                            <View style={{ flex: 1, marginRight: s(12) }}>
                                <ActionOutlineButton
                                    onPress={() => { }}
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
                                    Refresh
                                </ActionOutlineButton>
                            </View>

                            <View style={{ flex: 1.5 }}>
                                <ActionFilledButton
                                    onPress={() => router.push("/(auth)/xtremeSetup")}
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        height: s(48),
                                        borderRadius: s(10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                    textColor="#000000"
                                >
                                    Quick Setup (Xtreme Codes)
                                </ActionFilledButton>
                            </View>
                        </>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <ActionFilledButton
                                onPress={(screenState === 'expired' || screenState === 'blocked') ? handleExit : handleContinue}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: s(8),
                                    width: '100%',
                                }}
                                textColor="#000000"
                            >
                                {(screenState === 'expired' || screenState === 'blocked') ? "Exit App" : "Continue"}
                            </ActionFilledButton>
                        </View>
                    )}
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

    qrSection: {
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
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    }
});

export default ActivationScreen;


// import ButtonSystemShowcase from "@/components/ui/ButtonExamples";

// export default function Index() {

//     return <ButtonSystemShowcase />
// }
