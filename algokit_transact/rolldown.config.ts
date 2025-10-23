import createConfig from '../rolldown'
import pkg from './package.json' with { type: 'json' }

export default createConfig([...Object.keys(pkg.dependencies || {})])
