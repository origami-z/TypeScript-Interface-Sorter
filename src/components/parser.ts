import * as fs from "fs";
import * as ts from "typescript";

export interface IComment {
  text: string;
  range: ts.CommentRange;
}

export interface IComments {
  leadingComment?: IComment[];
  trailingComment?: IComment[];
}

export interface ITsNode {
  start: ts.LineAndCharacter;
  end: ts.LineAndCharacter;

  comments: IComments;
}

export interface ITsInterfaceNode extends ITsNode {
  declaration: ts.InterfaceDeclaration;
  members: Array<ITsInterfaceMemberNode>;
}

export interface ITsInterfaceMemberNode extends ITsNode {
  element: ts.TypeElement;
  text: string;
}

export interface ITsParser {
  parseInterface(
    fullFilePath: string,
    sourceFileText?: string
  ): { nodes: ITsInterfaceNode[]; sourceFile: ts.SourceFile | null };
}

export class SimpleTsParser implements ITsParser {
  public parseInterface(
    fullFilePath: string,
    _sourceText?: string | undefined
  ): { nodes: ITsInterfaceNode[]; sourceFile: ts.SourceFile | null } {
    if (_sourceText !== null && _sourceText !== undefined && _sourceText.trim() === "") {
      return { nodes: [], sourceFile: null };
    }

    const sourceText = _sourceText || fs.readFileSync(fullFilePath).toString();
    const sourceFile = this.createSourceFile(fullFilePath, sourceText);
    const { interfaces } = this.delintFile(sourceFile, sourceText);

    return { nodes: interfaces, sourceFile };
  }

  private createSourceFile(fullFilePath: string, sourceText: string): ts.SourceFile {
    return ts.createSourceFile(fullFilePath, sourceText, ts.ScriptTarget.ES2016, false);
  }

  private delintFile(
    sourceFile: ts.SourceFile,
    sourceText?: string
  ): { interfaces: ITsInterfaceNode[] } {
    const sourceFileText = sourceText || sourceFile.getText();

    return { interfaces: this.delintInterfaces(sourceFile, sourceFile, sourceFileText) };
  }

  private delintInterfaces(
    node: ts.Node,
    sourceFile: ts.SourceFile,
    sourceFileText: string
  ): ITsInterfaceNode[] {
    const interfaceNodes: ITsInterfaceNode[] = [];

    switch (node.kind) {
      case ts.SyntaxKind.InterfaceDeclaration:
        const interfaceNode = node as ts.InterfaceDeclaration;
        const lines = this.getCodeLineNumbers(node, sourceFile);
        const delintedInterface: ITsInterfaceNode = {
          declaration: interfaceNode,
          start: lines.start,
          end: lines.end,
          comments: this.getComments(node, sourceFileText),
          members: this.delintInterfaceElements(interfaceNode, sourceFile, sourceFileText)
        };
        interfaceNodes.push(delintedInterface);
        break;
      default:
        break;
    }

    ts.forEachChild(node, node => {
      interfaceNodes.push(...this.delintInterfaces(node, sourceFile, sourceFileText));
    });

    return interfaceNodes;
  }

  private getComments(node: ts.Node, sourceFileText: string): IComments {
    const leadingComment = (
      ts.getLeadingCommentRanges(sourceFileText, node.getFullStart()) || []
    ).map(range => this.getComment(range, sourceFileText));
    const trailingComment = (ts.getTrailingCommentRanges(sourceFileText, node.getEnd()) || []).map(
      range => this.getComment(range, sourceFileText)
    );
    return { leadingComment, trailingComment };
  }

  getComment(range: ts.CommentRange, sourceFileText: string): IComment {
    return {
      range,
      text: sourceFileText.slice(range.pos, range.end).replace(/\r/g, "")
    };
  }

  private getCodeLineNumbers(
    node: ts.Node,
    sourceFile: ts.SourceFile
  ): { start: ts.LineAndCharacter; end: ts.LineAndCharacter } {
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    return { start, end };
  }

  private delintInterfaceElements(
    node: ts.InterfaceDeclaration,
    sourceFile: ts.SourceFile,
    sourceFileText: string
  ): ITsInterfaceMemberNode[] {
    return node.members.map(x => {
      const lines = this.getCodeLineNumbers(x, sourceFile);
      const comments = this.getComments(x, sourceFileText);
      return {
        element: x,
        text: x.getText(sourceFile).trim(),
        start: lines.start,
        end: lines.end,
        comments
      };
    });
  }
}
