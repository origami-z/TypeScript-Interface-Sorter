import { SimpleTsParser } from "../../components/parser";

import {
  tcClassImplementInterface,
  tcEmptyInterface,
  tcPrefixExport,
  tcInterfaceWithOneProperty,
  tcInterfaceWithExtends,
  tcInterfaceWithComment,
  tcImportsReact,
  tcImportsPlainCss,
  tcImportsCssModule
} from "./test-cases";

describe("Parser", () => {
  const parser = new SimpleTsParser();
  const filePath = "Untitled-1";
  describe("parse number of interface", () => {
    test("should parse no interface", () => {
      const { nodes } = parser.parseInterface(filePath, tcClassImplementInterface);

      expect(nodes.length).toBe(0);
    });

    test("should parse one interface with input of empty interface", () => {
      const { nodes } = parser.parseInterface(filePath, tcEmptyInterface);
      expect(nodes.length).toBe(1);
    });

    test("should parse one interface with export prefix", () => {
      const { nodes } = parser.parseInterface(
        filePath,
        tcPrefixExport + tcInterfaceWithOneProperty
      );
      expect(nodes.length).toBe(1);
    });

    test("should parse two interfaces with one extends the other", () => {
      const { nodes } = parser.parseInterface(filePath, tcInterfaceWithExtends);
      expect(nodes.length).toBe(2);
    });

    test("should parse one interface with comments", () => {
      const { nodes } = parser.parseInterface(filePath, tcInterfaceWithComment);
      expect(nodes.length).toBe(1);
    });
  });

  describe("parse import declaration", () => {

    test("should parse imports from react", () => {
      const { nodes } = parser.parseImports(filePath, tcImportsReact);
      expect(nodes.length).toBe(1);
      expect(nodes[0].moduleSpecifierText).toEqual('\'react\'');
    });

    test("should parse imports from plain css", () => {
      const { nodes } = parser.parseImports(filePath, tcImportsPlainCss);
      expect(nodes.length).toBe(1);
    });

    test("should parse imports from css module", () => {
      const { nodes } = parser.parseImports(filePath, tcImportsCssModule);
      expect(nodes.length).toBe(1);
    });



  });
});
