//@ts-ignore
import { __dirname, pkgsPath, require } from "./paths.js";
import path from 'node:path';
import esbuild, { Plugin } from 'esbuild';
import minimist from 'minimist';
import { polyfillNode } from 'esbuild-plugin-polyfill-node'


const args = minimist(process.argv.slice(2))
const target = args._[0] || 'vue'
const format = args.f || 'esm'
const pkg = require(`../packages/${target}/package.json`)

const outputFormat = format.startsWith('global')
  ? 'iife'
  : format === 'cjs'
  ? 'cjs'
  : 'esm'


const postfix = format.endsWith('-runtime')
  ? `runtime.${format.replace(/-runtime$/, '')}`
  : format

const outfile = path.resolve(
  __dirname,
  `../packages/${target}/dist/${
    target === 'vue-compat' ? `vue` : target
  }.${postfix}.js`
)

const relativeOutfile = path.relative(process.cwd(), outfile)

const plugins:Plugin[] = [
  {
    name: 'log-rebuild',
    setup(build) {
      build.onEnd(() => {
        console.log(`built: ${relativeOutfile}`)
      })
    }
  }
]

if (format === 'cjs' || pkg.buildOptions?.enableNonBrowserBranches) {
  plugins.push(polyfillNode())
} 

esbuild
.context({
  entryPoints: [path.resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true,
  external:[],
  sourcemap: true,
  minify: false,
  format:outputFormat,
  globalName:'VueMini',
  platform: format === 'cjs' ? 'node' : 'browser', 
  plugins,
  define: {
    __COMMIT__: `"dev"`,
    __VERSION__: `"${pkg.version}"`,
  }
})
.then(ctx => ctx.watch())