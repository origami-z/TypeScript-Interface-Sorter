import * as path from "path";

/**
 * The TypeScript compiler API module type.
 */
export type TypeScriptApi = typeof import("typescript");

export interface TypeScriptResolution {
  tsModule: TypeScriptApi;
  version: string;
  resolvedFrom: string;
}

/**
 * Resolves the TypeScript module to use at runtime.
 *
 * Priority:
 * 1. Path from `typescript.tsdk` VS Code setting (user's selected TS version)
 * 2. Workspace `node_modules/typescript`
 * 3. Bundled TypeScript (fallback)
 */
export function resolveTypeScript(
  tsdk: string | undefined,
  workspacePaths: string[]
): TypeScriptResolution {
  // 1. Try typescript.tsdk setting
  if (tsdk) {
    const result = tryResolveTsdk(tsdk, workspacePaths);
    if (result) {
      return result;
    }
  }

  // 2. Try workspace node_modules
  for (const wsPath of workspacePaths) {
    const result = tryRequireTs(
      path.join(wsPath, "node_modules", "typescript"),
      "workspace"
    );
    if (result) {
      return result;
    }
  }

  // 3. Bundled fallback
  return getBundledTypeScript();
}

export function getBundledTypeScript(): TypeScriptResolution {
  const ts = require("typescript");
  return { tsModule: ts, version: ts.version, resolvedFrom: "bundled" };
}

function tryResolveTsdk(
  tsdk: string,
  workspacePaths: string[]
): TypeScriptResolution | null {
  const pathsToTry = path.isAbsolute(tsdk)
    ? [tsdk]
    : workspacePaths.map((ws) => path.resolve(ws, tsdk));

  for (const tsdkPath of pathsToTry) {
    // tsdk points to TypeScript's lib directory, go up to package root
    const tsPackagePath = path.resolve(tsdkPath, "..");
    const result = tryRequireTs(tsPackagePath, "tsdk");
    if (result) {
      return result;
    }
  }
  return null;
}

function tryRequireTs(
  tsPath: string,
  source: string
): TypeScriptResolution | null {
  try {
    const tsModule = require(tsPath);
    if (
      tsModule &&
      typeof tsModule.version === "string" &&
      typeof tsModule.createSourceFile === "function"
    ) {
      return { tsModule, version: tsModule.version, resolvedFrom: source };
    }
  } catch {
    // Module not found or invalid
  }
  return null;
}
