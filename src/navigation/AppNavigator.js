import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useTheme } from '../theme/useTheme';
import { useAuthStore } from '../store/useAuthStore';
import { loadPersistedAuth, persistAuth } from '../services/authService';
import { getCurrentUser } from '../services/api';
import { SwipeableTabView } from './SwipeableTabView';
import { LoginScreen } from '../screens/LoginScreen';
import { PlanningFlowScreen } from '../screens/PlanningFlowScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { GeneratedPlanScreen } from '../screens/GeneratedPlanScreen';
import { PlanDetailScreen } from '../screens/PlanDetailScreen';

const Stack = createStackNavigator();

const AppStack = ({ colors }) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.mainBackground },
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen name="MainTabs" component={SwipeableTabView} />
    <Stack.Screen
      name="PlanningFlow"
      component={PlanningFlowScreen}
      options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
    />
    <Stack.Screen
      name="Loading"
      component={LoadingScreen}
      options={{ ...TransitionPresets.FadeFromBottomAndroid }}
    />
    <Stack.Screen name="GeneratedPlan" component={GeneratedPlanScreen} />
    <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
  </Stack.Navigator>
);

const AuthStack = ({ colors }) => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.mainBackground } }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  const { colors, isDark } = useTheme();
  const { user, isLoading, setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    loadPersistedAuth()
      .then(async (saved) => {
        if (!saved) {
          setLoading(false);
          return;
        }
        setAuth(saved.user, saved.token);
        if (saved.token === 'demo') return;
        try {
          const { user: freshUser } = await getCurrentUser();
          setAuth(freshUser, saved.token);
          await persistAuth(saved.token, freshUser);
        } catch {}
      })
      .catch(() => setLoading(false));
  }, []);

  const navTheme = {
    dark: isDark,
    colors: {
      primary: colors.primaryAccent,
      background: colors.mainBackground,
      card: colors.mainBackground,
      text: colors.textPrimary,
      border: colors.inputSurface,
      notification: colors.primaryAccent,
    },
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.mainBackground, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primaryAccent} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {user ? <AppStack colors={colors} /> : <AuthStack colors={colors} />}
    </NavigationContainer>
  );
};
