import { ApolloProvider } from "@apollo/client";
import { apolloClient, queryClient } from "@/lib/api";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import "@/lib/i18n/i18n";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Auth flow — activation, playlist setup, device verification */}
            <Stack.Screen name="(auth)" />
            {/* Main app — home screen with all tabs */}
            <Stack.Screen name="(home)" />
            {/* Temporary diagnostic test screen */}
            <Stack.Screen name="test-player" />
          </Stack>
        </AuthProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
}
