module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/src'],
};
