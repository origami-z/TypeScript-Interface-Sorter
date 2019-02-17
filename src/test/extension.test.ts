import "jest";
import * as vscode from "vscode";

test("Something 1", () => {
  expect([1, 2, 3].indexOf(5)).toEqual(-1);
  expect([1, 2, 3].indexOf(0)).toEqual(-1);
});
