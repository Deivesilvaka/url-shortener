import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

module.exports = <Config>{
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverageFrom: ['<rootDir>/src/**/*controller.(t|j)s'],
  coverageDirectory: './coverage/e2e',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*e2e.spec.(t|j)s'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
