# Asset Opt-Out with Balance Validation

This example demonstrates **asset opt-out validation using the `ensureZeroBalance` parameter**. This safety feature prevents accidental loss of assets by blocking opt-out attempts when the account still holds the asset.

## Overview

The `ensureZeroBalance` parameter provides an extra safety check:
- **When `true`**: Validates account has zero balance before opting out
- **When `false` or omitted**: Allows opt-out (may result in asset loss if balance > 0)

### Why This Matters

Without validation, opting out with a non-zero balance permanently destroys those assets. The `ensureZeroBalance` parameter prevents this costly mistake.

## Key Patterns

### Safe Opt-Out with Validation

```typescript
// This will fail if balance > 0 (protecting your assets)
await algorand.send.assetOptOut({
  sender: account.addr,
  assetId: assetId,
  creator: creatorAddr,
  ensureZeroBalance: true, // Safety check enabled
})
```

### Checking Balance Before Opt-Out

```typescript
const accountInfo = await algorand.account.getInformation(account.addr)
const assetHolding = accountInfo.assets?.find(a => BigInt(a.assetId) === assetId)
console.log(`Balance: ${assetHolding?.amount || 0n}`)
```

## Running This Example

```bash
npm install
algokit localnet start
npm start
```

## Learn More

- [Algorand ASA Documentation](https://developer.algorand.org/docs/get-details/asa/)
- [AlgoKit Utils TypeScript Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
