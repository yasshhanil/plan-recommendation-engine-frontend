import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from '@tamagui/core';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import config from './tamagui.config';
import { RootNavigator } from './src/navigation/AppNavigator';
import { useThemeStore } from './src/store/useThemeStore';
import { getPlans } from './src/services/api';

const queryClient = new QueryClient();

const fetchPlans = async () => {
  const response = await getPlans();
  if (!response.success) throw new Error('Failed to load plans');
  return response.plans;
};

function AppContent() {
  const { isDark } = useThemeStore();
  const qc = useQueryClient();

  useEffect(() => {
    qc.prefetchQuery({ queryKey: ['saved-plans'], queryFn: fetchPlans });
  }, []);

  const bgColor = isDark ? '#1A1B24' : '#F5F7FA';

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={bgColor} />
      <RootNavigator />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TamaguiProvider config={config} defaultTheme="dark">
          <QueryClientProvider client={queryClient}>
            <AppContent />
          </QueryClientProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
