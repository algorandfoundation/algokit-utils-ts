[@algorandfoundation/algokit-utils](../README.md) / types/app-manager

# Module: types/app-manager

## Table of contents

### References

- [ABIReturn](types_app_manager.md#abireturn)
- [AppState](types_app_manager.md#appstate)
- [BoxName](types_app_manager.md#boxname)
- [CompiledTeal](types_app_manager.md#compiledteal)

### Classes

- [AppManager](../classes/types_app_manager.AppManager.md)

### Interfaces

- [AppInformation](../interfaces/types_app_manager.AppInformation.md)
- [BoxReference](../interfaces/types_app_manager.BoxReference.md)
- [BoxValueRequestParams](../interfaces/types_app_manager.BoxValueRequestParams.md)
- [BoxValuesRequestParams](../interfaces/types_app_manager.BoxValuesRequestParams.md)

### Type Aliases

- [BoxIdentifier](types_app_manager.md#boxidentifier)

## References

### ABIReturn

Re-exports [ABIReturn](types_app.md#abireturn)

___

### AppState

Re-exports [AppState](../interfaces/types_app.AppState.md)

___

### BoxName

Re-exports [BoxName](../interfaces/types_app.BoxName.md)

___

### CompiledTeal

Re-exports [CompiledTeal](../interfaces/types_app.CompiledTeal.md)

## Type Aliases

### BoxIdentifier

Ƭ **BoxIdentifier**: `string` \| `Uint8Array` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

Something that identifies an app box name - either a:
 * `Uint8Array` (the actual binary of the box name)
 * `string` (that will be encoded to a `Uint8Array`)
 * `TransactionSignerAccount` (that will be encoded into the
   public key address of the corresponding account)

#### Defined in

[src/types/app-manager.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L50)
