[@algorandfoundation/algokit-utils](../README.md) / types/algod

# Module: types/algod

## Table of contents

### Interfaces

- [ApplicationParams](../interfaces/types_algod.ApplicationParams.md)
- [ApplicationResponse](../interfaces/types_algod.ApplicationResponse.md)
- [ApplicationStateSchema](../interfaces/types_algod.ApplicationStateSchema.md)
- [PendingTransactionResponse](../interfaces/types_algod.PendingTransactionResponse.md)

### Type Aliases

- [EvalDelta](types_algod.md#evaldelta)
- [TealValue](types_algod.md#tealvalue)

## Type Aliases

### EvalDelta

Ƭ **EvalDelta**: { `action`: ``1`` ; `bytes`: `string`  } \| { `action`: ``2`` ; `uint`: `number` \| `bigint`  }

Represents a TEAL value delta https://developer.algorand.org/docs/rest-apis/algod/v2/#evaldelta

#### Defined in

[src/types/algod.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L66)

___

### TealValue

Ƭ **TealValue**: { `bytes`: `string` ; `type`: ``1``  } \| { `type`: ``2`` ; `uint`: `number` \| `bigint`  }

Represents a TEAL value https://developer.algorand.org/docs/rest-apis/algod/v2/#tealvalue

#### Defined in

[src/types/algod.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L116)
