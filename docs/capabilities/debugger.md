# Debugger

The AlgoKit TypeScript Utilities package provides a set of debugging tools that can be used to simulate and trace transactions on the Algorand blockchain. These tools and methods are optimized for developers who are building applications on Algorand and need to test and debug their smart contracts via [AVM Debugger extension](link to vscode extension).

## Configuration

The `config.ts` file contains the `UpdatableConfig` class which manages and updates configuration settings for the AlgoKit project. The class has the following attributes:

- `debug`: Indicates whether debug mode is enabled.
- `projectRoot`: The path to the project root directory. Can be ignored if you are using `algokit-utils` inside an `algokit` compliant project (containing `.algokit.toml` file). For non algokit compliant projects, simply provide the path to the folder where you want to store sourcemaps and traces to be used with [`AVM Debugger`](links to extension). Alternatively you can also set the value via the `ALGOKIT_PROJECT_ROOT` environment variable.
- `traceAll`: Indicates whether to trace all operations. Defaults to false, this means that when debug mode is enabled, any (or all) application client calls performed via `algokit-utils` will store responses from `simulate` endpoint. These files are called traces, and can be used with [AVM Debugger](link to vscode extension) to debug TEAL source codes, transactions in the atomic group and etc.
- `traceBufferSizeMb`: The size of the trace buffer in megabytes. By default uses 256 megabytes. When output folder containing debug trace files exceedes the size, oldest files are removed to optimize for storage consumption.
- `maxSearchDepth`: The maximum depth to search for a an `algokit` config file. By default it will traverse at most 10 folders searching for `.algokit.toml` file which will be used to assume algokit compliant project root path.

The `configure` method can be used to set these attributes.

To enable debug mode in your project you can configure it as follows:

```ts
import { UpdatableConfig } from '@algorandfoundation/algokit-utils'

const config = new UpdatableConfig()
config.configure({ debug: true })
```

## Debugging Utilities

Debugging utilities can be used to simplify gathering artifacts to be used with [AVM Debugger](link to vscode extension) in non algokit compliant projects. The following methods are provided:

- `persistSourcemaps`: This method persists the sourcemaps for the given sources as AVM Debugger compliant artifacts.
- `simulateAndPersistResponse`: This method simulates the atomic transactions using the provided `AtomicTransactionComposer` object and `Algodv2` object, and persists the simulation response to an AVM Debugger compliant JSON file.
