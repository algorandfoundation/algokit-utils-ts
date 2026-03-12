/**
 * Generates static .mdx files from example .ts files for devportal inclusion.
 *
 * Reuses parsing and category definitions from the examples-loader.
 * Output goes to src/content/docs/examples/ so it gets packaged in the tarball.
 *
 * Run: npx tsx docs/scripts/generate-examples-mdx.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { CATEGORIES, parseJSDoc, extractOrder, createSlug } from '../src/loaders/examples-loader.ts'

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..')
const EXAMPLES_DIR = path.join(REPO_ROOT, 'examples')
const OUTPUT_DIR = path.join(REPO_ROOT, 'docs', 'src', 'content', 'docs', 'examples')
const GITHUB_BASE = 'https://github.com/algorandfoundation/algokit-utils-ts/blob/main/examples'

// Clean output directory
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true })
}

// Collect all examples across categories for cross-referencing
type ExampleInfo = { title: string; slug: string; description: string; categoryDir: string; categorySlug: string; categoryLabel: string }
const allExamplesByCategory: Record<string, ExampleInfo[]> = {}
let totalCount = 0

for (const [categoryDir, meta] of Object.entries(CATEGORIES)) {
  const categoryPath = path.join(EXAMPLES_DIR, categoryDir)
  if (!fs.existsSync(categoryPath)) {
    console.warn(`  Skipping missing category: ${categoryDir}`)
    continue
  }

  const outputCategoryDir = path.join(OUTPUT_DIR, meta.slug)
  fs.mkdirSync(outputCategoryDir, { recursive: true })

  const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.ts') && !f.startsWith('_'))
  const categoryExamples: ExampleInfo[] = []

  for (const filename of files) {
    const content = fs.readFileSync(path.join(categoryPath, filename), 'utf-8')
    const { title, description, prerequisites } = parseJSDoc(content)
    const order = extractOrder(filename)
    const slug = createSlug(filename)
    const githubUrl = `${GITHUB_BASE}/${categoryDir}/${filename}`
    const runCommand = `npm run example ${categoryDir}/${filename}`

    const prereqList = prerequisites
      .split('\n')
      .map((p) => p.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean)
      .map((p) => `- ${p}`)
      .join('\n')

    // Build "Other examples in this category" links (filled in second pass)
    categoryExamples.push({ title, slug, description, categoryDir, categorySlug: meta.slug, categoryLabel: meta.label })

    const mdx = `---
title: "${title}"
description: "${description.split('\n')[0].replace(/"/g, '\\"')}"
sidebar:
  order: ${order}
---

[← Back to ${meta.label}](../)

## Description

${description.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')}

## Prerequisites

${prereqList}

## Run This Example

From the repository root:

\`\`\`bash
cd examples
${runCommand}
\`\`\`

## Code

[View source on GitHub](${githubUrl})

\`\`\`typescript title="${filename}"
${content}
\`\`\`

---

### Other examples in ${meta.label}

PLACEHOLDER_OTHER_EXAMPLES_${meta.slug}
`

    fs.writeFileSync(path.join(outputCategoryDir, `${slug}.mdx`), mdx)
    totalCount++
  }

  allExamplesByCategory[meta.slug] = categoryExamples
}

// Second pass: replace placeholder with actual sibling links
for (const [categorySlug, examples] of Object.entries(allExamplesByCategory)) {
  const outputCategoryDir = path.join(OUTPUT_DIR, categorySlug)

  for (const example of examples) {
    const filePath = path.join(outputCategoryDir, `${example.slug}.mdx`)
    let content = fs.readFileSync(filePath, 'utf-8')

    const siblingLinks = examples
      .map((ex) => (ex.slug === example.slug ? `- **${ex.title}**` : `- [${ex.title}](../${ex.slug}/)`))
      .join('\n')

    content = content.replace(`PLACEHOLDER_OTHER_EXAMPLES_${categorySlug}`, siblingLinks)
    fs.writeFileSync(filePath, content)
  }

  // Category index page — HTML table with full descriptions including bullets
  // Escape text content before inserting into HTML so MDX doesn't parse it as JSX/tags.
  // & → &amp; (first, to avoid double-escaping), < → &lt;, > → &gt;, { → &#123;, } → &#125;
  const escapeForMdx = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')

  const tableRows = examples
    .map((ex) => {
      const lines = ex.description.split('\n')
      let descHtml = ''
      let bulletBuffer: string[] = []
      const flushBullets = () => {
        if (bulletBuffer.length > 0) {
          descHtml += `<ul>${bulletBuffer.map((b) => `<li>${escapeForMdx(b)}</li>`).join('')}</ul>`
          bulletBuffer = []
        }
      }
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        if (/^[-•]\s/.test(trimmed)) {
          bulletBuffer.push(trimmed.replace(/^[-•]\s*/, ''))
        } else {
          flushBullets()
          descHtml += `<p>${escapeForMdx(trimmed)}</p>`
        }
      }
      flushBullets()

      return `<tr><td><a href="${ex.slug}/">${escapeForMdx(ex.title)}</a></td><td>${descHtml}</td></tr>`
    })
    .join('\n')

  fs.writeFileSync(
    path.join(outputCategoryDir, 'index.mdx'),
    `---
title: "${allExamplesByCategory[categorySlug][0].categoryLabel}"
description: "${CATEGORIES[examples[0].categoryDir].description.replace(/"/g, '\\"')}"
sidebar:
  label: "${allExamplesByCategory[categorySlug][0].categoryLabel}"
  order: 0
---

[← Back to Examples Overview](../)

${CATEGORIES[examples[0].categoryDir].description}

## Examples (${examples.length})

<table>
<thead><tr><th>Example</th><th>Description</th></tr></thead>
<tbody>
${tableRows}
</tbody>
</table>

## Quick Start

Run any example from the repository's \`examples\` directory:

\`\`\`bash
cd examples
npm run example ${examples[0].categoryDir}/01-*.ts
\`\`\`
`,
  )
}

// Top-level examples index — custom card grid matching original index.astro
const categoryCards = Object.entries(CATEGORIES)
  .map(([_dirName, meta]) => {
    const count = allExamplesByCategory[meta.slug]?.length ?? 0
    return `<a href="${meta.slug}/" class="card">
  <h3>${meta.label}</h3>
  <p>${meta.description}</p>
  <span class="count">${count} examples</span>
</a>`
  })
  .join('\n')

fs.mkdirSync(OUTPUT_DIR, { recursive: true })
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'index.mdx'),
  `---
title: Code Examples
description: "${totalCount} runnable TypeScript examples demonstrating AlgoKit Utils features"
sidebar:
  order: 0
---

Browse **${totalCount}** runnable TypeScript examples organized by feature area. Each example is self-contained and demonstrates specific functionality of the AlgoKit Utils library.

## Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/algorandfoundation/algokit-utils-ts.git
cd algokit-utils-ts

# Install dependencies and build the package
npm ci
npm run build

# Install examples dependencies
cd examples
npm ci

# Run any example
npm run example algorand_client/01-client-instantiation.ts
\`\`\`

## Prerequisites

- Node.js >= 20.0
- [AlgoKit CLI](https://github.com/algorandfoundation/algokit-cli) installed
- LocalNet running for network examples (\`algokit localnet start\`)

*Some examples marked "No LocalNet required" work with pure utility functions.*

## Categories

<div class="card-grid">
${categoryCards}
</div>

<style>
{\`
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
  border-color: var(--sl-color-accent);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--sl-color-white);
}
.card p {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: var(--sl-color-gray-2);
}
.card .count {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--sl-color-accent-low);
  color: var(--sl-color-accent-high);
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}
\`}
</style>
`,
)

console.log(`Generated ${totalCount} example MDX files + index pages in docs/src/content/docs/examples/`)