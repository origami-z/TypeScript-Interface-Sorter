import * as vscode from "vscode";
import { SortInterfaceExtension } from "./sort-interface-extension";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "tsInterfaceSorter" is now active!'
  );
  const extension = new SortInterfaceExtension();
  extension.updateFromWorkspaceConfig();

  let disposable = vscode.commands.registerCommand(
    "tsInterfaceSorter.sortTsInterface",
    () => {
      const message = extension.sortActiveWindowInterfaceMembers();
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
