
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.e2e.test.ts'], // Match only E2E test files
  setupFilesAfterEnv: ['./jest.setup.ts']
};
