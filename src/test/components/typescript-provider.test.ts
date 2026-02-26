import * as path from "path";
import { resolveTypeScript, getBundledTypeScript } from "../../typescript-provider";
import { SimpleTsParser } from "../../components/parser";
import { SimpleConfigurator, defaultConfig } from "../../components/configurator";

describe("TypeScriptProvider", () => {
  describe("getBundledTypeScript", () => {
    test("should return bundled TypeScript module", () => {
      const result = getBundledTypeScript();

      expect(result.tsModule).toBeDefined();
      expect(typeof result.tsModule.createSourceFile).toBe("function");
      expect(typeof result.version).toBe("string");
      expect(result.resolvedFrom).toBe("bundled");
    });
  });

  describe("resolveTypeScript", () => {
    test("should return bundled TypeScript when no tsdk and no workspace paths", () => {
      const result = resolveTypeScript(undefined, []);

      expect(result.resolvedFrom).toBe("bundled");
      expect(typeof result.tsModule.createSourceFile).toBe("function");
    });

    test("should return bundled TypeScript when workspace path has no node_modules/typescript", () => {
      const result = resolveTypeScript(undefined, ["/nonexistent/path"]);

      expect(result.resolvedFrom).toBe("bundled");
    });

    test("should resolve from workspace node_modules when typescript is present", () => {
      // Use the actual project's node_modules as a workspace path
      const projectRoot = path.resolve(__dirname, "..", "..", "..");
      const result = resolveTypeScript(undefined, [projectRoot]);

      expect(result.resolvedFrom).toBe("workspace");
      expect(typeof result.tsModule.createSourceFile).toBe("function");
      expect(typeof result.version).toBe("string");
    });

    test("should resolve from tsdk when valid path is provided", () => {
      // Point tsdk to the actual TypeScript lib directory
      const projectRoot = path.resolve(__dirname, "..", "..", "..");
      const tsdkPath = path.join(projectRoot, "node_modules", "typescript", "lib");
      const result = resolveTypeScript(tsdkPath, []);

      expect(result.resolvedFrom).toBe("tsdk");
      expect(typeof result.tsModule.createSourceFile).toBe("function");
    });

    test("should resolve from relative tsdk path", () => {
      const projectRoot = path.resolve(__dirname, "..", "..", "..");
      const result = resolveTypeScript("node_modules/typescript/lib", [projectRoot]);

      expect(result.resolvedFrom).toBe("tsdk");
      expect(typeof result.tsModule.createSourceFile).toBe("function");
    });

    test("should fall back to workspace when tsdk path is invalid", () => {
      const projectRoot = path.resolve(__dirname, "..", "..", "..");
      const result = resolveTypeScript("/invalid/tsdk/path", [projectRoot]);

      expect(result.resolvedFrom).toBe("workspace");
    });

    test("should prioritize tsdk over workspace", () => {
      const projectRoot = path.resolve(__dirname, "..", "..", "..");
      const tsdkPath = path.join(projectRoot, "node_modules", "typescript", "lib");
      const result = resolveTypeScript(tsdkPath, [projectRoot]);

      // tsdk should take priority
      expect(result.resolvedFrom).toBe("tsdk");
    });
  });

  describe("parser integration with resolved TypeScript", () => {
    test("should parse interfaces using resolved TypeScript module", () => {
      const resolved = getBundledTypeScript();
      const parser = new SimpleTsParser(
        new SimpleConfigurator({ default: defaultConfig }),
        resolved.tsModule
      );

      const { nodes } = parser.parseTypeNodes("test.ts", `
interface ITest {
  name: string;
  age: number;
}
      `);

      expect(nodes.length).toBe(1);
      expect(nodes[0].members.length).toBe(2);
    });
  });
});
