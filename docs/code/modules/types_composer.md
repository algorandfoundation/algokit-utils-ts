[@algorandfoundation/algokit-utils](../README.md) / types/composer

# Module: types/composer

## Table of contents

### Classes

- [default](../classes/types_composer.default.md)

### Interfaces

- [BuiltTransactions](../interfaces/types_composer.BuiltTransactions.md)

### Type Aliases

- [AlgoKitComposerParams](types_composer.md#algokitcomposerparams)
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
- [OnlineKeyRegistrationParams](types_composer.md#onlinekeyregistrationparams)
- [PaymentParams](types_composer.md#paymentparams)
- [SimulateOptions](types_composer.md#simulateoptions)

### Variables

- [MAX\_TRANSACTION\_GROUP\_SIZE](types_composer.md#max_transaction_group_size)

## Type Aliases

### AlgoKitComposerParams

Ƭ **AlgoKitComposerParams**: `Object`

Parameters to create an `AlgoKitComposer`.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `algosdk.Algodv2` | The algod client to use to get suggestedParams and send the transaction group |
| `appManager?` | [`AppManager`](../classes/types_app_manager.AppManager.md) | An existing `AppManager` to use to manage app compilation and cache compilation results. If not specified than an ephemeral one will be created. |
| `defaultValidityWindow?` | `number` | How many rounds a transaction should be valid for by default; if not specified then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet). |
| `getSigner` | (`address`: `string`) => `algosdk.TransactionSigner` | - |
| `getSuggestedParams?` | () => `Promise`\<`algosdk.SuggestedParams`\> | - |

#### Defined in

[src/types/composer.ts:450](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L450)

___

### AppCallMethodCall

Ƭ **AppCallMethodCall**: [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppMethodCallParams`](types_composer.md#appmethodcallparams)\>

#### Defined in

[src/types/composer.ts:401](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L401)

___

### AppCallParams

Ƭ **AppCallParams**: [`CommonAppCallParams`](types_composer.md#commonappcallparams) & \{ `onComplete?`: `Exclude`\<`algosdk.OnApplicationComplete`, `algosdk.OnApplicationComplete.UpdateApplicationOC`\>  }

Parameters to define an application call transaction.

#### Defined in

[src/types/composer.ts:381](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L381)

___

### AppCreateMethodCall

Ƭ **AppCreateMethodCall**: [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppCreateParams`](types_composer.md#appcreateparams)\>

#### Defined in

[src/types/composer.ts:398](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L398)

___

### AppCreateParams

Ƭ **AppCreateParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`CommonAppCallParams`](types_composer.md#commonappcallparams), ``"appId"``\> & \{ `approvalProgram`: `string` \| `Uint8Array` ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraProgramPages?`: `number` ; `onComplete?`: `Exclude`\<`algosdk.OnApplicationComplete`, `algosdk.OnApplicationComplete.ClearStateOC`\> ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  }  }\>

#### Defined in

[src/types/composer.ts:345](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L345)

___

### AppDeleteMethodCall

Ƭ **AppDeleteMethodCall**: [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppDeleteParams`](types_composer.md#appdeleteparams)\>

#### Defined in

[src/types/composer.ts:400](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L400)

___

### AppDeleteParams

Ƭ **AppDeleteParams**: [`CommonAppCallParams`](types_composer.md#commonappcallparams) & \{ `onComplete?`: `algosdk.OnApplicationComplete.DeleteApplicationOC`  }

Parameters to define an application delete call transaction.

#### Defined in

[src/types/composer.ts:394](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L394)

___

### AppMethodCall

Ƭ **AppMethodCall**\<`T`\>: [`Expand`](types_expand.md#expand)\<`Omit`\<`T`, ``"args"``\>\> & \{ `args?`: (`algosdk.ABIValue` \| `TransactionWithSigner` \| `Transaction` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppCreateParams`](types_composer.md#appcreateparams)\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppUpdateParams`](types_composer.md#appupdateparams)\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppMethodCallParams`](types_composer.md#appmethodcallparams)\>)[] ; `method`: `algosdk.ABIMethod`  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/types/composer.ts:412](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L412)

___

### AppMethodCallParams

Ƭ **AppMethodCallParams**: [`CommonAppCallParams`](types_composer.md#commonappcallparams) & \{ `onComplete?`: `Exclude`\<`algosdk.OnApplicationComplete`, `algosdk.OnApplicationComplete.UpdateApplicationOC` \| `algosdk.OnApplicationComplete.ClearStateOC`\>  }

Parameters to define a method call transaction.

#### Defined in

[src/types/composer.ts:386](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L386)

___

### AppMethodCallTransactionArgument

Ƭ **AppMethodCallTransactionArgument**: `TransactionWithSigner` \| `Transaction` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppCreateParams`](types_composer.md#appcreateparams)\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppUpdateParams`](types_composer.md#appupdateparams)\> \| [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppMethodCallParams`](types_composer.md#appmethodcallparams)\>

#### Defined in

[src/types/composer.ts:403](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L403)

___

### AppUpdateMethodCall

Ƭ **AppUpdateMethodCall**: [`AppMethodCall`](types_composer.md#appmethodcall)\<[`AppUpdateParams`](types_composer.md#appupdateparams)\>

#### Defined in

[src/types/composer.ts:399](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L399)

___

### AppUpdateParams

Ƭ **AppUpdateParams**: [`Expand`](types_expand.md#expand)\<[`CommonAppCallParams`](types_composer.md#commonappcallparams) & \{ `approvalProgram`: `string` \| `Uint8Array` ; `clearStateProgram`: `string` \| `Uint8Array` ; `onComplete?`: `algosdk.OnApplicationComplete.UpdateApplicationOC`  }\>

#### Defined in

[src/types/composer.ts:370](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L370)

___

### AssetConfigParams

Ƭ **AssetConfigParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `clawback?`: `string` ; `freeze?`: `string` ; `manager`: `string` \| `undefined` ; `reserve?`: `string`  }

Parameters to define an asset reconfiguration transaction.

**Note:** The manager, reserve, freeze, and clawback addresses
are immutably empty if they are not set. If manager is not set then
all fields are immutable from that point forward.

#### Defined in

[src/types/composer.ts:199](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L199)

___

### AssetCreateParams

Ƭ **AssetCreateParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetName?`: `string` ; `clawback?`: `string` ; `decimals?`: `number` ; `defaultFrozen?`: `boolean` ; `freeze?`: `string` ; `manager?`: `string` ; `metadataHash?`: `string` \| `Uint8Array` ; `reserve?`: `string` ; `total`: `bigint` ; `unitName?`: `string` ; `url?`: `string`  }

Parameters to define an asset create transaction.

The account that sends this transaction will automatically be opted in to the asset and will hold all units after creation.

#### Defined in

[src/types/composer.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L83)

___

### AssetDestroyParams

Ƭ **AssetDestroyParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  }

Parameters to define an asset destroy transaction.

Created assets can be destroyed only by the asset manager account. All of the assets must be owned by the creator of the asset before the asset can be deleted.

#### Defined in

[src/types/composer.ts:257](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L257)

___

### AssetFreezeParams

Ƭ **AssetFreezeParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `account`: `string` ; `assetId`: `bigint` ; `frozen`: `boolean`  }

Parameters to define an asset freeze transaction.

#### Defined in

[src/types/composer.ts:244](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L244)

___

### AssetOptInParams

Ƭ **AssetOptInParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  }

Parameters to define an asset opt-in transaction.

#### Defined in

[src/types/composer.ts:285](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L285)

___

### AssetOptOutParams

Ƭ **AssetOptOutParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `creator`: `string`  }

Parameters to define an asset opt-out transaction.

#### Defined in

[src/types/composer.ts:291](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L291)

___

### AssetTransferParams

Ƭ **AssetTransferParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `amount`: `bigint` ; `assetId`: `bigint` ; `clawbackTarget?`: `string` ; `closeAssetTo?`: `string` ; `receiver`: `string`  }

Parameters to define an asset transfer transaction.

#### Defined in

[src/types/composer.ts:263](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L263)

___

### CommonAppCallParams

Ƭ **CommonAppCallParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxReference`](../interfaces/types_app_manager.BoxReference.md) \| [`BoxIdentifier`](types_app_manager.md#boxidentifier))[] ; `onComplete?`: `algosdk.OnApplicationComplete`  }

Common parameters for defining an application call transaction.

#### Defined in

[src/types/composer.ts:324](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L324)

___

### CommonTransactionParams

Ƭ **CommonTransactionParams**: `Object`

Common parameters for defining a transaction.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `extraFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for covering inner transaction fees. |
| `firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `lease?` | `Uint8Array` \| `string` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `maxFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `note?` | `Uint8Array` \| `string` | Note to attach to the transaction. Max of 1000 bytes. |
| `rekeyTo?` | `string` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://developer.algorand.org/docs/get-details/accounts/rekey/). |
| `sender` | `string` | The address of the account sending the transaction. |
| `signer?` | `algosdk.TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `staticFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `validityWindow?` | `number` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Defined in

[src/types/composer.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L26)

___

### OnlineKeyRegistrationParams

Ƭ **OnlineKeyRegistrationParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey?`: `Uint8Array` ; `voteFirst`: `bigint` ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: `bigint` ; `voteLast`: `bigint`  }

Parameters to define an online key registration transaction.

#### Defined in

[src/types/composer.ts:302](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L302)

___

### PaymentParams

Ƭ **PaymentParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `amount`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `receiver`: `string`  }

Parameters to define a payment transaction.

#### Defined in

[src/types/composer.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L67)

___

### SimulateOptions

Ƭ **SimulateOptions**: [`Expand`](types_expand.md#expand)\<`Omit`\<`ConstructorParameters`\<typeof `modelsv2.SimulateRequest`\>[``0``], ``"txnGroups"``\>\>

Options to control a simulate request

#### Defined in

[src/types/composer.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L23)

## Variables

### MAX\_TRANSACTION\_GROUP\_SIZE

• `Const` **MAX\_TRANSACTION\_GROUP\_SIZE**: ``16``

#### Defined in

[src/types/composer.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L20)
