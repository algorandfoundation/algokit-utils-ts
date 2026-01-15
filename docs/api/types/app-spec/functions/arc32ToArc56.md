[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-spec](../README.md) / arc32ToArc56

# Function: arc32ToArc56()

> **arc32ToArc56**(`appSpec`): [`Arc56Contract`](../../../Subpaths/abi/type-aliases/Arc56Contract.md)

Defined in: [src/types/app-spec.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L20)

Converts an ARC-32 Application Specification to an ARC-56 Contract

## Parameters

### appSpec

[`AppSpec`](../interfaces/AppSpec.md)

The ARC-32 Application Specification

## Returns

[`Arc56Contract`](../../../Subpaths/abi/type-aliases/Arc56Contract.md)

The ARC-56 Contract

## Example

```typescript
const arc56AppSpec = arc32ToArc56(arc32AppSpec)
```
