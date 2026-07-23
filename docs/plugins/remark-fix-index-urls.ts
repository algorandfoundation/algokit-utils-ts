import type { Link, Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Remark plugin that removes trailing `/index/` from internal links.
 *
 * Starlight serves `index.md` files at the parent directory URL, but
 * starlight-typedoc generates links with an explicit `/index/` segment.
 * e.g. `/algokit-utils-ts/api/algokit-utils/abi/index/` → `/algokit-utils-ts/api/algokit-utils/abi/`
 */
export default function remarkFixIndexUrls() {
  return (tree: Root) => {
    visit(tree, 'link', (node: Link) => {
      node.url = node.url.replace(/\/index\/$/, '/')
    })
  }
}
