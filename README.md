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

Then to import it:

```typescript
import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'
```

See [usage](./docs/README.md#usage) for more.

## Guiding principles

This library follows the [Guiding Principles of AlgoKit](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md#guiding-principles).

## NextJS compatibility

`algokit-utils-ts` has a set of `node` specific utilities used for simplifying aggregation of artifacts for [AlgoKit VSCode Debugger Extension](https://github.com/algorandfoundation/algokit-avm-vscode-debugger). Which causes Next.js based projects to fail on `fs` module not found. To fix this issue, you can add the following to your `next.config.js` file:

```js
  webpack: (config, { isServer }) => {
    // Fix for Module not found: Can't resolve 'fs'
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
```

The root cause is due to the fact that, unlike many frameworks, Next.js allows you to import server-only (Node.js APIs that don't work in a browser) code into your page files. When Next.js builds your project, it removes server only code from your client-side bundle by checking which code exists inside one any of the following built-in methods (code splitting):

- getServerSideProps
- getStaticProps
- getStaticPaths

The Module not found: can't resolve 'xyz' error happens when you try to use server only code outside of these methods. Despite `algokit-utils` lazy loading the node specific code dynamically, Next.js does not seem to correctly identify whether a dynamic import is specific to server or client side. Hence the above fix disables the fallback for `fs` module so it ignores polyfilling it on client side.

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
