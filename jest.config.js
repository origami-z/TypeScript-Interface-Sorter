module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  globals: {
    "ts-jest": {
      // Disable type checking in test
      diagnostics: false,
    },
  },
};
