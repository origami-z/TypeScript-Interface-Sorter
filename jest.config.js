module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    // Ignore suite folder, which is integration test
    'src/test/components'
  ]
};