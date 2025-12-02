import pkg from './package.json' with { type: 'json' }
import createConfig from './rolldown'

export default createConfig(
  [...Object.keys(pkg.dependencies || {})],
  [
    'src/index.ts',
    'src/testing/index.ts',
    'src/types/*.ts',
    '!src/types/*.spec.ts',
    // Package re-exports
    'src/abi/index.ts',
    'src/common/index.ts',
    'src/transact/index.ts',
    'src/algod-client/index.ts',
    'src/indexer-client/index.ts',
    'src/kmd-client/index.ts',
  ],
)
