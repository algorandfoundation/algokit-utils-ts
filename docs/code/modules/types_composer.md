[@algorandfoundation/algokit-utils](../README.md) / types/composer

# Module: types/composer

## Table of contents

### Classes

- [default](../classes/types_composer.default.md)

### Type Aliases

- [AlgokitComposerParams](types_composer.md#algokitcomposerparams)
- [AppCallParams](types_composer.md#appcallparams)
- [AssetConfigParams](types_composer.md#assetconfigparams)
- [AssetCreateParams](types_composer.md#assetcreateparams)
- [AssetDestroyParams](types_composer.md#assetdestroyparams)
- [AssetFreezeParams](types_composer.md#assetfreezeparams)
- [AssetOptInParams](types_composer.md#assetoptinparams)
- [AssetTransferParams](types_composer.md#assettransferparams)
- [CommonTxnParams](types_composer.md#commontxnparams)
- [MethodCallParams](types_composer.md#methodcallparams)
- [OnlineKeyRegParams](types_composer.md#onlinekeyregparams)
- [PayTxnParams](types_composer.md#paytxnparams)

## Type Aliases

### AlgokitComposerParams

Ƭ **AlgokitComposerParams**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `algosdk.Algodv2` | The algod client to use to get suggestedParams and send the transaction group |
| `defaultValidityWindow?` | `number` | How many rounds a transaction should be valid for by default |
| `getSigner` | (`address`: `string`) => `algosdk.TransactionSigner` | The function used to get the TransactionSigner for a given address |
| `getSuggestedParams?` | () => `Promise`\<`algosdk.SuggestedParams`\> | The method used to get SuggestedParams for transactions in the group |

#### Defined in

[src/types/composer.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L193)

___

### AppCallParams

Ƭ **AppCallParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & \{ `accountReferences?`: `string`[] ; `appId?`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram?`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: `algosdk.BoxReference`[] ; `clearProgram?`: `Uint8Array` ; `extraPages?`: `number` ; `onComplete?`: `algosdk.OnApplicationComplete` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalUints`: `number` ; `localByteSlices`: `number` ; `localUints`: `number`  }  }

#### Defined in

[src/types/composer.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L135)

___

### AssetConfigParams

Ƭ **AssetConfigParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & \{ `assetId`: `bigint` ; `clawback?`: `string` ; `freeze?`: `string` ; `manager?`: `string` ; `reserve?`: `string`  }

#### Defined in

[src/types/composer.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L69)

___

### AssetCreateParams

Ƭ **AssetCreateParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & \{ `assetName?`: `string` ; `clawback?`: `string` ; `decimals?`: `number` ; `defaultFrozen?`: `boolean` ; `freeze?`: `string` ; `manager?`: `string` ; `metadataHash?`: `Uint8Array` ; `reserve?`: `string` ; `total`: `bigint` ; `unitName?`: `string` ; `url?`: `string`  }

#### Defined in

[src/types/composer.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L44)

___

### AssetDestroyParams

Ƭ **AssetDestroyParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & \{ `assetId`: `bigint`  }

#### Defined in

[src/types/composer.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L91)

___

### AssetFreezeParams

Ƭ **AssetFreezeParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & \{ `account`: `string` ; `assetId`: `bigint` ; `frozen`: `boolean`  }

#### Defined in

[src/types/composer.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L82)

___

### AssetOptInParams

Ƭ **AssetOptInParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & \{ `assetId`: `bigint`  }

#### Defined in

[src/types/composer.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L130)

___

### AssetTransferParams

Ƭ **AssetTransferParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & \{ `amount`: `bigint` ; `assetId`: `bigint` ; `clawbackTarget?`: `string` ; `closeAssetTo?`: `string` ; `receiver`: `string`  }

#### Defined in

[src/types/composer.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L117)

___

### CommonTxnParams

Ƭ **CommonTxnParams**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `extraFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for covering inner transaction fees |
| `firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. Only set this when you intentionally want this to be some time in the future |
| `lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use validityWindow instead |
| `lease?` | `Uint8Array` \| `string` | Prevent multiple transactions with the same lease being included within the validity window |
| `maxFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount |
| `note?` | `Uint8Array` \| `string` | Note to attach to the transaction |
| `rekeyTo?` | `string` | Change the signing key of the sender to the given address |
| `sender` | `string` | The address sending the transaction |
| `signer?` | `algosdk.TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transactions |
| `staticFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction |
| `validityWindow?` | `number` | How many rounds the transaction should be valid for |

#### Defined in

[src/types/composer.ts:6](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L6)

___

### MethodCallParams

Ƭ **MethodCallParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & `Omit`\<[`AppCallParams`](types_composer.md#appcallparams), ``"args"``\> & \{ `appId`: `bigint` ; `args?`: (`algosdk.ABIValue` \| `Txn`)[] ; `method`: `algosdk.ABIMethod`  }

#### Defined in

[src/types/composer.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L169)

___

### OnlineKeyRegParams

Ƭ **OnlineKeyRegParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey?`: `Uint8Array` ; `voteFirst`: `bigint` ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: `bigint` ; `voteLast`: `bigint`  }

#### Defined in

[src/types/composer.ts:96](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L96)

___

### PayTxnParams

Ƭ **PayTxnParams**: [`CommonTxnParams`](types_composer.md#commontxnparams) & \{ `amount`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `receiver`: `string`  }

#### Defined in

[src/types/composer.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L35)
