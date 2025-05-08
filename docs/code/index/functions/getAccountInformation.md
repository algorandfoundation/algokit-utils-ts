[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAccountInformation

# Function: ~~getAccountInformation()~~

> **getAccountInformation**(`sender`, `algod`): `Promise`\<[`AccountInformation`](../type-aliases/AccountInformation.md)\>

Defined in: [src/account/account.ts:156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L156)

## Parameters

### sender

The address of the sender/account to look up

`string` | [`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

### algod

`AlgodClient`

The algod instance

## Returns

`Promise`\<[`AccountInformation`](../type-aliases/AccountInformation.md)\>

The account information

## Deprecated

Use `algorand.account.getInformation(sender)` or `new AccountManager(clientManager).getInformation(sender)` instead.

Returns the given sender account's current status, balance and spendable amounts.

## Example

```typescript
const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
const accountInfo = await account.getInformation(address, algod);
```

[Response data schema details](https://dev.algorand.co/reference/rest-apis/algod/#accountinformation)
