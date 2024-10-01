// ApiClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { cookies } from 'next/headers';
import {
  ApiConfig,
  AuthTokens,
  User,
  CustomAxiosRequestConfig,
} from '@/types/createClient';

import { Environment } from '@/types/createClient';

// cookies() 함수의 반환 타입을 추론
type CookiesType = ReturnType<typeof cookies>;

// API 클라이언트 클래스
class ApiClient {

  private axiosInstance: AxiosInstance;     // Axios 인스턴스
  private config: ApiConfig;                // API 설정
  private cookieStore: CookiesType | null;  // 쿠키 저장소

  // 생성자
  constructor(config: ApiConfig, cookieStore: CookiesType | null = null) {
    this.config = config;
    this.cookieStore = cookieStore;

    this.axiosInstance = axios.create({
      baseURL: this.config.apiUrl[this.config.environment],
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // 인터셉터 설정 : 요청과 응답에 대한 처리
  private setupInterceptors() {
    // 요청 인터셉터 설정
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // 응답 인터셉터 설정
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const newAccessToken = await this.refreshAccessToken();
          if (newAccessToken) {
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return this.axiosInstance(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // 액세스 토큰 가져오기
  private async getAccessToken(): Promise<string | null> {
    if (this.cookieStore) {
      return this.cookieStore.get('accessToken')?.value || null;
    } else if (typeof window !== 'undefined') {
      // 클라이언트 사이드에서 localStorage 사용
      return localStorage.getItem('accessToken');
    }
    return null;
  }
  
  // 액세스 토큰 갱신
  private async refreshAccessToken(): Promise<string | null> {
    try {
      let refreshToken: string | undefined;

      if (this.cookieStore) {
        refreshToken = this.cookieStore.get('refreshToken')?.value;
      } else if (typeof window !== 'undefined') {
        refreshToken = localStorage.getItem('refreshToken') || undefined;
      }

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        `${this.config.apiUrl[this.config.environment]}/auth/refresh`,
        { refreshToken }
      );
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      if (typeof window !== 'undefined') {
        // 클라이언트 사이드에서 localStorage 업데이트
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
      } else {
        // 서버 사이드에서 쿠키를 설정할 수 없으므로, 별도의 처리 필요
      }

      return accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      return null;
    }
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await this.axiosInstance.post('/auth/login', {
      email,
      password,
    });
    const { accessToken, refreshToken } = response.data;

    if (typeof window !== 'undefined') {
      // 클라이언트 사이드에서 localStorage 설정
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      // 서버 사이드에서 쿠키를 설정할 수 없으므로, 별도의 처리 필요
    }

    return { accessToken, refreshToken };
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      // 클라이언트 사이드에서 localStorage 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } else {
      // 서버 사이드에서 쿠키를 삭제할 수 없으므로, 별도의 처리 필요
    }

    // 로그아웃 엔드포인트 호출
    await this.axiosInstance.post('/auth/logout');
  }

  async getMe(): Promise<User> {
    const response = await this.axiosInstance.get('/auth/me');
    return response.data;
  }

  async get<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: CustomAxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: CustomAxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

// 팩토리 함수
export function createServerClient(config: ApiConfig): ApiClient {
  const cookieStore = cookies(); // 타입은 추론됩니다.
  return new ApiClient(config, cookieStore);
}

export function createBrowserClient(config: ApiConfig): ApiClient {
  return new ApiClient(config);
}

// 사용 예시


const apiConfig: ApiConfig = {
  environment: process.env.NODE_ENV as Environment,
  apiUrl: {
    development: process.env.NEXT_PUBLIC_DEV_API_URL!,
    staging: process.env.NEXT_PUBLIC_STAGING_API_URL!,
    production: process.env.NEXT_PUBLIC_PROD_API_URL!,
  },
  siteUrl: {
    development: process.env.NEXT_PUBLIC_DEV_SITE_URL!,
    staging: process.env.NEXT_PUBLIC_STAGING_SITE_URL!,
    production: process.env.NEXT_PUBLIC_PROD_SITE_URL!,
  },
};

// 서버 사이드 사용
export const serverApiClient = createServerClient(apiConfig);

// 클라이언트 사이드 사용
export const browserApiClient = createBrowserClient(apiConfig);
