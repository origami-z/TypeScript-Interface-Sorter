import { defaultConfig, SimpleConfigurator } from "../../components/configurator";
import { SimpleTsParser } from "../../components/parser";

import {
  tcClassImplementInterface,
  tcEmptyInterface,
  tcPrefixExport,
  tcInterfaceWithOneProperty,
  tcInterfaceWithExtends,
  tcInterfaceWithComment,
  typeWithJsDocProperty,
  tcPrefixes
} from "./test-cases";

describe("Parser", () => {
  describe('default setting', () => {
    const parser = new SimpleTsParser(new SimpleConfigurator({ default: defaultConfig }));
    const filePath = "Untitled-1";
    describe("parse number of interface", () => {
      test("should parse no interface", () => {
        const { nodes } = parser.parseTypeNodes(filePath, tcClassImplementInterface);

        expect(nodes.length).toBe(0);
      });

      test("should parse one interface with input of empty interface", () => {
        const { nodes } = parser.parseTypeNodes(filePath, tcEmptyInterface);
        expect(nodes.length).toBe(1);
      });

      test("should parse one interface with export prefix", () => {
        const { nodes } = parser.parseTypeNodes(
          filePath,
          tcPrefixExport + tcInterfaceWithOneProperty
        );
        expect(nodes.length).toBe(1);
      });

      test("should parse two interfaces with one extends the other", () => {
        const { nodes } = parser.parseTypeNodes(filePath, tcInterfaceWithExtends);
        expect(nodes.length).toBe(2);
      });

      test("should parse one interface with comments", () => {
        const { nodes } = parser.parseTypeNodes(filePath, tcInterfaceWithComment);
        expect(nodes.length).toBe(1);
      });
    });

    describe('parse number of types', () => {
      test.each(tcPrefixes)("test - %s", (prefix) => {
        const { nodes } = parser.parseTypeNodes(filePath, prefix + typeWithJsDocProperty);
        expect(nodes.length).toBe(1);
        expect(nodes[0].members[0].text).toEqual('name: string;');
        expect(nodes[0].members[1].text).toEqual('length: number;');
      });
    });
  });

  describe('when sortTypes=false', () => {
    const parser = new SimpleTsParser(
      new SimpleConfigurator({
        default: {
          ...defaultConfig,
          sortTypes: false
        },
      }));
    const filePath = "Untitled-1";
    test('should not parse type', () => {
      const { nodes } = parser.parseTypeNodes(filePath, `export type CustomType = ` + typeWithJsDocProperty);
      expect(nodes.length).toBe(0);
    });
    test('should parse interface', () => {
      const { nodes } = parser.parseTypeNodes(filePath, `export interface IInterface` + typeWithJsDocProperty);
      expect(nodes.length).toBe(1);
    });
  });
});
