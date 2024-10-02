# MySingle API Client for Next.JS

[![npm version](https://img.shields.io/npm/v/@mysingle/api-client)](https://www.npmjs.com/package/@mysingle/api-client)
[![License](https://img.shields.io/npm/l/@mysingle/api-client)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Br0therDan/mysingle-api-client)](https://github.com/Br0therDan/mysingle-api-client/issues)
[![GitHub stars](https://img.shields.io/github/stars/Br0therDan/mysingle-api-client?style=social)](https://github.com/Br0therDan/mysingle-api-client)

MySingle Next.JS Generic Toolkit is a versatile and reusable library designed to streamline API interactions and UI component management in Next.js applications. It provides a robust and type-safe API client for handling authentication, token management, and CRUD operations, along with flexible UI components like `GenericView`, `LayoutBuilder`, and a custom `useToast` hook for notifications.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [ApiConfig](#apiconfig)
  - [LayoutConfig](#layoutconfig)
- [Usage](#usage)
  - [API Client](#api-client)
    - [Creating an API Client](#creating-an-api-client)
    - [Server-Side Usage](#server-side-usage)
    - [Client-Side Usage](#client-side-usage)
  - [GenericView Component](#genericview-component)
    - [Props](#props)
    - [Usage Example](#usage-example)
  - [LayoutBuilder Component](#layoutbuilder-component)
    - [Configuration](#configuration-1)
    - [Usage Example](#usage-example-1)
  - [useToast Hook](#usetostachook)
    - [Usage Example](#toast-usage-example)
- [API Reference](#api-reference)
  - [ApiClient Methods](#apiclient-methods)
  - [GenericView Props](#genericview-props)
  - [LayoutBuilder Props](#layoutbuilder-props)
  - [useToast Hook](#usetostachook-1)
- [Examples](#examples)
  - [Login Example](#login-example)
  - [Fetching User Data](#fetching-user-data)
  - [Using GenericView](#using-genericview)
  - [Using LayoutBuilder](#using-layoutbuilder)
  - [Using useToast Hook](#using-usetostachook)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Type-Safe API Requests**: Utilizes TypeScript for type safety and IntelliSense support.
- **Token Management**: Automatically handles access token refreshing using refresh tokens.
- **Interceptors**: Configurable request and response interceptors for custom logic.
- **Environment Configuration**: Easily switch between development, staging, and production environments.
- **Server and Client Support**: Seamlessly works on both server-side and client-side within Next.js.
- **Reusable UI Components**: `GenericView` component for versatile data presentation (dashboard, list, detail views) and `LayoutBuilder` for consistent application layout.
- **Custom Toast Notifications**: `useToast` hook for managing toast notifications in your application.
- **Extensible**: Easily extendable to include additional functionalities as needed.

## Installation

Install the package via npm or yarn:

```bash
npm install @mysingle/api-client
# or
yarn add @mysingle/api-client
```

## Configuration

### Environment Variables

Ensure you have the following environment variables set in your `.env` file:

```env
NEXT_PUBLIC_DEV_API_URL=https://dev-api.example.com
NEXT_PUBLIC_STAGING_API_URL=https://staging-api.example.com
NEXT_PUBLIC_PROD_API_URL=https://api.example.com

NEXT_PUBLIC_DEV_SITE_URL=https://dev.example.com
NEXT_PUBLIC_STAGING_SITE_URL=https://staging.example.com
NEXT_PUBLIC_PROD_SITE_URL=https://www.example.com
```

### ApiConfig

Define your API configuration based on the environment:

```typescript
// src/config/apiConfig.ts
import { Environment, ApiConfig } from 'nextjs-generic-views/types/createClient';

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

export default apiConfig;
```



## Usage

### API Client

The `ApiClient` class provides a type-safe and configurable way to interact with your API, handle authentication, and manage tokens.

#### Creating an API Client

Import the factory functions to create server-side and client-side API clients.

```typescript
// src/lib/apiClient.ts
import { createServerClient, createBrowserClient } from 'nextjs-generic-views';
import apiConfig from '@/config/apiConfig';

// Server-side API client
export const serverApiClient = createServerClient(apiConfig);

// Client-side API client
export const browserApiClient = createBrowserClient(apiConfig);
```

#### Server-Side Usage

Use the server-side API client within Next.js server components or API routes.

```typescript
// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { serverApiClient } from '@/lib/apiClient';

export async function GET() {
  try {
    const user = await serverApiClient.getMe();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error();
  }
}
```

#### Client-Side Usage

Use the client-side API client within React components.

```typescript
// src/components/UserProfile.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { browserApiClient } from '@/lib/apiClient';
import { User } from 'nextjs-generic-views/types/createClient';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await browserApiClient.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default UserProfile;
```


## API Reference

### ApiClient Methods

The `ApiClient` class provides methods to interact with your API, handle authentication, and manage tokens.

#### Methods

- **login(email: string, password: string): Promise<AuthTokens>**

  Authenticates a user and stores the access and refresh tokens.

  ```typescript
  const tokens = await apiClient.login('user@example.com', 'password123');
  ```

- **logout(): Promise<void>**

  Logs out the user by removing tokens and calling the logout endpoint.

  ```typescript
  await apiClient.logout();
  ```

- **getMe(): Promise<User>**

  Fetches the authenticated user's profile.

  ```typescript
  const user = await apiClient.getMe();
  ```

- **get<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T>**

  Sends a GET request to the specified URL.

  ```typescript
  const data = await apiClient.get<DataType>('/endpoint');
  ```

- **post<T, D = unknown>(url: string, data?: D, config?: CustomAxiosRequestConfig): Promise<T>**

  Sends a POST request with the provided data.

  ```typescript
  const response = await apiClient.post<ResponseType>('/endpoint', requestData);
  ```

- **put<T, D = unknown>(url: string, data?: D, config?: CustomAxiosRequestConfig): Promise<T>**

  Sends a PUT request with the provided data.

  ```typescript
  const response = await apiClient.put<ResponseType>('/endpoint', updateData);
  ```

- **delete<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T>**

  Sends a DELETE request to the specified URL.

  ```typescript
  const response = await apiClient.delete<ResponseType>('/endpoint');
  ```



#### Type Definitions

```typescript
// types/createClient.ts

import { Path } from 'react-hook-form';
import * as z from 'zod';

export type Environment = 'development' | 'staging' | 'production';

export interface ApiConfig {
  environment: Environment;
  apiUrl: Record<Environment, string>;
  siteUrl: Record<Environment, string>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
```

## Examples

### Login Example

```typescript
// src/components/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { browserApiClient } from '@/lib/apiClient';
import { AuthTokens } from 'nextjs-generic-views/types/createClient';
import { Button } from '@/components/ui/button';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokens: AuthTokens = await browserApiClient.login(email, password);
      console.log('Logged in successfully:', tokens);
      // Redirect or update UI as needed
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (e.g., show notification)
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label htmlFor="email">Email:</label>
        <input 
          id="email"
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="input"
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input 
          id="password"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="input"
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
```

### Fetching User Data

```typescript
// src/components/UserDashboard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { browserApiClient } from '@/lib/apiClient';
import { User } from 'nextjs-generic-views/types/createClient';

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await browserApiClient.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        // Handle error (e.g., redirect to login)
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div>Loading user data...</div>;

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more user-related information */}
    </div>
  );
};

export default UserDashboard;
```



## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a pull request.

Please ensure that your code adheres to the existing style and passes all tests.

## License

This project is licensed under the [ISC License](LICENSE).


# MySingle API Client for Next.JS

[![npm 버전](https://img.shields.io/npm/v/nextjs-generic-views)](https://www.npmjs.com/package/nextjs-generic-views)
[![라이선스](https://img.shields.io/npm/l/nextjs-generic-views)](LICENSE)
[![GitHub 이슈](https://img.shields.io/github/issues/Br0therDan/react-generic-view)](https://github.com/Br0therDan/react-generic-view/issues)
[![GitHub 스타](https://img.shields.io/github/stars/Br0therDan/react-generic-view?style=social)](https://github.com/Br0therDan/react-generic-view)

MySingle Next.JS Generic Toolkit은 Next.js 애플리케이션에서 API 상호작용 및 UI 컴포넌트 관리를 간소화하기 위해 설계된 다재다능하고 재사용 가능한 라이브러리입니다. 인증, 토큰 관리 및 CRUD 작업을 처리하기 위한 견고하고 타입 안전한 API 클라이언트와 함께, `GenericView`, `LayoutBuilder` 같은 유연한 UI 컴포넌트 및 알림을 위한 커스텀 `useToast` 훅을 제공합니다.

## 목차

- [특징](#특징)
- [설치](#설치)
- [구성](#구성)
  - [환경 변수](#환경-변수)
  - [ApiConfig](#apiconfig)
  - [LayoutConfig](#layoutconfig)
- [사용법](#사용법)
  - [API 클라이언트](#api-클라이언트)
    - [API 클라이언트 생성](#api-클라이언트-생성)
    - [서버 사이드 사용](#서버-사이드-사용)
    - [클라이언트 사이드 사용](#클라이언트-사이드-사용)
  - [GenericView 컴포넌트](#genericview-컴포넌트)
    - [Props](#props)
    - [사용 예시](#사용-예시)
  - [LayoutBuilder 컴포넌트](#layoutbuilder-컴포넌트)
    - [구성](#구성-1)
    - [사용 예시](#사용-예시-1)
  - [useToast 훅](#usetostachook)
    - [사용 예시](#toast-사용-예시)
- [API 참조](#api-참조)
  - [ApiClient 메서드](#apiclient-메서드)
  - [GenericView Props](#genericview-props)
  - [LayoutBuilder Props](#layoutbuilder-props)
  - [useToast 훅](#usetostachook-1)
- [예제](#예제)
  - [로그인 예제](#로그인-예제)
  - [사용자 데이터 가져오기](#사용자-데이터-가져오기)
  - [GenericView 사용](#genericview-사용)
  - [LayoutBuilder 사용](#layoutbuilder-사용)
  - [useToast 훅 사용](#usetostachook-사용)
- [기여](#기여)
- [라이선스](#라이선스)

## 특징

- **타입 안전한 API 요청**: TypeScript를 활용하여 타입 안전성과 IntelliSense 지원을 제공합니다.
- **토큰 관리**: 리프레시 토큰을 사용하여 접근 토큰 갱신을 자동으로 처리합니다.
- **인터셉터**: 커스텀 로직을 위한 요청 및 응답 인터셉터를 구성할 수 있습니다.
- **환경 구성**: 개발, 스테이징, 프로덕션 환경 간의 전환을 쉽게 할 수 있습니다.
- **서버 및 클라이언트 지원**: Next.js 내에서 서버 사이드 및 클라이언트 사이드에서 원활하게 작동합니다.
- **재사용 가능한 UI 컴포넌트**: 대시보드, 리스트, 상세 보기와 같은 다양한 데이터 표시를 위한 `GenericView` 컴포넌트와 일관된 애플리케이션 레이아웃을 위한 `LayoutBuilder` 컴포넌트를 제공합니다.
- **커스텀 토스트 알림**: 애플리케이션 내에서 토스트 알림을 관리하기 위한 `useToast` 훅을 제공합니다.
- **확장 가능**: 필요에 따라 추가 기능을 쉽게 확장할 수 있습니다.

## 설치

npm 또는 yarn을 통해 패키지를 설치하세요:

```bash
npm install @mysingle/api-client
# 또는
yarn add @mysingle/api-client
```

## 구성

### 환경 변수

`.env` 파일에 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_DEV_API_URL=https://dev-api.example.com
NEXT_PUBLIC_STAGING_API_URL=https://staging-api.example.com
NEXT_PUBLIC_PROD_API_URL=https://api.example.com

NEXT_PUBLIC_DEV_SITE_URL=https://dev.example.com
NEXT_PUBLIC_STAGING_SITE_URL=https://staging.example.com
NEXT_PUBLIC_PROD_SITE_URL=https://www.example.com
```

### ApiConfig

환경에 따라 API 구성을 정의하세요:

```typescript
// src/config/apiConfig.ts
import { Environment, ApiConfig } from 'nextjs-generic-views/types/createClient';

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

export default apiConfig;
```

## 사용법

### API 클라이언트

`ApiClient` 클래스는 API와 상호작용하고, 인증을 처리하며, 토큰을 관리하는 타입 안전하고 구성 가능한 방법을 제공합니다.

#### API 클라이언트 생성

서버 사이드 및 클라이언트 사이드 API 클라이언트를 생성하기 위해 팩토리 함수를 가져오세요.

```typescript
// src/lib/apiClient.ts
import { createServerClient, createBrowserClient } from 'nextjs-generic-views';
import apiConfig from '@/config/apiConfig';

// 서버 사이드 API 클라이언트
export const serverApiClient = createServerClient(apiConfig);

// 클라이언트 사이드 API 클라이언트
export const browserApiClient = createBrowserClient(apiConfig);
```

#### 서버 사이드 사용

Next.js 서버 컴포넌트 또는 API 라우트 내에서 서버 사이드 API 클라이언트를 사용하세요.

```typescript
// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { serverApiClient } from '@/lib/apiClient';

export async function GET() {
  try {
    const user = await serverApiClient.getMe();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error();
  }
}
```

#### 클라이언트 사이드 사용

React 컴포넌트 내에서 클라이언트 사이드 API 클라이언트를 사용하세요.

```typescript
// src/components/UserProfile.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { browserApiClient } from '@/lib/apiClient';
import { User } from 'nextjs-generic-views/types/createClient';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await browserApiClient.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {/* 필요한 사용자 세부 정보 추가 */}
    </div>
  );
};

export default UserProfile;
```


## API 참조

### ApiClient 메서드

`ApiClient` 클래스는 API와 상호작용하고, 인증을 처리하며, 토큰을 관리하는 메서드를 제공합니다.

#### 메서드

- **login(email: string, password: string): Promise<AuthTokens>**

  사용자를 인증하고 접근 토큰 및 리프레시 토큰을 저장합니다.

  ```typescript
  const tokens = await apiClient.login('user@example.com', 'password123');
  ```

- **logout(): Promise<void>**

  토큰을 제거하고 로그아웃 엔드포인트를 호출하여 사용자를 로그아웃합니다.

  ```typescript
  await apiClient.logout();
  ```

- **getMe(): Promise<User>**

  인증된 사용자의 프로필을 가져옵니다.

  ```typescript
  const user = await apiClient.getMe();
  ```

- **get<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T>**

  지정된 URL로 GET 요청을 보냅니다.

  ```typescript
  const data = await apiClient.get<DataType>('/endpoint');
  ```

- **post<T, D = unknown>(url: string, data?: D, config?: CustomAxiosRequestConfig): Promise<T>**

  제공된 데이터와 함께 POST 요청을 보냅니다.

  ```typescript
  const response = await apiClient.post<ResponseType>('/endpoint', requestData);
  ```

- **put<T, D = unknown>(url: string, data?: D, config?: CustomAxiosRequestConfig): Promise<T>**

  제공된 데이터와 함께 PUT 요청을 보냅니다.

  ```typescript
  const response = await apiClient.put<ResponseType>('/endpoint', updateData);
  ```

- **delete<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T>**

  지정된 URL로 DELETE 요청을 보냅니다.

  ```typescript
  const response = await apiClient.delete<ResponseType>('/endpoint');
  ```

#### 타입 정의

```typescript
// types/createClient.ts

import { Path } from 'react-hook-form';
import * as z from 'zod';

export type Environment = 'development' | 'staging' | 'production';

export interface ApiConfig {
  environment: Environment;
  apiUrl: Record<Environment, string>;
  siteUrl: Record<Environment, string>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
```

## Examples

### Login Example

```typescript
// src/components/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { browserApiClient } from '@/lib/apiClient';
import { AuthTokens } from 'nextjs-generic-views/types/createClient';
import { Button } from '@/components/ui/button';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokens: AuthTokens = await browserApiClient.login(email, password);
      console.log('Logged in successfully:', tokens);
      // Redirect or update UI as needed
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (e.g., show notification)
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label htmlFor="email">Email:</label>
        <input 
          id="email"
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="input"
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input 
          id="password"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="input"
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
```

### Fetching User Data

```typescript
// src/components/UserDashboard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { browserApiClient } from '@/lib/apiClient';
import { User } from 'nextjs-generic-views/types/createClient';

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await browserApiClient.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        // Handle error (e.g., redirect to login)
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div>Loading user data...</div>;

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more user-related information */}
    </div>
  );
};

export default UserDashboard;
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a pull request.

Please ensure that your code adheres to the existing style and passes all tests.

## License

This project is licensed under the [ISC License](LICENSE).
