[@algorandfoundation/algokit-utils](../README.md) / types/account

# Module: types/account

## Table of contents

### Classes

- [MultisigAccount](../classes/types_account.MultisigAccount.md)
- [SigningAccount](../classes/types_account.SigningAccount.md)

### Interfaces

- [AccountConfig](../interfaces/types_account.AccountConfig.md)
- [TransactionSignerAccount](../interfaces/types_account.TransactionSignerAccount.md)

### Type Aliases

- [AccountAssetInformation](types_account.md#accountassetinformation)
- [AccountInformation](types_account.md#accountinformation)

### Variables

- [DISPENSER\_ACCOUNT](types_account.md#dispenser_account)

## Type Aliases

### AccountAssetInformation

Ƭ **AccountAssetInformation**: `Object`

Account asset holding information at a given round.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `assetId` | `bigint` | The ID of the asset held. |
| `balance` | `bigint` | The current balance of that asset holding. |
| `frozen` | `boolean` | Whether or not the asset is frozen for the account. |
| `round` | `bigint` | The round as at which the holding was correct. |

#### Defined in

[src/types/account.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L137)

___

### AccountInformation

Ƭ **AccountInformation**: `Omit`\<`NumberConverter`\<`AccountInformationModel`\>, ``"get_obj_for_encoding"``\>

Account information at a given round.

#### Defined in

[src/types/account.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L134)

## Variables

### DISPENSER\_ACCOUNT

• `Const` **DISPENSER\_ACCOUNT**: ``"DISPENSER"``

The account name identifier used for fund dispensing in test environments

#### Defined in

[src/types/account.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/account.ts#L11)
