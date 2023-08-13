// @ts-check
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

export const __dirname = fileURLToPath(new URL(".", import.meta.url));

export const rootPath = path.resolve(__dirname, "..");

export const pkgsPath = path.resolve(rootPath, "packages");

export const scriptsPath = path.resolve(rootPath, "scripts");

export const configPath = path.resolve(scriptsPath, "rollup.config.ts");

const windowsSlashRE = /\\/g;
export function slash(p) {
  return p.replace(windowsSlashRE, "/");
}

export const isWindows = os.platform() === "win32";

export function normalizePath(id) {
  return path.posix.normalize(isWindows ? slash(id) : id);
}
