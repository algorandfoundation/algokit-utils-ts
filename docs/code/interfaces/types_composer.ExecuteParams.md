[@algorandfoundation/algokit-utils](../README.md) / [types/composer](../modules/types_composer.md) / ExecuteParams

# Interface: ExecuteParams

[types/composer](../modules/types_composer.md).ExecuteParams

Parameters to configure transaction execution.

## Table of contents

### Properties

- [maxRoundsToWaitForConfirmation](types_composer.ExecuteParams.md#maxroundstowaitforconfirmation)
- [populateAppCallResources](types_composer.ExecuteParams.md#populateappcallresources)
- [suppressLog](types_composer.ExecuteParams.md#suppresslog)

## Properties

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The number of rounds to wait for confirmation. By default until the latest lastValid has past.

#### Defined in

[src/types/composer.ts:424](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L424)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`.

#### Defined in

[src/types/composer.ts:428](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L428)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress.

#### Defined in

[src/types/composer.ts:426](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L426)
