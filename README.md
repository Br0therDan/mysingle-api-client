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
npm install nextjs-generic-views
# 또는
yarn add nextjs-generic-views
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

### LayoutConfig

레이아웃 구성을 정의하세요:

```typescript
// src/config/layoutConfig.ts
import React from 'react';
import { Home, Users, Settings } from 'lucide-react';
import LayoutBuilder from 'nextjs-generic-views/components/genericLayout';

const navItems = [
  { label: 'Home', href: '/', icon: <Home /> },
  { label: 'Users', href: '/users', icon: <Users /> },
  { label: 'Settings', href: '/settings', icon: <Settings /> },
  // 필요한 내비게이션 항목 추가
];

const userMenuItems = [
  { label: 'Profile', onClick: () => console.log('Profile clicked') },
  { label: 'Logout', onClick: () => console.log('Logout clicked') },
  // 필요한 사용자 메뉴 항목 추가
];

const layoutConfig = {
  siteName: 'MySingle',
  logo: '/logo.svg', // 로고 이미지 경로
  navItems,
  userMenuItems,
  // font: inter, // 선택 사항: 커스텀 폰트 추가 시
};

export default layoutConfig;
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

### GenericView 컴포넌트

`GenericView` 컴포넌트는 대시보드, 리스트, 상세 보기와 같은 다양한 형식으로 데이터를 표시할 수 있는 유연한 방법을 제공합니다.

#### Props

- **schema**: `z.ZodTypeAny` - 데이터 유효성 검사용 Zod 스키마.
- **fields**: `Field<z.infer<T>>[]` - 각 필드를 렌더링하는 방법을 지정하는 필드 정의 배열.
- **viewType**: `ViewType` - 렌더링할 보기 유형 (`'dashboard' | 'list' | 'detail'`).
- **data**: `z.infer<T> | z.infer<T>[]` - 표시할 데이터 (단일 객체 또는 객체 배열).
- **onSave**: `(data: z.infer<T>) => void` (선택 사항) - 상세 보기에서 데이터 저장을 처리하는 콜백 함수.
- **dashboardCards**: `DashboardCard[]` (선택 사항) - 대시보드 카드 정의 배열.

#### 사용 예시

```typescript
// src/components/Dashboard.tsx
'use client';

import React from 'react';
import { GenericView } from 'nextjs-generic-views';
import * as z from 'zod';
import { Field, DashboardCard } from 'nextjs-generic-views/types/genericView';
import { SomeIcon, AnotherIcon } from 'lucide-react';

// Define your data schema using Zod
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  // Add other fields as needed
});

// Define fields for the GenericView
const fields: Field<typeof userSchema>[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  // Add other fields as needed
];

// Define dashboard cards
const dashboardCards: DashboardCard[] = [
  { title: 'Total Users', value: 1500, icon: <SomeIcon /> },
  { title: 'Active Users', value: 1234, icon: <AnotherIcon /> },
  // Add more cards as needed
];

// Example data
const data = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  // Add more data as needed
];

const Dashboard: React.FC = () => {
  const handleSave = (updatedData: typeof userSchema._output) => {
    console.log('Data saved:', updatedData);
    // Implement your save logic here
  };

  return (
    <GenericView
      schema={userSchema}
      fields={fields}
      viewType="dashboard"
      data={data}
      dashboardCards={dashboardCards}
      onSave={handleSave} // Optional for detail view
    />
  );
};

export default Dashboard;
```

### LayoutBuilder 컴포넌트

`LayoutBuilder` 컴포넌트는 반응형 헤더, 사이드바, 푸터를 포함한 일관된 레이아웃을 제공하며, 테마 전환 기능도 통합되어 있습니다.

#### 구성

사이트 이름, 로고, 내비게이션 항목 및 사용자 메뉴 항목을 포함한 레이아웃 구성을 정의하세요.

```typescript
// src/config/layoutConfig.ts
import React from 'react';
import { Home, Users, Settings } from 'lucide-react';
import LayoutBuilder from 'nextjs-generic-views/components/genericLayout';

const navItems = [
  { label: 'Home', href: '/', icon: <Home /> },
  { label: 'Users', href: '/users', icon: <Users /> },
  { label: 'Settings', href: '/settings', icon: <Settings /> },
  // Add more navigation items as needed
];

const userMenuItems = [
  { label: 'Profile', onClick: () => console.log('Profile clicked') },
  { label: 'Logout', onClick: () => console.log('Logout clicked') },
  // Add more user menu items as needed
];

const layoutConfig = {
  siteName: 'MySingle',
  logo: '/logo.svg', // Path to your logo image
  navItems,
  userMenuItems,
  // font: inter, // Optional: Add custom font if needed
};

export default layoutConfig;
```

#### 사용 예시

Next.js의 레이아웃 파일에서 `LayoutBuilder` 컴포넌트를 사용하여 애플리케이션 전체에 일관된 레이아웃을 제공합니다.

```typescript
// src/app/layout.tsx
'use client';

import React from 'react';
import LayoutBuilder from 'nextjs-generic-views/components/genericLayout';
import layoutConfig from '@/config/layoutConfig';

const layoutBuilder = new LayoutBuilder(layoutConfig);

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <layoutBuilder.Layout>{children}</layoutBuilder.Layout>;
};

export default RootLayout;
```

### useToast 훅

`useToast` 훅은 애플리케이션 내에서 토스트 알림을 관리하고 표시하는 간단하고 커스터마이징 가능한 방법을 제공합니다.

#### 사용 예시

```typescript
// src/components/NotificationExample.tsx
'use client';

import React from 'react';
import { useToast } from 'nextjs-generic-views';
import { Button } from '@/components/ui/button';

const NotificationExample: React.FC = () => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: 'Notification',
      description: 'This is a sample toast notification.',
      // Add more properties as needed
    });
  };

  return (
    <div>
      <Button onClick={showToast}>Show Toast</Button>
    </div>
  );
};

export default NotificationExample;
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

### GenericView Props

`GenericView` 컴포넌트는 다음과 같은 props를 받습니다:

- **schema**: `z.ZodTypeAny` - 데이터 유효성 검사용 Zod 스키마.
- **fields**: `Field<z.infer<T>>[]` - 각 필드를 렌더링하는 방법을 지정하는 필드 정의 배열.
- **viewType**: `ViewType` - 렌더링할 보기 유형 (`'dashboard' | 'list' | 'detail'`).
- **data**: `z.infer<T> | z.infer<T>[]` - 표시할 데이터 (단일 객체 또는 객체 배열).
- **onSave**: `(data: z.infer<T>) => void` (선택 사항) - 상세 보기에서 데이터 저장을 처리하는 콜백 함수.
- **dashboardCards**: `DashboardCard[]` (선택 사항) - 대시보드 카드 정의 배열.

#### 타입 정의

```typescript
// types/genericView.d.ts

import { Path } from 'react-hook-form';
import * as z from 'zod';

export type ViewType = 'dashboard' | 'list' | 'detail';

export type SelectOption = {
  value: string;
  label: string;
};

export type Field<T> = {
  name: Path<T>;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'select';
  validation?: z.ZodTypeAny;
  options?: SelectOption[];
};

export type DashboardCard = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};

export type GenericViewProps<T extends z.ZodTypeAny> = {
  schema: T;
  fields: Field<z.infer<T>>[];
  viewType: ViewType;
  data: z.infer<T> | z.infer<T>[];
  onSave?: (data: z.infer<T>) => void;
  dashboardCards?: DashboardCard[];
};
```

### LayoutBuilder Props

`LayoutBuilder` 컴포넌트는 `LayoutConfig` 인터페이스를 사용하여 구성됩니다.

- **siteName**: `string` - 사이트 이름.
- **logo**: `string` - 사이트 로고 이미지 경로.
- **navItems**: `NavItem[]` - 내비게이션 항목 배열.
- **userMenuItems**: `UserMenuItem[]` - 사용자 메뉴 항목 배열.
- **font**: `typeof inter` (선택 사항) - 커스텀 폰트 구성.

```typescript
// types/createClient.ts

import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export interface UserMenuItem {
  label: string;
  onClick: () => void;
}

export interface LayoutConfig {
  siteName: string;
  logo: string;
  navItems: NavItem[];
  userMenuItems: UserMenuItem[];
  font?: typeof inter;
}
```

### useToast Hook

`useToast` 훅은 애플리케이션 내에서 토스트 알림을 관리하고 표시하는 방법을 제공합니다.

#### 메서드

- **toast({ title, description, action }): Toast**

  새로운 토스트 알림을 표시합니다.

  ```typescript
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: 'Notification',
      description: 'This is a sample toast notification.',
      // Add more properties as needed
    });
  };
  ```

- **dismiss(toastId?: string): void**

  특정 토스트를 해제하거나, ID가 제공되지 않은 경우 모든 토스트를 해제합니다.

  ```typescript
  dismiss(); // Dismiss all toasts
  dismiss('toast-id'); // Dismiss a specific toast
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

### Using GenericView

```typescript
// src/components/UserListView.tsx
'use client';

import React from 'react';
import { GenericView } from 'nextjs-generic-views';
import * as z from 'zod';
import { Field, DashboardCard } from 'nextjs-generic-views/types/genericView';
import { SomeIcon, AnotherIcon } from 'lucide-react';

// Define your data schema using Zod
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  // Add other fields as needed
});

// Define fields for the GenericView
const fields: Field<typeof userSchema>[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  // Add other fields as needed
];

// Define dashboard cards
const dashboardCards: DashboardCard[] = [
  { title: 'Total Users', value: 1500, icon: <SomeIcon /> },
  { title: 'Active Users', value: 1234, icon: <AnotherIcon /> },
  // Add more cards as needed
];

// Example data
const data = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  // Add more data as needed
];

const UserListView: React.FC = () => {
  const handleSave = (updatedData: typeof userSchema._output) => {
    console.log('Data saved:', updatedData);
    // Implement your save logic here
  };

  return (
    <GenericView
      schema={userSchema}
      fields={fields}
      viewType="list"
      data={data}
      onSave={handleSave}
      dashboardCards={dashboardCards}
    />
  );
};

export default UserListView;
```

### Using LayoutBuilder

```typescript
// src/components/AppLayout.tsx
'use client';

import React from 'react';
import LayoutBuilder from 'nextjs-generic-views/components/genericLayout';
import layoutConfig from '@/config/layoutConfig';

const layoutBuilder = new LayoutBuilder(layoutConfig);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <layoutBuilder.Layout>{children}</layoutBuilder.Layout>;
};

export default AppLayout;
```

### Using useToast Hook

```typescript
// src/components/NotificationExample.tsx
'use client';

import React from 'react';
import { useToast } from 'nextjs-generic-views';
import { Button } from '@/components/ui/button';

const NotificationExample: React.FC = () => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: 'Notification',
      description: 'This is a sample toast notification.',
      // Add more properties as needed
    });
  };

  return (
    <div>
      <Button onClick={showToast}>Show Toast</Button>
    </div>
  );
};

export default NotificationExample;
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


### Additional Notes:

1. **ESM Support**: The package is built using ESM (ECMAScript Module) to leverage modern JavaScript features and improve compatibility with Next.js and other modern frameworks.

2. **Using `index.ts`**: The package uses `index.ts` as the entry point for exporting all components, hooks, and utilities. Ensure that your `tsconfig.json` is configured correctly to compile TypeScript files and emit declaration files.

   ```typescript
   // src/index.ts
   export { default as GenericView } from './components/GenericView';
   export { default as LayoutBuilder } from './components/genericLayout';
   export { useToast } from './hooks/use-toast';
   export { createServerClient, createBrowserClient } from './utils/mysingle/createClient';
   export type { GenericViewProps, Field, DashboardCard, ViewType, SelectOption } from './types/genericView';
   export type { ApiConfig, AuthTokens, User, CustomAxiosRequestConfig } from './types/createClient';
   // Export other components and hooks as needed
   ```

3. **Peer Dependencies**: To avoid bundling dependencies that your library expects the consuming project to provide (like React, Next.js, etc.), list them as `peerDependencies` in your `package.json`.

   Update your `package.json` to include `peerDependencies`:

   ```json
   {
     "name": "nextjs-generic-views",
     "version": "0.1.0",
     "private": false, // Set to false to allow publishing
     "scripts": {
       "build": "tsc",
       "prepare": "npm run build",
       "dev": "next dev",
       "start": "next start",
       "lint": "next lint"
     },
     "dependencies": {
       "@hookform/resolvers": "^3.9.0",
       "@radix-ui/react-accordion": "^1.2.0",
       "@radix-ui/react-avatar": "^1.1.0",
       "@radix-ui/react-dropdown-menu": "^2.1.1",
       "@radix-ui/react-icons": "^1.3.0",
       "@radix-ui/react-label": "^2.1.0",
       "@radix-ui/react-select": "^2.1.1",
       "@radix-ui/react-slot": "^1.1.0",
       "@radix-ui/react-toast": "^1.2.1",
       "@radix-ui/react-tooltip": "^1.1.2",
       "axios": "^1.7.7",
       "class-variance-authority": "^0.7.0",
       "clsx": "^2.1.1",
       "lucide-react": "^0.446.0",
       "next-themes": "^0.3.0",
       "react-hook-form": "^7.53.0",
       "tailwind-merge": "^2.5.2",
       "tailwindcss-animate": "^1.0.7",
       "zod": "^3.23.8"
     },
     "peerDependencies": {
       "react": "^18",
       "react-dom": "^18",
       "next": ">=13.0.0",
       "zod": "^3.23.8"
     },
     "devDependencies": {
       "@types/node": "^20",
       "@types/react": "^18",
       "@types/react-dom": "^18",
       "eslint": "^8",
       "eslint-config-next": "14.2.13",
       "postcss": "^8",
       "tailwindcss": "^3.4.1",
       "typescript": "^5"
     },
     "description": "This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).",
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "repository": {
       "type": "git",
       "url": "git+https://github.com/Br0therDan/react-generic-view.git"
     },
     "keywords": [
       "nextjs",
       "react",
       "generic",
       "views",
       "api",
       "client",
       "hooks"
     ],
     "author": "Dan Kim",
     "license": "ISC",
     "bugs": {
       "url": "https://github.com/Br0therDan/react-generic-view/issues"
     },
     "homepage": "https://github.com/Br0therDan/react-generic-view#readme"
   }
   ```

4. **Building and Publishing**: Ensure you have a build step that compiles your TypeScript code into JavaScript, typically into a `dist` folder. Update your `package.json` scripts accordingly and specify the `main` and `types` fields.

   ```json
   {
     // ...
     "scripts": {
       "build": "tsc",
       "prepare": "npm run build"
     },
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     // ...
   }
   ```

5. **Including Types**: Make sure that your `tsconfig.json` is set up to emit type definitions.

   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "outDir": "dist",
       "declaration": true,
       "declarationDir": "dist/types",
       "emitDeclarationOnly": false,
       "strict": true,
       "jsx": "react-jsx",
       "module": "ESNext",
       "moduleResolution": "node",
       "target": "ES6",
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true
       // ... other options
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist"]
   }
   ```

6. **Publishing**: After building, you can publish your package to NPM.

   ```bash
   npm login
   npm publish
   ```

   Ensure that your package name is unique and not already taken on NPM.

7. **Documentation**: Keep your README.md up to date with all components, hooks, and utilities your package provides. Include code examples and explanations for each feature to help users integrate your library seamlessly.

<<<<<<< HEAD
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 1e6675d (Initial commit from Create Next App)
=======
>>>>>>> 71dc551 (Fixed Errors)
