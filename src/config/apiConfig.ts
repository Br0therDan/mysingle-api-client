// src/config/apiConfig.ts

import { ApiConfig, Environment } from '@/types/createClient';

export const apiConfig: ApiConfig = {
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

