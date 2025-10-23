# AlgoKit Transact TypeScript

This library provides the core primitives for transaction management, including: creation, grouping, fee calculation, signature attachment, and encoding. Once the transactions have been formed, they can be sent to the network using your chosen algod HTTP client.

## Installation

> [!NOTE] This library is not yet published to NPM.
> You can install the package by [following these instructions](../../README.md#typescript).

## Key Management

This library doesn't contain any abstractions for keypair creation or transaction signing because Algorand uses standard ED25519 key pairs. As a result you can use any cryptographic library that supports ED25519 alongside this library.

In the below examples we use `@noble/ed25519`. Using this library, you can create a keypair and obtain the Algorand address like below:

```ts
// Generate a new secret key
const mySecretKey = ed.utils.randomPrivateKey()

// Get the public key and Algorand address
const myPublicKey = await ed.getPublicKeyAsync(mySecretKey)
const myAlgorandAddress = addressFromPubKey(myPublicKey)
```

## Examples

Below is a collection of examples that'll help you formulate transactions that can be sent to the network.

### Create a Payment

```ts
import * as ed from '@noble/ed25519'
import {
  addressFromString,
  Transaction,
  SignedTransaction,
  assignFee,
  encodeTransaction,
  encodeSignedTransaction,
} from '@algorandfoundation/algokit-transact'

// Get the sender and reciever addresses
const alicePubKey = await ed.getPublicKeyAsync(aliceSk)
const alice = addressFromPubKey(alicePubKey)
const bob = addressFromString('B72WNFFEZ7EOGMQPP7ROHYS3DSLL5JW74QASYNWGZGQXWRPJECJJLJIJ2Y')

// Build the base payment transaction
const baseTx: Transaction = {
  transactionType: 'Payment',
  sender: alice,
  firstValid: 1337n,
  lastValid: 1347n,
  genesisHash: Buffer.from('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=', 'base64'),
  genesisId: 'testnet-v1.0',
  payment: {
    amount: 1337n,
    receiver: bob,
  },
}

// Calculate and attach the correct fee, based on the supplied params
const tx = assignFee(baseTx, {
  feePerByte: 0n,
  minFee: 1000n,
  maxFee: 2000n,
})

// Encode the transaction for signing
const encodedTx = encodeTransaction(tx)

//Sign the transaction using `@noble/ed25519`
const txSig = await ed.signAsync(encodedTx, aliceSk)

// Create an encoded signed transaction ready for sending to the algod api
const signedTx: SignedTransaction = {
  transaction: tx,
  signature: txSig,
}
const encodedSignedTx = encodeSignedTransaction(signedTxn)
```
