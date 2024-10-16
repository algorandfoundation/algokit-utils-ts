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

## Debugging in `node` environment (recommended)

Refer to the [algokit-utils-ts-debug](https://github.com/algorandfoundation/algokit-utils-ts-debug) for more details on how to activate the addon package with `algokit-utils` in your project.

> Note: Config also contains a set of flags that affect behaviour of [algokit-utils-ts-debug](https://github.com/algorandfoundation/algokit-utils-ts-debug). Those include `projectRoot`, `traceAll`, `traceBufferSizeMb`, and `maxSearchDepth`. Refer to addon package documentation for details.

### Why are the debug utilities in a separate package?

To keep the `algokit-utils-ts` package lean and isomporphic, the debugging utilities are located in a separate package. This eliminates various error cases with bundlers (e.g. `webpack`, `esbuild`) when building for the browser.

## Debugging in `browser` environment

Note that it's not possible to use `algokit-utils-ts-debug` in browser environments; however, you can still obtain and persist simulation traces from the browser network tab whenever a transaction is being submitted using the algokit-utils-ts package. Make sure to enable the debug mode in the algokit-utils-ts config as described in the [getting started](./docs/code/getting-started.md) guide. To obtain the simulation trace:

1. Open the browser network tab
2. Submit the transaction
3. Filter the requests by `simulate`
4. Copy the 'simulate' request body and store it in a file with a .trace.avm.json extension, then place it under the `debug_traces` folder in your AlgoKit contract project.
   4.1. (Optional) If you are not using an AlgoKit project structure for your contracts codebase, as long as the trace file is within your VSCode workspace, the extension will present a picker to select the trace file.
