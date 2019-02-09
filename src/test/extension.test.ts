import "jest";
import * as vscode from "vscode";

import { SimpleTsParser } from "../components/parser";

import {
  tcClassImplementInterface,
  tcEmptyInterface,
  tcPrefixExport,
  tcInterfaceWithOneProperty,
  tcInterfaceWithExtends,
  tcInterfaceWithComment
} from "./testCases";

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
      const { nodes } = parser.parseInterface(
        filePath,
        `${tcEmptyInterface}\n\n${tcInterfaceWithExtends}`
      );
      expect(nodes.length).toBe(2);
    });

    test("should parse one interface with comments", () => {
      const { nodes } = parser.parseInterface(filePath, tcInterfaceWithComment);
      expect(nodes.length).toBe(1);
    });
  });

  test("Something 1", () => {
    expect([1, 2, 3].indexOf(5)).toEqual(-1);
    expect([1, 2, 3].indexOf(0)).toEqual(-1);
  });
});
