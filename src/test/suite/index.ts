/**
 * Wires in Jest as the test runner in place of the default Mocha.
 * 
 * Based on https://github.com/rozzzly/vscode-prompt-debug/blob/master/test/jest-test-runner.ts
 */
import { runCLI } from 'jest';
import type { TestResult } from '@jest/test-result';
import * as path from 'path';

const rootDir = path.resolve(__dirname, '../../../');
const fromRoot = (...subPaths: string[]): string => path.resolve(rootDir, ...subPaths);
const srcRoot = fromRoot('src');

const jestConfig = {
  rootDir: rootDir,
  roots: ['<rootDir>/src'],
  verbose: true,
  colors: true,
  transform: JSON.stringify({ '^.+\\.ts$': 'ts-jest' }),
  runInBand: true, // Required due to the way the "vscode" module is injected.
  testRegex: '\\.e2e\\.test\\.ts$',
  testEnvironment: fromRoot('out/test/jest-vscode-environment.js'),
  setupTestFrameworkScriptFile: fromRoot('out/test/jest-vscode-framework-setup.js'),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: JSON.stringify({
    'ts-jest': {
      babelConfig: false,
      tsconfig: fromRoot('tsconfig.json')
    }
  })
};

export async function run(_testRoot: string, callback: TestRunnerCallback) {

  // Forward logging from Jest to the Debug Console.
  forwardStdoutStderrStreams();

  try {
    const { globalConfig, results } = await (runCLI as any)(jestConfig, [rootDir]);
    const failures = collectTestFailureMessages(results);

    if (failures.length > 0) {
      callback(null, failures);
      return;
    }

    callback(null);
  } catch (e) {
    callback(e as any);
  }
}

/**
 * Collect failure messages from Jest test results.
 *
 * @param results Jest test results.
 */
function collectTestFailureMessages(results: TestResult): string[] {
  const failures = results.testResults.reduce<string[]>((acc, testResult) => {
    if (testResult.failureMessages) { acc.push(...testResult.failureMessages); }
    return acc;
  }, []);

  return failures;
}

/**
 * Forward writes to process.stdout and process.stderr to console.log.
 *
 * For some reason this seems to be required for the Jest output to be streamed
 * to the Debug Console.
 */
function forwardStdoutStderrStreams() {
  const logger = (line: string) => {
    console.log(line); // tslint:disable-line:no-console
    return true;
  };

  process.stdout.write = logger;
  process.stderr.write = logger;
}

export type TestRunnerCallback = (error: Error | null, failures?: any) => void;