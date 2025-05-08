[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / AccountInformation

# Type Alias: ~~AccountInformation~~

> **AccountInformation** = `Omit`\<[`NumberConverter`](NumberConverter.md)\<`AccountInformationModel`\>, `"getEncodingSchema"` \| `"toEncodingData"` \| `"authAddr"`\> & `object`

Defined in: [src/account/account.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/account/account.ts#L135)

## Type declaration

### ~~authAddr?~~

> `optional` **authAddr**: `string`

(spend) the address against which signing should be checked. If empty, the address of the current account is used. This field can be updated in any transaction by setting the RekeyTo field.

## Deprecated

Account information at a given round.
