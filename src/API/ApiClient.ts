// src/services/ApiClient.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from './TokenStorage';
// Assuming a way to navigate the user to the Login screen if refresh fails
// import { navigateToLogin } from './NavigationService'; // Create this utility or use a Context/Redux action

// --- Configuration ---
const API_BASE_URL = 'http://181.214.10.5/api';
const REFRESH_URL = '/Auth/refresh'; // Your refresh token endpoint
const LOGIN_URL = '/Auth/login'; // Your refresh token endpoint

// --- Axios Instance Setup ---
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// --- State to manage the refresh process and pending requests ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  originalRequest: InternalAxiosRequestConfig;
}> = [];

/**
 * Function to process the queue of failed requests
 * @param token The new access token
 */
const processQueue = (token: string | null) => {
  failedQueue.forEach(prom => {
    if (token) {
      // Update header and resolve the promise to retry the original request
      prom.originalRequest.headers.Authorization = `Bearer ${token}`;
      prom.resolve(apiClient(prom.originalRequest));
    } else {
      // If token refresh failed, reject the queued request
      prom.reject(new AxiosError('Refresh token failed, forcing logout.'));
    }
  });

  failedQueue = [];
};

// --- Request Interceptor: Inject Access Token ---
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Exclude the refresh token API itself from this logic
    if (config.url === REFRESH_URL || config.url === LOGIN_URL) {
      return config;
    }

    const accessToken = await TokenStorage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor: Handle 401 and Token Refresh ---
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    console.log(error.response)
    console.log(originalRequest)
    // Check for 401 status and ensure it's not the retry attempt of the original request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark as retried to prevent infinite loops
      originalRequest._retry = true;

      // This promise will be returned to the original API call to wait for the token refresh
      const retryOriginalRequest = new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, originalRequest });
      });

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = await TokenStorage.getRefreshToken();

          if (!refreshToken) {
            // No refresh token, clear tokens and redirect to login
            await TokenStorage.clearTokens();
            // navigateToLogin();
            return Promise.reject(error); // Reject the 401
          }

          // 1. Call the refresh token API
          const response = await axios.post<{ accessToken: string, refreshToken: string }>(
            `${API_BASE_URL}${REFRESH_URL}`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );
          console.log('Refresh response')
          console.log(response)
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          // 2. Update the stored tokens
          await TokenStorage.setAccessToken(newAccessToken);
          await TokenStorage.setRefreshToken(newRefreshToken);

          // 3. Process the queue of failed requests
          processQueue(newAccessToken);

        } catch (refreshError) {
          // If the refresh token call fails (e.g., 400 or 401), clear tokens and force login
          await TokenStorage.clearTokens();
          processQueue(null); // Reject all queued requests
        //   navigateToLogin();

          return Promise.reject(refreshError); // Reject the refresh failure
        } finally {
          isRefreshing = false;
        }
      }

      // Return the promise that will resolve once the token is refreshed and the request is retried
      return retryOriginalRequest;
    }

    // For any other error (including 401 from a failed retry), just return the error
    return Promise.reject(error);
  }
);

export default apiClient;