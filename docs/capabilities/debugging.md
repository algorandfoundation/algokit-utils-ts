# Debugger

The AlgoKit TypeScript Utilities package provides a set of debugging tools that can be used to simulate and trace transactions on the Algorand blockchain. These tools and methods are optimized for developers who are building applications on Algorand and need to test and debug their smart contracts via [AlgoKit AVM Debugger extension](https://github.com/algorandfoundation/algokit-avm-vscode-debugger).

## Configuration

The `config.ts` file contains the `UpdatableConfig` class which manages and updates configuration settings for the AlgoKit project.

To enable debug mode in your project you can configure it as follows:

```ts
import { Config } from '@algorandfoundation/algokit-utils'
Config.configure({
  debug: true,
})
```

## Debugging Utilities

Refer to the [algokit-utils-ts-debug](https://github.com/algorandfoundation/algokit-utils-ts-debug) for more details on how to activate the addon package with `algokit-utils` in your project.

> Note: Config also contains a set flags that affect behaviour of [algokit-utils-ts-debug](https://github.com/algorandfoundation/algokit-utils-ts-debug). Those include `projectRoot`, `traceAll`, `traceBufferSizeMb`, and `maxSearchDepth`. Refer to addon package documentation for details.

### Why are the debug utilities in a separate package?

To keep the `algokit-utils-ts` package lean and isomporphic, the debugging utilities are located in a separate package. This eliminates various error cases with bundlers (e.g. `webpack`, `esbuild`) when building for the browser.
