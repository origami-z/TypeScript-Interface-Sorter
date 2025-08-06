/**
 * Takes the Visual Studio Code extension API which was exposed on the sandbox's
 * global object and uses it to create a virtual mock. This replaces vscode
 * module imports with the vscode extension instance from the test runner's
 * environment.
 *
 * @see https://github.com/Unibeautify/vscode/blob/bc148a79c8b52cdccc16a8cc4c14fbfb703fbf76/test/jest-vscode-framework-setup.ts
 */
jest.mock("vscode", () => (global as any).vscode, { virtual: true });