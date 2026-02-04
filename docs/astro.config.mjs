// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';
import remarkGithubAlerts from 'remark-github-alerts';

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
  },
  integrations: [
    starlight({
      title: 'AlgoKit Utils TypeScript',
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
          },
        }),
      ],
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'Getting Started',
          items: [{ label: 'Quick Start', slug: 'tutorials/quick-start' }],
        },
        {
          label: 'Core Concepts',
          collapsed: false,
          autogenerate: { directory: 'concepts' },
        },
        {
          label: 'Migration Guides',
          collapsed: true,
          autogenerate: { directory: 'migration' },
        },
        typeDocSidebarGroup,
      ],
    }),
  ],
});