[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAccountConfigFromEnvironment

# Function: ~~getAccountConfigFromEnvironment()~~

> **getAccountConfigFromEnvironment**(`accountName`): [`AccountConfig`](../../types/account/interfaces/AccountConfig.md)

Defined in: [src/account/get-account-config-from-environment.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/get-account-config-from-environment.ts#L13)

## Parameters

### accountName

`string`

account name

## Returns

[`AccountConfig`](../../types/account/interfaces/AccountConfig.md)

## Deprecated

Use algokit.mnemonicAccountFromEnvironment, which doesn't need this function
Returns the Account configuration from environment variables

## Example

```ts
environment variables
{accountName}_MNEMONIC
{accountName}_SENDER
```
