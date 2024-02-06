import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { RollupOptions } from 'rollup'

const config: RollupOptions = {
  input: ['src/index.ts', 'src/testing/index.ts'],
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
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
  // no deps, normally external might be all your deps: [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})], import pkg from './package.json'
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
      sourceMap: true,
    }),
    nodeResolve(),
  ],
  external: ['algosdk'],
}

export default config
