[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / isLocalNet

# Function: ~~isLocalNet()~~

> **isLocalNet**(`algod`): `Promise`\<`boolean`\>

Defined in: [src/localnet/is-localnet.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/localnet/is-localnet.ts#L9)

## Parameters

### algod

`AlgodClient`

## Returns

`Promise`\<`boolean`\>

## Deprecated

Use `await algorand.client.isLocalNet()` or `await new ClientManager({ algod }).isLocalNet()` instead.

Returns true if the algod client is pointing to a LocalNet Algorand network
