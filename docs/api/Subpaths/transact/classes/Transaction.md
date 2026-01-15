[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / Transaction

# Class: Transaction

Defined in: [packages/transact/src/transactions/transaction.ts:160](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L160)

Represents a complete Algorand transaction.

## Implements

- [`TransactionParams`](../type-aliases/TransactionParams.md)

## Constructors

### Constructor

> **new Transaction**(`params`): `Transaction`

Defined in: [packages/transact/src/transactions/transaction.ts:282](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L282)

#### Parameters

##### params

[`TransactionParams`](../type-aliases/TransactionParams.md)

#### Returns

`Transaction`

## Properties

### \[TXN\_SYMBOL\]

> **\[TXN\_SYMBOL\]**: `boolean`

Defined in: [packages/transact/src/transactions/transaction.ts:162](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L162)

**`Internal`**

***

### appCall?

> `optional` **appCall**: [`AppCallTransactionFields`](../type-aliases/AppCallTransactionFields.md)

Defined in: [packages/transact/src/transactions/transaction.ts:260](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L260)

App call specific fields

#### Implementation of

`TransactionParams.appCall`

***

### assetConfig?

> `optional` **assetConfig**: [`AssetConfigTransactionFields`](../type-aliases/AssetConfigTransactionFields.md)

Defined in: [packages/transact/src/transactions/transaction.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L255)

Asset config specific fields

#### Implementation of

`TransactionParams.assetConfig`

***

### assetFreeze?

> `optional` **assetFreeze**: [`AssetFreezeTransactionFields`](../type-aliases/AssetFreezeTransactionFields.md)

Defined in: [packages/transact/src/transactions/transaction.ts:270](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L270)

Asset freeze specific fields

#### Implementation of

`TransactionParams.assetFreeze`

***

### assetTransfer?

> `optional` **assetTransfer**: [`AssetTransferTransactionFields`](../type-aliases/AssetTransferTransactionFields.md)

Defined in: [packages/transact/src/transactions/transaction.ts:250](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L250)

Asset transfer specific fields

#### Implementation of

`TransactionParams.assetTransfer`

***

### fee?

> `optional` **fee**: `bigint`

Defined in: [packages/transact/src/transactions/transaction.ts:181](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L181)

Optional transaction fee in microALGO.

When not set, the fee will be interpreted as 0 by the network.

#### Implementation of

`TransactionParams.fee`

***

### firstValid

> **firstValid**: `bigint`

Defined in: [packages/transact/src/transactions/transaction.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L186)

First round for when the transaction is valid.

#### Implementation of

`TransactionParams.firstValid`

***

### genesisHash?

> `optional` **genesisHash**: `Uint8Array`

Defined in: [packages/transact/src/transactions/transaction.ts:200](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L200)

Hash of the genesis block of the network.

Used to identify which network the transaction is for.

#### Implementation of

`TransactionParams.genesisHash`

***

### genesisId?

> `optional` **genesisId**: `string`

Defined in: [packages/transact/src/transactions/transaction.ts:207](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L207)

Genesis ID of the network.

A human-readable string used alongside genesis hash to identify the network.

#### Implementation of

`TransactionParams.genesisId`

***

### group?

> `optional` **group**: `Uint8Array`

Defined in: [packages/transact/src/transactions/transaction.ts:240](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L240)

Optional group ID for atomic transaction grouping.

Transactions with the same group ID must execute together or not at all.

#### Implementation of

`TransactionParams.group`

***

### heartbeat?

> `optional` **heartbeat**: [`HeartbeatTransactionFields`](../type-aliases/HeartbeatTransactionFields.md)

Defined in: [packages/transact/src/transactions/transaction.ts:275](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L275)

Heartbeat specific fields

#### Implementation of

`TransactionParams.heartbeat`

***

### keyRegistration?

> `optional` **keyRegistration**: [`KeyRegistrationTransactionFields`](../type-aliases/KeyRegistrationTransactionFields.md)

Defined in: [packages/transact/src/transactions/transaction.ts:265](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L265)

Key registration specific fields

#### Implementation of

`TransactionParams.keyRegistration`

***

### lastValid

> **lastValid**: `bigint`

Defined in: [packages/transact/src/transactions/transaction.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L193)

Last round for when the transaction is valid.

After this round, the transaction will be expired.

#### Implementation of

`TransactionParams.lastValid`

***

### lease?

> `optional` **lease**: `Uint8Array`

Defined in: [packages/transact/src/transactions/transaction.ts:233](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L233)

Optional lease value to enforce mutual transaction exclusion.

When a transaction with a non-empty lease field is confirmed, the lease is acquired.
A lease X is acquired by the sender, generating the (sender, X) lease.
The lease is kept active until the last_valid round of the transaction has elapsed.
No other transaction sent by the same sender can be confirmed until the lease expires.

#### Implementation of

`TransactionParams.lease`

***

### note?

> `optional` **note**: `Uint8Array`

Defined in: [packages/transact/src/transactions/transaction.ts:214](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L214)

Optional user-defined note field.

Can contain arbitrary data up to 1KB in size.

#### Implementation of

`TransactionParams.note`

***

### payment?

> `optional` **payment**: [`PaymentTransactionFields`](../type-aliases/PaymentTransactionFields.md)

Defined in: [packages/transact/src/transactions/transaction.ts:245](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L245)

Payment specific fields

#### Implementation of

`TransactionParams.payment`

***

### rekeyTo?

> `optional` **rekeyTo**: [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [packages/transact/src/transactions/transaction.ts:223](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L223)

Optional authorized account for future transactions.

If set, only this account will be used for transaction authorization going forward.
Reverting back control to the original address must be done by setting this field to
the original address.

#### Implementation of

`TransactionParams.rekeyTo`

***

### sender

> **sender**: [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [packages/transact/src/transactions/transaction.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L174)

The account that authorized the transaction.

Fees are deducted from this account.

#### Implementation of

`TransactionParams.sender`

***

### stateProof?

> `optional` **stateProof**: [`StateProofTransactionFields`](../type-aliases/StateProofTransactionFields.md)

Defined in: [packages/transact/src/transactions/transaction.ts:280](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L280)

State proof specific fields

#### Implementation of

`TransactionParams.stateProof`

***

### type

> **type**: [`TransactionType`](../enumerations/TransactionType.md)

Defined in: [packages/transact/src/transactions/transaction.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L167)

The type of transaction

#### Implementation of

`TransactionParams.type`

## Methods

### txId()

> **txId**(): `string`

Defined in: [packages/transact/src/transactions/transaction.ts:317](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L317)

Get the transaction ID as a base32-encoded string.

#### Returns

`string`
