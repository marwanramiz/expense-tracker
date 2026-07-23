import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import Login from '@/Login';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('jwt');
      setLoggedIn(!!token);
      setCheckingAuth(false);
      SplashScreen.hideAsync();
    })();
  }, []);

  if (checkingAuth) {
    return null; // splash screen stays visible until this resolves
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {loggedIn ? <AppTabs /> : <Login onLoginSuccess={() => setLoggedIn(true)} />}
    </ThemeProvider>
  );
}