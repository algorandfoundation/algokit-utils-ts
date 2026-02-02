[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / bytesForSigning

# Variable: bytesForSigning

> `const` **bytesForSigning**: `object`

Defined in: [packages/transact/src/signer.ts:121](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/transact/src/signer.ts#L121)

## Type Declaration

### lsigForDelegation()

> **lsigForDelegation**(`lsig`, `msig?`): `Uint8Array`

#### Parameters

##### lsig

[`LogicSig`](../classes/LogicSig.md)

##### msig?

[`MultisigAccount`](../classes/MultisigAccount.md)

#### Returns

`Uint8Array`

### mxBytes()

> **mxBytes**(`bytes`): `Uint8Array`

#### Parameters

##### bytes

`Uint8Array`

#### Returns

`Uint8Array`

### programData()

> **programData**(`lsig`, `data`): `Uint8Array`

#### Parameters

##### lsig

[`LogicSig`](../classes/LogicSig.md)

##### data

`Uint8Array`

#### Returns

`Uint8Array`

### transaction()

> **transaction**(`txn`): `Uint8Array`

#### Parameters

##### txn

[`Transaction`](../classes/Transaction.md)

#### Returns

`Uint8Array`
