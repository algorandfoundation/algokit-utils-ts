import type { TsToolkitConfig } from '@makerx/ts-toolkit'

const config: TsToolkitConfig = {
  packageConfig: {
    srcDir: 'src',
    outDir: 'dist',
    main: 'index.js',
    customSections: ['module', 'main', 'type', 'types', 'exports'],
  },
}
export default config
