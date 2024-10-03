// __tests__/createClient.test.ts

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ApiClient, createServerClient, createBrowserClient } from '../src/utils/mysingle/createClient';
import { jest } from '@jest/globals';
import { ApiConfig, AuthTokens, User } from '../src/types/createClient';

// `next/headers` 모듈을 모킹
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
  }),
}));

// `localStorage`를 글로벌 객체에 모킹 (클라이언트 사이드)
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
} as any;

// 테스트 대상 API 설정
const apiConfig: ApiConfig = {
  environment: 'development',
  apiUrl: {
    development: 'https://localhost:8000.com',
    staging: 'https://staging.api.example.com',
    production: 'https://api.example.com',
  },
  siteUrl: {
    development: 'https://localhost:3000.com',
    staging: 'https://staging.example.com',
    production: 'https://example.com',
  },
};

describe('ApiClient', () => {
  let mock: MockAdapter;
  let serverApiClient: ApiClient;
  let browserApiClient: ApiClient;

  beforeAll(() => {
    // 서버 사이드 클라이언트 생성
    serverApiClient = createServerClient(apiConfig);
    // 클라이언트 사이드 클라이언트 생성
    browserApiClient = createBrowserClient(apiConfig);
  });

  beforeEach(() => {
    // Axios 모킹 어댑터 설정
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    // 모든 모킹을 리셋
    mock.reset();
    jest.clearAllMocks();
  });
  

  // describe('login', () => {
  //   it('should store tokens and return AuthTokens on successful login (클라이언트 사이드)', async () => {
  //     const email = 'test@example.com';
  //     const password = 'password123';
  //     const tokens: AuthTokens = {
  //       accessToken: 'access-token',
  //       refreshToken: 'refresh-token',
  //     };

  //     // 로그인 API 모킹
  //     mock.onPost('https://dev.api.example.com/auth/login').reply(200, tokens);

  //     const result = await browserApiClient.login(email, password);

  //     expect(result).toEqual(tokens);
  //     expect(global.localStorage.setItem).toHaveBeenCalledWith('accessToken', tokens.accessToken);
  //     expect(global.localStorage.setItem).toHaveBeenCalledWith('refreshToken', tokens.refreshToken);
  //   });

  //   it('should throw an error on failed login (클라이언트 사이드)', async () => {
  //     const email = 'test@example.com';
  //     const password = 'wrongpassword';

  //     // 로그인 실패 API 모킹
  //     mock.onPost('https://dev.api.example.com/auth/login').reply(401);

  //     await expect(browserApiClient.login(email, password)).rejects.toThrow();
  //   });

  //   it('should return AuthTokens without setting localStorage on server side', async () => {
  //     const email = 'server@example.com';
  //     const password = 'serverpassword';
  //     const tokens: AuthTokens = {
  //       accessToken: 'server-access-token',
  //       refreshToken: 'server-refresh-token',
  //     };

  //     // 로그인 API 모킹
  //     mock.onPost('https://dev.api.example.com/auth/login').reply(200, tokens);

  //     const result = await serverApiClient.login(email, password);

  //     expect(result).toEqual(tokens);
  //     // 서버 사이드에서는 localStorage를 사용하지 않으므로 호출되지 않음
  //     expect(global.localStorage.setItem).not.toHaveBeenCalled();
  //   });
  // });

  // describe('logout', () => {
  //   it('should remove tokens from localStorage and call logout API (클라이언트 사이드)', async () => {
  //     // 로그아웃 API 모킹
  //     mock.onPost('https://dev.api.example.com/auth/logout').reply(200);

  //     await browserApiClient.logout();

  //     expect(global.localStorage.removeItem).toHaveBeenCalledWith('accessToken');
  //     expect(global.localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
  //     expect(mock.history.post.length).toBe(1);
  //     expect(mock.history.post[0].url).toBe('/auth/logout');
  //   });

  //   it('should call logout API without interacting with localStorage on server side', async () => {
  //     // 로그아웃 API 모킹
  //     mock.onPost('https://dev.api.example.com/auth/logout').reply(200);

  //     await serverApiClient.logout();

  //     expect(global.localStorage.removeItem).not.toHaveBeenCalled();
  //     expect(mock.history.post.length).toBe(1);
  //     expect(mock.history.post[0].url).toBe('/auth/logout');
  //   });
  // });

  // describe('getMe', () => {
  //   it('should return user data on successful getMe request', async () => {
  //     const user: User = {
  //       id: 'user123',
  //       email: 'user@example.com',
  //       name: 'Test User',
  //     };

  //     // getMe API 모킹
  //     mock.onGet('https://dev.api.example.com/auth/me').reply(200, user);

  //     const result = await browserApiClient.getMe();

  //     expect(result).toEqual(user);
  //     expect(mock.history.get.length).toBe(1);
  //     expect(mock.history.get[0].url).toBe('/auth/me');
  //   });

  //   it('should throw an error if getMe request fails', async () => {
  //     // getMe 실패 API 모킹
  //     mock.onGet('https://dev.api.example.com/auth/me').reply(500);

  //     await expect(browserApiClient.getMe()).rejects.toThrow();
  //   });
  // });

  // describe('token refresh', () => {
  //   it('should refresh token and retry the original request on 401 response (클라이언트 사이드)', async () => {
  //     const originalRequestUrl = '/protected';
  //     const newAccessToken = 'new-access-token';
  //     const newRefreshToken = 'new-refresh-token';
  //     const protectedData = { success: true };

  //     // 초기 보호된 API 요청이 401을 반환하도록 모킹
  //     mock.onGet('https://dev.api.example.com/protected').replyOnce(401);

  //     // 토큰 갱신 API 모킹
  //     mock.onPost('https://dev.api.example.com/auth/refresh').reply(200, {
  //       accessToken: newAccessToken,
  //       refreshToken: newRefreshToken,
  //     });

  //     // 갱신된 보호된 API 요청이 성공적으로 응답하도록 모킹
  //     mock.onGet('https://dev.api.example.com/protected').reply(200, protectedData);

  //     // 기존 액세스 토큰 설정
  //     (global.localStorage.getItem as jest.Mock).mockImplementation((key: any ) => {
  //       if (key === 'accessToken') return 'expired-access-token';
  //       if (key === 'refreshToken') return 'valid-refresh-token';
  //       return null;
  //     });

  //     const result = await browserApiClient.get('/protected');

  //     expect(result).toEqual(protectedData);
  //     expect(mock.history.get.length).toBe(2); // 초기 요청 + 재시도 요청
  //     expect(mock.history.post.length).toBe(1); // 토큰 갱신 요청
  //     expect(mock.history.post[0].url).toBe('/auth/refresh');
  //     expect(global.localStorage.setItem).toHaveBeenCalledWith('accessToken', newAccessToken);
  //     expect(global.localStorage.setItem).toHaveBeenCalledWith('refreshToken', newRefreshToken);
  //   });

  //   it('should fail if token refresh fails (클라이언트 사이드)', async () => {
  //     const originalRequestUrl = '/protected';

  //     // 초기 보호된 API 요청이 401을 반환하도록 모킹
  //     mock.onGet('https://dev.api.example.com/protected').replyOnce(401);

  //     // 토큰 갱신 API 실패 모킹
  //     mock.onPost('https://dev.api.example.com/auth/refresh').reply(400);

  //     // 기존 액세스 토큰 설정
  //     (global.localStorage.getItem as jest.Mock).mockImplementation((key: any) => {
  //       if (key === 'accessToken') return 'expired-access-token';
  //       if (key === 'refreshToken') return 'invalid-refresh-token';
  //       return null;
  //     });

  //     await expect(browserApiClient.get('/protected')).rejects.toThrow();

  //     expect(mock.history.get.length).toBe(1); // 초기 요청
  //     expect(mock.history.post.length).toBe(1); // 토큰 갱신 요청
  //     expect(mock.history.post[0].url).toBe('/auth/refresh');
  //     expect(global.localStorage.setItem).not.toHaveBeenCalledWith('accessToken', expect.any(String));
  //     expect(global.localStorage.setItem).not.toHaveBeenCalledWith('refreshToken', expect.any(String));
  //   });
  // });

  // 추가적인 메서드 테스트 케이스들을 여기에 작성할 수 있습니다.
});