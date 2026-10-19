# Runnable examples

Every script here backs a docs page: docs render named regions from these
files, so the code in the docs is always real, executed code. `concepts/`
holds one script per Concepts page, with small snippets each showing one
library abstraction.

## Running

Start LocalNet (`algokit localnet start`), then from the repo root:

```bash
# one example
pnpm exec tsx --tsconfig examples/tsconfig.json examples/concepts/algorand_client.algo.ts

# all concept examples
for f in examples/concepts/*.algo.ts; do
  [ "$(basename "$f")" = "_helpers.algo.ts" ] && continue
  echo "== $f ==" && pnpm exec tsx --tsconfig examples/tsconfig.json "$f"
done
```

No env vars needed — examples use `AlgorandClient.defaultLocalNet()`.

The `--tsconfig examples/tsconfig.json` flag is required: `examples/tsconfig.json`
aliases the `@algorandfoundation/algokit-utils` package name to the local `src/`
(via `baseUrl` + `paths`), so the examples run against the in-repo source with no
build step. Without it the package name resolves to the unbuilt `dist/` and fails.

Each script runs end-to-end against LocalNet and asserts its own results, so a
non-zero exit code means the example is broken. Paths in `applications.algo.ts`
are relative to the repo root, so always run from there.

## Snippet markers

A region is the code between the **same** comment line appearing **exactly
twice**:

```ts
// example: SEND_PAYMENT
await algorand.send.payment({
  sender: accountA.addr,
  receiver: accountB.addr,
  amount: (1).algo(),
})
// example: SEND_PAYMENT
```

- Names are `UPPER_SNAKE_CASE`, matching the `algokit-utils-py` equivalent
  where one exists.
- Regions can't nest or overlap, and each name must appear exactly twice.
- Keep imports, setup, logs and asserts **outside** the markers — only the
  region is rendered, and it must be clean and copy-pasteable.
- `_`-prefixed files (e.g. `_helpers.algo.ts`) are shared setup, never rendered.

## Writing a new example

Copy the shape of `concepts/transactions.algo.ts`: a file header comment with
prerequisites, an `async function main()` with marked regions, asserts outside
the markers, and a `main().catch(...)` call at the bottom. Name concept files
`<page>.algo.ts` — the `.algo.ts` suffix keeps them out of the library's own
`tsc` build and test run (the base `tsconfig` excludes `**/*.algo.ts`).

## Rendering in a docs page

```mdx
import RemoteCode from '/src/components/RemoteCode.astro'

<RemoteCode
  src="https://raw.githubusercontent.com/algorandfoundation/algokit-utils-ts/main/examples/concepts/algorand_client.algo.ts"
  snippet="INSTANTIATE_ALGORAND_CLIENT"
  lang="ts"
/>
```
