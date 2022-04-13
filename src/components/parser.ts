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

export interface ITsNodeWithMembers extends ITsNode {
  members: Array<ITsTypeMemberNode>;
}

export interface ITsInterfaceNode extends ITsNodeWithMembers {
  declaration: ts.InterfaceDeclaration;
}

export interface ITsTypeLiteralNode extends ITsNodeWithMembers {
  declaration: ts.TypeAliasDeclaration;
}

export type ITypeNode = ITsInterfaceNode | ITsTypeLiteralNode;

export interface ITsTypeMemberNode extends ITsNode {
  element: ts.TypeElement;
  text: string;
}

export interface ITsParser {
  parseTypeNodes(
    fullFilePath: string,
    sourceFileText?: string
  ): { nodes: ITypeNode[]; sourceFile: ts.SourceFile | null };
}

export class SimpleTsParser implements ITsParser {
  public parseTypeNodes(
    fullFilePath: string,
    _sourceText?: string | undefined
  ): { nodes: ITypeNode[]; sourceFile: ts.SourceFile | null } {
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
  ): { interfaces: ITypeNode[] } {
    const sourceFileText = sourceText || sourceFile.getText();

    return { interfaces: this.delintTypeNodes(sourceFile, sourceFile, sourceFileText) };
  }

  private delintTypeNodes(
    node: ts.Node,
    sourceFile: ts.SourceFile,
    sourceFileText: string
  ): ITypeNode[] {
    const typeNodes: ITypeNode[] = [];

    switch (node.kind) {
      case ts.SyntaxKind.InterfaceDeclaration: {
        const interfaceNode = node as ts.InterfaceDeclaration;
        const lines = this.getCodeLineNumbers(node, sourceFile);
        const delintedInterface: ITsInterfaceNode = {
          declaration: interfaceNode,
          start: lines.start,
          end: lines.end,
          comments: this.getComments(node, sourceFileText),
          members: this.getMembers(interfaceNode, sourceFile, sourceFileText)
        };
        typeNodes.push(delintedInterface);
        break;
      }
      case ts.SyntaxKind.TypeAliasDeclaration: {
        const typeNode = node as ts.TypeAliasDeclaration;
        const lines = this.getCodeLineNumbers(node, sourceFile);
        if (typeNode.type.kind === ts.SyntaxKind.TypeLiteral) {
          const members = this.getMembers(typeNode.type as ts.TypeLiteralNode, sourceFile, sourceFileText);
          const delintedInterface: ITsTypeLiteralNode = {
            declaration: typeNode,
            start: lines.start,
            end: lines.end,
            comments: this.getComments(node, sourceFileText),
            members
          };
          typeNodes.push(delintedInterface);
        }
        break;
      }
      default:
        break;
    }

    ts.forEachChild(node, node => {
      typeNodes.push(...this.delintTypeNodes(node, sourceFile, sourceFileText));
    });

    return typeNodes;
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

  private getMembers<T extends { readonly members: ts.NodeArray<ts.TypeElement>; }>
    (
      node: T,
      sourceFile: ts.SourceFile,
      sourceFileText: string) {
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
