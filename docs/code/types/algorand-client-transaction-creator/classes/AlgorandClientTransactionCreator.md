[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/algorand-client-transaction-creator](../README.md) / AlgorandClientTransactionCreator

# Class: AlgorandClientTransactionCreator

Defined in: [src/types/algorand-client-transaction-creator.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L8)

Orchestrates creating transactions for `AlgorandClient`.

## Constructors

### Constructor

> **new AlgorandClientTransactionCreator**(`newGroup`): `AlgorandClientTransactionCreator`

Defined in: [src/types/algorand-client-transaction-creator.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L19)

Creates a new `AlgorandClientTransactionCreator`

#### Parameters

##### newGroup

() => [`TransactionComposer`](../../composer/classes/TransactionComposer.md)

A lambda that starts a new `TransactionComposer` transaction group

#### Returns

`AlgorandClientTransactionCreator`

#### Example

```typescript
const transactionCreator = new AlgorandClientTransactionCreator(() => new TransactionComposer())
```

## Properties

### appCall()

> **appCall**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:458](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L458)

Create an application call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

#### Parameters

##### params

[`AppCallParams`](../../composer/type-aliases/AppCallParams.md)

The parameters for the app call transaction

#### Returns

`Promise`\<`Transaction`\>

The application call transaction

#### Examples

```typescript
await algorand.createTransaction.appCall({ sender: 'CREATORADDRESS' })
```

```typescript
await algorand.createTransaction.appCall({
 sender: 'CREATORADDRESS',
 onComplete: algosdk.OnApplicationComplete.OptInOC,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

***

### appCallMethodCall()

> **appCallMethodCall**: (`params`) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\>; `signers`: `Map`\<`number`, `TransactionSigner`\>; `transactions`: `Transaction`[]; \}\>

Defined in: [src/types/algorand-client-transaction-creator.ts:653](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L653)

Create an application call with ABI method call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

#### Parameters

##### params

[`AppCallMethodCall`](../../composer/type-aliases/AppCallMethodCall.md)

The parameters for the app call transaction

#### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\>; `signers`: `Map`\<`number`, `TransactionSigner`\>; `transactions`: `Transaction`[]; \}\>

The application ABI method call transaction

#### Examples

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appCallMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appCallMethodCall({
 sender: 'CREATORADDRESS',
 method: method,
 args: ["arg1_value"],
 onComplete: algosdk.OnApplicationComplete.OptInOC,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

***

### appCreate()

> **appCreate**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:354](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L354)

Create an application create transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

#### Parameters

##### params

The parameters for the app creation transaction

###### accountReferences?

(`string` \| `Address`)[]

Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

###### appReferences?

`bigint`[]

The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

###### approvalProgram

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

The program to execute for all OnCompletes other than ClearState as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)).

###### args?

`Uint8Array`\<`ArrayBufferLike`\>[]

Any [arguments to pass to the smart contract call](/concepts/smart-contracts/languages/teal/#argument-passing).

###### assetReferences?

`bigint`[]

The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

###### boxReferences?

([`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md) \| [`BoxReference`](../../app-manager/interfaces/BoxReference.md))[]

Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

Either the name identifier (which will be set against app ID of `0` i.e.
 the current app), or a box identifier with the name identifier and app ID.

###### clearStateProgram

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

The program to execute for ClearState OnComplete as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)).

###### extraFee?

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees.

###### extraProgramPages?

`number`

Number of extra pages required for the programs.
Defaults to the number needed for the programs in this call if not specified.
This is immutable once the app is created.

###### firstValidRound?

`bigint`

Set the first round this transaction is valid.
If left undefined, the value from algod will be used.

We recommend you only set this when you intentionally want this to be some time in the future.

###### lastValidRound?

`bigint`

The last round this transaction is valid. It is recommended to use `validityWindow` instead.

###### lease?

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

Prevent multiple transactions with the same lease being included within the validity window.

A [lease](https://dev.algorand.co/concepts/transactions/leases)
 enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios).

###### maxFee?

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods.

###### note?

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

Note to attach to the transaction. Max of 1000 bytes.

###### onComplete?

`NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC`

The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op.

###### rekeyTo?

`string` \| `Address`

Change the signing key of the sender to the given address.

**Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).

###### schema?

\{ `globalByteSlices`: `number`; `globalInts`: `number`; `localByteSlices`: `number`; `localInts`: `number`; \}

The state schema for the app. This is immutable once the app is created.

###### schema.globalByteSlices

`number`

The number of byte slices saved in global state.

###### schema.globalInts

`number`

The number of integers saved in global state.

###### schema.localByteSlices

`number`

The number of byte slices saved in local state.

###### schema.localInts

`number`

The number of integers saved in local state.

###### sender

`string` \| `Address`

The address of the account sending the transaction.

###### signer?

`TransactionSigner` \| [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md)

The function used to sign transaction(s); if not specified then
 an attempt will be made to find a registered signer for the
 given `sender` or use a default signer (if configured).

###### staticFee?

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction.

###### validityWindow?

`number` \| `bigint`

How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used.

#### Returns

`Promise`\<`Transaction`\>

The application create transaction

#### Examples

```typescript
await algorand.createTransaction.appCreate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
```

```typescript
await algorand.createTransaction.appCreate({
 sender: 'CREATORADDRESS',
 approvalProgram: "TEALCODE",
 clearStateProgram: "TEALCODE",
 schema: {
   globalInts: 1,
   globalByteSlices: 2,
   localInts: 3,
   localByteSlices: 4
 },
 extraProgramPages: 1,
 onComplete: algosdk.OnApplicationComplete.OptInOC,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

***

### appCreateMethodCall()

> **appCreateMethodCall**: (`params`) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\>; `signers`: `Map`\<`number`, `TransactionSigner`\>; `transactions`: `Transaction`[]; \}\>

Defined in: [src/types/algorand-client-transaction-creator.ts:513](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L513)

Create an application create call with ABI method call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

#### Parameters

##### params

[`AppCreateMethodCall`](../../composer/type-aliases/AppCreateMethodCall.md)

The parameters for the app creation transaction

#### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\>; `signers`: `Map`\<`number`, `TransactionSigner`\>; `transactions`: `Transaction`[]; \}\>

The application ABI method create transaction

#### Examples

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appCreateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
```

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appCreateMethodCall({
 sender: 'CREATORADDRESS',
 method: method,
 args: ["arg1_value"],
 approvalProgram: "TEALCODE",
 clearStateProgram: "TEALCODE",
 schema: {
   globalInts: 1,
   globalByteSlices: 2,
   localInts: 3,
   localByteSlices: 4
 },
 extraProgramPages: 1,
 onComplete: algosdk.OnApplicationComplete.OptInOC,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

***

### appDelete()

> **appDelete**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:424](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L424)

Create an application delete transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

#### Parameters

##### params

[`AppDeleteParams`](../../composer/type-aliases/AppDeleteParams.md)

The parameters for the app deletion transaction

#### Returns

`Promise`\<`Transaction`\>

The application delete transaction

#### Examples

```typescript
await algorand.createTransaction.appDelete({ sender: 'CREATORADDRESS' })
```

```typescript
await algorand.createTransaction.appDelete({
 sender: 'CREATORADDRESS',
 onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

***

### appDeleteMethodCall()

> **appDeleteMethodCall**: (`params`) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\>; `signers`: `Map`\<`number`, `TransactionSigner`\>; `transactions`: `Transaction`[]; \}\>

Defined in: [src/types/algorand-client-transaction-creator.ts:607](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L607)

Create an application delete call with ABI method call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

#### Parameters

##### params

[`AppDeleteMethodCall`](../../composer/type-aliases/AppDeleteMethodCall.md)

The parameters for the app deletion transaction

#### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\>; `signers`: `Map`\<`number`, `TransactionSigner`\>; `transactions`: `Transaction`[]; \}\>

The application ABI method delete transaction

#### Examples

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appDeleteMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appDeleteMethodCall({
 sender: 'CREATORADDRESS',
 method: method,
 args: ["arg1_value"],
 onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

***

### appUpdate()

> **appUpdate**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:390](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L390)

Create an application update transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

#### Parameters

##### params

The parameters for the app update transaction

###### accountReferences?

(`string` \| `Address`)[]

Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

###### appId

`bigint`

ID of the application; 0 if the application is being created.

###### appReferences?

`bigint`[]

The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

###### approvalProgram

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array))

###### args?

`Uint8Array`\<`ArrayBufferLike`\>[]

Any [arguments to pass to the smart contract call](/concepts/smart-contracts/languages/teal/#argument-passing).

###### assetReferences?

`bigint`[]

The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

###### boxReferences?

([`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md) \| [`BoxReference`](../../app-manager/interfaces/BoxReference.md))[]

Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).

Either the name identifier (which will be set against app ID of `0` i.e.
 the current app), or a box identifier with the name identifier and app ID.

###### clearStateProgram

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array))

###### extraFee?

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees.

###### firstValidRound?

`bigint`

Set the first round this transaction is valid.
If left undefined, the value from algod will be used.

We recommend you only set this when you intentionally want this to be some time in the future.

###### lastValidRound?

`bigint`

The last round this transaction is valid. It is recommended to use `validityWindow` instead.

###### lease?

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

Prevent multiple transactions with the same lease being included within the validity window.

A [lease](https://dev.algorand.co/concepts/transactions/leases)
 enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios).

###### maxFee?

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods.

###### note?

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

Note to attach to the transaction. Max of 1000 bytes.

###### onComplete?

`UpdateApplicationOC`

The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op.

###### rekeyTo?

`string` \| `Address`

Change the signing key of the sender to the given address.

**Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).

###### sender

`string` \| `Address`

The address of the account sending the transaction.

###### signer?

`TransactionSigner` \| [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md)

The function used to sign transaction(s); if not specified then
 an attempt will be made to find a registered signer for the
 given `sender` or use a default signer (if configured).

###### staticFee?

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction.

###### validityWindow?

`number` \| `bigint`

How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used.

#### Returns

`Promise`\<`Transaction`\>

The application update transaction

#### Examples

```typescript
await algorand.createTransaction.appUpdate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
```

```typescript
await algorand.createTransaction.appUpdate({
 sender: 'CREATORADDRESS',
 approvalProgram: "TEALCODE",
 clearStateProgram: "TEALCODE",
 onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

***

### appUpdateMethodCall()

> **appUpdateMethodCall**: (`params`) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\>; `signers`: `Map`\<`number`, `TransactionSigner`\>; `transactions`: `Transaction`[]; \}\>

Defined in: [src/types/algorand-client-transaction-creator.ts:561](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L561)

Create an application update call with ABI method call transaction.

Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.

#### Parameters

##### params

[`AppUpdateMethodCall`](../../composer/type-aliases/AppUpdateMethodCall.md)

The parameters for the app update transaction

#### Returns

`Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\>; `signers`: `Map`\<`number`, `TransactionSigner`\>; `transactions`: `Transaction`[]; \}\>

The application ABI method update transaction

#### Examples

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appUpdateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
```

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
await algorand.createTransaction.appUpdateMethodCall({
 sender: 'CREATORADDRESS',
 method: method,
 args: ["arg1_value"],
 approvalProgram: "TEALCODE",
 clearStateProgram: "TEALCODE",
 onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC,
 args: [new Uint8Array(1, 2, 3, 4)]
 accountReferences: ["ACCOUNT_1"]
 appReferences: [123n, 1234n]
 assetReferences: [12345n]
 boxReferences: ["box1", {appId: 1234n, name: "box2"}]
 lease: 'lease',
 note: 'note',
 // You wouldn't normally set this field
 firstValidRound: 1000n,
 validityWindow: 10,
 extraFee: (1000).microAlgo(),
 staticFee: (1000).microAlgo(),
 // Max fee doesn't make sense with extraFee AND staticFee
 //  already specified, but here for completeness
 maxFee: (3000).microAlgo(),
})
```

***

### assetConfig()

> **assetConfig**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L151)

Create an asset config transaction to reconfigure an existing Algorand Standard Asset.

**Note:** The manager, reserve, freeze, and clawback addresses
are immutably empty if they are not set. If manager is not set then
all fields are immutable from that point forward.

#### Parameters

##### params

[`AssetConfigParams`](../../composer/type-aliases/AssetConfigParams.md)

The parameters for the asset config transaction

#### Returns

`Promise`\<`Transaction`\>

The asset config transaction

#### Examples

```typescript
await algorand.createTransaction.assetConfig({ sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
```

```typescript
await algorand.createTransaction.assetConfig({
  sender: 'MANAGERADDRESS',
  assetId: 123456n,
  manager: 'MANAGERADDRESS',
  reserve: 'RESERVEADDRESS',
  freeze: 'FREEZEADDRESS',
  clawback: 'CLAWBACKADDRESS',
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

***

### assetCreate()

> **assetCreate**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L115)

Create a create Algorand Standard Asset transaction.

The account that sends this transaction will automatically be
opted in to the asset and will hold all units after creation.

#### Parameters

##### params

[`AssetCreateParams`](../../composer/type-aliases/AssetCreateParams.md)

The parameters for the asset creation transaction

#### Returns

`Promise`\<`Transaction`\>

The asset create transaction

#### Examples

```typescript
await algorand.createTransaction.assetCreate({ sender: "CREATORADDRESS", total: 100n})
```

```typescript
await algorand.createTransaction.assetCreate({
  sender: 'CREATORADDRESS',
  total: 100n,
  decimals: 2,
  assetName: 'asset',
  unitName: 'unit',
  url: 'url',
  metadataHash: 'metadataHash',
  defaultFrozen: false,
  manager: 'MANAGERADDRESS',
  reserve: 'RESERVEADDRESS',
  freeze: 'FREEZEADDRESS',
  clawback: 'CLAWBACKADDRESS',
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

***

### assetDestroy()

> **assetDestroy**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:213](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L213)

Create an Algorand Standard Asset destroy transaction.

Created assets can be destroyed only by the asset manager account.
All of the assets must be owned by the creator of the asset before
the asset can be deleted.

#### Parameters

##### params

[`AssetDestroyParams`](../../composer/type-aliases/AssetDestroyParams.md)

The parameters for the asset destroy transaction

#### Returns

`Promise`\<`Transaction`\>

The asset destroy transaction

#### Examples

```typescript
await algorand.createTransaction.assetDestroy({ sender: "MANAGERADDRESS", assetId: 123456n })
```

```typescript
await algorand.createTransaction.assetDestroy({
  sender: 'MANAGERADDRESS',
  assetId: 123456n,
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

***

### assetFreeze()

> **assetFreeze**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:181](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L181)

Create an Algorand Standard Asset freeze transaction.

#### Parameters

##### params

[`AssetFreezeParams`](../../composer/type-aliases/AssetFreezeParams.md)

The parameters for the asset freeze transaction

#### Returns

`Promise`\<`Transaction`\>

The asset freeze transaction

#### Examples

```typescript
await algorand.createTransaction.assetFreeze({ sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
```

```typescript
await algorand.createTransaction.assetFreeze({
  sender: 'MANAGERADDRESS',
  assetId: 123456n,
  account: 'ACCOUNTADDRESS',
  frozen: true,
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

***

### assetOptIn()

> **assetOptIn**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:274](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L274)

Create an Algorand Standard Asset opt-in transaction.

#### Parameters

##### params

[`AssetOptInParams`](../../composer/type-aliases/AssetOptInParams.md)

The parameters for the asset opt-in transaction

#### Returns

`Promise`\<`Transaction`\>

The asset opt-in transaction

#### Examples

```typescript
await algorand.createTransaction.assetOptIn({ sender: "SENDERADDRESS", assetId: 123456n })
```

```typescript
await algorand.createTransaction.assetOptIn({
  sender: 'SENDERADDRESS',
  assetId: 123456n,
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

***

### assetOptOut()

> **assetOptOut**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:311](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L311)

Create an asset opt-out transaction.

*Note:* If the account has a balance of the asset,
it will lose those assets

#### Parameters

##### params

[`AssetOptOutParams`](../../composer/type-aliases/AssetOptOutParams.md)

The parameters for the asset opt-out transaction

#### Returns

`Promise`\<`Transaction`\>

The asset opt-out transaction

#### Examples

```typescript
await algorand.createTransaction.assetOptOut({ sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

```typescript
await algorand.createTransaction.assetOptOut({ sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

```typescript
await algorand.createTransaction.assetOptOut({
  sender: 'SENDERADDRESS',
  assetId: 123456n,
  creator: 'CREATORADDRESS',
  ensureZeroBalance: true,
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

***

### assetTransfer()

> **assetTransfer**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:246](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L246)

Create an Algorand Standard Asset transfer transaction.

#### Parameters

##### params

[`AssetTransferParams`](../../composer/type-aliases/AssetTransferParams.md)

The parameters for the asset transfer transaction

#### Returns

`Promise`\<`Transaction`\>

The result of the asset transfer transaction

#### Examples

```typescript
await algorand.createTransaction.assetTransfer({ sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
```

```typescript
await algorand.createTransaction.assetTransfer({
  sender: 'CLAWBACKADDRESS',
  assetId: 123456n,
  amount: 1n,
  receiver: 'RECEIVERADDRESS',
  clawbackTarget: 'HOLDERADDRESS',
  // This field needs to be used with caution
  closeAssetTo: 'ADDRESSTOCLOSETO'
  lease: 'lease',
  note: 'note',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

***

### offlineKeyRegistration()

> **offlineKeyRegistration**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:725](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L725)

Create an offline key registration transaction.

#### Parameters

##### params

[`OfflineKeyRegistrationParams`](../../composer/type-aliases/OfflineKeyRegistrationParams.md)

The parameters for the key registration transaction

#### Returns

`Promise`\<`Transaction`\>

The offline key registration transaction

#### Examples

```typescript
await algorand.createTransaction.offlineKeyRegistration({
  sender: 'SENDERADDRESS',
})
```

```typescript
await algorand.createTransaction.offlineKeyRegistration({
  sender: 'SENDERADDRESS',
  lease: 'lease',
  note: 'note',
  // Use this with caution, it's generally better to use algorand.account.rekeyAccount
  rekeyTo: 'REKEYTOADDRESS',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

***

### onlineKeyRegistration()

> **onlineKeyRegistration**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:695](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L695)

Create an online key registration transaction.

#### Parameters

##### params

[`OnlineKeyRegistrationParams`](../../composer/type-aliases/OnlineKeyRegistrationParams.md)

The parameters for the key registration transaction

#### Returns

`Promise`\<`Transaction`\>

The online key registration transaction

#### Examples

```typescript
await algorand.createTransaction.onlineKeyRegistration({
  sender: 'SENDERADDRESS',
  voteKey: Uint8Array.from(Buffer.from("voteKeyBase64", 'base64')),
  selectionKey: Uint8Array.from(Buffer.from("selectionKeyBase64", 'base64')),
  stateProofKey: Uint8Array.from(Buffer.from("stateProofKeyBase64", 'base64')),
  voteFirst: 1n,
  voteLast: 1000n,
  voteKeyDilution: 1n,
})
```

```typescript
await algorand.createTransaction.onlineKeyRegistration({
  sender: 'SENDERADDRESS',
  voteKey: Uint8Array.from(Buffer.from("voteKeyBase64", 'base64')),
  selectionKey: Uint8Array.from(Buffer.from("selectionKeyBase64", 'base64')),
  stateProofKey: Uint8Array.from(Buffer.from("stateProofKeyBase64", 'base64')),
  voteFirst: 1n,
  voteLast: 1000n,
  voteKeyDilution: 1n,
  lease: 'lease',
  note: 'note',
  // Use this with caution, it's generally better to use algorand.account.rekeyAccount
  rekeyTo: 'REKEYTOADDRESS',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```

***

### payment()

> **payment**: (`params`) => `Promise`\<`Transaction`\>

Defined in: [src/types/algorand-client-transaction-creator.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algorand-client-transaction-creator.ts#L74)

Create a payment transaction to transfer Algo between accounts.

#### Parameters

##### params

[`PaymentParams`](../../composer/type-aliases/PaymentParams.md)

The parameters for the payment transaction

#### Returns

`Promise`\<`Transaction`\>

The payment transaction

#### Examples

```typescript
await algorand.createTransaction.payment({
  sender: 'SENDERADDRESS',
  receiver: 'RECEIVERADDRESS',
  amount: (4).algo(),
})
```

```typescript
await algorand.createTransaction.payment({
  amount: (4).algo(),
  receiver: 'RECEIVERADDRESS',
  sender: 'SENDERADDRESS',
  closeRemainderTo: 'CLOSEREMAINDERTOADDRESS',
  lease: 'lease',
  note: 'note',
  // Use this with caution, it's generally better to use algorand.account.rekeyAccount
  rekeyTo: 'REKEYTOADDRESS',
  // You wouldn't normally set this field
  firstValidRound: 1000n,
  validityWindow: 10,
  extraFee: (1000).microAlgo(),
  staticFee: (1000).microAlgo(),
  // Max fee doesn't make sense with extraFee AND staticFee
  //  already specified, but here for completeness
  maxFee: (3000).microAlgo(),
})
```
