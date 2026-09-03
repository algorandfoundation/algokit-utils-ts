import fg from 'fast-glob'
import { builtinModules } from 'node:module'
import { LogLevel, LogOrStringHandler, RollupLog, defineConfig } from 'rolldown'
import workspacePkg from './package.json' with { type: 'json' }

type StringOrRegExp = string | RegExp

const nodeBuiltins = builtinModules.flatMap((m) => [m, `node:${m}`])

// This config emits JS only. Declarations are emitted separately by `tsc --emitDeclarationOnly`
// (see the `build:2-emit-types` script), NOT by `rolldown-plugin-dts`.
//
// `rolldown-plugin-dts` bundles declarations, and that bundling drops `import X = algosdk.Y` alias
// declarations while only partially rewriting their references. v9.2.1 shipped `.d.ts` files referencing
// ~30 undeclared names (`Algodv2`, `Transaction`, `OnApplicationComplete`, ...), which consumers with
// `skipLibCheck: true` silently received as `any`. The source uses that alias form in 132 places, so
// declaration emit stays with tsc, which passes it through untouched.

export default function createConfig(externalDependencies: StringOrRegExp[], input: string[] = ['src/index.ts']): typeof config {
  const external: StringOrRegExp[] = [
    ...nodeBuiltins,
    ...[...Object.keys(workspacePkg.dependencies || {}), ...externalDependencies]
      .map(dep => typeof dep === 'string' ? new RegExp(`^${dep}($|\\/|\\\\)`) : dep),
  ]

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
  ])

  return config
}
