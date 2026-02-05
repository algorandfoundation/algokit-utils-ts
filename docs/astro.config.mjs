// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';
import remarkGithubAlerts from 'remark-github-alerts';

// https://astro.build/config
export default defineConfig({
  site: 'https://algorandfoundation.github.io',
  base: '/algokit-utils-ts/',
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
          items: [
            { slug: 'concepts/core/algorand-client' },
            { slug: 'concepts/core/account' },
            { slug: 'concepts/core/transaction' },
            { slug: 'concepts/core/amount' },
            { slug: 'concepts/core/client' },
          ],
        },
        {
          label: 'Building Applications',
          items: [
            { slug: 'concepts/building/app-client' },
            { slug: 'concepts/building/app-deploy' },
            { slug: 'concepts/building/app' },
            { slug: 'concepts/building/typed-app-clients' },
            { slug: 'concepts/building/asset' },
            { slug: 'concepts/building/transfer' },
            { slug: 'concepts/building/testing' },
          ],
        },
        {
          label: 'Advanced Topics',
          collapsed: true,
          items: [
            { slug: 'concepts/advanced/transaction-composer' },
            { slug: 'concepts/advanced/modular-imports' },
            { slug: 'concepts/advanced/debugging' },
            { slug: 'concepts/advanced/indexer' },
            { slug: 'concepts/advanced/event-emitter' },
            { slug: 'concepts/advanced/dispenser-client' },
          ],
        },
        {
          label: 'Migration Guides',
          collapsed: true,
          autogenerate: { directory: 'migration' },
        },
        {
          label: 'Examples',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/examples/' },
            { label: 'ABI Encoding', link: '/examples/abi/' },
            { label: 'Mnemonic Utilities', link: '/examples/algo25/' },
            { label: 'Algod Client', link: '/examples/algod-client/' },
            { label: 'Algorand Client', link: '/examples/algorand-client/' },
            { label: 'Common Utilities', link: '/examples/common/' },
            { label: 'Indexer Client', link: '/examples/indexer-client/' },
            { label: 'KMD Client', link: '/examples/kmd-client/' },
            { label: 'Testing', link: '/examples/testing/' },
            { label: 'Transactions', link: '/examples/transact/' },
          ],
        },
        typeDocSidebarGroup,
      ],
    }),
  ],
});