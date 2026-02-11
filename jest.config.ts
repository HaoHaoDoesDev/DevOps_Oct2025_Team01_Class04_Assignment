import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
}

export default config;