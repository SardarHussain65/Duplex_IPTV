import { ActionOutlineButton } from "@/components/ui/buttons/ActionOutlineButton";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors, scale as s, width } from "../../constants";

type StepStatus = "pending" | "loading" | "success" | "error";

interface SyncStep {
    id: string;
    label: string;
    status: StepStatus;
}

const INITIAL_STEPS: SyncStep[] = [
    { id: "fetch", label: "Fetching playlist...", status: "loading" },
    { id: "load", label: "Loading channels & content...", status: "pending" },
    { id: "prepare", label: "Preparing home screen...", status: "pending" },
];


//I have make somme changes for just testing purposes

const DeviceVerification = () => {
    const router = useRouter();
    const [steps, setSteps] = useState<SyncStep[]>(INITIAL_STEPS);
    const [status, setStatus] = useState<"syncing" | "error" | "success">("syncing");
    const [globalError, setGlobalError] = useState<string | null>(null);

    const isLargeScreen = width >= 900;
    const contentWidth = isLargeScreen ? s(400) : s(320);

    const startSyncing = () => {
        setStatus("syncing");
        setGlobalError(null);
        setSteps(INITIAL_STEPS);
    };

    useEffect(() => {
        if (status !== "syncing") return;

        const processStep = async (index: number) => {
            if (index >= steps.length) {
                setStatus("success");
                return;
            }

            const stepId = steps[index].id;

            // Simulation Delay
            const delay = 1500 + Math.random() * 1000;

            const timer = setTimeout(() => {
                // TEST: Simulated Errors
                // 20% chance of error for demo
                const isError = Math.random() < 0.1;

                if (isError) {
                    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: "error" } : s));
                    setGlobalError(stepId === "fetch" ? "Invalid playlist URL, please check your link." : "No content was found.");
                    setStatus("error");
                    return;
                }

                // Success for this step
                setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: "success", label: getSuccessLabel(stepId) } : s));

                // Move to next step
                if (index + 1 < steps.length) {
                    const nextId = steps[index + 1].id;
                    setSteps(prev => prev.map(s => s.id === nextId ? { ...s, status: "loading" } : s));
                    processStep(index + 1);
                } else {
                    setStatus("success");
                }
            }, delay);

            return () => clearTimeout(timer);
        };

        processStep(0);
    }, [status]);

    const getSuccessLabel = (id: string) => {
        switch (id) {
            case 'fetch': return 'Playlist fetched!';
            case 'load': return 'Channels & content loaded!';
            case 'prepare': return 'Home screen ready!';
            default: return '';
        }
    };

    useEffect(() => {
        if (status !== "success") return;
        const timer = setTimeout(() => {
            router.push("/(home)/(tabs)");
        }, 1500);
        return () => clearTimeout(timer);
    }, [status]);

    const renderStepIcon = (stepStatus: StepStatus) => {
        switch (stepStatus) {
            case 'loading':
                return <ActivityIndicator size="small" color={Colors.gray[400]} style={styles.stepIcon} />;
            case 'success':
                return <Ionicons name="checkmark" size={s(16)} color="#4CAF50" style={styles.stepIcon} />;
            case 'error':
                return <Ionicons name="close" size={s(16)} color="#F44336" style={styles.stepIcon} />;
            default:
                return <View style={[styles.stepIcon, { width: s(16) }]} />;
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/ActivationImage.png")}
                style={styles.logo}
                contentFit="contain"
            />

            <View style={[styles.box, { width: contentWidth, padding: s(24), borderRadius: s(16) }]}>
                <Text style={[styles.boxTitle, { fontSize: s(16), marginBottom: s(16) }]}>
                    Syncing Content
                </Text>
                <View style={styles.divider} />

                <View style={styles.stepsContainer}>
                    {steps.map((step) => (
                        <View key={step.id} style={styles.stepRow}>
                            <View style={styles.iconWrapper}>
                                {renderStepIcon(step.status)}
                            </View>
                            <Text style={[
                                styles.stepLabel,
                                { fontSize: s(14) },
                                step.status === 'success' && styles.successStepText,
                                step.status === 'error' && styles.errorStepText
                            ]}>
                                {step.status === 'error' ? globalError : step.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {status === "error" && (
                    <View style={styles.buttonRow}>
                        <ActionOutlineButton
                            onPress={() => router.replace("/(auth)")}
                            style={styles.actionButton}
                            textColor="#ffffff"
                        >
                            Back to Main
                        </ActionOutlineButton>
                        <ActionOutlineButton
                            onPress={startSyncing}
                            style={[styles.actionButton, styles.retryButton]}
                            textColor="#000000"
                        >
                            Retry Sync
                        </ActionOutlineButton>
                    </View>
                )}
            </View>

            <View style={[styles.footer, { marginTop: s(24) }]}>
                {status === "success" ? (
                    <Text style={[styles.successFooterText, { fontSize: s(13) }]}>
                        All set! Opening your dashboard...
                    </Text>
                ) : status === "syncing" && (
                    <Text style={[styles.loadingFooterText, { fontSize: s(13) }]}>
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
        width: s(80),
        height: s(80),
        marginBottom: s(40),
    },
    box: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    boxTitle: {
        color: "#FFFFFF",
        fontWeight: "700",
        textAlign: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        marginBottom: s(20),
        width: "100%",
    },
    stepsContainer: {
        width: "100%",
        gap: s(14),
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconWrapper: {
        width: s(24),
        alignItems: "center",
        justifyContent: "center",
        marginRight: s(10),
    },
    stepIcon: {
        // sizing handled by icon/indicator
    },
    stepLabel: {
        color: Colors.gray[400],
        flex: 1,
    },
    successStepText: {
        color: "#FFFFFF",
    },
    errorStepText: {
        color: "#F44336",
    },
    footer: {
        alignItems: "center",
    },
    loadingFooterText: {
        color: Colors.gray[500],
        fontStyle: "italic",
    },
    successFooterText: {
        color: "#4CAF50",
        fontWeight: "600",
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: s(28),
        width: '100%',
        alignItems: "center",
        gap: s(20),
    },
    actionButton: {

    },
    retryButton: {
        backgroundColor: "#FFFFFF",
    }
});

export default DeviceVerification;