[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClient

# Class: AppClient

Defined in: [src/types/app-client.ts:431](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L431)

ARC-56/ARC-32 application client that allows you to manage calls and
state for a specific deployed instance of an app (with a known app ID).

## Constructors

### Constructor

> **new AppClient**(`params`): `AppClient`

Defined in: [src/types/app-client.ts:470](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L470)

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

Defined in: [src/types/app-client.ts:637](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L637)

A reference to the underlying `AlgorandClient` this app client is using.

##### Returns

[`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

***

### appAddress

#### Get Signature

> **get** **appAddress**(): [`Address`](../../../index/classes/Address.md)

Defined in: [src/types/app-client.ts:622](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L622)

The app address of the app instance this client is linked to.

##### Returns

[`Address`](../../../index/classes/Address.md)

***

### appId

#### Get Signature

> **get** **appId**(): `bigint`

Defined in: [src/types/app-client.ts:617](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L617)

The ID of the app instance this client is linked to.

##### Returns

`bigint`

***

### appName

#### Get Signature

> **get** **appName**(): `string`

Defined in: [src/types/app-client.ts:627](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L627)

The name of the app (from the ARC-32 / ARC-56 app spec or override).

##### Returns

`string`

***

### appSpec

#### Get Signature

> **get** **appSpec**(): [`Arc56Contract`](../../../abi/type-aliases/Arc56Contract.md)

Defined in: [src/types/app-client.ts:632](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L632)

The ARC-56 app spec being used

##### Returns

[`Arc56Contract`](../../../abi/type-aliases/Arc56Contract.md)

***

### createTransaction

#### Get Signature

> **get** **createTransaction**(): `object` & `object`

Defined in: [src/types/app-client.ts:661](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L661)

Create transactions for the current app

##### Returns

***

### params

#### Get Signature

> **get** **params**(): `object` & `object`

Defined in: [src/types/app-client.ts:656](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L656)

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

Defined in: [src/types/app-client.ts:666](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L666)

Send transactions to the current app

##### Returns

***

### state

#### Get Signature

> **get** **state**(): `object`

Defined in: [src/types/app-client.ts:671](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L671)

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

> **getMap**: (`mapName`) => `Promise`\<`Map`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md), [`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>\>

###### Parameters

###### mapName

`string`

The name of the map to read from

###### Returns

`Promise`\<`Map`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md), [`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>\>

###### box.getMapValue()

> **getMapValue**: (`mapName`, `key`) => `Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>

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

`Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>

###### box.getValue()

> **getValue**: (`name`) => `Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>

Returns a single state value for the current app with the value a decoded ABI value.

###### Parameters

###### name

`string`

The name of the state value to retrieve the value for

###### Returns

`Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>

###### global

> **global**: `object`

Methods to access global state for the current app

###### global.getAll()

> **getAll**: () => `Promise`\<`Record`\<`string`, `any`\>\>

Returns all single-key state values in a record keyed by the key name and the value a decoded ABI value.

###### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

###### global.getMap()

> **getMap**: (`mapName`) => `Promise`\<`Map`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md), [`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>\>

Returns all map values for the given map.

###### Parameters

###### mapName

`string`

The name of the map to read from

###### Returns

`Promise`\<`Map`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md), [`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>\>

A map of all key-value pairs in the map as a `Record<string, ABIValue>`

###### global.getMapValue()

> **getMapValue**: (`mapName`, `key`, `appState?`) => `Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md) \| `undefined`\>

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

`Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md) \| `undefined`\>

###### global.getValue()

> **getValue**: (`name`, `appState?`) => `Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md) \| `undefined`\>

Returns a single state value for the current app with the value a decoded ABI value.

###### Parameters

###### name

`string`

The name of the state value to retrieve the value for

###### appState?

[`AppState`](../../app/interfaces/AppState.md)

Optional cached value of the current state

###### Returns

`Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md) \| `undefined`\>

###### local()

> **local**: (`address`) => `object`

Methods to access local state for the current app

###### Parameters

###### address

[`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

The address of the account to get the local state for

###### Returns

###### getAll()

> **getAll**: () => `Promise`\<`Record`\<`string`, `any`\>\>

Returns all single-key state values in a record keyed by the key name and the value a decoded ABI value.

###### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

###### getMap()

> **getMap**: (`mapName`) => `Promise`\<`Map`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md), [`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>\>

Returns all map values for the given map.

###### Parameters

###### mapName

`string`

The name of the map to read from

###### Returns

`Promise`\<`Map`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md), [`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>\>

A map of all key-value pairs in the map as a `Record<string, ABIValue>`

###### getMapValue()

> **getMapValue**: (`mapName`, `key`, `appState?`) => `Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md) \| `undefined`\>

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

`Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md) \| `undefined`\>

###### getValue()

> **getValue**: (`name`, `appState?`) => `Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md) \| `undefined`\>

Returns a single state value for the current app with the value a decoded ABI value.

###### Parameters

###### name

`string`

The name of the state value to retrieve the value for

###### appState?

[`AppState`](../../app/interfaces/AppState.md)

Optional cached value of the current state

###### Returns

`Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md) \| `undefined`\>

## Methods

### clone()

> **clone**(`params`): `AppClient`

Defined in: [src/types/app-client.ts:525](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L525)

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

[`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

Optional address to use for the account to use as the default sender for calls.

###### defaultSigner?

[`TransactionSigner`](../../../transact/type-aliases/TransactionSigner.md)

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

Defined in: [src/types/app-client.ts:902](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L902)

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

Defined in: [src/types/app-client.ts:841](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L841)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/AppSourceMaps.md)

The source maps

***

### exposeLogicError()

> **exposeLogicError**(`e`, `isClearStateProgram?`): `Promise`\<`Error`\>

Defined in: [src/types/app-client.ts:819](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L819)

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

> **fundAppAccount**(`params`): `Promise`\<\{ `confirmation`: [`PendingTransactionResponse`](../../../algod-client/type-aliases/PendingTransactionResponse.md); `confirmations`: [`PendingTransactionResponse`](../../../algod-client/type-aliases/PendingTransactionResponse.md)[]; `groupId`: `string` \| `undefined`; `returns?`: [`ABIReturn`](../../../abi/type-aliases/ABIReturn.md)[]; `transaction`: [`Transaction`](../../../transact/classes/Transaction.md); `transactions`: [`Transaction`](../../../transact/classes/Transaction.md)[]; `txIds`: `string`[]; \}\>

Defined in: [src/types/app-client.ts:700](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L700)

Funds Algo into the app account for this app.

An alias for `appClient.send.fundAppAccount(params)`.

#### Parameters

##### params

The parameters for the funding transaction

###### amount

[`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Amount to send

###### closeRemainderTo?

[`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

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

`string` \| `Uint8Array`

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

`string` \| `Uint8Array`

Note to attach to the transaction. Max of 1000 bytes.

###### populateAppCallResources?

`boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`.

###### rekeyTo?

[`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

Change the signing key of the sender to the given address.

**Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).

###### sender?

[`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

The optional sender to send the transaction from, will use the application client's default sender by default if specified

###### signer?

[`AddressWithTransactionSigner`](../../../transact/interfaces/AddressWithTransactionSigner.md) \| [`TransactionSigner`](../../../transact/type-aliases/TransactionSigner.md)

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

`Promise`\<\{ `confirmation`: [`PendingTransactionResponse`](../../../algod-client/type-aliases/PendingTransactionResponse.md); `confirmations`: [`PendingTransactionResponse`](../../../algod-client/type-aliases/PendingTransactionResponse.md)[]; `groupId`: `string` \| `undefined`; `returns?`: [`ABIReturn`](../../../abi/type-aliases/ABIReturn.md)[]; `transaction`: [`Transaction`](../../../transact/classes/Transaction.md); `transactions`: [`Transaction`](../../../transact/classes/Transaction.md)[]; `txIds`: `string`[]; \}\>

The result of the funding

#### Example

```typescript
await appClient.fundAppAccount({ amount: algo(1) })
```

***

### getABIMethod()

> **getABIMethod**(`methodNameOrSignature`): [`ABIMethod`](../../../abi/classes/ABIMethod.md)

Defined in: [src/types/app-client.ts:869](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L869)

Returns the ABI Method spec for the given method string for the app represented by this application client instance

#### Parameters

##### methodNameOrSignature

`string`

The method name or method signature to call if an ABI call is being emitted.
e.g. `my_method` or `my_method(unit64,string)bytes`

#### Returns

[`ABIMethod`](../../../abi/classes/ABIMethod.md)

A tuple with: [ARC-56 `Method`, algosdk `ABIMethod`]

***

### getBoxNames()

> **getBoxNames**(): `Promise`\<[`BoxName`](../../app/interfaces/BoxName.md)[]\>

Defined in: [src/types/app-client.ts:737](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L737)

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

> **getBoxValue**(`name`): `Promise`\<`Uint8Array`\>

Defined in: [src/types/app-client.ts:750](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L750)

Returns the value of the given box for the current app.

#### Parameters

##### name

[`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md)

The identifier of the box to return

#### Returns

`Promise`\<`Uint8Array`\>

The current box value as a byte array

#### Example

```typescript
const boxValue = await appClient.getBoxValue('boxName')
```

***

### getBoxValueFromABIType()

> **getBoxValueFromABIType**(`name`, `type`): `Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>

Defined in: [src/types/app-client.ts:764](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L764)

Returns the value of the given box for the current app.

#### Parameters

##### name

[`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md)

The identifier of the box to return

##### type

[`ABIType`](../../../abi/classes/ABIType.md)

#### Returns

`Promise`\<[`ABIValue`](../../../abi/type-aliases/ABIValue.md)\>

The current box value as a byte array

#### Example

```typescript
const boxValue = await appClient.getBoxValueFromABIType('boxName', new ABIUintType(32))
```

***

### getBoxValues()

> **getBoxValues**(`filter?`): `Promise`\<`object`[]\>

Defined in: [src/types/app-client.ts:782](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L782)

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

Defined in: [src/types/app-client.ts:802](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L802)

Returns the values of all current boxes for the current app decoded using an ABI Type.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

##### type

[`ABIType`](../../../abi/classes/ABIType.md)

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

Defined in: [src/types/app-client.ts:712](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L712)

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

Defined in: [src/types/app-client.ts:725](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L725)

Returns raw local state for the given account address.

#### Parameters

##### address

[`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

The address of the account to get the local state for

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

Defined in: [src/types/app-client.ts:858](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L858)

Import source maps for the app.

#### Parameters

##### sourceMaps

[`AppSourceMaps`](../interfaces/AppSourceMaps.md)

The source maps to import

#### Returns

`void`

***

### processMethodCallReturn()

> **processMethodCallReturn**\<`TReturn`, `TResult`\>(`result`): `Promise`\<`Omit`\<`TResult`, `"return"`\> & [`AppReturn`](../../app/type-aliases/AppReturn.md)\<`TReturn`\>\>

Defined in: [src/types/app-client.ts:883](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L883)

Checks for decode errors on the SendAppTransactionResult and maps the return value to the specified type
on the ARC-56 method, replacing the `return` property with the decoded type.

If the return type is an ARC-56 struct then the struct will be returned.

#### Type Parameters

##### TReturn

`TReturn` *extends* [`ABIValue`](../../../abi/type-aliases/ABIValue.md) \| `undefined`

##### TResult

`TResult` *extends* `object` = \{ `confirmation`: [`PendingTransactionResponse`](../../../algod-client/type-aliases/PendingTransactionResponse.md); `confirmations`: [`PendingTransactionResponse`](../../../algod-client/type-aliases/PendingTransactionResponse.md)[]; `groupId`: `string` \| `undefined`; `return?`: [`ABIReturn`](../../../abi/type-aliases/ABIReturn.md); `returns?`: [`ABIReturn`](../../../abi/type-aliases/ABIReturn.md)[]; `transaction`: [`Transaction`](../../../transact/classes/Transaction.md); `transactions`: [`Transaction`](../../../transact/classes/Transaction.md)[]; `txIds`: `string`[]; \}

#### Parameters

##### result

The SendAppTransactionResult to be mapped

`TResult` | `Promise`\<`TResult`\>

#### Returns

`Promise`\<`Omit`\<`TResult`, `"return"`\> & [`AppReturn`](../../app/type-aliases/AppReturn.md)\<`TReturn`\>\>

The smart contract response with an updated return value

***

### compile()

> `static` **compile**(`appSpec`, `appManager`, `compilation?`): `Promise`\<[`AppClientCompilationResult`](../interfaces/AppClientCompilationResult.md)\>

Defined in: [src/types/app-client.ts:1010](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1010)

Compiles the approval and clear state programs (if TEAL templates provided),
performing any provided deploy-time parameter replacement and returns
the compiled code and any compilation results (including source maps).

If no TEAL templates provided it will use any byte code provided in the app spec.

Will store any generated source maps for later use in debugging.

#### Parameters

##### appSpec

[`Arc56Contract`](../../../abi/type-aliases/Arc56Contract.md)

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

Defined in: [src/types/app-client.ts:926](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L926)

Takes an error that may include a logic error from a call to the current app and re-exposes the
error to include source code information via the source map and ARC-56 spec.

#### Parameters

##### e

`Error`

The error to parse

##### appSpec

[`Arc56Contract`](../../../abi/type-aliases/Arc56Contract.md)

The app spec for the app

##### details

Additional information to inform the error

###### approvalSourceInfo?

[`ProgramSourceInfo`](../../../abi/type-aliases/ProgramSourceInfo.md)

ARC56 approval source info

###### approvalSourceMap?

`ProgramSourceMap`

Approval program source map

###### clearSourceInfo?

[`ProgramSourceInfo`](../../../abi/type-aliases/ProgramSourceInfo.md)

ARC56 clear source info

###### clearSourceMap?

`ProgramSourceMap`

Clear state program source map

###### isClearStateProgram?

`boolean`

Whether or not the code was running the clear state program (defaults to approval program)

###### program?

`Uint8Array`

program bytes

#### Returns

`Error`

The new error, or if there was no logic error or source map then the wrapped error with source details

***

### fromCreatorAndName()

> `static` **fromCreatorAndName**(`params`): `Promise`\<`AppClient`\>

Defined in: [src/types/app-client.ts:553](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L553)

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

`string` \| [`Arc56Contract`](../../../abi/type-aliases/Arc56Contract.md) \| [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

###### clearSourceMap?

`ProgramSourceMap`

Optional source map for the clear state program

###### creatorAddress

[`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

The address of the creator account for the app

###### defaultSender?

[`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

Optional address to use for the account to use as the default sender for calls.

###### defaultSigner?

[`TransactionSigner`](../../../transact/type-aliases/TransactionSigner.md)

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

Defined in: [src/types/app-client.ts:582](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L582)

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

`string` \| [`Arc56Contract`](../../../abi/type-aliases/Arc56Contract.md) \| [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

###### clearSourceMap?

`ProgramSourceMap`

Optional source map for the clear state program

###### defaultSender?

[`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

Optional address to use for the account to use as the default sender for calls.

###### defaultSigner?

[`TransactionSigner`](../../../transact/type-aliases/TransactionSigner.md)

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

> `static` **normaliseAppSpec**(`spec`): [`Arc56Contract`](../../../abi/type-aliases/Arc56Contract.md)

Defined in: [src/types/app-client.ts:610](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L610)

Takes a string or parsed JSON object that could be ARC-32 or ARC-56 format and
normalises it into a parsed ARC-56 contract object.

#### Parameters

##### spec

The spec to normalise

`string` | [`Arc56Contract`](../../../abi/type-aliases/Arc56Contract.md) | [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

#### Returns

[`Arc56Contract`](../../../abi/type-aliases/Arc56Contract.md)

The normalised ARC-56 contract object

#### Example

```typescript
const arc56AppSpec = AppClient.normaliseAppSpec(appSpec)
```
