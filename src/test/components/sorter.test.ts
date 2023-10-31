import { SimpleTsParser } from "../../components/parser";
import { SimpleTsSorter } from "../../components/sorter";
import {
  defaultConfig,
  IInterfaceSorterConfiguration,
  SimpleConfigurator,
} from "../../components/configurator";

import {
  tcPrefixes,
  tcClassImplementInterface,
  tcEmptyInterface,
  tcPrefixExport,
  tcInterfaceWithExtends,
  tcInterfaceWithOptionalProperty,
  tcInterfaceWithCapitalLetter,
  tcInterfaceWithMultipleOptionalProperty,
  typeWithJsDocProperty,
  typeWithOneProperty,
} from "./test-cases";

describe("Sorter", () => {
  const parser = new SimpleTsParser(
    new SimpleConfigurator({ default: defaultConfig })
  );
  const sorter = new SimpleTsSorter(
    new SimpleConfigurator({ default: defaultConfig })
  );

  const filePath = "Untitled-1";

  test("should not break with no interface", () => {
    const { nodes } = parser.parseTypeNodes(
      filePath,
      tcClassImplementInterface
    );
    const sorted = sorter.sortGenericTypeElements(nodes);

    expect(sorted.length).toBe(0);
  });

  test("should not sort with empty interface", () => {
    const { nodes } = parser.parseTypeNodes(filePath, tcEmptyInterface);
    const sorted = sorter.sortGenericTypeElements(nodes);

    expect(sorted.length).toBe(0);
  });

  test.each([tcPrefixes])(
    "should sort one with export prefix - %s",
    (prefix) => {
      const prefixLength = prefix.length;
      const exportLength = tcPrefixExport.length;
      const { nodes } = parser.parseTypeNodes(
        filePath,
        tcPrefixExport + prefix + typeWithOneProperty
      );
      const sorted = sorter.sortGenericTypeElements(nodes);

      expect(sorted.length).toBe(1);
      //
      expect(sorted[0].rangeToRemove).toEqual({
        pos: prefixLength + exportLength + 1,
        end: prefixLength + exportLength + 17,
      });
    }
  );

  test("should sort two interfaces with one extends the other", () => {
    const textIntput = tcInterfaceWithExtends;
    const { nodes } = parser.parseTypeNodes(filePath, textIntput);
    const sorted = sorter.sortGenericTypeElements(nodes);

    expect(sorted.length).toBe(1);
    expect(sorted[0].rangeToRemove).toEqual({ pos: 75, end: 110 });
    expect(sorted[0].textToReplace).toEqual(
      textIntput.substring(92, 110) + "\n" + textIntput.substring(75, 91)
    );
  });

  test.each(tcPrefixes)(`should sort one type with comments - %s`, (prefix) => {
    const prefixLength = prefix.length;
    const textIntput = prefix + typeWithJsDocProperty;
    const { nodes } = parser.parseTypeNodes(filePath, textIntput);
    const sorted = sorter.sortGenericTypeElements(nodes);

    expect(sorted.length).toBe(1);
    expect(sorted[0].rangeToRemove).toEqual({
      pos: prefixLength + 1,
      end: prefixLength + 121,
    });
    expect(sorted[0].textToReplace).toEqual(
      textIntput.substring(prefixLength + 71, prefixLength + 121) +
        "\n" +
        textIntput.substring(prefixLength + 1, prefixLength + 70)
    );
  });

  test("should sort capital letter first if sortByCapitalLetterFirst is true", () => {
    const sorter2 = new SimpleTsSorter(
      new SimpleConfigurator({
        default: { ...defaultConfig, sortByCapitalLetterFirst: true },
      })
    );

    const textIntput = tcInterfaceWithCapitalLetter;
    const { nodes } = parser.parseTypeNodes(filePath, textIntput);
    const sorted = sorter2.sortGenericTypeElements(nodes);

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
    const { nodes } = parser.parseTypeNodes(filePath, textIntput);
    const sorted = sorter2.sortGenericTypeElements(nodes);

    expect(sorted.length).toBe(1);
    expect(sorted[0].rangeToRemove).toEqual({ pos: 23, end: 82 });
    expect(sorted[0].textToReplace).toEqual(
      "\n  description: string;\n\n  Length: number;\n\n  name: string;"
    );
  });

  describe("when sortByRequiredElementFirst = true", () => {
    test("should sort required first", () => {
      const sorter2 = new SimpleTsSorter(
        new SimpleConfigurator({
          default: {
            ...defaultConfig,
            sortByCapitalLetterFirst: false,
            sortByRequiredElementFirst: true,
          },
        })
      );

      const textIntput = tcInterfaceWithOptionalProperty;
      const { nodes } = parser.parseTypeNodes(filePath, textIntput);
      const sorted = sorter2.sortGenericTypeElements(nodes);

      expect(sorted.length).toBe(1);
      expect(sorted[0].rangeToRemove).toEqual({ pos: 23, end: 73 });
      expect(sorted[0].textToReplace).toEqual(
        "\n  requiredProp: string;\n\n  optionalProp?: string;"
      );
    });

    test("should sort required first then sort by names", () => {
      const sorter2 = new SimpleTsSorter(
        new SimpleConfigurator({
          default: {
            ...defaultConfig,
            sortByCapitalLetterFirst: false,
            sortByRequiredElementFirst: true,
          },
        })
      );

      const textIntput = tcInterfaceWithMultipleOptionalProperty;
      const { nodes } = parser.parseTypeNodes(filePath, textIntput);
      const sorted = sorter2.sortGenericTypeElements(nodes);

      expect(sorted.length).toBe(1);
      expect(sorted[0].rangeToRemove).toEqual({ pos: 23, end: 125 });
      expect(sorted[0].textToReplace).toEqual(
        "\n  requiredProp1: string;\n\n  RequiredProp2: string;\n\n  optionalProp1?: string;\n\n  OptionalProp2?: string;"
      );
    });

    test("should sort required first then sort by names with capital letter first", () => {
      const sorter2 = new SimpleTsSorter(
        new SimpleConfigurator({
          default: {
            ...defaultConfig,
            sortByCapitalLetterFirst: true,
            sortByRequiredElementFirst: true,
          },
        })
      );

      const textIntput = tcInterfaceWithMultipleOptionalProperty;
      const { nodes } = parser.parseTypeNodes(filePath, textIntput);
      const sorted = sorter2.sortGenericTypeElements(nodes);

      expect(sorted.length).toBe(1);
      expect(sorted[0].rangeToRemove).toEqual({ pos: 23, end: 125 });
      expect(sorted[0].textToReplace).toEqual(
        "\n  RequiredProp2: string;\n\n  requiredProp1: string;\n\n  OptionalProp2?: string;\n\n  optionalProp1?: string;"
      );
    });
  });

  test("should take `indentSpace` setting into account", () => {
    const sorter2 = new SimpleTsSorter(
      new SimpleConfigurator({
        default: { ...defaultConfig, indentSpace: 4 },
      })
    );

    const textIntput = tcInterfaceWithCapitalLetter;
    const { nodes } = parser.parseTypeNodes(filePath, textIntput);
    const sorted = sorter2.sortGenericTypeElements(nodes);

    expect(sorted.length).toBe(1);
    expect(sorted[0].rangeToRemove).toEqual({ pos: 23, end: 82 });
    expect(sorted[0].textToReplace).toEqual(
      "\n    description: string;\n\n    Length: number;\n\n    name: string;"
    );
  });
});
