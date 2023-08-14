//@ts-ignore
import { __dirname, pkgsPath, require } from "./paths.js";
import path from 'node:path';
import esbuild, { Plugin } from 'esbuild';

const target = 'vue'

const plugins:Plugin[] = [
  {
    name: 'log-rebuild',
    setup(build) {
      build.onEnd(() => {
        // console.log(`built:  `)
      })
    }
  }
]

// if (format === 'cjs' || pkg.buildOptions?.enableNonBrowserBranches) {
//   plugins.push(polyfillNode())
// }

esbuild
.context({
  entryPoints: [path.resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile:'',
  bundle: true,
  external:[],
  sourcemap: true,
  minify: true,
  format:'cjs',
  globalName:'Vue',
  // platform: format === 'cjs' ? 'node' : 'browser',
  platform:'node',
  plugins,
  define: {
    __COMMIT__: `"dev"`,
  }
})
.then(ctx => ctx.watch())