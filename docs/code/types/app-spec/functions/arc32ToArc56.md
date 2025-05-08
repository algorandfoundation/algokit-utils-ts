[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-spec](../README.md) / arc32ToArc56

# Function: arc32ToArc56()

> **arc32ToArc56**(`appSpec`): [`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md)

Defined in: [src/types/app-spec.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L16)

Converts an ARC-32 Application Specification to an ARC-56 Contract

## Parameters

### appSpec

[`AppSpec`](../interfaces/AppSpec.md)

The ARC-32 Application Specification

## Returns

[`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md)

The ARC-56 Contract

## Example

```typescript
const arc56AppSpec = arc32ToArc56(arc32AppSpec)
```
