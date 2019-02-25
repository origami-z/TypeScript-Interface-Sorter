import { SimpleTsParser } from "../components/parser";
import { SimpleTsSorter } from "../components/sorter";
import { IInterfaceSorterConfiguration, SimpleConfigurator } from "../components/configurator";

import {
  tcClassImplementInterface,
  tcEmptyInterface,
  tcPrefixExport,
  tcInterfaceWithOneProperty,
  tcInterfaceWithExtends,
  tcInterfaceWithComment,
  tcInterfaceWithJsDocProperty
} from "./test-cases";

describe("Sorter", () => {
  const defaultConfig: IInterfaceSorterConfiguration = {
    lineBetweenMembers: true,
    indentSpace: 2
  };

  const parser = new SimpleTsParser();
  const sorter = new SimpleTsSorter(new SimpleConfigurator({ default: defaultConfig }));

  const filePath = "Untitled-1";

  test("should not break with no interface", () => {
    const { nodes } = parser.parseInterface(filePath, tcClassImplementInterface);
    const sorted = sorter.sortInterfaceElements(nodes);

    expect(sorted.length).toBe(0);
  });

  test("should not sort with empty interface", () => {
    const { nodes } = parser.parseInterface(filePath, tcEmptyInterface);
    const sorted = sorter.sortInterfaceElements(nodes);

    expect(sorted.length).toBe(0);
  });

  test("should sort one interface with export prefix", () => {
    const { nodes } = parser.parseInterface(filePath, tcPrefixExport + tcInterfaceWithOneProperty);
    const sorted = sorter.sortInterfaceElements(nodes);

    expect(sorted.length).toBe(1);
    expect(sorted[0].rangeToRemove).toEqual({ pos: 30, end: 46 });
  });

  test("should sort two interfaces with one extends the other", () => {
    const textIntput = tcInterfaceWithExtends;
    const { nodes } = parser.parseInterface(filePath, textIntput);
    const sorted = sorter.sortInterfaceElements(nodes);

    expect(sorted.length).toBe(1);
    expect(sorted[0].rangeToRemove).toEqual({ pos: 75, end: 110 });
    expect(sorted[0].textToReplace).toEqual(
      textIntput.substring(92, 110) + "\n" + textIntput.substring(75, 91)
    );
  });

  test("should sort one interface with comments", () => {
    const textIntput = tcInterfaceWithJsDocProperty;
    const { nodes } = parser.parseInterface(filePath, textIntput);
    const sorted = sorter.sortInterfaceElements(nodes);

    expect(sorted.length).toBe(1);
    expect(sorted[0].rangeToRemove).toEqual({ pos: 23, end: 143 });
    expect(sorted[0].textToReplace).toEqual(
      textIntput.substring(93, 143) + "\n" + textIntput.substring(23, 92)
    );
  });
});
