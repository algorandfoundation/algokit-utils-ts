[@algorandfoundation/algokit-utils](../README.md) / [types/testing](../modules/types_testing.md) / GetTestAccountParams

# Interface: GetTestAccountParams

[types/testing](../modules/types_testing.md).GetTestAccountParams

Parameters for the `getTestAccount` function.

## Table of contents

### Properties

- [accountGetter](types_testing.GetTestAccountParams.md#accountgetter)
- [initialFunds](types_testing.GetTestAccountParams.md#initialfunds)
- [suppressLog](types_testing.GetTestAccountParams.md#suppresslog)

## Properties

### accountGetter

• `Optional` **accountGetter**: (`algorand`: [`AlgorandClient`](../classes/types_algorand_client.AlgorandClient.md)) => `Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

Optional override for how to get a test account; this allows you to retrieve accounts from a known or cached list of accounts.

#### Type declaration

▸ (`algorand`): `Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `algorand` | [`AlgorandClient`](../classes/types_algorand_client.AlgorandClient.md) |

##### Returns

`Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

#### Defined in

[src/types/testing.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L51)

___

### initialFunds

• **initialFunds**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

Initial funds to ensure the account has

#### Defined in

[src/types/testing.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L47)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress the log (which includes a mnemonic) or not (default: do not suppress the log)

#### Defined in

[src/types/testing.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L49)
