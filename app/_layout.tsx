import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth flow — login, playlist setup, device verification */}
      {/* <Stack.Screen name="(auth)" /> */}
      {/* Main app — home screen with all 6 tabs */}
      <Stack.Screen name="(home)" />
    </Stack>
  );
}
