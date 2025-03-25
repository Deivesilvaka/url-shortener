import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverageFrom: ['<rootDir>/src/**/*.service.(t|j)s'],
  coverageDirectory: './coverage/unit',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testMatch: ['<rootDir>/test/**/*unit.spec.(t|j)s'],
  modulePathIgnorePatterns: ['node_modules'],
  testTimeout: 10000,
};
