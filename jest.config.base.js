const { defaults } = require('jest-config');

process.env.TZ = 'GMT';

/**
 * generates jest config for unit and e2e tests
 *
 * @param {*} overrides optional overrides
 * @param {*} merge configurations to merge
 * @param {*} merge.moduleNameMapper settings to merge with the `moduleNameMapper` option
 * @param {*} merge.coveragePathIgnorePatterns settings to merge with the `coveragePathIgnorePatterns` option
 * @returns
 */
function getBaseSettings(overrides, merge) {
  const tsconfig = require('./tsconfig.json');
  const paths = tsconfig.compilerOptions.paths;
  const formattedPaths = Object.keys(paths).reduce((obj, key) => {
    if (!key.endsWith('/*')) {
      const newKey = `${key}(.*)$`;
      const newValue = `<rootDir>/${paths[key][0]}$1`;
      obj[newKey] = newValue;
    }

    return obj;
  }, {});

  return {
    ...defaults,
    collectCoverageFrom: ['./**/*.{ts,tsx}'],
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'json-summary', 'lcov', 'text', 'text-summary'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      'enzyme.js',
      '<rootDir>(/.*)/__tests__',
      '<rootDir>(/.*)/__mocks__',
      // nestjs files that can't be nested in unit tests
      '<rootDir>(/.*)/*.module.ts',
      '<rootDir>/src/api/main.ts',
      // entity files
      '<rootDir>/shared/entities/(/.*)/*.entity.ts',
      '<rootDir>/shared/entities/(/.*)/*.index.ts',
      '<rootDir>/shared/entities/(/.*)/*.interface.ts',
      '<rootDir>/shared/entities/(/.*)/*.types.ts',
      // unit / e2e tests
      '<rootDir>/(.*)/__tests__',
      '<rootDir>/(.*)/__mocks__',
      '<rootDir>/(.*)/*.e2e.ts',
      '<rootDir>/(.*)/*.spec.ts',
      ...(merge && merge.coveragePathIgnorePatterns
        ? merge.coveragePathIgnorePatterns
        : []),
    ],
    errorOnDeprecated: true,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    modulePathIgnorePatterns: [
      '<rootDir>/dist',
      '<rootDir>/_next',
      '<rootDir>/.next',
    ],
    moduleNameMapper: {
      ...formattedPaths,
      ...(merge && merge.moduleNameMapper ? merge.moduleNameMapper : {}),
    },
    notify: true,
    notifyMode: 'always',
    preset: 'ts-jest',
    reporters: ['default', 'jest-json-reporter2'],
    resetMocks: true,
    resetModules: true,
    restoreMocks: true,
    setupFilesAfterEnv: [
      '<rootDir>/../../jest/jest.init.ts',
      '<rootDir>/jest/jest.init.ts',
    ],
    testEnvironment: 'node',
    transform: {
      '^.+\\.(ts|tsx)$': [
        'ts-jest',
        {
          isolatedModules: [undefined, false, 'false'].includes(process.env.CI),
          ...(overrides && overrides.globals && overrides.globals['ts-jest']
            ? overrides.globals['ts-jest']
            : {
                tsconfig: '<rootDir>/tsconfig.json',
              }),
        },
      ],
    },
    testMatch: ['**/*.(spec|test).+(ts|tsx|js)'],
    testPathIgnorePatterns: [
      '/node_modules/',
      '/dist/',
      '/*/*/dist',
      './shared/',
      './*/*/shared/',
      '/_next/',
      '/.next',
      '/__tests__/e2e/',
      '/__tests__/seed/',
      '/__tests__/mocks/',
      '/__mocks__/',
    ],
    verbose: true,
    ...(overrides || {}),
  };
}

module.exports.getBaseSettings = getBaseSettings;
