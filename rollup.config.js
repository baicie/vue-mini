// @ts-check
import json from "@rollup/plugin-json";
import path from "node:path";
import esbuild from "rollup-plugin-esbuild";
// import { pkgsPath } from "./paths.js";
import process from "node:process";
import commonJS from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import polyfillNode from "rollup-plugin-polyfill-node";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const packageDir = path.resolve(
  __dirname,
  "packages",
  process.env.TARGET ?? ""
);
console.log("packageDir", esbuild);
const resolve = (p) => path.resolve(packageDir, p);
const name = "";
const outputConfigs = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`,
  },
  "esm-browser": {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`,
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`,
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`,
  },
  // runtime-only builds, for main "vue" package only
  "esm-bundler-runtime": {
    file: resolve(`dist/${name}.runtime.esm-bundler.js`),
    format: `es`,
  },
  "esm-browser-runtime": {
    file: resolve(`dist/${name}.runtime.esm-browser.js`),
    format: "es",
  },
  "global-runtime": {
    file: resolve(`dist/${name}.runtime.global.js`),
    format: "iife",
  },
};

// /**
//  * @type {Manifest}
//  */
const pkg = require(resolve(`package.json`));
const packageOptions = pkg.buildOptions || {};
console.log(pkg);
const defaultFormats = ["esm-bundler", "cjs"];
const packageFormats = packageOptions.formats || defaultFormats;
const packageConfigs = packageFormats.map((format) =>
  createConfig(format, outputConfigs[format])
);

console.log("packageConfigs", packageConfigs);

export default packageConfigs;

// /**
//  *
//  * @param {string} format
//  * @param {OutputOptions} output
//  * @returns {RollupOptions}
//  */
/**
 * @param {string} format
 * @param {any} output
 */
function createConfig(format, output) {
  let entryFile = /runtime$/.test(format) ? `src/runtime.ts` : `src/index.ts`;

  function resolveExternal() {
    return [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ];
  }

  function resolveDefine() {
    const replacements = {
      __VERSION__: `"${"0.0.1"}"`,
    };
    return replacements;
  }

  function resolveNodePlugins() {
    let cjsIgnores = [];
    const nodePlugins =
      format === "cjs" && Object.keys(pkg.devDependencies || {}).length
        ? [
            commonJS({
              sourceMap: false,
              ignore: cjsIgnores,
            }),
            ...(format === "cjs" ? [] : [polyfillNode()]),
            nodeResolve(),
          ]
        : [];
    return nodePlugins;
  }

  return {
    input: resolve(entryFile),
    external: resolveExternal(),
    plugins: [
      json({
        namedExports: false,
      }),
      esbuild({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
        sourceMap: false,
        minify: false,
        target: "es2015",
        define: resolveDefine(),
      }),
      ...resolveNodePlugins(),
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg.message)) {
        warn(msg);
      }
    },
    treeshake: {
      moduleSideEffects: false,
    },
  };
}
