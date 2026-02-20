import { Stack } from "expo-router";

export const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="deviceVerification"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="selectPlaylists"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="test"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="playlistList"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AuthLayout;