import { TopNavBar } from "@/components/navigation/TopNavBar";
import { ParentalPinModal } from "@/components/ui/modals/ParentalPinModal";
import { TabContextProvider } from "@/context/TabContext";
import { Stack, useSegments } from "expo-router";
import { StyleSheet, View } from "react-native";

export const HomeLayout = () => {
    const segments = useSegments() as string[];
    const isPlayer = segments.includes('VideoPlayerScreen');

    return (
        <TabContextProvider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Stack>
                        <Stack.Screen
                            name="index"
                            options={{
                                headerTitle: "Main Screen",
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="ChannelDetailScreen"
                            options={{
                                headerTitle: "Channel Detail",
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="MovieDetailScreen"
                            options={{
                                headerTitle: "Movie Detail",
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="SeriesDetailScreen"
                            options={{
                                headerTitle: "Series Detail",
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="VideoPlayerScreen"
                            options={{
                                headerTitle: "Player",
                                headerShown: false,
                            }}
                        />
                    </Stack>
                </View>
                {!isPlayer && (
                    <View style={styles.navWrapper}>
                        <TopNavBar />
                    </View>
                )}
                <ParentalPinModal />
            </View>
        </TabContextProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141416',
    },
    navWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    content: {
        flex: 1,
    },
});

export default HomeLayout;