// App.js
import { AuthProvider, useAuth } from '@/context/authContext';
import { ProfileContextProvider } from '@/context/profileContext';
import { SpinnerProvider } from '@/context/spinnerContext';
import { Stack, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import  ToastManager  from 'toastify-react-native';

export default function App() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
  }, [error, loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <ProfileContextProvider>
        <SpinnerProvider>
          <ToastManager showCloseIcon={false} showProgressBar={false} />
          <RootLayoutNav />
        </SpinnerProvider>
      </ProfileContextProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{headerShown:false}}>
      {isAuthenticated ? (
        <Tabs>
          <Tabs.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
        </Tabs>
      ) : (
        <>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}
