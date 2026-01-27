[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / MultisigAccount

# Class: MultisigAccount

Defined in: [packages/transact/src/multisig.ts:351](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L351)

Account wrapper that supports partial or full multisig signing.

## Example

```ts
// Create a multisig account with 2-of-2 threshold
const addrs = [
  'RIMARGKZU46OZ77OLPDHHPUJ7YBSHRTCYMQUC64KZCCMESQAFQMYU6SL2Q',
  'ALGOC4J2BCZ33TCKSSAMV5GAXQBMV3HDCHDBSPRBZRNSR7BM2FFDZRFGXA',
].map((s) => Address.fromString(s))

const msigAccount = new MultisigAccount({ version: 1, threshold: 2, addrs }, [])

// Create an empty multisig signature structure
const multisig = msigAccount.createMultisigSignature()
```

## See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.spec.ts)

## Remarks

A multisig account requires M-of-N signatures to authorize transactions, where M is the threshold
and N is the total number of participating addresses. The same address can appear multiple times
in the participant list to implement weighted voting (each occurrence counts as one signature toward the threshold).

## Implements

- [`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md)
- [`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)

## Constructors

### Constructor

> **new MultisigAccount**(`multisigParams`, `subSigners`): `MultisigAccount`

Defined in: [packages/transact/src/multisig.ts:392](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L392)

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

Defined in: [packages/transact/src/multisig.ts:354](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L354)

***

### \_lsigSigner

> **\_lsigSigner**: [`DelegatedLsigSigner`](../type-aliases/DelegatedLsigSigner.md)

Defined in: [packages/transact/src/multisig.ts:356](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L356)

***

### \_params

> **\_params**: [`MultisigMetadata`](../interfaces/MultisigMetadata.md)

Defined in: [packages/transact/src/multisig.ts:352](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L352)

***

### \_signer

> **\_signer**: [`TransactionSigner`](../type-aliases/TransactionSigner.md)

Defined in: [packages/transact/src/multisig.ts:355](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L355)

***

### \_subSigners

> **\_subSigners**: [`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md) & [`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)[]

Defined in: [packages/transact/src/multisig.ts:353](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L353)

## Accessors

### addr

#### Get Signature

> **get** **addr**(): `Readonly`\<[`Address`](../../../algokit-utils/classes/Address.md)\>

Defined in: [packages/transact/src/multisig.ts:369](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L369)

The address of the multisig account

##### Returns

`Readonly`\<[`Address`](../../../algokit-utils/classes/Address.md)\>

#### Implementation of

[`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md).[`addr`](../interfaces/AddressWithDelegatedLsigSigner.md#addr)

***

### lsigSigner

#### Get Signature

> **get** **lsigSigner**(): [`DelegatedLsigSigner`](../type-aliases/DelegatedLsigSigner.md)

Defined in: [packages/transact/src/multisig.ts:378](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L378)

##### Returns

[`DelegatedLsigSigner`](../type-aliases/DelegatedLsigSigner.md)

#### Implementation of

[`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md).[`lsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md#lsigsigner)

***

### params

#### Get Signature

> **get** **params**(): `Readonly`\<[`MultisigMetadata`](../interfaces/MultisigMetadata.md)\>

Defined in: [packages/transact/src/multisig.ts:359](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L359)

The parameters for the multisig account

##### Returns

`Readonly`\<[`MultisigMetadata`](../interfaces/MultisigMetadata.md)\>

***

### signer

#### Get Signature

> **get** **signer**(): [`TransactionSigner`](../type-aliases/TransactionSigner.md)

Defined in: [packages/transact/src/multisig.ts:374](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L374)

The transaction signer for the multisig account

##### Returns

[`TransactionSigner`](../type-aliases/TransactionSigner.md)

#### Implementation of

[`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md).[`signer`](../interfaces/AddressWithTransactionSigner.md#signer)

***

### subSigners

#### Get Signature

> **get** **subSigners**(): [`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md) & [`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)[]

Defined in: [packages/transact/src/multisig.ts:364](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L364)

The list of accounts that are present to sign transactions or lsigs

##### Returns

[`AddressWithTransactionSigner`](../interfaces/AddressWithTransactionSigner.md) & [`AddressWithDelegatedLsigSigner`](../interfaces/AddressWithDelegatedLsigSigner.md)[]

## Methods

### applySignature()

> **applySignature**(`msigSignature`, `pubkey`, `signature`): [`MultisigSignature`](../type-aliases/MultisigSignature.md)

Defined in: [packages/transact/src/multisig.ts:464](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L464)

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

Defined in: [packages/transact/src/multisig.ts:455](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L455)

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

Defined in: [packages/transact/src/multisig.ts:448](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L448)

#### Returns

[`MultisigSignature`](../type-aliases/MultisigSignature.md)

***

### createMultisigTransaction()

> **createMultisigTransaction**(`txn`): [`SignedTransaction`](../type-aliases/SignedTransaction.md)

Defined in: [packages/transact/src/multisig.ts:444](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L444)

#### Parameters

##### txn

[`Transaction`](Transaction.md)

#### Returns

[`SignedTransaction`](../type-aliases/SignedTransaction.md)

***

### fromSignature()

> `static` **fromSignature**(`signature`): `MultisigAccount`

Defined in: [packages/transact/src/multisig.ts:382](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/multisig.ts#L382)

#### Parameters

##### signature

[`MultisigSignature`](../type-aliases/MultisigSignature.md)

#### Returns

`MultisigAccount`
