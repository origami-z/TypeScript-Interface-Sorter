import * as ts from "typescript";

import { ITsInterfaceNode } from "./parser";
import { IConfigurator } from "./configurator";

export interface ISortedInterfaceElememts {
  textToReplace: string;
  rangeToRemove: ts.TextRange;
}

export interface ITsSorter {
  sortInterfaceElements(interfaces: ITsInterfaceNode[]): ISortedInterfaceElememts[];
}

export class SimpleTsSorter implements ITsSorter {
  private configurator: IConfigurator;

  public constructor(configurator: IConfigurator) {
    this.configurator = configurator;
  }

  sortInterfaceElements(interfaces: ITsInterfaceNode[]): ISortedInterfaceElememts[] {
    throw new Error("Method not implemented.");
  }
}
