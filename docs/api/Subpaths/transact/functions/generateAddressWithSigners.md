[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / generateAddressWithSigners

# Function: generateAddressWithSigners()

> **generateAddressWithSigners**(`args`): `object`

Defined in: [packages/transact/src/signer.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/signer.ts#L49)

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

[`Address`](../../../algokit-utils/classes/Address.md)

The address that will be used as the sender of transactions. If not provided, defaults to the address derived from the ed25519 public key. This is useful when signing for a rekeyed account where the sending address differs from the auth address.

## Returns

`object`

An object containing the sending address and various signer functions

### addr

> **addr**: `Readonly`\<[`Address`](../../../algokit-utils/classes/Address.md)\>

### lsigSigner

> **lsigSigner**: [`DelegatedLsigSigner`](../type-aliases/DelegatedLsigSigner.md)

### mxBytesSigner

> **mxBytesSigner**: [`MxBytesSigner`](../type-aliases/MxBytesSigner.md)

### programDataSigner

> **programDataSigner**: [`ProgramDataSigner`](../type-aliases/ProgramDataSigner.md)

### signer

> **signer**: [`TransactionSigner`](../type-aliases/TransactionSigner.md)

## Example

```ts
// Generate signers from an ed25519 keypair
const keypair = nacl.sign.keyPair()

// Create a raw signing callback
const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
  return nacl.sign.detached(bytesToSign, keypair.secretKey)
}

// Generate all signer types from the keypair
const addressWithSigners = generateAddressWithSigners({
  ed25519Pubkey: keypair.publicKey,
  rawEd25519Signer: rawSigner,
})

// Access the address and various signers
const address = addressWithSigners.addr
const transactionSigner = addressWithSigners.signer
```

## See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/signer.spec.ts)
