import os from 'node:os'
import type { Project } from '@pnpm/find-workspace-packages'
import { findWorkspacePackages } from '@pnpm/find-workspace-packages'
import { pkgsPath } from './paths'

const getWorkspacePackages = () => findWorkspacePackages(pkgsPath)

async function main() {
  const pkgs = await getWorkspacePackages()
  await buildAll(pkgs)
}

async function buildAll(target: Project[]) {
  return runParallel(os.cpus().length, target, build)
}

async function runParallel(
  maxConcurrent: number,
  source: Project[],
  buildFn: (project: Project) => void,
) {
  const ret = []
  const executing: Promise<void>[] = []
  for (const item of source) {
    const p = Promise.resolve().then(() => buildFn(item))
    // 封装所有打包任务
    ret.push(p)

    //
    if (maxConcurrent <= source.length) {
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrent)
        await Promise.race(executing)
    }
  }

  return Promise.all(ret)
}

async function build(
  project: Project,
) {
  console.log(project)
  // cpu+1
  // exec()
}

main().catch((err) => {
  console.error(err)
})
