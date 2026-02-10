import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts','<rootDir>/tests/FileModel.test.ts','<rootDir>/tests/FileController.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/mocks/fileMock.js',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
}

export default config;