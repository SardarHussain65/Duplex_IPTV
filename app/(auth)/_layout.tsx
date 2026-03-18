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
        name="xtremeSetup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="playlistSource"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AuthLayout;