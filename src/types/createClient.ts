
import { AxiosRequestConfig } from 'axios';

// 환경 타입 정의
export type Environment = 'development' | 'staging' | 'production';

// API 설정 인터페이스
export interface ApiConfig {
  environment: Environment;
  apiUrl: Record<Environment, string>;
  siteUrl: Record<Environment, string>;
}

// 인증 토큰 인터페이스
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// 사용자 인터페이스
export interface User {
  id: string;
  email: string;
  name: string;
  // 필요한 다른 사용자 속성 추가
}

// 커스텀 Axios 요청 구성 인터페이스
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
