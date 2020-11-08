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
} from "./components/configurator";

const EXTENSION_IDENTIFIER = "tsInterfaceSorter";

export class SortInterfaceExtension {
  private defaultConfig: IInterfaceSorterConfiguration = {
    lineBetweenMembers: true,
    indentSpace: 2,
    sortByCapitalLetterFirst: false,
  };

  private config: IConfiguration<IInterfaceSorterConfiguration> = {
    default: this.defaultConfig,
  };
  private configurator: IConfigurator<
    IInterfaceSorterConfiguration
  > = new SimpleConfigurator(this.config);
  private parser: ITsParser = new SimpleTsParser();
  private sorter: ITsSorter = new SimpleTsSorter(this.configurator);

  public updateFromWorkspaceConfig() {
    const fullConfig = workspace.getConfiguration(EXTENSION_IDENTIFIER);

    const override = {
      lineBetweenMembers: fullConfig.emptyLineBetweenProperties,
      sortByCapitalLetterFirst: fullConfig.sortByCapitalLetterFirst,
    };

    this.configurator.setOverride(override);
  }

  public sortActiveWindowInterfaceMembers(event?: TextDocumentChangeEvent) {
    try {
      if (window.activeTextEditor) {
        const doc: TextDocument = event
          ? event.document
          : window.activeTextEditor.document;
        const text = doc.getText();
        const { nodes, sourceFile } = this.parser.parseInterface(
          doc.uri.fsPath,
          text
        );

        if (nodes.length > 0 && sourceFile) {
          const sortedInterface = this.sorter.sortInterfaceElements(nodes);

          if (event) {
            // Support sort on document save
          } else {
            window.activeTextEditor.edit((editorBuilder: TextEditorEdit) => {
              sortedInterface.forEach((i) => {
                editorBuilder.replace(
                  new Range(
                    this.getPosition(i.rangeToRemove.pos, sourceFile),
                    this.getPosition(i.rangeToRemove.end, sourceFile)
                  ),
                  i.textToReplace
                );
              });
            });

            window.showInformationMessage(
              "Successfully sorted all interfaces!"
            );
          }
        } else {
          window.showInformationMessage(
            "No interface found. Please check current file."
          );
        }
      }
    } catch (error) {
      window.showErrorMessage(
        `Typescript interface sorter failed with - ${error}. Please log a bug`
      );
    }
  }

  private getPosition(pos: number, sourceFile: ts.SourceFile): Position {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
    return new Position(line, character);
  }
}
