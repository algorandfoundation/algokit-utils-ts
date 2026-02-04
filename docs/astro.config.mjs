// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
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
      ],
    }),
  ],
});