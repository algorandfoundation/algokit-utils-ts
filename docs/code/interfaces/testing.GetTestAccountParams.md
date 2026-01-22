[@algorandfoundation/algokit-utils](../README.md) / [testing](../modules/testing.md) / GetTestAccountParams

# Interface: GetTestAccountParams

[testing](../modules/testing.md).GetTestAccountParams

Parameters for the `getTestAccount` function.

## Table of contents

### Properties

- [accountGetter](testing.GetTestAccountParams.md#accountgetter)
- [initialFunds](testing.GetTestAccountParams.md#initialfunds)
- [suppressLog](testing.GetTestAccountParams.md#suppresslog)

## Properties

### accountGetter

• `Optional` **accountGetter**: (`algorand`: [`AlgorandClient`](../classes/index.AlgorandClient.md)) => `Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

Optional override for how to get a test account; this allows you to retrieve accounts from a known or cached list of accounts.

#### Type declaration

▸ (`algorand`): `Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `algorand` | [`AlgorandClient`](../classes/index.AlgorandClient.md) |

##### Returns

`Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

#### Defined in

[src/testing/types.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L51)

___

### initialFunds

• **initialFunds**: [`AlgoAmount`](../classes/index.AlgoAmount.md)

Initial funds to ensure the account has

#### Defined in

[src/testing/types.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L47)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress the log (which includes a mnemonic) or not (default: do not suppress the log)

#### Defined in

[src/testing/types.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L49)
