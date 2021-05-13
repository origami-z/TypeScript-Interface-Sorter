import { SimpleTsParser } from "../../components/parser";
import { SimpleTsSorter } from "../../components/sorter";
import {
  IInterfaceSorterConfiguration,
  SimpleConfigurator,
} from "../../components/configurator";

import {
  tcClassImplementInterface,
  tcEmptyInterface,
  tcPrefixExport,
  tcInterfaceWithOneProperty,
  tcInterfaceWithExtends,
  tcInterfaceWithComment,
  tcInterfaceWithJsDocProperty,
  tcInterfaceWithOptionalProperty,
  tcInterfaceWithCapitalLetter,
} from "./test-cases";

describe("Sorter", () => {
  const defaultConfig: IInterfaceSorterConfiguration = {
    lineBetweenMembers: true,
    indentSpace: 2,
  };

  const parser = new SimpleTsParser();
  const sorter = new SimpleTsSorter(
    new SimpleConfigurator({ default: defaultConfig })
  );

  const filePath = "Untitled-1";

  test("should not break with no interface", () => {
    const { nodes } = parser.parseInterface(
      filePath,
      tcClassImplementInterface
    );
    const sorted = sorter.sortInterfaceElements(nodes);

    expect(sorted.length).toBe(0);
  });

  test("should not sort with empty interface", () => {
    const { nodes } = parser.parseInterface(filePath, tcEmptyInterface);
    const sorted = sorter.sortInterfaceElements(nodes);

    expect(sorted.length).toBe(0);
  });

  test("should sort one interface with export prefix", () => {
    const { nodes } = parser.parseInterface(
      filePath,
      tcPrefixExport + tcInterfaceWithOneProperty
    );
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

  test("should sort capital letter first if sortByCapitalLetterFirst is true", () => {
    const sorter2 = new SimpleTsSorter(
      new SimpleConfigurator({
        default: { ...defaultConfig, sortByCapitalLetterFirst: true },
      })
    );

    const textIntput = tcInterfaceWithCapitalLetter;
    const { nodes } = parser.parseInterface(filePath, textIntput);
    const sorted = sorter2.sortInterfaceElements(nodes);

    expect(sorted.length).toBe(1);
    expect(sorted[0].rangeToRemove).toEqual({ pos: 23, end: 82 });
    expect(sorted[0].textToReplace).toEqual(
      "\n  Length: number;\n\n  description: string;\n\n  name: string;"
    );
  });

  test("should sort by ASCII order if sortByCapitalLetterFirst is false", () => {
    const sorter2 = new SimpleTsSorter(
      new SimpleConfigurator({
        default: { ...defaultConfig, sortByCapitalLetterFirst: false },
      })
    );

    const textIntput = tcInterfaceWithCapitalLetter;
    const { nodes } = parser.parseInterface(filePath, textIntput);
    const sorted = sorter2.sortInterfaceElements(nodes);

    expect(sorted.length).toBe(1);
    expect(sorted[0].rangeToRemove).toEqual({ pos: 23, end: 82 });
    expect(sorted[0].textToReplace).toEqual(
      "\n  description: string;\n\n  Length: number;\n\n  name: string;"
    );
  });

  test.skip("should sort optional first", () => {
    const textIntput = tcInterfaceWithOptionalProperty;
    const { nodes } = parser.parseInterface(filePath, textIntput);
    const sorted = sorter.sortInterfaceElements(nodes);

    // expect(sorted.length).toBe(1);
    // expect(sorted[0].rangeToRemove).toEqual({ pos: 23, end: 143 });
    // expect(sorted[0].textToReplace).toEqual(
    //   textIntput.substring(93, 143) + "\n" + textIntput.substring(23, 92)
    // );
  });
});
