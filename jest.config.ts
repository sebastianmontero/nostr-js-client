import type { Config } from 'jest';
import { TextEncoder, TextDecoder } from 'util';

const config: Config = {
  verbose: false,
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  globals: {
    TextDecoder: TextDecoder,
    TextEncoder: TextEncoder
  },
  transform: {
    "^.+\\.(ts?)$": "ts-jest",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules",
    "<rootDir>/dist"
  ],
  testRegex: "(/src/.*(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testEnvironment: "./jest-environment-jsdom.js"
};

export default config;