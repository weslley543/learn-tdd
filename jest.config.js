module.exports = {
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testEnviroment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts': 'ts-jest'
  }
};
