import pkg from './package.json' with { type: 'json' }
import createConfig from './rolldown'

export default createConfig(
  [...Object.keys(pkg.dependencies || {})],
  ['src/index.ts', 'src/testing/index.ts', 'src/types/*.ts', '!src/types/*.spec.ts'],
)
