// @ts-check
import { css, fonts } from '@algorandfoundation/devportal-docs/theme'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import remarkGithubAlerts from 'remark-github-alerts'
import starlightLinksValidator from 'starlight-links-validator'
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc'
import { sidebar } from './sidebar.config'

// https://astro.build/config
export default defineConfig({
  site: 'https://algorandfoundation.github.io',
  base: '/algokit-utils-ts/',
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
  },
  vite: { plugins: [tailwindcss()] },
  integrations: [
    starlight({
      title: 'AlgoKit Utils TypeScript',
      customCss: [
        css,
        fonts,
        './src/styles/global.css',
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
          entryPoints: [
            '../src/index.ts',
            '../src/testing/index.ts',
            '../src/abi/index.ts',
            '../src/transact/index.ts',
            '../src/transaction/index.ts',
            '../src/algod-client/index.ts',
            '../src/indexer-client/index.ts',
            '../src/kmd-client/index.ts',
            '../src/algo25/index.ts',
          ],
          tsconfig: '../tsconfig.build.json',
          output: 'api',
          sidebar: {
            label: 'API Reference',
            collapsed: true,
          },
          typeDoc: {
            excludeReferences: true,
            gitRevision: 'main',
            entryFileName: 'index.md',
          },
        }),
        // Skip link validation during devportal builds — cross-site links
        // (e.g. /concepts/smart-contracts/...) only resolve in the full portal.
        ...(process.env.SKIP_LINK_VALIDATION
          ? []
          : [
              starlightLinksValidator({
                errorOnInvalidHashes: false,
                errorOnLocalLinks: false,
              }),
            ]),
      ],
      sidebar: [...sidebar, typeDocSidebarGroup],
    }),
  ],
})
