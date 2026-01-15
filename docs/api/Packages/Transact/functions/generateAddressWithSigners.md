[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/Transact](../README.md) / generateAddressWithSigners

# Function: generateAddressWithSigners()

> **generateAddressWithSigners**(`args`): `object`

Defined in: [packages/transact/src/signer.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/signer.ts#L46)

Generate type-safe domain-separated signer callbacks given an ed25519 pubkey and a signing callback

## Parameters

### args

The arguments for generating signers

#### ed25519Pubkey

`Uint8Array`

The ed25519 public key used for signing

#### rawEd25519Signer

(`bytesToSign`) => `Promise`\<`Uint8Array`\>

A callback function that signs raw bytes using the ed25519 private key

#### sendingAddress?

[`Address`](../../../Algokit-Utils-API/classes/Address.md)

The address that will be used as the sender of transactions. If not provided, defaults to the address derived from the ed25519 public key. This is useful when signing for a rekeyed account where the sending address differs from the auth address.

## Returns

`object`

An object containing the sending address and various signer functions

### addr

> **addr**: `Readonly`\<[`Address`](../../../Algokit-Utils-API/classes/Address.md)\>

### lsigSigner

> **lsigSigner**: [`DelegatedLsigSigner`](../type-aliases/DelegatedLsigSigner.md)

### mxBytesSigner

> **mxBytesSigner**: [`MxBytesSigner`](../type-aliases/MxBytesSigner.md)

### programDataSigner

> **programDataSigner**: [`ProgramDataSigner`](../type-aliases/ProgramDataSigner.md)

### signer

> **signer**: [`TransactionSigner`](../type-aliases/TransactionSigner.md)
