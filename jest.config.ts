import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json'; 

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
  setupFilesAfterEnv: ['./setup-jest.ts'], 
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: './coverage',
};
