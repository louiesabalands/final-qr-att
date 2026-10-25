import { Stack } from 'expo-router';
import { ThemeProvider } from '@/lib/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Isolated Full Screen Views with no Nav Bars */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="awaiting-approval" />

        {/* This path handles our actual tab system layout group explicitly */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
