# AlgoKit TypeScript Utilities

A set of core Algorand utilities written in TypeScript and released via npm that make it easier to build solutions on Algorand. This project is part of [AlgoKit](https://github.com/algorandfoundation/algokit-cli).

The goal of this library is to provide intuitive, productive utility functions that make it easier, quicker and safer to build applications on Algorand. Largely these functions wrap the underlying Algorand SDK, but provide a higher level interface with sensible defaults and capabilities for common tasks.

Note: If you prefer Python there's an equivalent [Python utility library](https://github.com/algorandfoundation/algokit-utils-py).

[Install](#install) | [Documentation](docs/README.md)

## Install

This library can be installed from NPM using your favourite npm client, e.g.:

```
npm install @algorandfoundation/algokit-utils
```

## Guiding principles

This library follows the [Guiding Principles of AlgoKit](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md#guiding-principles).

## Contributing

This is an open source project managed by the Algorand Foundation. See the [AlgoKit contributing page](https://github.com/algorandfoundation/algokit-cli/blob/main/CONTRIBUTING.md) to learn about making improvements.

To successfully run the tests in this repository you need to be running LocalNet via [AlgoKit](https://github.com/algorandfoundation/algokit-cli) and also have package dependencies and `.env.template` copied to `.env` (both of which `algokit bootstrap all` can do for you):

```
algokit bootstrap all
algokit localnet start
```

To run tests you can use VS Code, or:

```
npm run test
```
