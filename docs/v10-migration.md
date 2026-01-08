# v9 to v10 Migration Guide

This document outlines the required migration steps for going from AlgoKit utils v9 to v10.

AlgoKit utils v10 removes the dependency on `algosdk`. Most of the changes in v10 are related to this change.

It should be noted that this guide is intended to cover the changes to AlgoKit utils functionality. Utils *can* do everything that the
`algosdk` can do (in other words, you *could* completely remove `algosdk` from your codebase), but this guide assumes you want to keep existing `algosdk` code as-is to reduce the migration effort.

# Significant Changes

## Transaction

Since utils no longer depends on `algosdk`, the `Transaction` class has been redefined within AlgoKit. This results in some breaking
changes.

The easiest way to convert between `algosdk` `Transaction` and AlgoKit `Transaction` is to encode the `algosdk` transaction to bytes and then decode it using AlgoKit.

```ts
import * as algosdk from "algosdk";
import { decodeTransaction, Transaction } from "@algorandfoundation/algokit-utils/transact";

const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  sender: addr,
  receiver: addr,
  suggestedParams,
  amount: 0,
});

const utilsTxn = decodeTransaction(algosdk.encodeMsgpack(txn));
```

It may be useful to create utility functions to help with this conversion.

```ts
import * as algosdk from "algosdk";
import {
  decodeSignedTransaction,
  decodeTransaction,
  encodeSignedTransaction,
  encodeTransactionRaw,
  type SignedTransaction,
  type Transaction,
} from "@algorandfoundation/algokit-utils/transact";

export function sdkTxnToAlgokit(txn: algosdk.Transaction): Transaction {
  return decodeTransaction(algosdk.encodeMsgpack(txn));
}

export function algokitTxnToSdk(txn: Transaction): algosdk.Transaction {
  return algosdk.decodeUnsignedTransaction(encodeTransactionRaw(txn));
}

export function signedAlgokitTxnToSdk(
  signedTxn: algosdk.SignedTransaction,
): SignedTransaction {
  return decodeSignedTransaction(algosdk.encodeMsgpack(signedTxn));
}

export function signedSdkTxnToAlgokit(
  signedTxn: SignedTransaction,
): algosdk.SignedTransaction {
  return algosdk.decodeSignedTransaction(encodeSignedTransaction(signedTxn));
}
```

The `Tranasction` class is used in several places throughout the utils library. The following is a list of the most commonly affected areas
but it is not exhaustive. For any other use case not covered here the above utility functions can be used to convert between types.

### Composer Compatibility

The v9 composer can work directly with `algosdk` `Transaction` objects. In v10, this is no longer the case. You will need to convert `algosdk` `Transaction` objects to AlgoKit `Transaction` objects.

```ts
const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  sender: sdkAddr,
  receiver: sdkAddr,
  suggestedParams,
  amount: 0,
});

// Using the above convertTxn utility function
const utilsTxn = sdkTxnToAlgokit(txn);

const composerGroup = algorand.newGroup();
composerGroup.addTransaction(utilsTxn);
```

### Transaction Responses

Any function that returns Transaction objects will now return the AlgoKit `Transaction` type instead of the `algosdk` type.

To convert it, you can use the following utility function:

```ts
import type { PendingTransactionResponse } from "@algorandfoundation/algokit-utils/algod-client";

export type SdkPendingTransactionResponse = Omit<
  Omit<PendingTransactionResponse, "txn">,
  "innerTxns"
> & {
  txn: algosdk.SignedTransaction;
  innerTxns?: SdkPendingTransactionResponse[];
};

export function algokitPendingTxnToSdk(
  pendingTxn: PendingTransactionResponse,
): SdkPendingTransactionResponse {
  return {
    ...pendingTxn,
    txn: signedAlgokitTxnToSdk(pendingTxn.txn),
    innerTxns: pendingTxn.innerTxns?.map(algokitPendingTxnToSdk),
  };
}

const sendResponse = await composerGroup.send();

const sentTxns: algosdk.Transaction[] =
  sendResponse.transactions.map(algokitTxnToSdk);

const confirmedTxns: SdkPendingTransactionResponse[] =
  sendResponse.confirmations?.map(algokitPendingTxnToSdk);
```

### TransactionSigner

The `TransactionSigner` in v10 has the same interface as algosdk, but it uses the AlgoKit `Transaction` type. If you are providing a library
that implements `TransactionSigner` and you want to support both v10 and algosdk transactions, you can implement a wrapper like this:

```ts
import * as algosdk from "algosdk";
import { Transaction } from '@algorandfoundation/algokit-utils/transact'

export function isAlgokitTxnGroup(txnGroup: any): txnGroup is Transaction[] {
  if (!Array.isArray(txnGroup) || txnGroup.length === 0) {
    return false
  }

  return txnGroup[0] instanceof Transaction
}

export const transactionSigner = async (txns: algosdk.Transaction[] | Transaction[]) => {
  let sdkTxns: algosdk.Transaction[]

  if (isAlgokitTxnGroup(txns)) {
    sdkTxns = txns.map(algokitTxnToSdk)
  } else {
    sdkTxns = txns
  }

  // Rest of existing signing logic here using sdkTxns
}
```

## API Clients

AlgoKit utils v10 includes new API clients for algod, KMD, and indexer. The clients offer the same functionality as the SDK clients but
offer more consistent naming, better type coverage, and a more idiomatic UX. The request/response models are similar enough that it is
recommended to convert algosdk client code to use the new clients, but if you need to continue using `algosdk` clients, migration is possible.

### Using algosdk clients

If you want to continue using `algosdk` clients, you can convert an AlgoKit utils v10 client to an `algosdk` client like so:

```ts
export function algokitAlgodClientToAlgosdk(
  algokitClient: AlgodClient,
): algosdk.Algodv2 {
  return new algosdk.Algodv2(
    algokitClient.httpRequest.config.headers ?? "",
    algokitClient.httpRequest.config.baseUrl,
    algokitClient.httpRequest.config.port,
  );
}

export function algokitIndexerClientToAlgosdk(
  algokitClient: AlgodClient,
): algosdk.Indexer {
  return new algosdk.Indexer(
    algokitClient.httpRequest.config.headers ?? "",
    algokitClient.httpRequest.config.baseUrl,
    algokitClient.httpRequest.config.port,
  );
}

export function algokitKMDClientToAlgosdk(
  algokitClient: AlgodClient,
): algosdk.Kmd {
  return new algosdk.Kmd(
    algokitClient.httpRequest.config.headers ?? "",
    algokitClient.httpRequest.config.baseUrl,
    algokitClient.httpRequest.config.port,
  );
}
```

### .do()

The algosdk clients use a `.do()` method to execute requests. In v10, this has been replaced with direct method calls.

**v9**

```ts
const sdkResult = await algorand.client.algod.getApplicationBoxes(1234).do();
```

**v10**

```ts
const algokitResult = await algorand.client.algod.applicationBoxes(1234);
```

### Request Parameters

The algosdk clients use a builder pattern to assemble a request perform calling `.do()` on it. In the v10 clients, request parameters are passed directly to the method.

**v9**

```ts
const sdkResult = await algorand.client.algod.getApplicationBoxes(1234).max(10).do();
```

**v10**

```ts
const algokitResult = await algorand.client.algod.applicationBoxes(1234, { max: 10 });
```

## ABI Types and Values

AlgoKit utils v10 also has new classes for ABI types and values. The functionality of these classes are practically the same as the current `algosdk` ABI type and value classes,

```ts
export function sdkAbiTypeToAlgokit(sdkAbiType: algosdk.ABIType): ABIType {
  return ABIType.from(sdkAbiType.toString());
}

export function algokitAbiTypeToSdk(algokitAbiType: ABIType): algosdk.ABIType {
  return algosdk.ABIType.from(algokitAbiType.toString());
}
```

### Handling Structs

The AlgoKit ABI package treats ARC56 structs as first-class types. This, however, does add some friction if you wish to convert AlgoKit ABI
values to `algosdk` ABI values, since `algosdk` does not have a struct type. In order to properly convert a struct, you need both the value
(which is just a plain JS object) and the ABI type:

```ts
export function algokitStructToSdkAbiValue(
  algokitAbiValue: ABIValue,
  abiType: ABIStructType,
): algosdk.ABIValue {
  const sdkTupleType = algosdk.ABIType.from(
    abiType.toABITupleType().toString(),
  );
  const encoded = abiType.encode(algokitAbiValue);
  return sdkTupleType.decode(encoded);
}
```

## Address

AlgoKit utils v10 includes a new `Address` class. It has the same functionality as the `algosdk` `Address` class. You can easily convert
between the two using the public key:

```ts
import * as algosdk from "algosdk";
import { Address } from "@algorandfoundation/algokit-utils";

export function sdkAddressToAlgokit(
  sdkAddress: algosdk.Address,
): Address {
  return new Address(sdkAddress.publicKey);
}

export function algokitAddressToSdk(
  algokitAddress: Address,
): algosdk.Address {
  return new algosdk.Address(algokitAddress.publicKey);
}
```

## Accounts

`Account`, `Multsig`, and `Logicsig` classes from `algosdk` will no longer be compatible with AlgoKit utils v10. For most users, this should
not require any migration effort outside of test code and wallets. Additionally, the new AlgoKit classes have some breaking changes to
improve UX and security (no more passing around secret keys).

### Account

The `Account` class has been completely removed in v10. There is no abstraction on-top of secret material. In most cases if you have a
keypair and want Algorand-specific functionality (Address and signing), you can use the `generateAddressWithSigners` function. The output
includes an `addr` field with the `Address` and signing callbacks for signing transactions, lsigs, msigs, bytes, and program data.

```ts
const keypair = nacl.sign.keyPair()
const rawSigner = async (bytesToSign: Uint8Array): Promise<Uint8Array> => {
  return nacl.sign.detached(bytesToSign, keypair.secretKey)
}

const addressWithSigners = generateAddressWithSigners({ ed25519Pubkey: keypair.publicKey, rawEd25519Signer: rawSigner })
```

### Multisig

TODO: There's some significant changes but the affect userbase is probably pretty small, so not a priority for now.

### Logicsig

TODO: There's some significant changes but the affect userbase is probably pretty small, so not a priority for now.

## AtomicTransactionComposer

TODO: Converting between composer types is non-trivial. We should think about how we want to handle this before documenting it.

## Minor Changes

### Renaming index to id

`algosdk` will use `index` and `id` interchangeably for things like asset ID and application ID. In v10, we have standardized on `id` for these fields. For example, `Asset.index` is now `Asset.id` throughout the library.

### Renaming txID to txId

`algosdk` uses `txID` for transaction IDs. In v10, this has been renamed to `txId` for consistency with other field names that use `id`.

### Removed HTTP methods from API clients

`algosdk` would add HTTP method prefixes to some of the API client methods. In v10, the method prefix is removed from all methods. For example, `getSuggestedParams` is now `suggestedParams`.

### TransactionType Enum

In `algosdk` the `TransactionType` enum used the short names for transaction types. In v10, the enum uses the full names. For example,
`TransactionType.axfer` is now `TransactionType.AssetTransfer`.

### Renaming applicationCall to appCall

In an algosdk `Transaction`, the app call fields when reading an app call transaction are under `applicationCall`. In v10, this has been renamed to `appCall` for consistency with the rest of the library.
