// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node', // 또는 'jsdom' 클라이언트 사이드 테스트 시
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};