import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./setup-jest.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest', 
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json', 'node'],
  transformIgnorePatterns: ['node_modules/(?!(@angular|your-module-name)/)'],
  globals: {
    'ts-jest': {
      useESM: true, 
    },
  },
};
