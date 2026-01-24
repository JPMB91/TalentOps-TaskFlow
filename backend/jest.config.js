module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   roots: ['<rootDir>/tests'],
   testMatch: [
     '**/__tests__/**/*.+(ts|tsx|js)',
     '**/?(*.)+(spec|test).+(ts|tsx|js)',
   ],
   transform: {
     '^.+\\.(ts|tsx)$': ['ts-jest', {
       tsconfig: 'tsconfig.test.json',
     }],
   },
   collectCoverageFrom: [
     'src/**/*.{js,jsx,ts,tsx}',
     '!src/**/*.d.ts',
   ],
   moduleNameMapper: {
     '^@/(.*)$': '<rootDir>/src/$1',
   },
   setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts', '<rootDir>/jest.setup.js'],
   testTimeout: 10000,
   verbose: true
};