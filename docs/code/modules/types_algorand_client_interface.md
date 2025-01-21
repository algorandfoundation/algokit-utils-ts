[@algorandfoundation/algokit-utils](../README.md) / types/algorand-client-interface

# Module: types/algorand-client-interface

## Table of contents

### Type Aliases

- [AlgorandClientInterface](types_algorand_client_interface.md#algorandclientinterface)

## Type Aliases

### AlgorandClientInterface

Ƭ **AlgorandClientInterface**: `OldAlgorandClientInterface` & `Partial`\<[`InterfaceOf`](types_interface_of.md#interfaceof)\<[`AlgorandClient`](../classes/types_algorand_client.AlgorandClient.md)\>\>

**`Deprecated`**

Use `AlgorandClient` with `import type` instead since this interface
will get removed in the next major release

This type is a solution to the problem raised in the PR below.
In summary, we needed to update the interface without making a breaking
change so this was the best option. This interface has some optional properties,
such as `account`, but unless you are using a custom implementation of AlgorandClient
(you probably aren't) you can be sure these will always be defined.

**`Example`**

```ts
algorand.account!.getInformation(addr);
```

**`See`**

https://github.com/algorandfoundation/algokit-utils-ts/pull/365

#### Defined in

[src/types/algorand-client-interface.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-interface.ts#L55)
