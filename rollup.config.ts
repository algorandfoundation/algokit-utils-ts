import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import MagicString from 'magic-string'
import type { Plugin } from 'rollup'
import { RollupOptions } from 'rollup'
import pkg from './package.json' with { type: 'json' }

const normaliseEsmOutput = (): Plugin => {
  const CJSFilenameRegex = /__filename/g
  const CJSDirnameRegex = /__dirname/g
  // Replace with dynamically imported ESM equivalents, so that they work in the browser and in Node.js
  const filenameReplacement = "await import('url').then((url) => url.fileURLToPath(import.meta.url))"
  const dirnameReplacement = `await import('path').then(async (path) => path.dirname(${filenameReplacement}))`

  return {
    name: 'normaliseEsmOutput',
    renderChunk(code, _chunk, opts) {
      if (opts.format === 'es') {
        if (!CJSDirnameRegex.test(code) && !CJSFilenameRegex.test(code)) {
          return null
        }
        const s = new MagicString(code.replace(CJSDirnameRegex, dirnameReplacement).replace(CJSFilenameRegex, filenameReplacement))
        return {
          code: s.toString(),
          ...(opts.sourcemap !== false ? { map: s.generateMap({ hires: true }) } : {}),
        }
      }

      return null
    },
  }
}

const config: RollupOptions = {
  input: ['src/index.ts', 'src/testing/index.ts'],
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].js',
      preserveModules: true,
      sourcemap: true,
      dynamicImportInCjs: false,
    },
    {
      dir: 'dist',
      format: 'es',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      sourcemap: true,
    },
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
    normaliseEsmOutput(),
  ],
  external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
}

export default config
