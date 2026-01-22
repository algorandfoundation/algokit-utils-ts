[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIReturn

# Type Alias: ABIReturn

> **ABIReturn** = \{ `decodeError`: `undefined`; `method`: [`ABIMethod`](../classes/ABIMethod.md); `rawReturnValue`: `Uint8Array`; `returnValue`: [`ABIValue`](ABIValue.md); \} \| \{ `decodeError?`: `Error`; `method`: [`ABIMethod`](../classes/ABIMethod.md); `rawReturnValue?`: `undefined`; `returnValue?`: `undefined`; \}

Defined in: [packages/abi/src/abi-method.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L46)

Represents an ABI method return value with parsed data.

## Type Declaration

\{ `decodeError`: `undefined`; `method`: [`ABIMethod`](../classes/ABIMethod.md); `rawReturnValue`: `Uint8Array`; `returnValue`: [`ABIValue`](ABIValue.md); \}

### decodeError

> **decodeError**: `undefined`

### method

> **method**: [`ABIMethod`](../classes/ABIMethod.md)

The method that was called.

### rawReturnValue

> **rawReturnValue**: `Uint8Array`

The raw return value as bytes.

This is the value from the last app call log with the first 4 bytes (the ABI return prefix) omitted.

### returnValue

> **returnValue**: [`ABIValue`](ABIValue.md)

The parsed ABI return value.

\{ `decodeError?`: `Error`; `method`: [`ABIMethod`](../classes/ABIMethod.md); `rawReturnValue?`: `undefined`; `returnValue?`: `undefined`; \}

### decodeError?

> `optional` **decodeError**: `Error`

### method

> **method**: [`ABIMethod`](../classes/ABIMethod.md)

### rawReturnValue?

> `optional` **rawReturnValue**: `undefined`

### returnValue?

> `optional` **returnValue**: `undefined`
