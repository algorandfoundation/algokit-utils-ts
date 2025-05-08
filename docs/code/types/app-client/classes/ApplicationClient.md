[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / ApplicationClient

# Class: ~~ApplicationClient~~

Defined in: [src/types/app-client.ts:1721](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1721)

## Deprecated

Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
`algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.

Application client - a class that wraps an ARC-0032 app spec and provides high productivity methods to deploy and call the app

## Constructors

### Constructor

> **new ApplicationClient**(`appDetails`, `algod`): `ApplicationClient`

Defined in: [src/types/app-client.ts:1748](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1748)

#### Parameters

##### appDetails

[`AppSpecAppDetails`](../type-aliases/AppSpecAppDetails.md)

The details of the app

##### algod

`AlgodClient`

An algod instance

#### Returns

`ApplicationClient`

#### Deprecated

Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
`algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.

Create a new ApplicationClient instance

## Methods

### ~~call()~~

> **call**(`call?`): `Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

Defined in: [src/types/app-client.ts:2060](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2060)

#### Parameters

##### call?

[`AppClientCallParams`](../type-aliases/AppClientCallParams.md)

The call details.

#### Returns

`Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

The result of the call

#### Deprecated

Use `appClient.send.call` or `appClient.createTransaction.call` from an `AppClient` instance instead.

Issues a no_op (normal) call to the app.

***

### ~~callOfType()~~

> **callOfType**(`call`, `callType`): `Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

Defined in: [src/types/app-client.ts:2142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2142)

#### Parameters

##### call

[`AppClientCallParams`](../type-aliases/AppClientCallParams.md) = `{}`

The call details.

##### callType

The call type

`"no_op"` | `"opt_in"` | `"close_out"` | `"clear_state"` | `"delete_application"` | `NoOpOC` | `OptInOC` | `CloseOutOC` | `ClearStateOC` | `DeleteApplicationOC`

#### Returns

`Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

The result of the call

#### Deprecated

Use `appClient.send.call` or `appClient.createTransaction.call` from an `AppClient` instance instead.

Issues a call to the app with the given call type.

***

### ~~clearState()~~

> **clearState**(`call?`): `Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

Defined in: [src/types/app-client.ts:2119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2119)

#### Parameters

##### call?

[`AppClientClearStateParams`](../type-aliases/AppClientClearStateParams.md)

The call details.

#### Returns

`Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

The result of the call

#### Deprecated

Use `appClient.send.clearState` or `appClient.createTransaction.clearState` from an `AppClient` instance instead.

Issues a clear_state call to the app.

***

### ~~closeOut()~~

> **closeOut**(`call?`): `Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

Defined in: [src/types/app-client.ts:2108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2108)

#### Parameters

##### call?

[`AppClientCallParams`](../type-aliases/AppClientCallParams.md)

The call details.

#### Returns

`Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

The result of the call

#### Deprecated

Use `appClient.send.closeOut` or `appClient.createTransaction.closeOut` from an `AppClient` instance instead.

Issues a close_out call to the app.

***

### ~~compile()~~

> **compile**(`compilation?`): `Promise`\<\{ `approvalCompiled`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `clearCompiled`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); \}\>

Defined in: [src/types/app-client.ts:1787](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1787)

#### Parameters

##### compilation?

[`AppClientCompilationParams`](../interfaces/AppClientCompilationParams.md)

The deploy-time parameters for the compilation

#### Returns

`Promise`\<\{ `approvalCompiled`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `clearCompiled`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); \}\>

The compiled approval and clear state programs

#### Deprecated

Use `AppClient.compile()` instead.

Compiles the approval and clear state programs and sets up the source map.

***

### ~~create()~~

> **create**(`create?`): `Promise`\<\{ `appAddress`: `string`; `appId`: `number` \| `bigint`; `compiledApproval`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `compiledClear`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `confirmation?`: `PendingTransactionResponse`; `confirmations?`: `PendingTransactionResponse`[]; `return?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `transaction`: `Transaction`; `transactions`: `Transaction`[]; \}\>

Defined in: [src/types/app-client.ts:1955](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1955)

#### Parameters

##### create?

[`AppClientCreateParams`](../type-aliases/AppClientCreateParams.md)

The parameters to create the app with

#### Returns

`Promise`\<\{ `appAddress`: `string`; `appId`: `number` \| `bigint`; `compiledApproval`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `compiledClear`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `confirmation?`: `PendingTransactionResponse`; `confirmations?`: `PendingTransactionResponse`[]; `return?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `transaction`: `Transaction`; `transactions`: `Transaction`[]; \}\>

The details of the created app, or the transaction to create it if `skipSending` and the compilation result

#### Deprecated

Use `create` from an `AppFactory` instance instead.

Creates a smart contract app, returns the details of the created app.

***

### ~~delete()~~

> **delete**(`call?`): `Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

Defined in: [src/types/app-client.ts:2130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2130)

#### Parameters

##### call?

[`AppClientCallParams`](../type-aliases/AppClientCallParams.md)

The call details.

#### Returns

`Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

The result of the call

#### Deprecated

Use `appClient.send.delete` or `appClient.createTransaction.delete` from an `AppClient` instance instead.

Issues a delete_application call to the app.

***

### ~~deploy()~~

> **deploy**(`deploy?`): `Promise`\<`Partial`\<[`AppCompilationResult`](../../app/interfaces/AppCompilationResult.md)\> & [`AppMetadata`](../../app/interfaces/AppMetadata.md) & `object` \| \{ `appAddress`: `string`; `appId`: `number` \| `bigint`; `compiledApproval`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `compiledClear`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `confirmation`: `PendingTransactionResponse`; `confirmations`: `PendingTransactionResponse`[]; `createdMetadata`: [`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md); `createdRound`: `number`; `deletable?`: `boolean`; `deleted`: `boolean`; `name`: `string`; `operationPerformed`: `"update"` \| `"create"`; `return?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `transaction`: `Transaction`; `transactions`: `Transaction`[]; `updatable?`: `boolean`; `updatedRound`: `number`; `version`: `string`; \} \| \{ `appAddress`: `string`; `appId`: `number` \| `bigint`; `compiledApproval`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `compiledClear`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `confirmation`: `PendingTransactionResponse`; `confirmations`: `PendingTransactionResponse`[]; `createdMetadata`: [`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md); `createdRound`: `number`; `deletable?`: `boolean`; `deleted`: `boolean`; `deleteResult`: [`ConfirmedTransactionResult`](../../transaction/interfaces/ConfirmedTransactionResult.md); `deleteReturn?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `name`: `string`; `operationPerformed`: `"replace"`; `return?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `transaction`: `Transaction`; `transactions`: `Transaction`[]; `updatable?`: `boolean`; `updatedRound`: `number`; `version`: `string`; \}\>

Defined in: [src/types/app-client.ts:1849](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1849)

#### Parameters

##### deploy?

[`AppClientDeployParams`](../interfaces/AppClientDeployParams.md)

Deployment details

#### Returns

`Promise`\<`Partial`\<[`AppCompilationResult`](../../app/interfaces/AppCompilationResult.md)\> & [`AppMetadata`](../../app/interfaces/AppMetadata.md) & `object` \| \{ `appAddress`: `string`; `appId`: `number` \| `bigint`; `compiledApproval`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `compiledClear`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `confirmation`: `PendingTransactionResponse`; `confirmations`: `PendingTransactionResponse`[]; `createdMetadata`: [`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md); `createdRound`: `number`; `deletable?`: `boolean`; `deleted`: `boolean`; `name`: `string`; `operationPerformed`: `"update"` \| `"create"`; `return?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `transaction`: `Transaction`; `transactions`: `Transaction`[]; `updatable?`: `boolean`; `updatedRound`: `number`; `version`: `string`; \} \| \{ `appAddress`: `string`; `appId`: `number` \| `bigint`; `compiledApproval`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `compiledClear`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `confirmation`: `PendingTransactionResponse`; `confirmations`: `PendingTransactionResponse`[]; `createdMetadata`: [`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md); `createdRound`: `number`; `deletable?`: `boolean`; `deleted`: `boolean`; `deleteResult`: [`ConfirmedTransactionResult`](../../transaction/interfaces/ConfirmedTransactionResult.md); `deleteReturn?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `name`: `string`; `operationPerformed`: `"replace"`; `return?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `transaction`: `Transaction`; `transactions`: `Transaction`[]; `updatable?`: `boolean`; `updatedRound`: `number`; `version`: `string`; \}\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

#### Deprecated

Use `deploy` from an `AppFactory` instance instead.

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

***

### ~~exportSourceMaps()~~

> **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/AppSourceMaps.md)

Defined in: [src/types/app-client.ts:1817](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1817)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/AppSourceMaps.md)

The source maps

***

### ~~exposeLogicError()~~

> **exposeLogicError**(`e`, `isClear?`): `Error`

Defined in: [src/types/app-client.ts:2451](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2451)

Takes an error that may include a logic error from a smart contract call and re-exposes the error to include source code information via the source map.
This is automatically used within `ApplicationClient` but if you pass `skipSending: true` e.g. if doing a group transaction
 then you can use this in a try/catch block to get better debugging information.

#### Parameters

##### e

`Error`

The error to parse

##### isClear?

`boolean`

Whether or not the code was running the clear state program

#### Returns

`Error`

The new error, or if there was no logic error or source map then the wrapped error with source details

***

### ~~fundAppAccount()~~

> **fundAppAccount**(`fund`): `Promise`\<[`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md) \| \{ `confirmation`: `PendingTransactionResponse`; `confirmations`: `PendingTransactionResponse`[]; `groupId`: `string`; `returns?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md)[]; `transaction`: `Transaction`; `transactions`: `Transaction`[]; `txIds`: `string`[]; \} & `object`\>

Defined in: [src/types/app-client.ts:2181](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2181)

Funds Algo into the app account for this app.

#### Parameters

##### fund

The parameters for the funding or the funding amount

[`AlgoAmount`](../../amount/classes/AlgoAmount.md) | [`FundAppAccountParams`](../interfaces/FundAppAccountParams.md)

#### Returns

`Promise`\<[`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md) \| \{ `confirmation`: `PendingTransactionResponse`; `confirmations`: `PendingTransactionResponse`[]; `groupId`: `string`; `returns?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md)[]; `transaction`: `Transaction`; `transactions`: `Transaction`[]; `txIds`: `string`[]; \} & `object`\>

The result of the funding

***

### ~~getABIMethod()~~

> **getABIMethod**(`method`): `undefined` \| `ABIMethod`

Defined in: [src/types/app-client.ts:2415](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2415)

Returns the ABI Method for the given method name string for the app represented by this application client instance

#### Parameters

##### method

`string`

Either the name of the method or the ABI method spec definition string

#### Returns

`undefined` \| `ABIMethod`

The ABI method for the given method

***

### ~~getABIMethodParams()~~

> **getABIMethodParams**(`method`): `undefined` \| `ABIMethodParams`

Defined in: [src/types/app-client.ts:2393](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2393)

#### Parameters

##### method

`string`

Either the name of the method or the ABI method spec definition string

#### Returns

`undefined` \| `ABIMethodParams`

The ABI method params for the given method

#### Deprecated

Use `appClient.getABIMethod` instead.

Returns the ABI Method parameters for the given method name string for the app represented by this application client instance

***

### ~~getAppReference()~~

> **getAppReference**(): `Promise`\<[`AppReference`](../../app/interfaces/AppReference.md) \| [`AppMetadata`](../../app/interfaces/AppMetadata.md)\>

Defined in: [src/types/app-client.ts:2427](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2427)

#### Returns

`Promise`\<[`AppReference`](../../app/interfaces/AppReference.md) \| [`AppMetadata`](../../app/interfaces/AppMetadata.md)\>

The app reference, or if deployed using the `deploy` method, the app metadata too

#### Deprecated

Use `appClient.appId` and `appClient.appAddress` from an `AppClient` instance instead.

Gets the reference information for the current application instance.
`appId` will be 0 if it can't find an app.

***

### ~~getBoxNames()~~

> **getBoxNames**(): `Promise`\<[`BoxName`](../../app/interfaces/BoxName.md)[]\>

Defined in: [src/types/app-client.ts:2232](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2232)

Returns the names of all current boxes for the current app.

#### Returns

`Promise`\<[`BoxName`](../../app/interfaces/BoxName.md)[]\>

The names of the boxes

***

### ~~getBoxValue()~~

> **getBoxValue**(`name`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [src/types/app-client.ts:2247](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2247)

Returns the value of the given box for the current app.

#### Parameters

##### name

The name of the box to return either as a string, binary array or `BoxName`

`string` | `Uint8Array`\<`ArrayBufferLike`\> | [`BoxName`](../../app/interfaces/BoxName.md)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The current box value as a byte array

***

### ~~getBoxValueFromABIType()~~

> **getBoxValueFromABIType**(`name`, `type`): `Promise`\<`ABIValue`\>

Defined in: [src/types/app-client.ts:2263](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2263)

Returns the value of the given box for the current app.

#### Parameters

##### name

The name of the box to return either as a string, binary array or `BoxName`

`string` | `Uint8Array`\<`ArrayBufferLike`\> | [`BoxName`](../../app/interfaces/BoxName.md)

##### type

`ABIType`

#### Returns

`Promise`\<`ABIValue`\>

The current box value as a byte array

***

### ~~getBoxValues()~~

> **getBoxValues**(`filter?`): `Promise`\<`object`[]\>

Defined in: [src/types/app-client.ts:2279](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2279)

Returns the values of all current boxes for the current app.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

##### filter?

(`name`) => `boolean`

Optional filter to filter which boxes' values are returned

#### Returns

`Promise`\<`object`[]\>

The (name, value) pair of the boxes with values as raw byte arrays

***

### ~~getBoxValuesFromABIType()~~

> **getBoxValuesFromABIType**(`type`, `filter?`): `Promise`\<`object`[]\>

Defined in: [src/types/app-client.ts:2301](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2301)

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

***

### ~~getCallArgs()~~

> **getCallArgs**(`args`, `sender`): `Promise`\<`undefined` \| [`AppCallArgs`](../../app/type-aliases/AppCallArgs.md)\>

Defined in: [src/types/app-client.ts:2327](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2327)

#### Parameters

##### args

The call args specific to this application client

`undefined` | [`AppClientCallArgs`](../type-aliases/AppClientCallArgs.md)

##### sender

[`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

The sender of this call. Will be used to fetch any default argument values if applicable

#### Returns

`Promise`\<`undefined` \| [`AppCallArgs`](../../app/type-aliases/AppCallArgs.md)\>

The call args ready to pass into an app call

#### Deprecated

Use `appClient.params.*` from an `AppClient` instance instead.

Returns the arguments for an app call for the given ABI method or raw method specification.

***

### ~~getGlobalState()~~

> **getGlobalState**(): `Promise`\<[`AppState`](../../app/interfaces/AppState.md)\>

Defined in: [src/types/app-client.ts:2204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2204)

Returns global state for the current app.

#### Returns

`Promise`\<[`AppState`](../../app/interfaces/AppState.md)\>

The global state

***

### ~~getLocalState()~~

> **getLocalState**(`account`): `Promise`\<[`AppState`](../../app/interfaces/AppState.md)\>

Defined in: [src/types/app-client.ts:2218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2218)

Returns local state for the given account / account address.

#### Parameters

##### account

`string` | [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

#### Returns

`Promise`\<[`AppState`](../../app/interfaces/AppState.md)\>

The global state

***

### ~~importSourceMaps()~~

> **importSourceMaps**(`sourceMaps`): `void`

Defined in: [src/types/app-client.ts:1831](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1831)

Import source maps for the app.

#### Parameters

##### sourceMaps

[`AppSourceMaps`](../interfaces/AppSourceMaps.md)

The source maps to import

#### Returns

`void`

***

### ~~optIn()~~

> **optIn**(`call?`): `Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

Defined in: [src/types/app-client.ts:2097](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2097)

#### Parameters

##### call?

[`AppClientCallParams`](../type-aliases/AppClientCallParams.md)

The call details.

#### Returns

`Promise`\<[`AppCallTransactionResult`](../../app/type-aliases/AppCallTransactionResult.md)\>

The result of the call

#### Deprecated

Use `appClient.send.optIn` or `appClient.createTransaction.optIn` from an `AppClient` instance instead.

Issues a opt_in call to the app.

***

### ~~update()~~

> **update**(`update?`): `Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `compiledClear`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `confirmation?`: `PendingTransactionResponse`; `confirmations?`: `PendingTransactionResponse`[]; `return?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `transaction`: `Transaction`; `transactions`: `Transaction`[]; \}\>

Defined in: [src/types/app-client.ts:2019](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2019)

#### Parameters

##### update?

[`AppClientUpdateParams`](../type-aliases/AppClientUpdateParams.md)

The parameters to update the app with

#### Returns

`Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `compiledClear`: [`CompiledTeal`](../../app/interfaces/CompiledTeal.md); `confirmation?`: `PendingTransactionResponse`; `confirmations?`: `PendingTransactionResponse`[]; `return?`: [`ABIReturn`](../../app/type-aliases/ABIReturn.md); `transaction`: `Transaction`; `transactions`: `Transaction`[]; \}\>

The transaction send result and the compilation result

#### Deprecated

Use `appClient.send.update` or `appClient.createTransaction.update` from an `AppClient` instance instead.

Updates the smart contract app.
