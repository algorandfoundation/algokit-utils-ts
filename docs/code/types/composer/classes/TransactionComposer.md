[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / TransactionComposer

# Class: TransactionComposer

Defined in: [src/types/composer.ts:547](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L547)

TransactionComposer helps you compose and execute transactions as a transaction group.

## Constructors

### Constructor

> **new TransactionComposer**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:608](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L608)

Create a `TransactionComposer`.

#### Parameters

##### params

[`TransactionComposerParams`](../type-aliases/TransactionComposerParams.md)

The configuration for this composer

#### Returns

`TransactionComposer`

The `TransactionComposer` instance

## Methods

### addAppCall()

> **addAppCall**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:1106](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1106)

Add an application call transaction to the transaction group.

If you want to create or update an app use `addAppCreate` or `addAppUpdate`.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

##### params

[`AppCallParams`](../type-aliases/AppCallParams.md)

The application call transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAppCall({ sender: 'CREATORADDRESS' })
```

```typescript
composer.addAppCall({
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

### addAppCallMethodCall()

> **addAppCallMethodCall**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:1318](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1318)

Add a non-create/non-update ABI method application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

##### params

[`AppCallMethodCall`](../type-aliases/AppCallMethodCall.md)

The ABI method application call transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppCallMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppCallMethodCall({
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

### addAppCreate()

> **addAppCreate**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:985](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L985)

Add an application create transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

##### params

The application create transaction parameters

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

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAppCreate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
```

```typescript
composer.addAppCreate({
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
 // Signer only needed if you want to provide one,
 //  generally you'd register it with AlgorandClient
 //  against the sender and not need to pass it in
 signer: transactionSigner,
 maxRoundsToWaitForConfirmation: 5,
 suppressLog: true,
})
```

***

### addAppCreateMethodCall()

> **addAppCreateMethodCall**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:1166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1166)

Add an ABI method create application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

##### params

[`AppCreateMethodCall`](../type-aliases/AppCreateMethodCall.md)

The ABI create method application call transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppCreateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
```

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppCreateMethodCall({
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

### addAppDelete()

> **addAppDelete**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:1065](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1065)

Add an application delete transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

##### params

[`AppDeleteParams`](../type-aliases/AppDeleteParams.md)

The application delete transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAppDelete({ sender: 'CREATORADDRESS' })
```

```typescript
composer.addAppDelete({
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

### addAppDeleteMethodCall()

> **addAppDeleteMethodCall**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:1268](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1268)

Add an ABI method delete application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

##### params

[`AppDeleteMethodCall`](../type-aliases/AppDeleteMethodCall.md)

The ABI delete method application call transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppDeleteMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
```

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppDeleteMethodCall({
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

### addAppUpdate()

> **addAppUpdate**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:1026](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1026)

Add an application update transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

##### params

The application update transaction parameters

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

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAppUpdate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
```

```typescript
composer.addAppUpdate({
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

### addAppUpdateMethodCall()

> **addAppUpdateMethodCall**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:1218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1218)

Add an ABI method update application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

##### params

[`AppUpdateMethodCall`](../type-aliases/AppUpdateMethodCall.md)

The ABI update method application call transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppUpdateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
```

```typescript
const method = new ABIMethod({
  name: 'method',
  args: [{ name: 'arg1', type: 'string' }],
  returns: { type: 'string' },
})
composer.addAppUpdateMethodCall({
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

### addAssetConfig()

> **addAssetConfig**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:758](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L758)

Add an asset config transaction to the transaction group.

#### Parameters

##### params

[`AssetConfigParams`](../type-aliases/AssetConfigParams.md)

The asset config transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAssetConfig({ sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
```

```typescript
composer.addAssetConfig({
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

***

### addAssetCreate()

> **addAssetCreate**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:723](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L723)

Add an asset create transaction to the transaction group.

#### Parameters

##### params

[`AssetCreateParams`](../type-aliases/AssetCreateParams.md)

The asset create transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAssetCreate({ sender: "CREATORADDRESS", total: 100n})
```

```typescript
composer.addAssetCreate({
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

***

### addAssetDestroy()

> **addAssetDestroy**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:824](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L824)

Add an asset destroy transaction to the transaction group.

#### Parameters

##### params

[`AssetDestroyParams`](../type-aliases/AssetDestroyParams.md)

The asset destroy transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAssetDestroy({ sender: "MANAGERADDRESS", assetId: 123456n })
```

```typescript
composer.addAssetDestroy({
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

### addAssetFreeze()

> **addAssetFreeze**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:792](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L792)

Add an asset freeze transaction to the transaction group.

#### Parameters

##### params

[`AssetFreezeParams`](../type-aliases/AssetFreezeParams.md)

The asset freeze transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAssetFreeze({ sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
```

```typescript
composer.addAssetFreeze({
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

### addAssetOptIn()

> **addAssetOptIn**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:893](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L893)

Add an asset opt-in transaction to the transaction group.

#### Parameters

##### params

[`AssetOptInParams`](../type-aliases/AssetOptInParams.md)

The asset opt-in transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAssetOptIn({ sender: "SENDERADDRESS", assetId: 123456n })
```

```typescript
composer.addAssetOptIn({
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

### addAssetOptOut()

> **addAssetOptOut**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:931](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L931)

Add an asset opt-out transaction to the transaction group.

#### Parameters

##### params

[`AssetOptOutParams`](../type-aliases/AssetOptOutParams.md)

The asset opt-out transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAssetOptOut({ sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

```typescript
composer.addAssetOptOut({ sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
```

```typescript
composer.addAssetOptOut({
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

### addAssetTransfer()

> **addAssetTransfer**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:861](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L861)

Add an asset transfer transaction to the transaction group.

#### Parameters

##### params

[`AssetTransferParams`](../type-aliases/AssetTransferParams.md)

The asset transfer transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addAssetTransfer({ sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
```

```typescript
composer.addAssetTransfer({
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

### addAtc()

> **addAtc**(`atc`): `TransactionComposer`

Defined in: [src/types/composer.ts:1416](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1416)

Add the transactions within an `AtomicTransactionComposer` to the transaction group.

#### Parameters

##### atc

`AtomicTransactionComposer`

The `AtomicTransactionComposer` to build transactions from and add to the group

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Example

```typescript
const atc = new AtomicTransactionComposer()
  .addPayment({ sender: 'SENDERADDRESS', receiver: 'RECEIVERADDRESS', amount: 1000n })
composer.addAtc(atc)
```

***

### addOfflineKeyRegistration()

> **addOfflineKeyRegistration**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:1399](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1399)

Add an offline key registration transaction to the transaction group.

#### Parameters

##### params

[`OfflineKeyRegistrationParams`](../type-aliases/OfflineKeyRegistrationParams.md)

The offline key registration transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addOfflineKeyRegistration({
  sender: 'SENDERADDRESS',
})
```

```typescript
composer.addOfflineKeyRegistration({
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

### addOnlineKeyRegistration()

> **addOnlineKeyRegistration**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:1364](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1364)

Add an online key registration transaction to the transaction group.

#### Parameters

##### params

[`OnlineKeyRegistrationParams`](../type-aliases/OnlineKeyRegistrationParams.md)

The online key registration transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addOnlineKeyRegistration({
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
composer.addOnlineKeyRegistration({
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

### addPayment()

> **addPayment**(`params`): `TransactionComposer`

Defined in: [src/types/composer.ts:682](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L682)

Add a payment transaction to the transaction group.

#### Parameters

##### params

[`PaymentParams`](../type-aliases/PaymentParams.md)

The payment transaction parameters

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Examples

```typescript
composer.addPayment({
  sender: 'SENDERADDRESS',
  receiver: 'RECEIVERADDRESS',
  amount: (4).algo(),
})
```

```typescript
composer.addPayment({
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

***

### addTransaction()

> **addTransaction**(`transaction`, `signer?`): `TransactionComposer`

Defined in: [src/types/composer.ts:639](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L639)

Add a pre-built transaction to the transaction group.

#### Parameters

##### transaction

`Transaction`

The pre-built transaction

##### signer?

`TransactionSigner`

Optional signer override for the transaction

#### Returns

`TransactionComposer`

The composer so you can chain method calls

#### Example

```typescript
composer.addTransaction(txn)
```

***

### build()

> **build**(): `Promise`\<\{ `atc`: `AtomicTransactionComposer`; `methodCalls`: `any`; `transactions`: `TransactionWithSigner`[]; \}\>

Defined in: [src/types/composer.ts:1946](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1946)

Compose all of the transactions in a single atomic transaction group and an atomic transaction composer.

You can then use the transactions standalone, or use the composer to execute or simulate the transactions.

Once this method is called, no further transactions will be able to be added.
You can safely call this method multiple times to get the same result.

#### Returns

`Promise`\<\{ `atc`: `AtomicTransactionComposer`; `methodCalls`: `any`; `transactions`: `TransactionWithSigner`[]; \}\>

The built atomic transaction composer, the transactions and any corresponding method calls

#### Example

```typescript
const { atc, transactions, methodCalls } = await composer.build()
```

***

### buildTransactions()

> **buildTransactions**(): `Promise`\<[`BuiltTransactions`](../interfaces/BuiltTransactions.md)\>

Defined in: [src/types/composer.ts:1888](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1888)

Compose all of the transactions without signers and return the transaction objects directly along with any ABI method calls.

#### Returns

`Promise`\<[`BuiltTransactions`](../interfaces/BuiltTransactions.md)\>

The array of built transactions and any corresponding method calls

#### Example

```typescript
const { transactions, methodCalls, signers } = await composer.buildTransactions()
```

***

### count()

> **count**(): `Promise`\<`number`\>

Defined in: [src/types/composer.ts:1929](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1929)

Get the number of transactions currently added to this composer.

#### Returns

`Promise`\<`number`\>

The number of transactions currently added to this composer

***

### ~~execute()~~

> **execute**(`params?`): `Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md)\>

Defined in: [src/types/composer.ts:2044](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2044)

#### Parameters

##### params?

[`SendParams`](../../transaction/interfaces/SendParams.md)

The parameters to control execution with

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md)\>

The execution result

#### Deprecated

Use `send` instead.

Compose the atomic transaction group and send it to the network

An alias for `composer.send(params)`.

***

### rebuild()

> **rebuild**(): `Promise`\<\{ `atc`: `AtomicTransactionComposer`; `methodCalls`: `any`; `transactions`: `TransactionWithSigner`[]; \}\>

Defined in: [src/types/composer.ts:1985](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1985)

Rebuild the group, discarding any previously built transactions.
This will potentially cause new signers and suggested params to be used if the callbacks return a new value compared to the first build.

#### Returns

`Promise`\<\{ `atc`: `AtomicTransactionComposer`; `methodCalls`: `any`; `transactions`: `TransactionWithSigner`[]; \}\>

The newly built atomic transaction composer and the transactions

#### Example

```typescript
const { atc, transactions, methodCalls } = await composer.rebuild()
```

***

### registerErrorTransformer()

> **registerErrorTransformer**(`transformer`): `TransactionComposer`

Defined in: [src/types/composer.ts:624](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L624)

Register a function that will be used to transform an error caught when simulating or executing

#### Parameters

##### transformer

[`ErrorTransformer`](../type-aliases/ErrorTransformer.md)

#### Returns

`TransactionComposer`

The composer so you can chain method calls

***

### send()

> **send**(`params?`): `Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md)\>

Defined in: [src/types/composer.ts:1999](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1999)

Compose the atomic transaction group and send it to the network.

#### Parameters

##### params?

[`SendParams`](../../transaction/interfaces/SendParams.md)

The parameters to control execution with

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md)\>

The execution result

#### Example

```typescript
const result = await composer.send()
```

***

### simulate()

#### Call Signature

> **simulate**(): `Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md) & `object`\>

Defined in: [src/types/composer.ts:2056](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2056)

Compose the atomic transaction group and simulate sending it to the network

##### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md) & `object`\>

The simulation result

##### Example

```typescript
const result = await composer.simulate()
```

#### Call Signature

> **simulate**(`options`): `Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md) & `object`\>

Defined in: [src/types/composer.ts:2067](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2067)

Compose the atomic transaction group and simulate sending it to the network

##### Parameters

###### options

###### allowMoreLogging?

`boolean`

###### allowUnnamedResources?

`boolean`

###### execTraceConfig?

`SimulateTraceConfig`

###### extraOpcodeBudget?

`number` \| `bigint`

###### round?

`number` \| `bigint`

###### skipSignatures

`boolean`

Whether or not to skip signatures for all built transactions and use an empty signer instead.
This will set `fixSigners` and `allowEmptySignatures` when sending the request to the algod API.

##### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md) & `object`\>

The simulation result

##### Example

```typescript
const result = await composer.simulate({
  skipSignatures: true,
})
```

#### Call Signature

> **simulate**(`options`): `Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md) & `object`\>

Defined in: [src/types/composer.ts:2080](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2080)

Compose the atomic transaction group and simulate sending it to the network

##### Parameters

###### options

###### allowEmptySignatures?

`boolean`

###### allowMoreLogging?

`boolean`

###### allowUnnamedResources?

`boolean`

###### execTraceConfig?

`SimulateTraceConfig`

###### extraOpcodeBudget?

`number` \| `bigint`

###### fixSigners?

`boolean`

###### round?

`number` \| `bigint`

##### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../../transaction/interfaces/SendAtomicTransactionComposerResults.md) & `object`\>

The simulation result

##### Example

```typescript
const result = await composer.simulate({
  extraOpcodeBudget: 1000,
})
```

***

### arc2Note()

> `static` **arc2Note**(`note`): `Uint8Array`

Defined in: [src/types/composer.ts:2156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L2156)

Create an encoded transaction note that follows the ARC-2 spec.

https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md

#### Parameters

##### note

[`Arc2TransactionNote`](../../transaction/type-aliases/Arc2TransactionNote.md)

The ARC-2 transaction note data

#### Returns

`Uint8Array`

The binary encoded transaction note
