[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / MultisigAccount

# Class: MultisigAccount

Defined in: [packages/transact/src/multisig.ts:387](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L387)

Account wrapper that supports partial or full multisig signing.

## Implements

- [`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md)
- [`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)

## Constructors

### Constructor

> **new MultisigAccount**(`multisigParams`, `subSigners`): `MultisigAccount`

Defined in: [packages/transact/src/multisig.ts:428](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L428)

#### Parameters

##### multisigParams

[`MultisigMetadata`](../interfaces/MultisigMetadata.md)

##### subSigners

[`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md) & [`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)[]

#### Returns

`MultisigAccount`

## Properties

### \_addr

> **\_addr**: [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [packages/transact/src/multisig.ts:390](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L390)

***

### \_lsigSigner

> **\_lsigSigner**: [`DelegatedLsigSigner`](../type-aliases/DelegatedLsigSigner.md)

Defined in: [packages/transact/src/multisig.ts:392](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L392)

***

### \_params

> **\_params**: [`MultisigMetadata`](../interfaces/MultisigMetadata.md)

Defined in: [packages/transact/src/multisig.ts:388](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L388)

***

### \_signer

> **\_signer**: [`TransactionSigner`](../type-aliases/TransactionSigner.md)

Defined in: [packages/transact/src/multisig.ts:391](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L391)

***

### \_subSigners

> **\_subSigners**: [`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md) & [`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)[]

Defined in: [packages/transact/src/multisig.ts:389](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L389)

## Accessors

### addr

#### Get Signature

> **get** **addr**(): `Readonly`\<[`Address`](../../../algokit-utils/classes/Address.md)\>

Defined in: [packages/transact/src/multisig.ts:405](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L405)

The address of the multisig account

##### Returns

`Readonly`\<[`Address`](../../../algokit-utils/classes/Address.md)\>

#### Implementation of

[`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md).[`addr`](../interfaces/AddressWithDelegatedLsigSigner.md#addr)

***

### lsigSigner

#### Get Signature

> **get** **lsigSigner**(): [`DelegatedLsigSigner`](../type-aliases/DelegatedLsigSigner.md)

Defined in: [packages/transact/src/multisig.ts:414](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L414)

##### Returns

[`DelegatedLsigSigner`](../type-aliases/DelegatedLsigSigner.md)

#### Implementation of

[`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md).[`lsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md#lsigsigner)

***

### params

#### Get Signature

> **get** **params**(): `Readonly`\<[`MultisigMetadata`](../interfaces/MultisigMetadata.md)\>

Defined in: [packages/transact/src/multisig.ts:395](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L395)

The parameters for the multisig account

##### Returns

`Readonly`\<[`MultisigMetadata`](../interfaces/MultisigMetadata.md)\>

***

### signer

#### Get Signature

> **get** **signer**(): [`TransactionSigner`](../type-aliases/TransactionSigner.md)

Defined in: [packages/transact/src/multisig.ts:410](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L410)

The transaction signer for the multisig account

##### Returns

[`TransactionSigner`](../type-aliases/TransactionSigner.md)

#### Implementation of

[`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md).[`signer`](../interfaces/AddressWithTransactionSigner.md#signer)

***

### subSigners

#### Get Signature

> **get** **subSigners**(): [`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md) & [`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)[]

Defined in: [packages/transact/src/multisig.ts:400](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L400)

The list of accounts that are present to sign transactions or lsigs

##### Returns

[`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md) & [`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)[]

## Methods

### applySignature()

> **applySignature**(`msigSignature`, `pubkey`, `signature`): [`MultisigSignature`](../type-aliases/MultisigSignature.md)

Defined in: [packages/transact/src/multisig.ts:507](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L507)

#### Parameters

##### msigSignature

[`MultisigSignature`](../type-aliases/MultisigSignature.md)

##### pubkey

`Uint8Array`

##### signature

`Uint8Array`

#### Returns

[`MultisigSignature`](../type-aliases/MultisigSignature.md)

***

### applySignatureToTxn()

> **applySignatureToTxn**(`txn`, `pubkey`, `signature`): `void`

Defined in: [packages/transact/src/multisig.ts:498](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L498)

#### Parameters

##### txn

[`SignedTransaction`](../type-aliases/SignedTransaction.md)

##### pubkey

`Uint8Array`

##### signature

`Uint8Array`

#### Returns

`void`

***

### createMultisigSignature()

> **createMultisigSignature**(): [`MultisigSignature`](../type-aliases/MultisigSignature.md)

Defined in: [packages/transact/src/multisig.ts:484](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L484)

#### Returns

[`MultisigSignature`](../type-aliases/MultisigSignature.md)

***

### createMultisigTransaction()

> **createMultisigTransaction**(`txn`): [`SignedTransaction`](../type-aliases/SignedTransaction.md)

Defined in: [packages/transact/src/multisig.ts:480](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L480)

#### Parameters

##### txn

[`Transaction`](Transaction.md)

#### Returns

[`SignedTransaction`](../type-aliases/SignedTransaction.md)

***

### fromSignature()

> `static` **fromSignature**(`signature`): `MultisigAccount`

Defined in: [packages/transact/src/multisig.ts:418](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L418)

#### Parameters

##### signature

[`MultisigSignature`](../type-aliases/MultisigSignature.md)

#### Returns

`MultisigAccount`
