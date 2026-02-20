import { TopNavBar } from "@/components/navigation/TopNavBar";
import { TabContextProvider } from "@/context/TabContext";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export const HomeLayout = () => {
    return (
        <TabContextProvider>
            <View style={styles.container}>
                <TopNavBar />
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
                    </Stack>
                </View>
            </View>
        </TabContextProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141416',
    },
    content: {
        flex: 1,
    },
});

export default HomeLayout;