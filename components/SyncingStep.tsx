import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors, scale as s } from "../constants";

type StepStatus = "pending" | "loading" | "success" | "error";

interface SyncingStepProps {
    label: string;
    status: StepStatus;
    errorLabel?: string;
}

export const SyncingStep = ({ label, status, errorLabel }: SyncingStepProps) => {
    const renderIcon = () => {
        switch (status) {
            case "loading":
                return <ActivityIndicator size={s(16)} color={Colors.dark[3]} />;
            case "success":
                return <Ionicons name="checkmark" size={s(16)} color={Colors.primary[900]} />;
            case "error":
                return <Ionicons name="close" size={s(16)} color={Colors.error[600]} />;
            default:
                return (
                    <View
                        style={[
                            styles.circle,
                            { width: s(12), height: s(12), borderRadius: s(12) / 2, borderWidth: 1, borderColor: Colors.dark[7] },
                        ]}
                    />
                );
        }
    };

    const getTextColor = () => {
        if (status === "pending") return Colors.dark[7];
        return Colors.dark[1];
    };

    return (
        <View style={[styles.container, { marginBottom: s(8) }]}>
            <View style={[styles.iconWrapper, { width: s(24) }]}>
                {renderIcon()}
            </View>
            <View style={styles.textWrapper}>
                <Text style={[styles.label, { fontSize: s(14), color: getTextColor() }]}>
                    {label}
                </Text>
                {status === "error" && errorLabel && (
                    <Text style={[styles.errorLabel, { fontSize: s(11), color: Colors.error[400] }]}>
                        {errorLabel}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
        marginTop: 2,
    },
    textWrapper: {
        flex: 1,
    },
    circle: {
        // borderRadius: 8,
    },
    label: {
        fontWeight: "500",
    },
    errorLabel: {
        marginTop: 2,
        fontWeight: "400",
    },
});
