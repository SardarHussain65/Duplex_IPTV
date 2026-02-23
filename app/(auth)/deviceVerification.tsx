import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SyncingStep } from "../../components/SyncingStep";
import { Colors, scale as s, width } from "../../constants";

type StepStatus = "pending" | "loading" | "success" | "error";

const STEPS = [
    "Device Verification",
    "Fetching playlist...",
    "Loading channels & content...",
    "Preparing home screen...",
];


//I have make somme changes for just testing purposes

const DeviceVerification = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [status, setStatus] = useState<"syncing" | "error" | "success">("syncing");
    const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(Array(STEPS.length).fill("pending"));

    const isLargeScreen = width >= 900;
    const contentWidth = isLargeScreen ? s(320) : s(280);

    const startSyncing = () => {
        setStatus("syncing");
        setStepStatuses(Array(STEPS.length).fill("pending"));
        setCurrentStep(0);
    };

    useEffect(() => {
        if (status !== "syncing") return;

        const timers: NodeJS.Timeout[] = [];

        const processStep = async (index: number) => {
            if (index >= STEPS.length) {
                setStatus("success");
                // Navigate to home after success or let user click
                const timer = setTimeout(() => {
                    // router.replace("/(tabs)"); // Example navigation
                }, 1500);
                timers.push(timer);
                return;
            }

            // Set current step to loading
            setStepStatuses(prev => {
                const copy = [...prev];
                copy[index] = "loading";
                return copy;
            });

            // Simulation Delay
            const delay = index === 0 ? 1500 : 2000 + Math.random() * 1000;

            const timer = setTimeout(() => {
                // TEST: Trigger error at index 1 (Fetching playlist) with 50% chance
                // Change 0.5 to 1.0 to FORCE an error for testing
                if (index === 1 && Math.random() < 0.2) {
                    setStepStatuses(prev => {
                        const copy = [...prev];
                        copy[index] = "error";
                        return copy;
                    });
                    setStatus("error");
                    return;
                }

                // Success for this step
                setStepStatuses(prev => {
                    const copy = [...prev];
                    copy[index] = "success";
                    return copy;
                });
                setCurrentStep(index + 1);
            }, delay);
            timers.push(timer);
        };

        processStep(currentStep);

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [currentStep, status]);

    return (
        <View style={styles.container}>
            {/* Background Logo / Branding */}
            <Image
                source={require("../../assets/images/ActivationImage.png")}
                style={styles.logo}
                contentFit="contain"
            />

            {/* Syncing Box */}
            <View style={[styles.box, { width: contentWidth, padding: s(14), borderRadius: s(12) }]}>
                <Text style={[styles.boxTitle, { fontSize: s(14), marginBottom: s(12) }]}>
                    Syncing Content
                </Text>
                <View style={{ width: "100%", height: 1, backgroundColor: Colors.dark[8], marginBottom: s(12) }} />

                <View style={styles.stepsContainer}>
                    {STEPS.map((step, index) => (
                        <SyncingStep
                            key={step}
                            label={step}
                            status={stepStatuses[index]}
                            errorLabel={
                                stepStatuses[index] === "error"
                                    ? "Content could not be loaded. Please check your connection."
                                    : undefined
                            }
                        />
                    ))}
                </View>

                {/* Status Message */}
                {status === "error" && (
                    <View style={styles.errorContainer}>
                        <Pressable
                            style={[styles.button, { paddingVertical: s(10), borderRadius: s(8) }]}
                            onPress={startSyncing}
                        >
                            <Text style={[styles.buttonText, { fontSize: s(13) }]}>Retry Verification</Text>
                        </Pressable>
                    </View>
                )}

            </View>
            <View style={[styles.footer, { marginTop: s(20) }]}>
                {status === "success" ? (
                    <Text style={[styles.successText, { fontSize: s(12) }]} onPress={() => router.push("/(auth)/selectPlaylists")}>
                        All set! Taking you to the home screen…
                    </Text>
                ) : (
                    <Text style={[styles.loadingText, { fontSize: s(12) }]}>
                        This may take a few moments...
                    </Text>
                )}
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
    logo: {
        width: s(60),
        height: s(60),
        marginBottom: s(24),
    },
    box: {
        backgroundColor: Colors.dark[12],
        borderWidth: 1,
        borderColor: Colors.dark[8],
        alignItems: "center",
    },
    boxTitle: {
        color: Colors.dark[1],
        fontWeight: "700",
        textAlign: "center",
    },
    stepsContainer: {
        width: "100%",
    },
    footer: {
        width: "100%",
        alignItems: "center",
    },
    loadingText: {
        color: Colors.dark[6],
        fontStyle: "italic",
    },
    successText: {
        color: "#07C701",
        fontWeight: "600",
    },
    errorContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: s(12),
    },
    button: {
        backgroundColor: Colors.dark[1],
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: Colors.dark.background,
        fontWeight: "700",
    },
});

export default DeviceVerification;