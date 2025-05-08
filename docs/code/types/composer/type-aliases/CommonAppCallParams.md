[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / CommonAppCallParams

# Type Alias: CommonAppCallParams

> **CommonAppCallParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/types/composer.ts:343](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L343)

Common parameters for defining an application call transaction.

## Type declaration

### accountReferences?

> `optional` **accountReferences**: (`string` \| `Address`)[]

Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

### appId

> **appId**: `bigint`

ID of the application; 0 if the application is being created.

### appReferences?

> `optional` **appReferences**: `bigint`[]

The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

### args?

> `optional` **args**: `Uint8Array`[]

Any [arguments to pass to the smart contract call](/concepts/smart-contracts/languages/teal/#argument-passing).

### assetReferences?

> `optional` **assetReferences**: `bigint`[]

The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

### boxReferences?

> `optional` **boxReferences**: ([`BoxReference`](../../app-manager/interfaces/BoxReference.md) \| [`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md))[]

Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

Either the name identifier (which will be set against app ID of `0` i.e.
 the current app), or a box identifier with the name identifier and app ID.

### onComplete?

> `optional` **onComplete**: `algosdk.OnApplicationComplete`

The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op.
