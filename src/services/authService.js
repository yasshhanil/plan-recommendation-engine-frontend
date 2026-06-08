import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_BASE } from '../config';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

const storage = {
  set: (key, value) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      return SecureStore.setItemAsync(key, value);
    }
  },
  get: (key) => {
    if (Platform.OS === 'web') {
      return Promise.resolve(localStorage.getItem(key));
    }
    return SecureStore.getItemAsync(key);
  },
  remove: (key) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      return SecureStore.deleteItemAsync(key);
    }
  },
};

export const persistAuth = async (token, user) => {
  await Promise.all([
    storage.set(TOKEN_KEY, token),
    storage.set(USER_KEY, JSON.stringify(user)),
  ]);
};

export const loadPersistedAuth = async () => {
  const [token, userJson] = await Promise.all([
    storage.get(TOKEN_KEY),
    storage.get(USER_KEY),
  ]);
  if (token && userJson) return { token, user: JSON.parse(userJson) };
  return null;
};

export const removePersistedAuth = async () => {
  await Promise.all([
    storage.remove(TOKEN_KEY),
    storage.remove(USER_KEY),
  ]);
};

const authPost = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Authentication failed');
  return res.json(); // { token, user: { id, email, name } }
};

export const signInWithGoogle = (code, redirectUri, codeVerifier) =>
  authPost('/auth/google/', { code, redirect_uri: redirectUri, code_verifier: codeVerifier });

export const signInWithApple = (identityToken, fullName) =>
  authPost('/auth/apple/', { identity_token: identityToken, full_name: fullName });
