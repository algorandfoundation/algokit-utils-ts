[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-manager](../README.md) / BoxIdentifier

# Type Alias: BoxIdentifier

> **BoxIdentifier** = `string` \| `Uint8Array` \| [`AddressWithTransactionSigner`](../../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app-manager.ts:59](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-manager.ts#L59)

Something that identifies an app box name - either a:
 * `Uint8Array` (the actual binary of the box name)
 * `string` (that will be encoded to a `Uint8Array`)
 * `AddressWithSigner` (that will be encoded into the
   public key address of the corresponding account)
