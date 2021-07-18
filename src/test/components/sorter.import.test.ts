import { IInterfaceSorterConfiguration, SimpleConfigurator } from "../../components/configurator";
import { SimpleTsParser } from "../../components/parser";
import { SimpleTsSorter } from "../../components/sorter";
import { tcImportsReact, tcImportsCommon1 } from "./test-cases";


describe("Import Sorter", () => {
  const defaultConfig: IInterfaceSorterConfiguration = {
    lineBetweenMembers: true,
    indentSpace: 2,
    sortByCapitalLetterFirst: false,
    sortByRequiredElementFirst: false,
  };

  const parser = new SimpleTsParser();
  const sorter = new SimpleTsSorter(
    new SimpleConfigurator({ default: defaultConfig })
  );

  const filePath = "Untitled-1";

  test("should sort global package first", () => {
    const { nodes } = parser.parseImports(
      filePath,
      tcImportsCommon1
    );
    const sorted = sorter.sortImportStatements(nodes);

    // FIXME: Test is not written yet
    expect(sorted.length).toBe(0);
  });

});