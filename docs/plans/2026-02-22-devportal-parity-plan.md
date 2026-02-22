# DevPortal Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring algokit-utils-ts docs to devportal-ready parity — standardized build scripts, link normalization, link validation, and a GitHub Actions workflow for publishing docs artifacts.

**Architecture:** Library repo owns its doc pipeline via standardized `package.json` scripts (`build`, `normalize-links`, `build-sidebar`, `build-devportal`). A generic composite action in the devportal repo handles packaging and publishing. The normalize-links script runs post-build to prepend site base to relative links in generated API markdown.

**Tech Stack:** Astro/Starlight, starlight-typedoc, starlight-links-validator, tsx, TypeScript

**Design doc:** `docs/plans/2026-02-22-devportal-parity-design.md`

**Reference files:**
- `normalize-links.sphinx.ts` template: `/Users/larkinyoung/dev/af/algokit-utils-py-fork/docs/normalize-links.sphinx.ts`
- `build-sidebar-json.ts` reference: `/Users/larkinyoung/dev/af/algokit-utils-py-fork/docs/build-sidebar-json.ts`
- Devportal workflow reference: `/Users/larkinyoung/dev/af/algokit-utils-py-fork/.github/workflows/publish-devportal-docs.yml`

---

### Task 1: Add starlight-links-validator and tsx dependencies

**Files:**
- Modify: `docs/package.json`
- Modify: `docs/astro.config.mjs`

**Step 1: Install dependencies**

```bash
cd docs && npm install starlight-links-validator && npm install --save-dev tsx
```

**Step 2: Add starlight-links-validator to astro config**

In `docs/astro.config.mjs`, add import at top:

```ts
import starlightLinksValidator from 'starlight-links-validator'
```

Add to the `plugins` array (after the `starlightTypeDoc(...)` entry, line 50):

```ts
starlightLinksValidator({
  errorOnInvalidHashes: false,
  errorOnLocalLinks: false,
}),
```

**Step 3: Verify the docs build still works**

```bash
cd docs && npm run build
```

Expected: Build succeeds. Links validator may report warnings but should not fail the build for hash or local link issues.

**Step 4: Commit**

```bash
git add docs/package.json docs/package-lock.json docs/astro.config.mjs
git commit -m "chore(docs): add starlight-links-validator and tsx dependencies"
```

---

### Task 2: Create normalize-links.typedoc.ts

**Files:**
- Create: `docs/normalize-links.typedoc.ts`

**Step 1: Create the normalize-links script**

Copy `/Users/larkinyoung/dev/af/algokit-utils-py-fork/docs/normalize-links.sphinx.ts` to `docs/normalize-links.typedoc.ts` and make these modifications:

1. Update the file header comment: change "Sphinx-based" to "TypeDoc-based" throughout
2. The `TARGETS` array stays the same — both `guides/` (with fallback) and `api/` (without fallback) are correct for typedoc repos too
3. The `SKIP_PATTERN` stays the same
4. All core functions (`resolveRelativePath`, `slugExists`, `buildFileIndex`, `findBestMatch`, `normalizeLinksInContent`, `processFile`, `processDirectory`, `readBaseFromConfig`, `main`) are identical — copy as-is

The only real change is the file name and header comments. The logic is generator-agnostic.

**Step 2: Test the script runs without errors**

First build the docs so API markdown exists on disk, then run normalize:

```bash
cd docs && npm run build && npx tsx normalize-links.typedoc.ts
```

Expected: Script prints `Site base: /algokit-utils-ts`, processes `guides/` and `api/` directories, reports how many links were normalized (may be 0 if all links are already absolute). Should exit 0 with "All links normalized successfully."

**Step 3: Commit**

```bash
git add docs/normalize-links.typedoc.ts
git commit -m "feat(docs): add normalize-links.typedoc.ts for devportal link normalization"
```

---

### Task 3: Delete stale build-sidebar-json.mjs

**Files:**
- Delete: `docs/build-sidebar-json.mjs`

**Step 1: Delete the old .mjs version**

```bash
rm docs/build-sidebar-json.mjs
```

The `.ts` version (`docs/build-sidebar-json.ts`) is the replacement and is already functionally identical.

**Step 2: Verify the .ts version works**

```bash
cd docs && npx tsx build-sidebar-json.ts
```

Expected: Output like `Wrote 7 sidebar entries to /path/to/dist-devportal/sidebar.json`

**Step 3: Commit**

```bash
git add docs/build-sidebar-json.mjs
git commit -m "chore(docs): remove stale build-sidebar-json.mjs (replaced by .ts)"
```

---

### Task 4: Add standardized scripts, gitignore, fix typo

**Files:**
- Modify: `docs/package.json` (add scripts)
- Modify: `docs/.gitignore` (add dist-devportal/)
- Modify: `docs/src/content/docs/index.mdx` (fix typo)

**Step 1: Add standardized devportal scripts to package.json**

Add these to the `"scripts"` section in `docs/package.json`:

```json
"normalize-links": "npx tsx normalize-links.typedoc.ts",
"build-sidebar": "npx tsx build-sidebar-json.ts",
"build-devportal": "npm run build && npm run normalize-links && npm run build-sidebar"
```

**Step 2: Add dist-devportal/ to .gitignore**

Add this line to `docs/.gitignore` after the `dist/` entry:

```
# devportal build output
dist-devportal/
```

**Step 3: Fix typo in index.mdx**

In `docs/src/content/docs/index.mdx` line 10, change:

```
link: /algokit-utils-ts/guides/tutorials/quick-starta
```

to:

```
link: /algokit-utils-ts/guides/tutorials/quick-start
```

**Step 4: Test the full devportal pipeline**

```bash
cd docs && npm run build-devportal
```

Expected: Builds docs, normalizes links, generates `dist-devportal/sidebar.json`. All three steps succeed.

**Step 5: Verify sidebar.json looks correct**

```bash
cat docs/dist-devportal/sidebar.json | head -20
```

Expected: JSON array starting with the Home link entry, containing all sidebar sections plus the devportalFallbacks API Reference entry at the end.

**Step 6: Commit**

```bash
git add docs/package.json docs/.gitignore docs/src/content/docs/index.mdx
git commit -m "chore(docs): add devportal scripts, gitignore dist-devportal, fix index typo"
```

---

### Task 5: Add publish-devportal-docs.yml workflow

**Files:**
- Create: `.github/workflows/publish-devportal-docs.yml`

**Step 1: Create the workflow file**

Create `.github/workflows/publish-devportal-docs.yml` with this content. This is a thin caller that sets up the environment, then calls the composite action from the devportal repo:

```yaml
name: Publish DevPortal Docs

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:
    inputs:
      ref:
        description: 'Git ref to build from'
        required: false
        default: 'main'

permissions:
  contents: write

jobs:
  publish-docs:
    name: Build and Publish Docs
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.ref || github.ref }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install root dependencies
        run: npm ci

      - name: Install docs dependencies
        run: npm ci --prefix docs

      - name: Build devportal artifact
        working-directory: docs
        run: npm run build-devportal

      - name: Prepare dist-devportal
        working-directory: docs
        run: |
          mkdir -p dist-devportal/content

          # Copy root content files (index.mdx etc)
          find src/content/docs -maxdepth 1 -type f \( -name '*.md' -o -name '*.mdx' \) -exec cp {} dist-devportal/content/ \;

          # Copy guides and API content
          cp -R src/content/docs/guides dist-devportal/content/ 2>/dev/null || true
          cp -R src/content/docs/api dist-devportal/content/ 2>/dev/null || true

          # Generate manifest
          cat > dist-devportal/manifest.json <<MANIFEST
          {
            "repo": "${{ github.repository }}",
            "ref": "${{ github.sha }}",
            "tag": "${{ github.ref_name }}",
            "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
          }
          MANIFEST

      - name: Create tarball
        working-directory: docs
        run: |
          cd dist-devportal
          tar czf ../devportal-docs.tar.gz .

      - name: Determine release tag
        id: release-tag
        run: |
          if [[ "${{ github.event_name }}" == "push" && "${{ github.ref_type }}" == "tag" ]]; then
            echo "tag=${{ github.ref_name }}" >> $GITHUB_OUTPUT
            echo "prerelease=false" >> $GITHUB_OUTPUT
          else
            echo "tag=docs-latest" >> $GITHUB_OUTPUT
            echo "prerelease=true" >> $GITHUB_OUTPUT
          fi

      - name: Upsert docs-latest release (manual dispatch)
        if: steps.release-tag.outputs.prerelease == 'true'
        uses: softprops/action-gh-release@v2
        with:
          tag_name: docs-latest
          name: 'Documentation (Latest)'
          body: |
            Rolling pre-release with latest documentation build.
            Updated: ${{ github.event.head_commit.timestamp || github.event.inputs.ref || 'manual' }}
          prerelease: true
          files: docs/devportal-docs.tar.gz
          fail_on_unmatched_files: true

      - name: Attach to version release (tag push)
        if: steps.release-tag.outputs.prerelease == 'false'
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ github.ref_name }}
          files: docs/devportal-docs.tar.gz
          fail_on_unmatched_files: true
```

Note: The composite action from the devportal repo doesn't exist yet. This workflow is self-contained for now — it inlines the packaging/publishing steps. When the composite action is created in the devportal repo, this workflow will be simplified to just call it.

**Step 2: Commit**

```bash
git add .github/workflows/publish-devportal-docs.yml
git commit -m "ci: add devportal docs publishing workflow"
```

---

### Task 6: End-to-end verification

**Step 1: Run the full devportal build pipeline locally**

```bash
cd docs && rm -rf dist dist-devportal && npm run build-devportal
```

Expected: Clean build succeeds, `dist-devportal/sidebar.json` exists.

**Step 2: Verify sidebar.json structure**

```bash
npx tsx -e "const s = require('./docs/dist-devportal/sidebar.json'); console.log(s.length + ' entries'); console.log(s.map(e => e.label).join(', '))"
```

Expected: Lists all sidebar sections including API Reference fallback.

**Step 3: Verify no broken links in build output**

Check the build output for any starlight-links-validator errors. Warnings about hashes or local links are acceptable (we configured those off), but content link errors should be investigated.

**Step 4: Push to fork**

```bash
git push origin chore/structure-change
```
