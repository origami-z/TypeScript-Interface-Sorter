import "jest";
import * as vscode from "vscode";

import { SimpleTsParser } from "../components/parser";

import { tcClassImplementInterface, tcEmptyInterface } from "./testCases";

describe("Parser", () => {
  const parser = new SimpleTsParser();
  const filePath = "Untitled-1";
  describe("parse correct number of interface", () => {
    test("should parse no interface", () => {
      const { nodes } = parser.parseInterface(filePath, tcClassImplementInterface);
      expect(nodes.length).toBe(0);
    });

    test("should pass one interface with input of empty interface", () => {
      const { nodes } = parser.parseInterface(filePath, tcEmptyInterface);
      expect(nodes.length).toBe(1);
    });
  });

  test("Something 1", () => {
    expect([1, 2, 3].indexOf(5)).toEqual(-1);
    expect([1, 2, 3].indexOf(0)).toEqual(-1);
  });
});
