import { LogLevel, LogOrStringHandler, RollupLog, defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import workspacePkg from './package.json' with { type: 'json' }

export default function createConfig(externalDependencies: string[], input: string[] = ['src/index.ts']): typeof config {
  const external = Array.from(new Set([...Object.keys(workspacePkg.dependencies || {}), ...externalDependencies]))

  const common = defineConfig({
    input,
    checks: {
      circularDependency: true,
    },
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
    },
    tsconfig: 'tsconfig.build.json',
    external,
    onLog(level: LogLevel, log: RollupLog, handler: LogOrStringHandler) {
      // Ignore logs produced for .d.ts files
      if (log.message.includes('.d.ts')) {
        return
      }
      if (log.code === 'CIRCULAR_DEPENDENCY') {
        handler('error', log)
      } else {
        handler(level, log)
      }
    },
  })

  const config = defineConfig([
    {
      ...common,
      output: {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].mjs',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
    },
    {
      ...common,
      output: {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
    },
    {
      ...common,
      plugins: [dts({ emitDtsOnly: true, resolve: true })],
      output: {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
    },
  ])

  return config
}
