// @ts-check
import commonJS from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "node:path";
import process from "node:process";
import esbuild from "rollup-plugin-esbuild";
import polyfillNode from "rollup-plugin-polyfill-node";
import { __dirname, pkgsPath, require } from "./scripts/paths.js";

/**
 * @type {string|undefined}
 */
const target = process.env.TARGET

if(!target){
  throw new Error('TARGET package must be specified via --environment flag.') 
}

const packageDir = path.resolve(pkgsPath,target);

/**
 * 
 * @param {string} p 
 * @returns 
 */
const resolve = (p) => path.resolve(packageDir, p);
const name =  path.basename(packageDir)

/**
 * @type {Record<string,import('rollup').OutputOptions>}
 */
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

/**
 * @type {import('./scripts/types.d.ts').Manifest}
 */
const pkg = require(resolve(`package.json`));
const packageOptions = pkg.buildOptions || {};

const defaultFormats = ["esm-bundler", "cjs"];
const packageFormats = packageOptions.formats || defaultFormats;
const packageConfigs = packageFormats.map((format) =>
  createConfig(format, outputConfigs[format])
);


export default packageConfigs;

/**
 * @param {string} format
 * @param {import('rollup').OutputOptions} output
 * @returns {import('rollup').RollupOptions}
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
