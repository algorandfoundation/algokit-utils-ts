import fg from 'fast-glob'
import { LogLevel, LogOrStringHandler, RollupLog, defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import workspacePkg from './package.json' with { type: 'json' }

type StringOrRegExp = string | RegExp

export default function createConfig(externalDependencies: StringOrRegExp[], input: string[] = ['src/index.ts']): typeof config {
  const external = Array.from(new Set([...Object.keys(workspacePkg.dependencies || {}), ...externalDependencies]))

  const resolvedInput = input.flatMap((pattern) => {
    // If it contains glob characters or negations, resolve with fast-glob
    if (pattern.includes('*') || pattern.includes('!')) {
      return fg.sync(pattern, { ignore: input.filter((p) => p.startsWith('!')) })
    }
    return pattern
  })

  const common = defineConfig({
    input: resolvedInput,
    checks: {
      circularDependency: true,
    },
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
    },
    tsconfig: 'tsconfig.build.json',
    external: external,
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
