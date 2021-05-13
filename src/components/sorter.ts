import * as ts from "typescript";

import { ITsInterfaceNode, ITsInterfaceMemberNode } from "./parser";
import { IConfigurator, IInterfaceSorterConfiguration } from "./configurator";

export interface ISortedInterfaceElements {
  textToReplace: string;
  rangeToRemove: ts.TextRange;
}

export interface ITsSorter {
  sortInterfaceElements(
    interfaces: ITsInterfaceNode[]
  ): ISortedInterfaceElements[];
}

export type MemberCompareFunction = (
  a: ITsInterfaceMemberNode,
  b: ITsInterfaceMemberNode
) => number;

export class SimpleTsSorter implements ITsSorter {
  private configurator: IConfigurator<IInterfaceSorterConfiguration>;

  public constructor(
    configurator: IConfigurator<IInterfaceSorterConfiguration>
  ) {
    this.configurator = configurator;
  }

  public sortInterfaceElements(
    interfaces: ITsInterfaceNode[]
  ): ISortedInterfaceElements[] {
    const sortedInterfaceElements: ISortedInterfaceElements[] = [];

    for (const i in interfaces) {
      if (interfaces.hasOwnProperty(i)) {
        const oneInterface = interfaces[i];

        if (!oneInterface.members) {
          continue;
        }

        const sortedElements = oneInterface.members.sort(
          this.getSortFunction(
            this.configurator.getValue("sortByCapitalLetterFirst") as boolean,
            this.configurator.getValue("sortByRequiredElementFirst") as boolean
          )
        );

        let output = "";

        const SPACE = " ".repeat(
          this.configurator.getValue("indentSpace") as number
        );
        const NEWLINE = "\n";

        let rangeToRemove: ts.TextRange | undefined = undefined;

        for (let j = 0; j < sortedElements.length; j++) {
          output += NEWLINE;

          if (
            j !== 0 &&
            (this.configurator.getValue("lineBetweenMembers") as boolean)
          ) {
            output += NEWLINE;
          }

          const element = sortedElements[j];

          rangeToRemove = this.computeRemovalRange(element, rangeToRemove);

          const comments = element.comments;
          if (
            comments &&
            comments.leadingComment &&
            comments.leadingComment.length > 0
          ) {
            output += SPACE;
            output += comments.leadingComment
              .map((c) => c.text)
              .join(`${NEWLINE}${SPACE}`);
            output += NEWLINE;
          }

          output += SPACE;
          output += element.text;

          if (
            comments &&
            comments.trailingComment &&
            comments.trailingComment.length > 0
          ) {
            output += SPACE;
            output += comments.trailingComment.map((c) => c.text).join("");
          }
        }

        if (rangeToRemove) {
          sortedInterfaceElements.push({
            textToReplace: output,
            rangeToRemove,
          });
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

  /**
   * We want capital letter first
   *
   * A: string;
   * B: string;
   * Z: string;
   * a: string;
   * z: string;
   */
  private compareFnCapitalFirst = (nameA: string, nameB: string): number => {
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  };

  /**
   * Locale compare
   *
   * a: string;
   * A: string;
   * B: string;
   * z: string;
   * Z: string;
   */
  private compareFnLocale = (nameA: string, nameB: string): number => {
    return nameA.localeCompare(nameB);
  };

  /**
   * Required first
   *
   * c: string;
   *
   * A?: string;
   */
  private compareFnRequiredFirst = (
    aRequired: boolean,
    bRequired: boolean
  ): number => {
    if (aRequired && !bRequired) {
      return -1;
    } else if (!aRequired && bRequired) {
      return 1;
    } else {
      return 0;
    }
  };

  private getSortFunction = (
    sortCapitalFirst: boolean = false,
    requiredFirst: boolean = false
  ): MemberCompareFunction => {
    return (a: ITsInterfaceMemberNode, b: ITsInterfaceMemberNode): number => {
      const nameA = this.getStringFromName(a.element.name);
      const nameB = this.getStringFromName(b.element.name);
      if (nameA && nameB) {
        if (requiredFirst) {
          const requiredComparison = this.compareFnRequiredFirst(
            !a.element.questionToken,
            !b.element.questionToken
          );
          // If we get a difference for one optional and one required, return
          if (requiredComparison !== 0) {
            return requiredComparison;
          }
          // otherwise we run string compare below
        }

        if (sortCapitalFirst) {
          return this.compareFnCapitalFirst(nameA, nameB);
        } else {
          return this.compareFnLocale(nameA, nameB);
        }
      } else if (nameA) {
        return 1;
      } else if (nameB) {
        return -1;
      } else {
        return 0;
      }
    };
  };

  private getStringFromName = (
    name:
      | ts.Identifier
      | ts.StringLiteral
      | ts.NumericLiteral
      | ts.ComputedPropertyName
      | ts.PropertyName
      | undefined
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
