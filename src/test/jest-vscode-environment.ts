/**
 * Exposes the Visual Studio Code extension API to the Jest testing environment.
 *
 * Tests would otherwise not have access because they are sandboxed.
 *
 * @see https://github.com/rozzzly/vscode-prompt-debug/blob/c1abba77a46ef9b9950daceeee8f5ffce3cab490/test/jest-vscode-environment.ts
 */
import NodeEnvironment from "jest-environment-node";
import * as vscode from "vscode";

class VsCodeEnvironment extends NodeEnvironment {
  constructor(config: any) {
    super(config);
  }

  public async setup() {
    await super.setup();
    this.global.vscode = vscode;
  }

  public async teardown() {
    this.global.vscode = {};
    await super.teardown();
  }
}

module.exports = VsCodeEnvironment;