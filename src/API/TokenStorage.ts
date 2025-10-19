// src/utils/TokenStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const TokenStorage = {
  getAccessToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken: async (token: string): Promise<void> => {
    return AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  getRefreshToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken: async (token: string): Promise<void> => {
    return AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clearTokens: async (): Promise<void> => {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};