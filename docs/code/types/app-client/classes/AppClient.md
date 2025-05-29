[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClient

# Class: AppClient

Defined in: [src/types/app-client.ts:475](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L475)

ARC-56/ARC-32 application client that allows you to manage calls and
state for a specific deployed instance of an app (with a known app ID).

## Constructors

### Constructor

> **new AppClient**(`params`): `AppClient`

Defined in: [src/types/app-client.ts:514](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L514)

Create a new app client.

#### Parameters

##### params

[`AppClientParams`](../interfaces/AppClientParams.md)

The parameters to create the app client

#### Returns

`AppClient`

The `AppClient` instance

#### Example

```typescript
const appClient = new AppClient({
  appId: 12345678n,
  appSpec: appSpec,
  algorand: AlgorandClient.mainNet(),
})

## Accessors

### algorand

#### Get Signature

> **get** **algorand**(): [`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

Defined in: [src/types/app-client.ts:677](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L677)

A reference to the underlying `AlgorandClient` this app client is using.

##### Returns

[`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

***

### appAddress

#### Get Signature

> **get** **appAddress**(): `Address`

Defined in: [src/types/app-client.ts:662](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L662)

The app address of the app instance this client is linked to.

##### Returns

`Address`

***

### appId

#### Get Signature

> **get** **appId**(): `bigint`

Defined in: [src/types/app-client.ts:657](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L657)

The ID of the app instance this client is linked to.

##### Returns

`bigint`

***

### appName

#### Get Signature

> **get** **appName**(): `string`

Defined in: [src/types/app-client.ts:667](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L667)

The name of the app (from the ARC-32 / ARC-56 app spec or override).

##### Returns

`string`

***

### appSpec

#### Get Signature

> **get** **appSpec**(): [`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md)

Defined in: [src/types/app-client.ts:672](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L672)

The ARC-56 app spec being used

##### Returns

[`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md)

***

### createTransaction

#### Get Signature

> **get** **createTransaction**(): `object` & `object`

Defined in: [src/types/app-client.ts:701](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L701)

Create transactions for the current app

##### Returns

***

### params

#### Get Signature

> **get** **params**(): `object` & `object`

Defined in: [src/types/app-client.ts:696](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L696)

Get parameters to create transactions for the current app.

A good mental model for this is that these parameters represent a deferred transaction creation.

##### Examples

```typescript
const myMethodCall = appClient.params.call({method: 'my_method', args: [123, 'hello']})
// ...
await algorand.send.AppMethodCall(myMethodCall)
```

```typescript
const myMethodCall = appClient.params.call({method: 'my_method', args: [123, 'hello']})
await appClient.send.call({method: 'my_method2', args: [myMethodCall]})
```

##### Returns

***

### send

#### Get Signature

> **get** **send**(): `object` & `object`

Defined in: [src/types/app-client.ts:706](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L706)

Send transactions to the current app

##### Returns

***

### state

#### Get Signature

> **get** **state**(): `object`

Defined in: [src/types/app-client.ts:711](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L711)

Get state (local, global, box) from the current app

##### Returns

###### box

> **box**: `object`

Methods to access box storage for the current app

###### box.getAll()

> **getAll**: () => `Promise`\<`Record`\<`string`, `any`\>\>

Returns all single-key state values in a record keyed by the key name and the value a decoded ABI value.

###### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

###### box.getMap()

> **getMap**: (`mapName`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md), `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>\>

###### Parameters

###### mapName

`string`

The name of the map to read from

###### Returns

`Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md), `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>\>

###### box.getMapValue()

> **getMapValue**: (`mapName`, `key`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

###### Parameters

###### mapName

`string`

The name of the map to read from

###### key

`any`

The key within the map (without any map prefix) as either a Buffer with the bytes or a value
 that will be converted to bytes by encoding it using the specified ABI key type
 in the ARC-56 spec

###### Returns

`Promise`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

###### box.getValue()

> **getValue**: (`name`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

Returns a single state value for the current app with the value a decoded ABI value.

###### Parameters

###### name

`string`

The name of the state value to retrieve the value for

###### Returns

`Promise`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

###### global

> **global**: `object`

Methods to access global state for the current app

###### global.getAll()

> **getAll**: () => `Promise`\<`Record`\<`string`, `any`\>\>

Returns all single-key state values in a record keyed by the key name and the value a decoded ABI value.

###### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

###### global.getMap()

> **getMap**: (`mapName`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md), `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>\>

Returns all map values for the given map.

###### Parameters

###### mapName

`string`

The name of the map to read from

###### Returns

`Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md), `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>\>

A map of all key-value pairs in the map as a `Record<string, ABIValue>`

###### global.getMapValue()

> **getMapValue**: (`mapName`, `key`, `appState?`) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

Returns a single value from the given map for the current app with the value a decoded ABI value.

###### Parameters

###### mapName

`string`

The name of the map to read from

###### key

`any`

The key within the map (without any map prefix) as either a Buffer with the bytes or a value
 that will be converted to bytes by encoding it using the specified ABI key type
 in the ARC-56 spec

###### appState?

[`AppState`](../../app/interfaces/AppState.md)

Optional cached value of the current state

###### Returns

`Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

###### global.getValue()

> **getValue**: (`name`, `appState?`) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

Returns a single state value for the current app with the value a decoded ABI value.

###### Parameters

###### name

`string`

The name of the state value to retrieve the value for

###### appState?

[`AppState`](../../app/interfaces/AppState.md)

Optional cached value of the current state

###### Returns

`Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

###### local()

> **local**: (`address`) => `object`

Methods to access local state for the current app

###### Parameters

###### address

The address of the account to get the local state for

`string` | `Address`

###### Returns

###### getAll()

> **getAll**: () => `Promise`\<`Record`\<`string`, `any`\>\>

Returns all single-key state values in a record keyed by the key name and the value a decoded ABI value.

###### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

###### getMap()

> **getMap**: (`mapName`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md), `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>\>

Returns all map values for the given map.

###### Parameters

###### mapName

`string`

The name of the map to read from

###### Returns

`Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md), `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>\>

A map of all key-value pairs in the map as a `Record<string, ABIValue>`

###### getMapValue()

> **getMapValue**: (`mapName`, `key`, `appState?`) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

Returns a single value from the given map for the current app with the value a decoded ABI value.

###### Parameters

###### mapName

`string`

The name of the map to read from

###### key

`any`

The key within the map (without any map prefix) as either a Buffer with the bytes or a value
 that will be converted to bytes by encoding it using the specified ABI key type
 in the ARC-56 spec

###### appState?

[`AppState`](../../app/interfaces/AppState.md)

Optional cached value of the current state

###### Returns

`Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

###### getValue()

> **getValue**: (`name`, `appState?`) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

Returns a single state value for the current app with the value a decoded ABI value.

###### Parameters

###### name

`string`

The name of the state value to retrieve the value for

###### appState?

[`AppState`](../../app/interfaces/AppState.md)

Optional cached value of the current state

###### Returns

`Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)\>

## Methods

### clone()

> **clone**(`params`): `AppClient`

Defined in: [src/types/app-client.ts:569](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L569)

Clone this app client with different params

#### Parameters

##### params

The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.

###### appId?

`bigint`

The ID of the app instance this client should make calls against.

###### appName?

`string`

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

###### approvalSourceMap?

`ProgramSourceMap`

Optional source map for the approval program

###### clearSourceMap?

`ProgramSourceMap`

Optional source map for the clear state program

###### defaultSender?

`string` \| `Address`

Optional address to use for the account to use as the default sender for calls.

###### defaultSigner?

`TransactionSigner`

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).

#### Returns

`AppClient`

A new app client with the altered params

#### Example

```typescript
const appClient2 = appClient.clone({ defaultSender: 'NEW_SENDER_ADDRESS' })
```

***

### compile()

> **compile**(`compilation?`): `Promise`\<[`AppClientCompilationResult`](../interfaces/AppClientCompilationResult.md)\>

Defined in: [src/types/app-client.ts:935](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L935)

Compiles the approval and clear state programs (if TEAL templates provided),
performing any provided deploy-time parameter replacement and stores
the source maps.

If no TEAL templates provided it will use any byte code provided in the app spec.

Will store any generated source maps for later use in debugging.

#### Parameters

##### compilation?

[`AppClientCompilationParams`](../interfaces/AppClientCompilationParams.md)

Any compilation parameters to use

#### Returns

`Promise`\<[`AppClientCompilationResult`](../interfaces/AppClientCompilationResult.md)\>

The compiled code and any compilation results (including source maps)

***

### exportSourceMaps()

> **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/AppSourceMaps.md)

Defined in: [src/types/app-client.ts:877](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L877)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/AppSourceMaps.md)

The source maps

***

### exposeLogicError()

> **exposeLogicError**(`e`, `isClearStateProgram?`): `Promise`\<`Error`\>

Defined in: [src/types/app-client.ts:855](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L855)

Takes an error that may include a logic error from a call to the current app and re-exposes the
error to include source code information via the source map and ARC-56 spec.

#### Parameters

##### e

`Error`

The error to parse

##### isClearStateProgram?

`boolean`

Whether or not the code was running the clear state program (defaults to approval program)

#### Returns

`Promise`\<`Error`\>

The new error, or if there was no logic error or source map then the wrapped error with source details

***

### fundAppAccount()

> **fundAppAccount**(`params`): `Promise`\<\{ `confirmation`: `PendingTransactionResponse`; `confirmations`: `PendingTransactionResponse`[]; `groupId`: `string`; `returns?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md)[]; `transaction`: `Transaction`; `transactions`: `Transaction`[]; `txIds`: `string`[]; \}\>

Defined in: [src/types/app-client.ts:740](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L740)

Funds Algo into the app account for this app.

An alias for `appClient.send.fundAppAccount(params)`.

#### Parameters

##### params

The parameters for the funding transaction

###### amount

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Amount to send

###### closeRemainderTo?

`string` \| `Address`

If given, close the sender account and send the remaining balance to this address

*Warning:* Be careful with this parameter as it can lead to loss of funds if not used correctly.

###### coverAppCallInnerTransactionFees?

`boolean`

Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee

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

###### maxRoundsToWaitForConfirmation?

`number`

The number of rounds to wait for confirmation. By default until the latest lastValid has past.

###### note?

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

Note to attach to the transaction. Max of 1000 bytes.

###### populateAppCallResources?

`boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`.

###### rekeyTo?

`string` \| `Address`

Change the signing key of the sender to the given address.

**Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).

###### sender?

`string` \| `Address`

The optional sender to send the transaction from, will use the application client's default sender by default if specified

###### signer?

`TransactionSigner` \| [`TransactionSignerAccount`](../../account/interfaces/TransactionSignerAccount.md)

The function used to sign transaction(s); if not specified then
 an attempt will be made to find a registered signer for the
 given `sender` or use a default signer (if configured).

###### staticFee?

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction.

###### suppressLog?

`boolean`

Whether to suppress log messages from transaction send, default: do not suppress.

###### validityWindow?

`number` \| `bigint`

How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used.

#### Returns

`Promise`\<\{ `confirmation`: `PendingTransactionResponse`; `confirmations`: `PendingTransactionResponse`[]; `groupId`: `string`; `returns?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md)[]; `transaction`: `Transaction`; `transactions`: `Transaction`[]; `txIds`: `string`[]; \}\>

The result of the funding

#### Example

```typescript
await appClient.fundAppAccount({ amount: algo(1) })
```

***

### getABIMethod()

> **getABIMethod**(`methodNameOrSignature`): [`Arc56Method`](../../app-arc56/classes/Arc56Method.md)

Defined in: [src/types/app-client.ts:902](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L902)

Returns the ABI Method spec for the given method string for the app represented by this application client instance

#### Parameters

##### methodNameOrSignature

`string`

The method name or method signature to call if an ABI call is being emitted.
e.g. `my_method` or `my_method(unit64,string)bytes`

#### Returns

[`Arc56Method`](../../app-arc56/classes/Arc56Method.md)

A tuple with: [ARC-56 `Method`, algosdk `ABIMethod`]

***

### getBoxNames()

> **getBoxNames**(): `Promise`\<[`BoxName`](../../app/interfaces/BoxName.md)[]\>

Defined in: [src/types/app-client.ts:777](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L777)

Returns the names of all current boxes for the current app.

#### Returns

`Promise`\<[`BoxName`](../../app/interfaces/BoxName.md)[]\>

The names of the boxes

#### Example

```typescript
const boxNames = await appClient.getBoxNames()
```

***

### getBoxValue()

> **getBoxValue**(`name`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [src/types/app-client.ts:790](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L790)

Returns the value of the given box for the current app.

#### Parameters

##### name

[`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md)

The identifier of the box to return

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The current box value as a byte array

#### Example

```typescript
const boxValue = await appClient.getBoxValue('boxName')
```

***

### getBoxValueFromABIType()

> **getBoxValueFromABIType**(`name`, `type`): `Promise`\<`ABIValue`\>

Defined in: [src/types/app-client.ts:804](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L804)

Returns the value of the given box for the current app.

#### Parameters

##### name

[`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md)

The identifier of the box to return

##### type

`ABIType`

#### Returns

`Promise`\<`ABIValue`\>

The current box value as a byte array

#### Example

```typescript
const boxValue = await appClient.getBoxValueFromABIType('boxName', new ABIUintType(32))
```

***

### getBoxValues()

> **getBoxValues**(`filter?`): `Promise`\<`object`[]\>

Defined in: [src/types/app-client.ts:818](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L818)

Returns the values of all current boxes for the current app.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

##### filter?

(`name`) => `boolean`

Optional filter to filter which boxes' values are returned

#### Returns

`Promise`\<`object`[]\>

The (name, value) pair of the boxes with values as raw byte arrays

#### Example

```typescript
const boxValues = await appClient.getBoxValues()
```

***

### getBoxValuesFromABIType()

> **getBoxValuesFromABIType**(`type`, `filter?`): `Promise`\<`object`[]\>

Defined in: [src/types/app-client.ts:838](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L838)

Returns the values of all current boxes for the current app decoded using an ABI Type.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

##### type

`ABIType`

The ABI type to decode the values with

##### filter?

(`name`) => `boolean`

Optional filter to filter which boxes' values are returned

#### Returns

`Promise`\<`object`[]\>

The (name, value) pair of the boxes with values as the ABI Value

#### Example

```typescript
const boxValues = await appClient.getBoxValuesFromABIType(new ABIUintType(32))
```

***

### getGlobalState()

> **getGlobalState**(): `Promise`\<[`AppState`](../../app/interfaces/AppState.md)\>

Defined in: [src/types/app-client.ts:752](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L752)

Returns raw global state for the current app.

#### Returns

`Promise`\<[`AppState`](../../app/interfaces/AppState.md)\>

The global state

#### Example

```typescript
const globalState = await appClient.getGlobalState()
```

***

### getLocalState()

> **getLocalState**(`address`): `Promise`\<[`AppState`](../../app/interfaces/AppState.md)\>

Defined in: [src/types/app-client.ts:765](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L765)

Returns raw local state for the given account address.

#### Parameters

##### address

The address of the account to get the local state for

`string` | `Address`

#### Returns

`Promise`\<[`AppState`](../../app/interfaces/AppState.md)\>

The local state

#### Example

```typescript
const localState = await appClient.getLocalState('ACCOUNT_ADDRESS')
```

***

### importSourceMaps()

> **importSourceMaps**(`sourceMaps`): `void`

Defined in: [src/types/app-client.ts:891](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L891)

Import source maps for the app.

#### Parameters

##### sourceMaps

[`AppSourceMaps`](../interfaces/AppSourceMaps.md)

The source maps to import

#### Returns

`void`

***

### processMethodCallReturn()

> **processMethodCallReturn**\<`TReturn`, `TResult`\>(`result`, `method`): `Promise`\<`Omit`\<`TResult`, `"return"`\> & [`AppReturn`](../../app/type-aliases/AppReturn.md)\<`TReturn`\>\>

Defined in: [src/types/app-client.ts:916](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L916)

Checks for decode errors on the SendAppTransactionResult and maps the return value to the specified type
on the ARC-56 method, replacing the `return` property with the decoded type.

If the return type is an ARC-56 struct then the struct will be returned.

#### Type Parameters

##### TReturn

`TReturn` *extends* `undefined` \| `Uint8Array`\<`ArrayBufferLike`\> \| `ABIValue` \| [`ABIStruct`](../../app-arc56/type-aliases/ABIStruct.md)

##### TResult

`TResult` *extends* `object` = \{ `confirmation`: `PendingTransactionResponse`; `confirmations`: `PendingTransactionResponse`[]; `groupId`: `string`; `return?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `returns?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md)[]; `transaction`: `Transaction`; `transactions`: `Transaction`[]; `txIds`: `string`[]; \}

#### Parameters

##### result

The SendAppTransactionResult to be mapped

`TResult` | `Promise`\<`TResult`\>

##### method

[`Arc56Method`](../../app-arc56/classes/Arc56Method.md)

The method that was called

#### Returns

`Promise`\<`Omit`\<`TResult`, `"return"`\> & [`AppReturn`](../../app/type-aliases/AppReturn.md)\<`TReturn`\>\>

The smart contract response with an updated return value

***

### compile()

> `static` **compile**(`appSpec`, `appManager`, `compilation?`): `Promise`\<[`AppClientCompilationResult`](../interfaces/AppClientCompilationResult.md)\>

Defined in: [src/types/app-client.ts:1043](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1043)

Compiles the approval and clear state programs (if TEAL templates provided),
performing any provided deploy-time parameter replacement and returns
the compiled code and any compilation results (including source maps).

If no TEAL templates provided it will use any byte code provided in the app spec.

Will store any generated source maps for later use in debugging.

#### Parameters

##### appSpec

[`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md)

The app spec for the app

##### appManager

[`AppManager`](../../app-manager/classes/AppManager.md)

The app manager to use for compilation

##### compilation?

[`AppClientCompilationParams`](../interfaces/AppClientCompilationParams.md)

Any compilation parameters to use

#### Returns

`Promise`\<[`AppClientCompilationResult`](../interfaces/AppClientCompilationResult.md)\>

The compiled code and any compilation results (including source maps)

***

### exposeLogicError()

> `static` **exposeLogicError**(`e`, `appSpec`, `details`): `Error`

Defined in: [src/types/app-client.ts:959](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L959)

Takes an error that may include a logic error from a call to the current app and re-exposes the
error to include source code information via the source map and ARC-56 spec.

#### Parameters

##### e

`Error`

The error to parse

##### appSpec

[`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md)

The app spec for the app

##### details

Additional information to inform the error

###### approvalSourceInfo?

[`ProgramSourceInfo`](../../app-arc56/interfaces/ProgramSourceInfo.md)

ARC56 approval source info

###### approvalSourceMap?

`ProgramSourceMap`

Approval program source map

###### clearSourceInfo?

[`ProgramSourceInfo`](../../app-arc56/interfaces/ProgramSourceInfo.md)

ARC56 clear source info

###### clearSourceMap?

`ProgramSourceMap`

Clear state program source map

###### isClearStateProgram?

`boolean`

Whether or not the code was running the clear state program (defaults to approval program)

###### program?

`Uint8Array`\<`ArrayBufferLike`\>

program bytes

#### Returns

`Error`

The new error, or if there was no logic error or source map then the wrapped error with source details

***

### fromCreatorAndName()

> `static` **fromCreatorAndName**(`params`): `Promise`\<`AppClient`\>

Defined in: [src/types/app-client.ts:597](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L597)

Returns a new `AppClient` client, resolving the app by creator address and name
using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).

#### Parameters

##### params

The parameters to create the app client

###### algorand

[`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

An `AlgorandClient` instance

###### appLookupCache?

[`AppLookup`](../../app-deployer/interfaces/AppLookup.md)

An optional cached app lookup that matches a name to on-chain details;
either this is needed or indexer is required to be passed in to this `ClientManager` on construction.

###### appName?

`string`

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

###### approvalSourceMap?

`ProgramSourceMap`

Optional source map for the approval program

###### appSpec

`string` \| [`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md) \| [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

###### clearSourceMap?

`ProgramSourceMap`

Optional source map for the clear state program

###### creatorAddress

`string` \| `Address`

The address of the creator account for the app

###### defaultSender?

`string` \| `Address`

Optional address to use for the account to use as the default sender for calls.

###### defaultSigner?

`TransactionSigner`

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).

###### ignoreCache?

`boolean`

Whether or not to ignore the `AppDeployer` lookup cache and force an on-chain lookup, default: use any cached value

#### Returns

`Promise`\<`AppClient`\>

The `AppClient` instance

#### Example

```typescript
const appClient = await AppClient.fromCreatorAndName({
  creatorAddress: 'CREATOR_ADDRESS',
  name: 'APP_NAME',
  appSpec: appSpec,
  algorand: AlgorandClient.mainNet(),
})

***

### fromNetwork()

> `static` **fromNetwork**(`params`): `Promise`\<`AppClient`\>

Defined in: [src/types/app-client.ts:622](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L622)

Returns an `AppClient` instance for the current network based on
pre-determined network-specific app IDs specified in the ARC-56 app spec.

If no IDs are in the app spec or the network isn't recognised, an error is thrown.

#### Parameters

##### params

The parameters to create the app client

###### algorand

[`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

An `AlgorandClient` instance

###### appName?

`string`

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

###### approvalSourceMap?

`ProgramSourceMap`

Optional source map for the approval program

###### appSpec

`string` \| [`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md) \| [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

###### clearSourceMap?

`ProgramSourceMap`

Optional source map for the clear state program

###### defaultSender?

`string` \| `Address`

Optional address to use for the account to use as the default sender for calls.

###### defaultSigner?

`TransactionSigner`

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).

#### Returns

`Promise`\<`AppClient`\>

The `AppClient` instance

#### Example

```typescript
const appClient = await AppClient.fromNetwork({
  appSpec: appSpec,
  algorand: AlgorandClient.mainNet(),
})

***

### normaliseAppSpec()

> `static` **normaliseAppSpec**(`spec`): [`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md)

Defined in: [src/types/app-client.ts:650](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L650)

Takes a string or parsed JSON object that could be ARC-32 or ARC-56 format and
normalises it into a parsed ARC-56 contract object.

#### Parameters

##### spec

The spec to normalise

`string` | [`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md) | [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

#### Returns

[`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md)

The normalised ARC-56 contract object

#### Example

```typescript
const arc56AppSpec = AppClient.normaliseAppSpec(appSpec)
```
