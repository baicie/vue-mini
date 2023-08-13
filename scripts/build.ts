import os from "node:os";
import type { Project as PnpmProject } from "@pnpm/find-workspace-packages";
import { ProjectManifest } from "@pnpm/types";
import { findWorkspacePackages } from "@pnpm/find-workspace-packages";
import { configPath, normalizePath, pkgsPath } from "./paths";
import { execa } from "execa";
import path from "node:path";
export type Manifest = ProjectManifest & {
  buildOptions: {
    name?: string;
    compat?: boolean;
    env?: string;
    formats: ("global" | "cjs" | "esm-bundler" | "esm-browser")[];
  };
};

interface Project extends PnpmProject {
  manifest: Manifest;
}

const getWorkspacePackages = () => findWorkspacePackages(pkgsPath);

async function main() {
  const pkgs = (await getWorkspacePackages()).filter(
    (item) => !item.manifest.private
  ) as Project[];
  await buildAll(pkgs);
}

async function buildAll(target: Project[]) {
  return runParallel(os.cpus().length, target, build);
}

async function runParallel(
  maxConcurrent: number,
  source: Project[],
  buildFn: (project: Project) => void
) {
  const ret = [];
  const executing: Promise<void>[] = [];
  for (const item of source) {
    const p = Promise.resolve().then(() => buildFn(item));
    // 封装所有打包任务
    ret.push(p);

    //
    if (maxConcurrent <= source.length) {
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= maxConcurrent) await Promise.race(executing);
    }
  }

  return Promise.all(ret);
}

async function build(project: Project) {
  const pkg = project.manifest;
  const target = path.relative(pkgsPath, project.dir);
  if (pkg.private) {
    return;
  }

  const env = pkg.buildOptions;
  await execa(
    "rollup",
    [
      `--config scripts/rollup.config.js`,
      "--environment",
      [`NODE_ENV:${env}`, `TARGET:${target}`].filter(Boolean).join(","),
    ],
    { stdio: "inherit" }
  );
}

main().catch((err) => {
  console.error(err);
});
