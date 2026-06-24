// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import remarkGithubAlerts from 'remark-github-alerts'
import starlightTypeDoc from 'starlight-typedoc'
import remarkFixIndexUrls from './plugins/remark-fix-index-urls'
import sidebarConfig from './sidebar.config.json'

// https://astro.build/config
export default defineConfig({
  site: 'https://algorandfoundation.github.io',
  base: '/algokit-utils-ts/',
  markdown: {
    remarkPlugins: [remarkGithubAlerts, remarkFixIndexUrls],
  },
  integrations: [
    starlight({
      title: 'AlgoKit Utils TypeScript',
      customCss: [
        'remark-github-alerts/styles/github-colors-light.css',
        'remark-github-alerts/styles/github-colors-dark-media.css',
        'remark-github-alerts/styles/github-base.css',
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/algorandfoundation/algokit-utils-ts' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/algorand' },
      ],
      plugins: [
        starlightTypeDoc({
          entryPoints: ['../src/index.ts', '../src/testing/index.ts'],
          tsconfig: '../tsconfig.build.json',
          output: 'api',
          sidebar: {
            label: 'API Reference',
            collapsed: true,
          },
          typeDoc: {
            excludeReferences: true,
            gitRevision: 'main',
            entryFileName: 'index',
            // v9 src type-checks cleanly with its own toolchain (node 20 types);
            // the docs toolchain resolves newer @types/node, so skip TypeDoc's
            // strict diagnostic pass which would otherwise flag Buffer/Uint8Array drift.
            skipErrorChecking: true,
          },
        }),
      ],
      sidebar: sidebarConfig,
    }),
  ],
})
