import * as fs from "fs";
import * as vscode from "vscode";
import * as ts from "typescript";
import { IConfigurator } from "./configurator";

export interface IComment {
  text: string;
  range: ts.CommentRange;
}

export interface IComments {
  leadingComment?: IComment;
  trailingComment?: IComment;
}

export interface ITsNode {
  tsNode: ts.Node;

  start: ts.LineAndCharacter;
  end: ts.LineAndCharacter;

  comments: IComments;
}

export interface ITsInterfaceNode extends ITsNode {
  members: Array<ITsInterfaceMemberNode>;
}

export interface ITsInterfaceMemberNode extends ITsNode {
  fullText: string;
}

export interface ITsParser {
  parseInterface(
    fullFilePath: string,
    sourceFileText?: string
  ): { nodes: ITsInterfaceNode[]; sourceFile: ts.SourceFile };
}

export class SimpleTsParser implements ITsParser {
  public parseInterface(
    fullFilePath: string,
    sourceFileText?: string | undefined
  ): { nodes: ITsInterfaceNode[]; sourceFile: ts.SourceFile } {
    throw new Error("Method not implemented.");
  }
}
