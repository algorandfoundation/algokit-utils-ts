import pkg from './package.json' with { type: 'json' }
import createConfig from './rolldown'

export default createConfig(
  [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {}), /^algosdk\/*/],
  ['src/index.ts', 'src/testing/index.ts', 'src/types/*.ts', '!src/types/*.spec.ts'],
)
