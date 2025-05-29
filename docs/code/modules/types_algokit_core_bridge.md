[@algorandfoundation/algokit-utils](../README.md) / types/algokit-core-bridge

# Module: types/algokit-core-bridge

## Table of contents

### Classes

- [TokenHeaderAuthenticationMethod](../classes/types_algokit_core_bridge.TokenHeaderAuthenticationMethod.md)

### Functions

- [buildAlgoKitCoreAlgodClient](types_algokit_core_bridge.md#buildalgokitcorealgodclient)
- [buildPayment](types_algokit_core_bridge.md#buildpayment)

## Functions

### buildAlgoKitCoreAlgodClient

▸ **buildAlgoKitCoreAlgodClient**(`baseUrl`, `tokenHeader`): `algodApi.AlgodApi`

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseUrl` | `URL` |
| `tokenHeader` | `TokenHeader` |

#### Returns

`algodApi.AlgodApi`

#### Defined in

[src/types/algokit-core-bridge.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L83)

___

### buildPayment

▸ **buildPayment**(`params`, `«destructured»`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CommonTransactionParams`](types_composer.md#commontransactionparams) |
| `«destructured»` | `PaymentTransactionParams` & `CommonTransactionParams` |

#### Returns

`Transaction`

#### Defined in

[src/types/algokit-core-bridge.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algokit-core-bridge.ts#L16)
