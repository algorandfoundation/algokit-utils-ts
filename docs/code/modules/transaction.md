[@algorandfoundation/algokit-utils](../README.md) / transaction

# Module: transaction

## Table of contents

### Classes

- [MultisigAccount](../classes/transaction.MultisigAccount.md)
- [SigningAccount](../classes/transaction.SigningAccount.md)

### Interfaces

- [SendTransactionParams](../interfaces/transaction.SendTransactionParams.md)
- [SendTransactionResult](../interfaces/transaction.SendTransactionResult.md)
- [TransactionSignerAccount](../interfaces/transaction.TransactionSignerAccount.md)
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

[transaction.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L97)

___

### SendTransactionFrom

Ƭ **SendTransactionFrom**: `Account` \| [`SigningAccount`](../classes/transaction.SigningAccount.md) \| `LogicSigAccount` \| [`MultisigAccount`](../classes/transaction.MultisigAccount.md) \| [`TransactionSignerAccount`](../interfaces/transaction.TransactionSignerAccount.md)

#### Defined in

[transaction.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L154)

___

### TransactionNote

Ƭ **TransactionNote**: `Uint8Array` \| [`TransactionNoteData`](transaction.md#transactionnotedata) \| [`Arc2TransactionNote`](transaction.md#arc2transactionnote)

#### Defined in

[transaction.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L93)

___

### TransactionNoteData

Ƭ **TransactionNoteData**: `string` \| ``null`` \| `undefined` \| `number` \| `any`[] \| `Record`<`string`, `any`\>

#### Defined in

[transaction.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L95)

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

[transaction.ts:390](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L390)

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

[transaction.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L115)

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

[transaction.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L161)

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

[transaction.ts:416](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L416)

___

### sendGroupOfTransactions

▸ **sendGroupOfTransactions**(`groupSend`, `algod`): `Promise`<{ `confirmations`: `undefined` \| [`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md)[] ; `groupId`: `string` ; `txIds`: `string`[]  }\>

Signs and sends a group of [up to 16](https://developer.algorand.org/docs/get-details/atomic_transfers/#create-transactions) transactions to the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `groupSend` | `Object` | The group details to send, with: * `transactions`: The array of transactions to send along with their signing account * `sendParams`: The parameters to dictate how the group is sent |
| `groupSend.sendParams?` | `Omit`<`Omit`<[`SendTransactionParams`](../interfaces/transaction.SendTransactionParams.md), ``"maxFee"``\>, ``"skipSending"``\> | - |
| `groupSend.transactions` | [`TransactionToSign`](../interfaces/transaction.TransactionToSign.md)[] | - |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<{ `confirmations`: `undefined` \| [`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md)[] ; `groupId`: `string` ; `txIds`: `string`[]  }\>

An object with group transaction ID (`groupTransactionId`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

#### Defined in

[transaction.ts:236](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L236)

___

### sendTransaction

▸ **sendTransaction**(`send`, `algod`): `Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

Signs and sends the given transaction to the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `send` | `Object` | The details for the transaction to send, including: * `transaction`: The unsigned transaction * `from`: The account to sign the transaction with: either an account with private key loaded or a logic signature account * `config`: The sending configuration for this transaction |
| `send.from` | [`SendTransactionFrom`](transaction.md#sendtransactionfrom) | - |
| `send.sendParams?` | [`SendTransactionParams`](../interfaces/transaction.SendTransactionParams.md) | - |
| `send.transaction` | `Transaction` | - |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)\>

An object with transaction (`transaction`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

#### Defined in

[transaction.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L175)

___

### waitForConfirmation

▸ **waitForConfirmation**(`transactionId`, `maxRoundsToWait`, `algod`): `Promise`<[`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md)\>

Wait until the transaction is confirmed or rejected, or until `timeout`
number of rounds have passed.

**`Throws`**

Throws an error if the transaction is not confirmed or rejected in the next `timeout` rounds

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionId` | `string` | The transaction ID to wait for |
| `maxRoundsToWait` | `number` | Maximum number of rounds to wait |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md)\>

Pending transaction information

#### Defined in

[transaction.ts:343](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L343)
