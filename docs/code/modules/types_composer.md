[@algorandfoundation/algokit-utils](../README.md) / types/composer

# Module: types/composer

## Table of contents

### Classes

- [default](../classes/types_composer.default.md)

### Interfaces

- [ExecuteParams](../interfaces/types_composer.ExecuteParams.md)

### Type Aliases

- [AlgokitComposerParams](types_composer.md#algokitcomposerparams)
- [AppCallParams](types_composer.md#appcallparams)
- [AssetConfigParams](types_composer.md#assetconfigparams)
- [AssetCreateParams](types_composer.md#assetcreateparams)
- [AssetDestroyParams](types_composer.md#assetdestroyparams)
- [AssetFreezeParams](types_composer.md#assetfreezeparams)
- [AssetOptInParams](types_composer.md#assetoptinparams)
- [AssetOptOutParams](types_composer.md#assetoptoutparams)
- [AssetTransferParams](types_composer.md#assettransferparams)
- [CommonTransactionParams](types_composer.md#commontransactionparams)
- [MethodCallParams](types_composer.md#methodcallparams)
- [OnlineKeyRegistrationParams](types_composer.md#onlinekeyregistrationparams)
- [PaymentParams](types_composer.md#paymentparams)
- [RekeyParams](types_composer.md#rekeyparams)

### Variables

- [MAX\_TRANSACTION\_GROUP\_SIZE](types_composer.md#max_transaction_group_size)

## Type Aliases

### AlgokitComposerParams

Ƭ **AlgokitComposerParams**: `Object`

Parameters to create an `AlgokitComposer`.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `algosdk.Algodv2` | The algod client to use to get suggestedParams and send the transaction group |
| `defaultValidityWindow?` | `number` | How many rounds a transaction should be valid for by default; if not specified then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet). |
| `getSigner` | (`address`: `string`) => `algosdk.TransactionSigner` | - |
| `getSuggestedParams?` | () => `Promise`\<`algosdk.SuggestedParams`\> | - |

#### Defined in

[src/types/composer.ts:338](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L338)

___

### AppCallParams

Ƭ **AppCallParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `accountReferences?`: `string`[] ; `appId?`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram?`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: `algosdk.BoxReference`[] ; `clearProgram?`: `Uint8Array` ; `extraPages?`: `number` ; `onComplete?`: `algosdk.OnApplicationComplete` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalUints`: `number` ; `localByteSlices`: `number` ; `localUints`: `number`  }  }

Parameters to define an application call transaction.

#### Defined in

[src/types/composer.ts:262](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L262)

___

### AssetConfigParams

Ƭ **AssetConfigParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `clawback?`: `string` ; `freeze?`: `string` ; `manager?`: `string` ; `reserve?`: `string`  }

Parameters to define an asset config transaction.

#### Defined in

[src/types/composer.ts:179](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L179)

___

### AssetCreateParams

Ƭ **AssetCreateParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetName?`: `string` ; `clawback?`: `string` ; `decimals?`: `number` ; `defaultFrozen?`: `boolean` ; `freeze?`: `string` ; `manager?`: `string` ; `metadataHash?`: `string` \| `Uint8Array` ; `reserve?`: `string` ; `total`: `bigint` ; `unitName?`: `string` ; `url?`: `string`  }

Parameters to define an asset create transaction.

The account that sends this transaction will automatically be opted in to the asset and will hold all units after creation.

#### Defined in

[src/types/composer.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L70)

___

### AssetDestroyParams

Ƭ **AssetDestroyParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  }

Parameters to define an asset destroy transaction.

#### Defined in

[src/types/composer.ts:203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L203)

___

### AssetFreezeParams

Ƭ **AssetFreezeParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `account`: `string` ; `assetId`: `bigint` ; `frozen`: `boolean`  }

Parameters to define an asset freeze transaction.

#### Defined in

[src/types/composer.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L193)

___

### AssetOptInParams

Ƭ **AssetOptInParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint`  }

Parameters to define an asset opt-in transaction.

#### Defined in

[src/types/composer.ts:223](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L223)

___

### AssetOptOutParams

Ƭ **AssetOptOutParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: `bigint` ; `creator`: `string`  }

Parameters to define an asset opt-out transaction.

#### Defined in

[src/types/composer.ts:229](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L229)

___

### AssetTransferParams

Ƭ **AssetTransferParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `amount`: `bigint` ; `assetId`: `bigint` ; `clawbackTarget?`: `string` ; `closeAssetTo?`: `string` ; `receiver`: `string`  }

Parameters to define an asset transfer transaction.

#### Defined in

[src/types/composer.ts:209](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L209)

___

### CommonTransactionParams

Ƭ **CommonTransactionParams**: `Object`

Common parameters for defining a transaction.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `extraFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for covering inner transaction fees |
| `firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. Only set this when you intentionally want this to be some time in the future |
| `lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use validityWindow instead |
| `lease?` | `Uint8Array` \| `string` | Prevent multiple transactions with the same lease being included within the validity window |
| `maxFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount |
| `note?` | `Uint8Array` \| `string` | Note to attach to the transaction |
| `rekeyTo?` | `string` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://developer.algorand.org/docs/get-details/accounts/rekey/). |
| `sender` | `string` | The address sending the transaction |
| `signer?` | `algosdk.TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transactions |
| `staticFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction |
| `validityWindow?` | `number` | How many rounds the transaction should be valid for |

#### Defined in

[src/types/composer.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L15)

___

### MethodCallParams

Ƭ **MethodCallParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & `Omit`\<[`AppCallParams`](types_composer.md#appcallparams), ``"args"``\> & \{ `appId`: `bigint` ; `args?`: (`algosdk.ABIValue` \| `TransactionWithSigner` \| `Transaction` \| `Promise`\<`Transaction`\> \| [`MethodCallParams`](types_composer.md#methodcallparams))[] ; `method`: `algosdk.ABIMethod`  }

Parameters to define an ABI method application call transaction.

#### Defined in

[src/types/composer.ts:297](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L297)

___

### OnlineKeyRegistrationParams

Ƭ **OnlineKeyRegistrationParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey?`: `Uint8Array` ; `voteFirst`: `bigint` ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: `bigint` ; `voteLast`: `bigint`  }

Parameters to define an online key registration transaction.

#### Defined in

[src/types/composer.ts:240](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L240)

___

### PaymentParams

Ƭ **PaymentParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `amount`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `receiver`: `string`  }

Parameters to define a payment transaction.

#### Defined in

[src/types/composer.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L48)

___

### RekeyParams

Ƭ **RekeyParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `rekeyTo`: `string`  }

Parameters to define a rekey transaction.

#### Defined in

[src/types/composer.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L58)

## Variables

### MAX\_TRANSACTION\_GROUP\_SIZE

• `Const` **MAX\_TRANSACTION\_GROUP\_SIZE**: ``16``

#### Defined in

[src/types/composer.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L12)
