import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, fontSize, radius } from '../theme/constants';
import { useTheme } from '../theme/useTheme';
import { useAuthStore } from '../store/useAuthStore';
import { signInWithGoogle, signInWithApple, persistAuth } from '../services/authService';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth client IDs — console.cloud.google.com
const GOOGLE_WEB_CLIENT_ID = '872602560767-r03fqbjr3uhcdgqdbhph85jvd15efq22.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '872602560767-2mi5csvm4grb6fchi1j0kuflohmec8tr.apps.googleusercontent.com';
// const GOOGLE_ANDROID_CLIENT_ID = 'TODO_ANDROID_CLIENT_ID.apps.googleusercontent.com';

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

// iOS uses the iOS client ID so the redirect is the reverse-client-ID scheme,
// which Google accepts without needing it registered in Cloud Console.
const googleClientId = Platform.OS === 'ios' ? GOOGLE_IOS_CLIENT_ID : GOOGLE_WEB_CLIENT_ID;
const googleRedirectUri = Platform.OS === 'web'
  ? 'http://localhost:8081'
  : Platform.OS === 'ios'
    ? 'com.googleusercontent.apps.872602560767-2mi5csvm4grb6fchi1j0kuflohmec8tr:/oauth2redirect/google'
    : AuthSession.makeRedirectUri({ scheme: 'tryouttie' });

export const LoginScreen = () => {
  const { colors } = useTheme();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(null); // 'google' | 'apple' | null

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: googleClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: googleRedirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    GOOGLE_DISCOVERY,
  );

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleCode(response.params.code, request?.codeVerifier);
    } else if (response?.type === 'error' || response?.type === 'dismiss') {
      setLoading(null);
    }
  }, [response]);

  const handleGoogleCode = async (code, codeVerifier) => {
    try {
      const { token, user } = await signInWithGoogle(code, googleRedirectUri, codeVerifier);
      await persistAuth(token, user);
      setAuth(user, token);
    } catch {
      Alert.alert('Sign in failed', 'Could not sign in with Google. Please try again.');
      setLoading(null);
    }
  };

  const handleGooglePress = async () => {
    setLoading('google');
    try {
      await promptAsync();
    } catch {
      setLoading(null);
    }
  };

  const handleApplePress = async () => {
    setLoading('apple');
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { token, user } = await signInWithApple(
        credential.identityToken,
        credential.fullName,
      );
      await persistAuth(token, user);
      setAuth(user, token);
    } catch (e) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Sign in failed', 'Could not sign in with Apple. Please try again.');
      }
      setLoading(null);
    }
  };

  const providerButton = (label, onPress, isLoading) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!!loading}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardSurface,
        paddingVertical: spacing.lg,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: colors.inputSurface,
        opacity: loading && !isLoading ? 0.5 : 1,
      }}
    >
      {isLoading
        ? <ActivityIndicator color={colors.textPrimary} size="small" />
        : <Text style={{ fontSize: fontSize.body, fontWeight: '600', color: colors.textPrimary }}>{label}</Text>
      }
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.mainBackground, paddingHorizontal: spacing.xl }}>
      {/* Hero */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LinearGradient
          colors={[colors.primaryAccent, colors.secondaryAccent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.xl,
          }}
        >
          <Text style={{ fontSize: 40, fontWeight: '800', color: colors.mainBackground }}>O</Text>
        </LinearGradient>
        <Text style={{ fontSize: fontSize.hero, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm }}>
          Outtie
        </Text>
        <Text style={{ fontSize: fontSize.body, color: colors.textSecondary, textAlign: 'center' }}>
          Plan your perfect day, effortlessly.
        </Text>
      </View>

      {/* Auth buttons */}
      <View style={{ paddingBottom: 52, gap: spacing.md }}>
        {providerButton('Continue with Google', handleGooglePress, loading === 'google')}

        {Platform.OS === 'ios' && (
          loading === 'apple'
            ? providerButton('Continue with Apple', handleApplePress, true)
            : (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={radius.button}
                style={{ height: 52 }}
                onPress={handleApplePress}
              />
            )
        )}

        <TouchableOpacity onPress={() => setAuth({ id: 0, name: 'Demo User', email: '' }, 'demo')} style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
          <Text style={{ fontSize: fontSize.smallLabel, color: colors.textMuted }}>Skip for now</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', fontSize: fontSize.metadata, color: colors.textMuted, marginTop: spacing.xs }}>
          By continsuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
};
