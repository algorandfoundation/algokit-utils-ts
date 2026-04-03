import type { Loader } from 'astro/loaders'
import fs from 'node:fs'
import path from 'node:path'

type ExampleEntry = {
  id: string
  title: string
  description: string
  prerequisites: string
  code: string
  category: string
  categoryLabel: string
  order: number
  filename: string
  runCommand: string
}

interface CategoryMeta {
  label: string
  description: string
  slug: string
}

const CATEGORIES: Record<string, CategoryMeta> = {
  abi: {
    label: 'ABI Encoding',
    description: 'ABI type parsing, encoding, and decoding following the ARC-4 specification.',
    slug: 'abi',
  },
  algo25: {
    label: 'Mnemonic Utilities',
    description: 'Mnemonic and seed conversion utilities following the Algorand 25-word mnemonic standard.',
    slug: 'algo25',
  },
  algod_client: {
    label: 'Algod Client',
    description: 'Algorand node operations and queries using the AlgodClient.',
    slug: 'algod-client',
  },
  algorand_client: {
    label: 'Algorand Client',
    description: 'High-level AlgorandClient API for simplified blockchain interactions.',
    slug: 'algorand-client',
  },
  common: {
    label: 'Common Utilities',
    description: 'Utility functions and helpers.',
    slug: 'common',
  },
  indexer_client: {
    label: 'Indexer Client',
    description: 'Blockchain data queries using the IndexerClient.',
    slug: 'indexer-client',
  },
  kmd_client: {
    label: 'KMD Client',
    description: 'Key Management Daemon operations for wallet and key management.',
    slug: 'kmd-client',
  },
  signing: {
    label: 'Signing',
    description: 'Transaction signing with keyrings and cloud KMS providers.',
    slug: 'signing',
  },
  testing: {
    label: 'Testing',
    description: 'Testing utilities for mock server setup and Vitest integration.',
    slug: 'testing',
  },
  transact: {
    label: 'Transactions',
    description: 'Low-level transaction construction and signing.',
    slug: 'transact',
  },
}

export function lineSeparator(text: string, isBullet: boolean, lastWasBullet: boolean): string {
  if (!text) return ''
  if (isBullet || lastWasBullet) return '\n'
  return ' '
}

export function parseJSDoc(content: string): { title: string; description: string; prerequisites: string } {
  const jsdocMatch = content.match(/\/\*\*\n([\s\S]*?)\*\//)

  if (!jsdocMatch) {
    return { title: 'Example', description: '', prerequisites: '' }
  }

  const jsdocContent = jsdocMatch[1]

  // Extract title from "Example: Title" line
  const titleMatch = jsdocContent.match(/\*\s*Example:\s*(.+)/)
  const title = titleMatch?.[1]?.trim() || 'Example'

  // Extract description - lines after title until Prerequisites or end
  const lines = jsdocContent.split('\n').map((line) => line.replace(/^\s*\*\s?/, '').trim())

  let description = ''
  let prerequisites = ''
  let inPrerequisites = false
  let lastLineWasBullet = false

  for (const line of lines) {
    if (line.startsWith('Example:')) continue

    if (line.toLowerCase().startsWith('prerequisites:') || line.toLowerCase() === 'prerequisites') {
      inPrerequisites = true
      lastLineWasBullet = false
      const prereqContent = line.replace(/prerequisites:?\s*/i, '').trim()
      if (prereqContent) prerequisites = prereqContent
      continue
    }

    if (line.startsWith('@')) continue

    if (!line) {
      lastLineWasBullet = false
      if (inPrerequisites) {
        if (prerequisites) prerequisites += '\n'
      } else if (description) {
        description += '\n'
      }
      continue
    }

    const isBullet = line.startsWith('-') || line.startsWith('•')
    if (inPrerequisites) {
      prerequisites += lineSeparator(prerequisites, isBullet, lastLineWasBullet) + line
    } else {
      description += lineSeparator(description, isBullet, lastLineWasBullet) + line
    }
    lastLineWasBullet = isBullet
  }

  return {
    title,
    description: description.trim(),
    prerequisites: prerequisites.trim() || 'LocalNet running (`algokit localnet start`)',
  }
}

/**
 * Extract order number from filename (e.g., "01-example.ts" -> 1)
 */
export function extractOrder(filename: string): number {
  const match = filename.match(/^(\d+)-/)
  return match ? parseInt(match[1], 10) : 999
}

export function createSlug(filename: string): string {
  return filename.replace(/\.ts$/, '').replace(/_/g, '-')
}

export function examplesLoader(): Loader {
  return {
    name: 'examples-loader',
    load: async ({ store, logger }) => {
      const examplesDir = path.resolve(process.cwd(), '..', 'examples')

      logger.info(`Loading examples from ${examplesDir}`)

      if (!fs.existsSync(examplesDir)) {
        logger.error(`Examples directory not found: ${examplesDir}`)
        return
      }

      const entries: ExampleEntry[] = []

      for (const [categoryDir, meta] of Object.entries(CATEGORIES)) {
        const categoryPath = path.join(examplesDir, categoryDir)

        if (!fs.existsSync(categoryPath)) {
          logger.warn(`Category directory not found: ${categoryPath}`)
          continue
        }

        const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.ts') && !f.startsWith('_'))

        for (const filename of files) {
          const filePath = path.join(categoryPath, filename)
          const content = fs.readFileSync(filePath, 'utf-8')
          const { title, description, prerequisites } = parseJSDoc(content)
          const order = extractOrder(filename)
          const slug = createSlug(filename)

          const entry: ExampleEntry = {
            id: `${meta.slug}/${slug}`,
            title,
            description,
            prerequisites,
            code: content,
            category: categoryDir,
            categoryLabel: meta.label,
            order,
            filename,
            runCommand: `pnpm run example ${categoryDir}/${filename}`,
          }

          entries.push(entry)
        }
      }

      entries.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category)
        }
        return a.order - b.order
      })

      logger.info(`Found ${entries.length} examples across ${Object.keys(CATEGORIES).length} categories`)

      for (const entry of entries) {
        store.set({
          id: entry.id,
          data: entry,
        })
      }
    },
  }
}

export { CATEGORIES }
export type { CategoryMeta, ExampleEntry }
