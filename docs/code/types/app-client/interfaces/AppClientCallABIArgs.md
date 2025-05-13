[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClientCallABIArgs

# Interface: AppClientCallABIArgs

Defined in: [src/types/app-client.ts:199](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L199)

## Extends

- `Omit`\<[`ABIAppCallArgs`](../../app/type-aliases/ABIAppCallArgs.md), `"method"`\>

## Properties

### accounts?

> `optional` **accounts**: (`string` \| `Address`)[]

Defined in: [src/types/app.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L79)

The address of any accounts to load in

#### Inherited from

`Omit.accounts`

***

### apps?

> `optional` **apps**: `number`[]

Defined in: [src/types/app.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L81)

IDs of any apps to load into the foreignApps array

#### Inherited from

`Omit.apps`

***

### assets?

> `optional` **assets**: `number`[]

Defined in: [src/types/app.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L83)

IDs of any assets to load into the foreignAssets array

#### Inherited from

`Omit.assets`

***

### boxes?

> `optional` **boxes**: ([`BoxReference`](../../app/interfaces/BoxReference.md) \| [`BoxIdentifier`](../../app/type-aliases/BoxIdentifier.md) \| `BoxReference`)[]

Defined in: [src/types/app.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L77)

Any box references to load

#### Inherited from

`Omit.boxes`

***

### lease?

> `optional` **lease**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [src/types/app.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L75)

The optional lease for the transaction

#### Inherited from

`Omit.lease`

***

### method

> **method**: `string`

Defined in: [src/types/app-client.ts:201](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L201)

If calling an ABI method then either the name of the method, or the ABI signature

***

### methodArgs

> **methodArgs**: [`ABIAppCallArg`](../../app/type-aliases/ABIAppCallArg.md)[]

Defined in: [src/types/app.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L117)

The ABI method args to pass in

#### Inherited from

`Omit.methodArgs`

***

### rekeyTo?

> `optional` **rekeyTo**: `string` \| [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/app.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L88)

Optional account / account address that should be authorised to transact on behalf of the from account the app call is sent from after this transaction.

**Note:** Use with extreme caution and review the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying) first.

#### Inherited from

`Omit.rekeyTo`
