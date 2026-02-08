module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          module: "commonjs",
        },
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(png|jpg|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
    "/api$": "<rootDir>/src/__mocks__/api.ts",
  },
};
