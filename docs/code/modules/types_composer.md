[@algorandfoundation/algokit-utils](../README.md) / types/composer

# Module: types/composer

## Table of contents

### Classes

- [TransactionComposer](../classes/types_composer.TransactionComposer.md)

### Interfaces

- [BuiltTransactions](../interfaces/types_composer.BuiltTransactions.md)

### Type Aliases

- [AppCallMethodCall](types_composer.md#appcallmethodcall)
- [AppCallParams](types_composer.md#appcallparams)
- [AppCreateMethodCall](types_composer.md#appcreatemethodcall)
- [AppCreateParams](types_composer.md#appcreateparams)
- [AppDeleteMethodCall](types_composer.md#appdeletemethodcall)
- [AppDeleteParams](types_composer.md#appdeleteparams)
- [AppMethodCall](types_composer.md#appmethodcall)
- [AppMethodCallParams](types_composer.md#appmethodcallparams)
- [AppMethodCallTransactionArgument](types_composer.md#appmethodcalltransactionargument)
- [AppUpdateMethodCall](types_composer.md#appupdatemethodcall)
- [AppUpdateParams](types_composer.md#appupdateparams)
- [AssetConfigParams](types_composer.md#assetconfigparams)
- [AssetCreateParams](types_composer.md#assetcreateparams)
- [AssetDestroyParams](types_composer.md#assetdestroyparams)
- [AssetFreezeParams](types_composer.md#assetfreezeparams)
- [AssetOptInParams](types_composer.md#assetoptinparams)
- [AssetOptOutParams](types_composer.md#assetoptoutparams)
- [AssetTransferParams](types_composer.md#assettransferparams)
- [CommonAppCallParams](types_composer.md#commonappcallparams)
- [CommonTransactionParams](types_composer.md#commontransactionparams)
- [ErrorTransformer](types_composer.md#errortransformer)
- [OfflineKeyRegistrationParams](types_composer.md#offlinekeyregistrationparams)
- [OnlineKeyRegistrationParams](types_composer.md#onlinekeyregistrationparams)
- [PaymentParams](types_composer.md#paymentparams)
- [ProcessedAppCallMethodCall](types_composer.md#processedappcallmethodcall)
- [ProcessedAppCreateMethodCall](types_composer.md#processedappcreatemethodcall)
- [ProcessedAppUpdateMethodCall](types_composer.md#processedappupdatemethodcall)
- [RawSimulateOptions](types_composer.md#rawsimulateoptions)
- [SimulateOptions](types_composer.md#simulateoptions)
- [SkipSignaturesSimulateOptions](types_composer.md#skipsignaturessimulateoptions)
- [TransactionComposerConfig](types_composer.md#transactioncomposerconfig)
- [TransactionComposerParams](types_composer.md#transactioncomposerparams)

## Type Aliases

### AppCallMethodCall

Ƭ **AppCallMethodCall**: `Expand`\<[`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppMethodCallParams`](types_composer.md#appmethodcallparams)\>\>

Parameters to define an ABI method call transaction.

#### Defined in

[src/transactions/method-call.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/method-call.ts#L29)

___

### AppCallParams

Ƭ **AppCallParams**: [`CommonAppCallParams`](types_composer.md#commonappcallparams) & \{ `onComplete?`: `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.UpdateApplication`\>  }

Parameters to define an application call transaction.

#### Defined in

[src/transactions/app-call.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/app-call.ts#L89)

___

### AppCreateMethodCall

Ƭ **AppCreateMethodCall**: `Expand`\<[`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppCreateParams`](types_composer.md#appcreateparams)\>\>

Parameters to define an ABI method call create transaction.

#### Defined in

[src/transactions/method-call.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/method-call.ts#L23)

___

### AppCreateParams

Ƭ **AppCreateParams**: `Expand`\<`Omit`\<[`CommonAppCallParams`](types_composer.md#commonappcallparams), ``"appId"``\> & \{ `appId?`: ``0`` ; `approvalProgram`: `string` \| `Uint8Array` ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraProgramPages?`: `number` ; `onComplete?`: `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.ClearState`\> ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  }  }\>

Parameters to define an app create transaction

#### Defined in

[src/transactions/app-call.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/app-call.ts#L51)

___

### AppDeleteMethodCall

Ƭ **AppDeleteMethodCall**: `Expand`\<[`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppDeleteParams`](types_composer.md#appdeleteparams)\>\>

Parameters to define an ABI method call delete transaction.

#### Defined in

[src/transactions/method-call.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/method-call.ts#L27)

___

### AppDeleteParams

Ƭ **AppDeleteParams**: [`CommonAppCallParams`](types_composer.md#commonappcallparams) & \{ `onComplete?`: `OnApplicationComplete.DeleteApplication`  }

Parameters to define an application delete call transaction.

#### Defined in

[src/transactions/app-call.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/app-call.ts#L97)

___

### AppMethodCall

Ƭ **AppMethodCall**\<`T`\>: `Expand`\<`Omit`\<`T`, ``"args"``\>\> & \{ `args?`: (`ABIValue` \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Transaction` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppCreateParams`](types_composer.md#appcreateparams)\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppUpdateParams`](types_composer.md#appupdateparams)\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppMethodCallParams`](types_composer.md#appmethodcallparams)\> \| `undefined`)[] ; `method`: `ABIMethod`  }

Parameters to define an ABI method call.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/transactions/method-call.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/method-call.ts#L60)

___

### AppMethodCallParams

Ƭ **AppMethodCallParams**: [`CommonAppCallParams`](types_composer.md#commonappcallparams) & \{ `onComplete?`: `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.UpdateApplication` \| `OnApplicationComplete.ClearState`\>  }

Common parameters to define an ABI method call transaction.

#### Defined in

[src/transactions/app-call.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/app-call.ts#L92)

___

### AppMethodCallTransactionArgument

Ƭ **AppMethodCallTransactionArgument**: [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| `Transaction` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppCreateParams`](types_composer.md#appcreateparams)\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppUpdateParams`](types_composer.md#appupdateparams)\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppMethodCallParams`](types_composer.md#appmethodcallparams)\>

Types that can be used to define a transaction argument for an ABI call transaction.

#### Defined in

[src/transactions/method-call.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/method-call.ts#L50)

___

### AppUpdateMethodCall

Ƭ **AppUpdateMethodCall**: `Expand`\<[`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppUpdateParams`](types_composer.md#appupdateparams)\>\>

Parameters to define an ABI method call update transaction.

#### Defined in

[src/transactions/method-call.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/method-call.ts#L25)

___

### AppUpdateParams

Ƭ **AppUpdateParams**: `Expand`\<[`CommonAppCallParams`](types_composer.md#commonappcallparams) & \{ `approvalProgram`: `string` \| `Uint8Array` ; `clearStateProgram`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete.UpdateApplication`  }\>

Parameters to define an app update transaction

#### Defined in

[src/transactions/app-call.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/app-call.ts#L78)

___

### AssetConfigParams

Ƭ **AssetConfigParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `clawback?`: [`ReadableAddress`](index.md#readableaddress) ; `freeze?`: [`ReadableAddress`](index.md#readableaddress) ; `manager?`: [`ReadableAddress`](index.md#readableaddress) ; `reserve?`: [`ReadableAddress`](index.md#readableaddress)  }

Parameters to define an asset reconfiguration transaction.

**Note:** The manager, reserve, freeze, and clawback addresses
are immutably empty if they are not set. If manager is not set then
all fields are immutable from that point forward.

#### Defined in

[src/transactions/asset-config.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-config.ts#L126)

___

### AssetCreateParams

Ƭ **AssetCreateParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetName?`: `string` ; `clawback?`: [`ReadableAddress`](index.md#readableaddress) ; `decimals?`: `number` ; `defaultFrozen?`: `boolean` ; `freeze?`: [`ReadableAddress`](index.md#readableaddress) ; `manager?`: [`ReadableAddress`](index.md#readableaddress) ; `metadataHash?`: `string` \| `Uint8Array` ; `reserve?`: [`ReadableAddress`](index.md#readableaddress) ; `total`: `bigint` ; `unitName?`: `string` ; `url?`: `string`  }

Parameters to define an asset create transaction.

The account that sends this transaction will automatically be opted in to the asset and will hold all units after creation.

#### Defined in

[src/transactions/asset-config.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-config.ts#L10)

___

### AssetDestroyParams

Ƭ **AssetDestroyParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  }

Parameters to define an asset destroy transaction.

Created assets can be destroyed only by the asset manager account. All of the assets must be owned by the creator of the asset before the asset can be deleted.

#### Defined in

[src/transactions/asset-config.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-config.ts#L184)

___

### AssetFreezeParams

Ƭ **AssetFreezeParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `freezeTarget`: [`ReadableAddress`](index.md#readableaddress) ; `frozen`: `boolean`  }

Parameters to define an asset freeze transaction.

#### Defined in

[src/transactions/asset-config.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-config.ts#L171)

___

### AssetOptInParams

Ƭ **AssetOptInParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  }

Parameters to define an asset opt-in transaction.

#### Defined in

[src/transactions/asset-transfer.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-transfer.ts#L29)

___

### AssetOptOutParams

Ƭ **AssetOptOutParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `creator`: [`ReadableAddress`](index.md#readableaddress)  }

Parameters to define an asset opt-out transaction.

#### Defined in

[src/transactions/asset-transfer.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-transfer.ts#L35)

___

### AssetTransferParams

Ƭ **AssetTransferParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `amount`: `bigint` ; `assetId`: `bigint` ; `clawbackTarget?`: [`ReadableAddress`](index.md#readableaddress) ; `closeAssetTo?`: [`ReadableAddress`](index.md#readableaddress) ; `receiver`: [`ReadableAddress`](index.md#readableaddress)  }

Parameters to define an asset transfer transaction.

#### Defined in

[src/transactions/asset-transfer.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-transfer.ts#L7)

___

### CommonAppCallParams

Ƭ **CommonAppCallParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `accessReferences?`: `ResourceReference`[] ; `accountReferences?`: [`ReadableAddress`](index.md#readableaddress)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxReference`](../interfaces/types_app_manager.BoxReference.md) \| [`BoxIdentifier`](types_app_manager.md#boxidentifier))[] ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number`  }

Common parameters for defining an application call transaction.

#### Defined in

[src/transactions/app-call.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/app-call.ts#L25)

___

### CommonTransactionParams

Ƭ **CommonTransactionParams**: `Object`

Common parameters for defining a transaction.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `extraFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `lease?` | `Uint8Array` \| `string` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://dev.algorand.co/concepts/transactions/leases) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `maxFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `note?` | `Uint8Array` \| `string` | Note to attach to the transaction. Max of 1000 bytes. |
| `rekeyTo?` | [`ReadableAddress`](index.md#readableaddress) | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `sender` | `SendingAddress` | The address sending the transaction, optionally with an attached signer. |
| `signer?` | `TransactionSigner` \| `AddressWithTransactionSigner` | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `staticFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Defined in

[src/transactions/common.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/common.ts#L8)

___

### ErrorTransformer

Ƭ **ErrorTransformer**: (`error`: `Error`) => `Promise`\<`Error`\>

A function that transforms an error into a new error.

In most cases, an ErrorTransformer should first check if it can or should transform the error
and return the input error if it cannot or should not transform it.

#### Type declaration

▸ (`error`): `Promise`\<`Error`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

##### Returns

`Promise`\<`Error`\>

#### Defined in

[src/types/composer.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L157)

___

### OfflineKeyRegistrationParams

Ƭ **OfflineKeyRegistrationParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `preventAccountFromEverParticipatingAgain?`: `boolean`  }

Parameters to define an offline key registration transaction.

#### Defined in

[src/transactions/key-registration.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/key-registration.ts#L22)

___

### OnlineKeyRegistrationParams

Ƭ **OnlineKeyRegistrationParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey`: `Uint8Array` ; `voteFirst`: `bigint` ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: `bigint` ; `voteLast`: `bigint`  }

Parameters to define an online key registration transaction.

#### Defined in

[src/transactions/key-registration.ts:6](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/key-registration.ts#L6)

___

### PaymentParams

Ƭ **PaymentParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `amount`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `closeRemainderTo?`: [`ReadableAddress`](index.md#readableaddress) ; `receiver`: [`ReadableAddress`](index.md#readableaddress)  }

Parameters to define a payment transaction.

#### Defined in

[src/transactions/payment.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/payment.ts#L8)

___

### ProcessedAppCallMethodCall

Ƭ **ProcessedAppCallMethodCall**: `Expand`\<`Omit`\<[`AppCallMethodCall`](types_composer.md#appcallmethodcall), ``"args"``\> & \{ `args?`: (`ABIValue` \| `undefined`)[]  }\>

#### Defined in

[src/transactions/method-call.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/method-call.ts#L43)

___

### ProcessedAppCreateMethodCall

Ƭ **ProcessedAppCreateMethodCall**: `Expand`\<`Omit`\<[`AppCreateMethodCall`](types_composer.md#appcreatemethodcall), ``"args"``\> & \{ `args?`: (`ABIValue` \| `undefined`)[]  }\>

#### Defined in

[src/transactions/method-call.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/method-call.ts#L31)

___

### ProcessedAppUpdateMethodCall

Ƭ **ProcessedAppUpdateMethodCall**: `Expand`\<`Omit`\<[`AppUpdateMethodCall`](types_composer.md#appupdatemethodcall), ``"args"``\> & \{ `args?`: (`ABIValue` \| `undefined`)[]  }\>

#### Defined in

[src/transactions/method-call.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/method-call.ts#L37)

___

### RawSimulateOptions

Ƭ **RawSimulateOptions**: `Expand`\<`Omit`\<`SimulateRequest`, ``"txnGroups"``\>\> & \{ `resultOnFailure?`: `boolean`  }

The raw API options to control a simulate request.
See algod API docs for more information: https://dev.algorand.co/reference/rest-apis/algod/#simulatetransaction

#### Defined in

[src/types/composer.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L128)

___

### SimulateOptions

Ƭ **SimulateOptions**: `Expand`\<`Partial`\<[`SkipSignaturesSimulateOptions`](types_composer.md#skipsignaturessimulateoptions)\> & [`RawSimulateOptions`](types_composer.md#rawsimulateoptions)\>

All options to control a simulate request

#### Defined in

[src/types/composer.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L134)

___

### SkipSignaturesSimulateOptions

Ƭ **SkipSignaturesSimulateOptions**: `Expand`\<`Omit`\<[`RawSimulateOptions`](types_composer.md#rawsimulateoptions), ``"fixSigners"`` \| ``"allowEmptySignatures"``\> & \{ `skipSignatures`: `boolean`  }\>

Options to control a simulate request, that does not require transaction signing

#### Defined in

[src/types/composer.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L116)

___

### TransactionComposerConfig

Ƭ **TransactionComposerConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `coverAppCallInnerTransactionFees` | `boolean` |
| `populateAppCallResources` | `boolean` |

#### Defined in

[src/types/composer.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L171)

___

### TransactionComposerParams

Ƭ **TransactionComposerParams**: `Object`

Parameters to create an `TransactionComposer`.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `AlgodClient` | The algod client to use to get suggestedParams and send the transaction group |
| `appManager?` | [`AppManager`](../classes/types_app_manager.AppManager.md) | An existing `AppManager` to use to manage app compilation and cache compilation results. If not specified then an ephemeral one will be created. |
| `composerConfig?` | [`TransactionComposerConfig`](types_composer.md#transactioncomposerconfig) | - |
| `defaultValidityWindow?` | `bigint` | How many rounds a transaction should be valid for by default; if not specified then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet). |
| `errorTransformers?` | [`ErrorTransformer`](types_composer.md#errortransformer)[] | An array of error transformers to use when an error is caught in simulate or execute callbacks can later be registered with `registerErrorTransformer` |
| `getSigner` | (`address`: [`ReadableAddress`](index.md#readableaddress)) => `TransactionSigner` | - |
| `getSuggestedParams?` | () => `Promise`\<`SuggestedParams`\> | - |

#### Defined in

[src/types/composer.ts:191](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L191)
