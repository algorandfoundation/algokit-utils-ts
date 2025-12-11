# AlgoKit TypeScript Utilities

A set of core Algorand utilities written in TypeScript and released via npm that make it easier to build solutions on Algorand. This project is part of [AlgoKit](https://github.com/algorandfoundation/algokit-cli).

The goal of this library is to provide intuitive, productive utility functions that make it easier, quicker and safer to build applications on Algorand. Largely these functions wrap the underlying Algorand SDK, but provide a higher level interface with sensible defaults and capabilities for common tasks.

Note: If you prefer Python there's an equivalent [Python utility library](https://github.com/algorandfoundation/algokit-utils-py).

[Install](#install) | [Documentation](./docs/README.md)

## Install

Before installing, you'll need to decide on the version you want to target. Version 7 and 8 have the same feature set, however v7 leverages algosdk@>=2.9.0<3.0, whereas v8 leverages algosdk@>=3.0.0. Your project and it's dependencies will help you decide which version to target.

Once you've decided on the target version, this library can be installed from NPM using your favourite npm client, e.g.:

To target algosdk@2 and use version 7 of AlgoKit Utils, run the below:

```
npm install algosdk@^2.9.0 @algorandfoundation/algokit-utils@^7.0.0
```

To target algosdk@3 and use the latest version of AlgoKit Utils, run the below:

```
npm install algosdk@^3.0.0 @algorandfoundation/algokit-utils
```

Now you can import the library:

```typescript
import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'
```

See [usage](./docs/README.md#usage) for more details.

## Migration

Whilst we aim to minimise breaking changes, there are situations where they are required.
JSDoc deprecations should guide you through most migration paths inside your IDE, however the migration guides will provide more detailed information should you need it.

If you're targetting v7, please refer to the [v7 migration guide](./docs/v7-migration.md).
If you're targetting v8, please refer to the [v8 migration guide](./docs/v8-migration.md).

## Guiding principles

This library follows the [Guiding Principles of AlgoKit](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md#guiding-principles).

## Contributing

This is an open source project managed by the Algorand Foundation. See the [AlgoKit contributing page](https://github.com/algorandfoundation/algokit-cli/blob/main/CONTRIBUTING.md) to learn about making improvements.

To successfully run the tests in this repository you need to be running LocalNet via [AlgoKit](https://github.com/algorandfoundation/algokit-cli) and also have package dependencies and `.env.template` copied to `.env` (both of which `algokit bootstrap all` can do for you):

```bash
algokit bootstrap all
algokit localnet start
```

To run tests you can use VS Code, or:

```bash
npm run test
```

### Prerequisites

- [Rust](https://rust-lang.org/tools/install/) - Required for building native dependencies
- [Bun](https://bun.sh/docs/installation) - JavaScript runtime and package manager
- [Polytest](https://github.com/algorandfoundation/algokit-polytest) - Install via Cargo:

  ```bash
  cargo install polytest
  ```

  To update to a specific version if required:

  ```bash
  cargo install polytest --version {X}
  ```

### Mock Server for Client Tests

The `algod_client`, `indexer_client`, and `kmd_client` packages use a mock server for deterministic API testing against pre-recorded HAR files. The mock server is managed externally (not by the test framework).

**In CI:** Mock servers are automatically started via the [algokit-polytest](https://github.com/algorandfoundation/algokit-polytest) setup.

**Local development:**

1. Init algokit-polytest on first run

```bash
npm run polytest:init
```

2. Start the mock servers:

```bash
npm run polytest:start-mock-servers
```

This starts algod (port 8000), indexer (port 8002), and kmd (port 8001) in the background.

3. Set environment variables and run tests.

| Environment Variable | Description             | Default Port |
| -------------------- | ----------------------- | ------------ |
| `MOCK_ALGOD_URL`     | Algod mock server URL   | 8000         |
| `MOCK_INDEXER_URL`   | Indexer mock server URL | 8002         |
| `MOCK_KMD_URL`       | KMD mock server URL     | 8001         |

Environment variables can also be set via `.env` file in project root (copy from `.env.template`).

```bash
# after setting env vars via export or .env file
npm run test
```

4. Stop servers when done:

```bash
npm run polytest:stop-mock-servers
```
