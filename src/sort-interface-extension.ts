import * as ts from "typescript";
import {
  TextDocumentChangeEvent,
  window,
  TextDocument,
  TextEditorEdit,
  Position,
  Range,
  workspace,
} from "vscode";

import { ITsParser, SimpleTsParser } from "./components/parser";
import { ITsSorter, SimpleTsSorter } from "./components/sorter";
import {
  IConfigurator,
  SimpleConfigurator,
  IConfiguration,
  IInterfaceSorterConfiguration,
  defaultConfig,
} from "./components/configurator";

const EXTENSION_IDENTIFIER = "tsInterfaceSorter";

export class SortInterfaceExtension {
  private config: IConfiguration<IInterfaceSorterConfiguration> = {
    default: defaultConfig,
  };
  private configurator: IConfigurator<IInterfaceSorterConfiguration> =
    new SimpleConfigurator(this.config);
  private parser: ITsParser = new SimpleTsParser(this.configurator);
  private sorter: ITsSorter = new SimpleTsSorter(this.configurator);

  public updateFromWorkspaceConfig() {
    const fullConfig = workspace.getConfiguration(EXTENSION_IDENTIFIER);
    // Setting: editor.tabSize
    const editorConfig = workspace.getConfiguration("editor");
    this.configurator.setOverride({
      ...(fullConfig as any),
      indentSpace: editorConfig.tabSize,
    });
  }

  public sortActiveWindowInterfaceMembers(event?: TextDocumentChangeEvent) {
    try {
      if (window.activeTextEditor) {
        const doc: TextDocument = event
          ? event.document
          : window.activeTextEditor.document;
        const text = doc.getText();
        const { nodes, sourceFile } = this.parser.parseTypeNodes(
          doc.uri.fsPath,
          text
        );

        if (nodes.length > 0 && sourceFile) {
          const sortedTypesWithElements =
            this.sorter.sortGenericTypeElements(nodes);

          if (event) {
            // Support sort on document save
          } else {
            window.activeTextEditor.edit((editorBuilder: TextEditorEdit) => {
              sortedTypesWithElements.forEach((i) => {
                editorBuilder.replace(
                  new Range(
                    this.getPosition(i.rangeToRemove.pos, sourceFile),
                    this.getPosition(i.rangeToRemove.end, sourceFile)
                  ),
                  i.textToReplace
                );
              });
            });
          }
          const sortTypes = this.configurator.getValue("sortTypes") as boolean;

          window.showInformationMessage(
            `Successfully sorted ${sortedTypesWithElements.length} interface${
              sortTypes ? " or type" : ""
            }.`
          );
        } else {
          window.showWarningMessage(
            `No source code is found in the current active file.`
          );
        }
      } else {
        window.showWarningMessage(
          `Active text editor is needed for the command to work.`
        );
      }
    } catch (error) {
      window.showErrorMessage(
        `Typescript interface sorter failed with - ${error}. Please file a bug.`
      );
    }
  }

  private getPosition(pos: number, sourceFile: ts.SourceFile): Position {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
    return new Position(line, character);
  }
}
