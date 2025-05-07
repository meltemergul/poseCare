import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#0D47A1',

                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <Stack.Screen name="index" options={{ headerShown: true, title: 'Ana Sayfa' }} />
            <Stack.Screen name="cameraScreen" options={{ headerShown: true, title: 'PoseCare' }} />
        </Stack>
    );
}
