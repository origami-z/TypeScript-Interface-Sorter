import * as ts from "typescript";

import { ITsInterfaceNode, ITsInterfaceMemberNode } from "./parser";
import { IConfigurator, IInterfaceSorterConfiguration } from "./configurator";

export interface ISortedInterfaceElememts {
  textToReplace: string;
  rangeToRemove: ts.TextRange;
}

export interface ITsSorter {
  sortInterfaceElements(interfaces: ITsInterfaceNode[]): ISortedInterfaceElememts[];
}

export class SimpleTsSorter implements ITsSorter {
  private configurator: IConfigurator<IInterfaceSorterConfiguration>;

  public constructor(configurator: IConfigurator<IInterfaceSorterConfiguration>) {
    this.configurator = configurator;
  }

  public sortInterfaceElements(interfaces: ITsInterfaceNode[]): ISortedInterfaceElememts[] {
    const sortedInterfaceElements: ISortedInterfaceElememts[] = [];

    for (const i in interfaces) {
      if (interfaces.hasOwnProperty(i)) {
        const oneInterface = interfaces[i];

        if (!oneInterface.members) {
          continue;
        }

        // TODO: Add compareFn into configuration?
        const sortedElements = oneInterface.members.sort(this.sortByName);

        let output = "";

        const SPACE = " ".repeat(this.configurator.getValue("indentSpace") as number);
        const NEWLINE = "\n";

        let rangeToRemove: ts.TextRange | undefined = undefined;

        for (let j = 0; j < sortedElements.length; j++) {
          output += NEWLINE;

          if (j !== 0 && (this.configurator.getValue("lineBetweenMembers") as boolean)) {
            output += NEWLINE;
          }

          const element = sortedElements[j];

          rangeToRemove = this.computeRemovalRange(element, rangeToRemove);

          const comments = element.comments;
          if (comments && comments.leadingComment && comments.leadingComment.length > 0) {
            output += SPACE;
            output += comments.leadingComment.map(c => c.text).join(`${NEWLINE}${SPACE}`);
            output += NEWLINE;
          }

          output += SPACE;
          output += element.text;

          if (comments && comments.trailingComment && comments.trailingComment.length > 0) {
            output += SPACE;
            output += comments.trailingComment.map(c => c.text).join("");
          }
        }

        if (rangeToRemove) {
          sortedInterfaceElements.push({ textToReplace: output, rangeToRemove });
        }
      }
    }

    return sortedInterfaceElements;
  }

  private computeRemovalRange(
    element: ITsInterfaceMemberNode,
    rangeToRemove: ts.TextRange | undefined
  ): ts.TextRange | undefined {
    const node = element.element;

    if (rangeToRemove === undefined) {
      return { pos: node.pos, end: node.end };
    }

    let { pos, end } = node;

    if (rangeToRemove.pos < pos) {
      pos = rangeToRemove.pos;
    }

    if (rangeToRemove.end > end) {
      end = rangeToRemove.end;
    }

    return { pos, end };
  }

  private sortByName = (a: ITsInterfaceMemberNode, b: ITsInterfaceMemberNode): number => {
    const nameA = this.getStringFromName(a.element.name);
    const nameB = this.getStringFromName(b.element.name);
    if (nameA && nameB) {
      return nameA.localeCompare(nameB);
    } else if (nameA) {
      return 1;
    } else if (nameB) {
      return -1;
    } else {
      return 0;
    }
  };

  private getStringFromName = (
    name: ts.Identifier | ts.StringLiteral | ts.NumericLiteral | ts.ComputedPropertyName | undefined
  ): string | undefined => {
    if (!name) {
      return undefined;
    }

    switch (name.kind) {
      case ts.SyntaxKind.Identifier:
        return name.text;
        break;
      case ts.SyntaxKind.StringLiteral:
        return name.text;
        break;
      case ts.SyntaxKind.NumericLiteral:
        return name.text;
        break;
      case ts.SyntaxKind.ComputedPropertyName:
        return undefined;
        break;
    }
  };
}
