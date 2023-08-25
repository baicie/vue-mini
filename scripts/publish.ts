import { findWorkspacePackages } from "@pnpm/find-workspace-packages";
// @ts-ignore
import { pkgsPath } from "./paths";
import { Project } from "@pnpm/types";
import color from 'picocolors';
import consola from "consola";
import { execa } from "execa";

const getWorkspacePackages = () => findWorkspacePackages(pkgsPath);

async function main() {
  const version = process.env.TAG_VERSION || '0.0.0'
  const pkgs = (await getWorkspacePackages()).filter(
    (item) => !item.manifest.private
  ) as Project[];

  await updateVersion(version, pkgs)

  await publishAll(pkgs);
}

async function updateVersion(version: string,targets: Project[]) {
  for (const target of targets) {
    await target.writeProjectManifest({
      ...target.manifest,
      version,
      publishConfig:{
        registry:'https://registry.npmjs.org/'
      }
    })
  }
}

async function publishAll(targets: Project[]) {
  for (const target of targets) {
    execa(
      "pnpm publish --access public",
      [ 
        '--no-git-checks',
      ],  
      {
        stdio: 'inherit',
        cwd: target.dir
      }
    )
  }
}

main().catch((err) => {
  consola.error(color.red(err));
});
