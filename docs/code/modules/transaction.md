[algotstest](../README.md) / transaction

# Module: transaction

## Table of contents

### Classes

- [MultisigAccount](../classes/transaction.MultisigAccount.md)
- [SigningAccount](../classes/transaction.SigningAccount.md)

### Interfaces

- [SendTransactionParams](../interfaces/transaction.SendTransactionParams.md)
- [SendTransactionResult](../interfaces/transaction.SendTransactionResult.md)
- [TransactionToSign](../interfaces/transaction.TransactionToSign.md)

### Type Aliases

- [Arc2TransactionNote](transaction.md#arc2transactionnote)
- [SendTransactionFrom](transaction.md#sendtransactionfrom)
- [TransactionNote](transaction.md#transactionnote)
- [TransactionNoteData](transaction.md#transactionnotedata)

### Functions

- [capTransactionFee](transaction.md#captransactionfee)
- [encodeTransactionNote](transaction.md#encodetransactionnote)
- [getSenderAddress](transaction.md#getsenderaddress)
- [getTransactionParams](transaction.md#gettransactionparams)
- [sendGroupOfTransactions](transaction.md#sendgroupoftransactions)
- [sendTransaction](transaction.md#sendtransaction)
- [waitForConfirmation](transaction.md#waitforconfirmation)

## Type Aliases

### Arc2TransactionNote

Ƭ **Arc2TransactionNote**: `Object`

ARC-0002 compatible transaction note components,

**`See`**

https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dAppName` | `string` |
| `data` | `string` |
| `format` | ``"m"`` \| ``"j"`` \| ``"b"`` \| ``"u"`` |

#### Defined in

[transaction.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L90)

___

### SendTransactionFrom

Ƭ **SendTransactionFrom**: `Account` \| [`SigningAccount`](../classes/transaction.SigningAccount.md) \| `LogicSigAccount` \| [`MultisigAccount`](../classes/transaction.MultisigAccount.md)

#### Defined in

[transaction.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L147)

___

### TransactionNote

Ƭ **TransactionNote**: `Uint8Array` \| [`TransactionNoteData`](transaction.md#transactionnotedata) \| [`Arc2TransactionNote`](transaction.md#arc2transactionnote)

#### Defined in

[transaction.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L86)

___

### TransactionNoteData

Ƭ **TransactionNoteData**: `string` \| ``null`` \| `undefined` \| `number` \| `any`[] \| `Record`<`string`, `any`\>

#### Defined in

[transaction.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L88)

## Functions

### capTransactionFee

▸ **capTransactionFee**(`transaction`, `maxAcceptableFee`): `void`

Limit the acceptable fee to a defined amount of µALGOs.
This also sets the transaction to be flatFee to ensure the transaction only succeeds at
the estimated rate.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `Transaction` | The transaction to cap |
| `maxAcceptableFee` | [`AlgoAmount`](../classes/algo_amount.AlgoAmount.md) | The maximum acceptable fee to pay |

#### Returns

`void`

#### Defined in

[transaction.ts:324](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L324)

___

### encodeTransactionNote

▸ **encodeTransactionNote**(`note?`): `Uint8Array` \| `undefined`

Encodes a transaction note into a byte array ready to be included in an Algorand transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `note?` | [`TransactionNote`](transaction.md#transactionnote) | The transaction note |

#### Returns

`Uint8Array` \| `undefined`

the transaction note ready for inclusion in a transaction

 Case on the value of `data` this either either be:
  * `null` | `undefined`: `undefined`
  * `string`: The string value
  * Uint8Array: passthrough
  * Arc2TransactionNote object: ARC-0002 compatible transaction note
  * Else: The object/value converted into a JSON string representation

#### Defined in

[transaction.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L108)

___

### getSenderAddress

▸ **getSenderAddress**(`sender`): `string`

Returns the public address of the given transaction sender.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sender` | [`SendTransactionFrom`](transaction.md#sendtransactionfrom) | A transaction sender |

#### Returns

`string`

The public address

#### Defined in

[transaction.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L154)

___

### getTransactionParams

▸ **getTransactionParams**(`params`, `algod`): `Promise`<`SuggestedParams`\>

Returns suggested transaction parameters from algod unless some are already provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `undefined` \| `SuggestedParams` | Optionally provide parameters to use |
| `algod` | `default` | Algod algod |

#### Returns

`Promise`<`SuggestedParams`\>

The suggested transaction parameters

#### Defined in

[transaction.ts:350](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L350)

___

### sendGroupOfTransactions

▸ **sendGroupOfTransactions**(`groupSend`, `algod`): `Promise`<{ `confirmation`: `undefined` \| [`PendingTransactionResponse`](../interfaces/algod_type.PendingTransactionResponse.md) ; `groupTransactionId`: `string` = txId }\>

Signs and sends a group of [up to 16](https://developer.algorand.org/docs/get-details/atomic_transfers/#create-transactions) transactions to the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `groupSend` | `Object` | The group details to send, with: * `transactions`: The array of transactions to send along with their signing account * `sendParams`: The parameters to dictate how the group is sent |
| `groupSend.sendParams?` | `Omit`<`Omit`<[`SendTransactionParams`](../interfaces/transaction.SendTransactionParams.md), ``"maxFee"``\>, ``"skipSending"``\> | - |
| `groupSend.transactions` | [`TransactionToSign`](../interfaces/transaction.TransactionToSign.md)[] | - |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<{ `confirmation`: `undefined` \| [`PendingTransactionResponse`](../interfaces/algod_type.PendingTransactionResponse.md) ; `groupTransactionId`: `string` = txId }\>

An object with group transaction ID (`groupTransactionId`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

#### Defined in

[transaction.ts:219](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L219)

___

### sendTransaction

▸ **sendTransaction**(`algod`, `transaction`, `from`, `sendParams?`): `Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

Signs and sends the given transaction to the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `default` | An algod client |
| `transaction` | `Transaction` | The unsigned transaction |
| `from` | [`SendTransactionFrom`](transaction.md#sendtransactionfrom) | The account to sign the transaction with: either an account with private key loaded or a logic signature account |
| `sendParams?` | [`SendTransactionParams`](../interfaces/transaction.SendTransactionParams.md) | - |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

An object with transaction (`transaction`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

#### Defined in

[transaction.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L167)

___

### waitForConfirmation

▸ **waitForConfirmation**(`algod`, `transactionId`, `timeout`): `Promise`<[`PendingTransactionResponse`](../interfaces/algod_type.PendingTransactionResponse.md)\>

Wait until the transaction is confirmed or rejected, or until `timeout`
number of rounds have passed.

**`Throws`**

Throws an error if the transaction is not confirmed or rejected in the next `timeout` rounds

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `algod` | `default` | An algod client |
| `transactionId` | `string` | The transaction ID to wait for |
| `timeout` | `number` | Maximum number of rounds to wait |

#### Returns

`Promise`<[`PendingTransactionResponse`](../interfaces/algod_type.PendingTransactionResponse.md)\>

Pending transaction information

#### Defined in

[transaction.ts:277](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L277)
