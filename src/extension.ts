import * as vscode from "vscode";
import { SortInterfaceExtension } from "./sort-interface-extension";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "sort-interface-property" is now active!');
  const extension = new SortInterfaceExtension();

  let disposable = vscode.commands.registerCommand("extension.sortInterface", () => {
    extension.sortActiveWindowInterfaceMembers();

    vscode.window.showInformationMessage("Successfully sorted all interfaces!");
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
