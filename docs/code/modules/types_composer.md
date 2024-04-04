[@algorandfoundation/algokit-utils](../README.md) / types/composer

# Module: types/composer

## Table of contents

### Classes

- [default](../classes/types_composer.default.md)

### Interfaces

- [ExecuteParams](../interfaces/types_composer.ExecuteParams.md)

### Type Aliases

- [AccountAddressParam](types_composer.md#accountaddressparam)
- [AlgokitComposerParams](types_composer.md#algokitcomposerparams)
- [AppCallParams](types_composer.md#appcallparams)
- [AppIdParam](types_composer.md#appidparam)
- [AssetAmountParam](types_composer.md#assetamountparam)
- [AssetConfigParams](types_composer.md#assetconfigparams)
- [AssetCreateParams](types_composer.md#assetcreateparams)
- [AssetDestroyParams](types_composer.md#assetdestroyparams)
- [AssetFreezeParams](types_composer.md#assetfreezeparams)
- [AssetIdParam](types_composer.md#assetidparam)
- [AssetOptInParams](types_composer.md#assetoptinparams)
- [AssetTransferParams](types_composer.md#assettransferparams)
- [CommonTransactionParams](types_composer.md#commontransactionparams)
- [MethodCallParams](types_composer.md#methodcallparams)
- [OnlineKeyRegistrationParams](types_composer.md#onlinekeyregistrationparams)
- [PaymentParams](types_composer.md#paymentparams)
- [RoundNumberParam](types_composer.md#roundnumberparam)

## Type Aliases

### AccountAddressParam

Ƭ **AccountAddressParam**: `string`

Transaction parameter that provides an account address.

#### Defined in

[src/types/composer.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L12)

___

### AlgokitComposerParams

Ƭ **AlgokitComposerParams**: `Object`

Parameters to create an `AlgokitComposer`.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `algosdk.Algodv2` | The algod client to use to get suggestedParams and send the transaction group |
| `defaultValidityWindow?` | `number` | How many rounds a transaction should be valid for by default |
| `getSigner` | (`address`: `string`) => `algosdk.TransactionSigner` | - |
| `getSuggestedParams?` | () => `Promise`\<`algosdk.SuggestedParams`\> | - |

#### Defined in

[src/types/composer.ts:239](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L239)

___

### AppCallParams

Ƭ **AppCallParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `accountReferences?`: [`AccountAddressParam`](types_composer.md#accountaddressparam)[] ; `appId?`: [`AppIdParam`](types_composer.md#appidparam) ; `appReferences?`: [`AppIdParam`](types_composer.md#appidparam)[] ; `approvalProgram?`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: [`AssetIdParam`](types_composer.md#assetidparam)[] ; `boxReferences?`: `algosdk.BoxReference`[] ; `clearProgram?`: `Uint8Array` ; `extraPages?`: `number` ; `onComplete?`: `algosdk.OnApplicationComplete` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalUints`: `number` ; `localByteSlices`: `number` ; `localUints`: `number`  }  }

Parameters to define an application call transaction.

#### Defined in

[src/types/composer.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L165)

___

### AppIdParam

Ƭ **AppIdParam**: `bigint`

Transaction parameter that provides an application ID.

#### Defined in

[src/types/composer.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L24)

___

### AssetAmountParam

Ƭ **AssetAmountParam**: `bigint`

Transaction parameter that provides an asset amount.

#### Defined in

[src/types/composer.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L18)

___

### AssetConfigParams

Ƭ **AssetConfigParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: [`AssetIdParam`](types_composer.md#assetidparam) ; `clawback?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `freeze?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `manager?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `reserve?`: [`AccountAddressParam`](types_composer.md#accountaddressparam)  }

Parameters to define an asset config transaction.

#### Defined in

[src/types/composer.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L93)

___

### AssetCreateParams

Ƭ **AssetCreateParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetName?`: `string` ; `clawback?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `decimals?`: `number` ; `defaultFrozen?`: `boolean` ; `freeze?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `manager?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `metadataHash?`: `Uint8Array` ; `reserve?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `total`: [`AssetAmountParam`](types_composer.md#assetamountparam) ; `unitName?`: `string` ; `url?`: `string`  }

Parameters to define an asset create transaction.

#### Defined in

[src/types/composer.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L67)

___

### AssetDestroyParams

Ƭ **AssetDestroyParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: [`AssetIdParam`](types_composer.md#assetidparam)  }

Parameters to define an asset destroy transaction.

#### Defined in

[src/types/composer.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L117)

___

### AssetFreezeParams

Ƭ **AssetFreezeParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `account`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `assetId`: [`AssetIdParam`](types_composer.md#assetidparam) ; `frozen`: `boolean`  }

Parameters to define an asset freeze transaction.

#### Defined in

[src/types/composer.ts:107](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L107)

___

### AssetIdParam

Ƭ **AssetIdParam**: `bigint`

Transaction parameter that provides an asset ID.

#### Defined in

[src/types/composer.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L21)

___

### AssetOptInParams

Ƭ **AssetOptInParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `assetId`: [`AssetIdParam`](types_composer.md#assetidparam)  }

Parameters to define an asset opt-in transaction.

#### Defined in

[src/types/composer.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L137)

___

### AssetTransferParams

Ƭ **AssetTransferParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `amount`: [`AssetAmountParam`](types_composer.md#assetamountparam) ; `assetId`: [`AssetIdParam`](types_composer.md#assetidparam) ; `clawbackTarget?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `closeAssetTo?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `receiver`: [`AccountAddressParam`](types_composer.md#accountaddressparam)  }

Parameters to define an asset transfer transaction.

#### Defined in

[src/types/composer.ts:123](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L123)

___

### CommonTransactionParams

Ƭ **CommonTransactionParams**: `Object`

Common parameters for defining a transaction.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `extraFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for covering inner transaction fees |
| `firstValidRound?` | [`RoundNumberParam`](types_composer.md#roundnumberparam) | Set the first round this transaction is valid. If left undefined, the value from algod will be used. Only set this when you intentionally want this to be some time in the future |
| `lastValidRound?` | [`RoundNumberParam`](types_composer.md#roundnumberparam) | The last round this transaction is valid. It is recommended to use validityWindow instead |
| `lease?` | `Uint8Array` \| `string` | Prevent multiple transactions with the same lease being included within the validity window |
| `maxFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount |
| `note?` | `Uint8Array` \| `string` | Note to attach to the transaction |
| `rekeyTo?` | [`AccountAddressParam`](types_composer.md#accountaddressparam) | Change the signing key of the sender to the given address |
| `sender` | [`AccountAddressParam`](types_composer.md#accountaddressparam) | The address sending the transaction |
| `signer?` | `algosdk.TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transactions |
| `staticFee?` | [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) | The transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction |
| `validityWindow?` | `number` | How many rounds the transaction should be valid for |

#### Defined in

[src/types/composer.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L27)

___

### MethodCallParams

Ƭ **MethodCallParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & `Omit`\<[`AppCallParams`](types_composer.md#appcallparams), ``"args"``\> & \{ `appId`: [`AppIdParam`](types_composer.md#appidparam) ; `args?`: (`algosdk.ABIValue` \| `TransactionWithSigner` \| `Transaction` \| `Promise`\<`Transaction`\> \| [`MethodCallParams`](types_composer.md#methodcallparams))[] ; `method`: `algosdk.ABIMethod`  }

Parameters to define an ABI method application call transaction.

#### Defined in

[src/types/composer.ts:200](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L200)

___

### OnlineKeyRegistrationParams

Ƭ **OnlineKeyRegistrationParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `selectionKey`: `Uint8Array` ; `stateProofKey?`: `Uint8Array` ; `voteFirst`: [`RoundNumberParam`](types_composer.md#roundnumberparam) ; `voteKey`: `Uint8Array` ; `voteKeyDilution`: [`RoundNumberParam`](types_composer.md#roundnumberparam) ; `voteLast`: [`RoundNumberParam`](types_composer.md#roundnumberparam)  }

Parameters to define an online key registration transaction.

#### Defined in

[src/types/composer.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L143)

___

### PaymentParams

Ƭ **PaymentParams**: [`CommonTransactionParams`](types_composer.md#commontransactionparams) & \{ `amount`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `closeRemainderTo?`: [`AccountAddressParam`](types_composer.md#accountaddressparam) ; `receiver`: [`AccountAddressParam`](types_composer.md#accountaddressparam)  }

Parameters to define a payment transaction.

#### Defined in

[src/types/composer.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L57)

___

### RoundNumberParam

Ƭ **RoundNumberParam**: `bigint`

Transaction parameter that provides a round number.

#### Defined in

[src/types/composer.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L15)
