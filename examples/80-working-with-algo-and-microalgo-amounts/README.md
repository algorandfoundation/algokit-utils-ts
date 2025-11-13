# Working with ALGO and MicroAlgo Amounts

This example demonstrates how to create and convert between ALGO and microAlgo amounts using AlgoKit Utils' amount helper functions. Understanding amount handling is essential for displaying user-friendly values and working with transaction amounts.

## Overview

On the Algorand blockchain, the base unit is **microAlgos (µALGO)**, where:
- **1 ALGO = 1,000,000 microAlgos**
- All on-chain amounts are stored in microAlgos
- User-facing applications typically display amounts in ALGO

AlgoKit Utils provides helper functions to:
- Create amounts in either unit (`algo()` or `microAlgo()`)
- Convert between units using `.algo` and `.microAlgos` properties
- Ensure type-safe amount handling throughout your application

## Key Concepts

### Amount Helper Functions

AlgoKit Utils provides two functions for creating amounts:

1. **`algo(value)`** - Creates an amount from ALGO units
   ```typescript
   const amount = algo(100)  // 100 ALGO
   ```

2. **`microAlgo(value)`** - Creates an amount from microAlgo units
   ```typescript
   const amount = microAlgo(1_000_000)  // 1,000,000 µALGO = 1 ALGO
   ```

### Amount Properties

Both functions return an `AlgoAmount` object with two properties:

1. **`.algo`** - Returns the amount in ALGO units (as a number)
   ```typescript
   const amount = microAlgo(5_500_000)
   console.log(amount.algo)  // 5.5
   ```

2. **`.microAlgos`** - Returns the amount in microAlgo units (as a bigint)
   ```typescript
   const amount = algo(5.5)
   console.log(amount.microAlgos)  // 5500000n
   ```

### Conversion Factor

The conversion between units follows this formula:
- **ALGO to microAlgos**: `microAlgos = ALGO × 1,000,000`
- **microAlgos to ALGO**: `ALGO = microAlgos ÷ 1,000,000`

### Type Safety

AlgoKit Utils uses the `AlgoAmount` type to ensure amounts are properly handled:
- Prevents mixing raw numbers with amount objects
- Provides consistent API across all transaction functions
- Catches amount-related bugs at compile time

## Code Examples

### Example 1: Creating Amounts in ALGO

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

// Create amount in ALGO
const amount = algo(100)

// Access in ALGO (identity conversion)
console.log(amount.algo)  // 100

// Access in microAlgos (converted)
console.log(amount.microAlgos)  // 100000000n
```

### Example 2: Creating Amounts in MicroAlgos

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

// Create amount in microAlgos
const amount = microAlgo(1_000_000)

// Access in microAlgos (identity)
console.log(amount.microAlgos)  // 1000000n

// Access in ALGO (converted)
console.log(amount.algo)  // 1
```

### Example 3: Small Amount Conversions

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

// Transaction fees are typically small amounts
const minFee = microAlgo(1000)

console.log(`Fee: ${minFee.microAlgos} µALGO`)  // Fee: 1000n µALGO
console.log(`Fee: ${minFee.algo} ALGO`)         // Fee: 0.001 ALGO

// This is useful for displaying fees in a user-friendly format
```

### Example 4: Large Amount Conversions

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

// Large amounts like total supply
const totalSupply = microAlgo(10_000_000_000_000)

console.log(`Supply: ${totalSupply.microAlgos} µALGO`)  // Supply: 10000000000000n µALGO
console.log(`Supply: ${totalSupply.algo} ALGO`)         // Supply: 10000000 ALGO
```

### Example 5: Using Amounts in Transactions

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
const sender = await algorand.account.fromEnvironment('MY_ACCOUNT')

// Send payment with amount in ALGO
await algorand.send.payment({
  sender: sender.addr,
  receiver: 'RECEIVER_ADDRESS',
  amount: algo(10),  // 10 ALGO
})

// Or with amount in microAlgos
await algorand.send.payment({
  sender: sender.addr,
  receiver: 'RECEIVER_ADDRESS',
  amount: microAlgo(10_000_000),  // 10 ALGO
})
```

### Example 6: Displaying Account Balances

```typescript
import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
const account = await algorand.account.fromEnvironment('MY_ACCOUNT')

// Get account information
const accountInfo = await algorand.account.getInformation(account.addr)

// The balance is returned in microAlgos
const balance = microAlgo(accountInfo.balance)

// Display in user-friendly format
console.log(`Balance: ${balance.algo.toFixed(6)} ALGO`)
console.log(`Balance: ${balance.microAlgos} µALGO`)
```

### Example 7: Calculating with Amounts

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

// When doing calculations, work with the same unit
const price = algo(5)
const quantity = 10
const total = microAlgo(price.microAlgos * BigInt(quantity))

console.log(`Price: ${price.algo} ALGO`)
console.log(`Quantity: ${quantity}`)
console.log(`Total: ${total.algo} ALGO`)  // 50 ALGO
```

### Example 8: Fractional ALGO Amounts

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

// ALGO supports up to 6 decimal places
const fractional = algo(0.123456)

console.log(`ALGO: ${fractional.algo}`)           // 0.123456
console.log(`microAlgos: ${fractional.microAlgos}`)  // 123456n

// Anything beyond 6 decimals is truncated
const tooManyDecimals = algo(0.1234567)
console.log(`Truncated: ${tooManyDecimals.algo}`)  // 0.123456
```

## Best Practices

### 1. Always Use Amount Helpers

**Good** - Type-safe and explicit:
```typescript
import { algo } from '@algorandfoundation/algokit-utils'

await algorand.send.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: algo(10),  // ✓ Clear and type-safe
})
```

**Avoid** - Raw numbers can be ambiguous:
```typescript
// BAD: Is this ALGO or microAlgos?
await algorand.send.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: 10,  // ✗ Ambiguous!
})
```

### 2. Use ALGO for User Input

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

// Get amount from user (typically in ALGO)
const userInput = parseFloat(prompt('Enter amount in ALGO:'))

// Convert to AlgoAmount
const amount = algo(userInput)

// Use in transaction
await algorand.send.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount,  // Type-safe and correct
})
```

### 3. Use MicroAlgos for Protocol Values

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

// Protocol values are in microAlgos
const minBalance = microAlgo(100_000)  // Minimum account balance
const minFee = microAlgo(1_000)        // Minimum transaction fee
const assetMinBalance = microAlgo(100_000)  // Asset opt-in cost

// Display to user in ALGO
console.log(`Minimum balance: ${minBalance.algo} ALGO`)
console.log(`Minimum fee: ${minFee.algo} ALGO`)
```

### 4. Format Amounts for Display

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

function formatAlgoAmount(microAlgos: bigint): string {
  const amount = microAlgo(microAlgos)

  // Format with appropriate precision
  if (amount.algo >= 1) {
    return `${amount.algo.toFixed(2)} ALGO`
  } else {
    return `${amount.algo.toFixed(6)} ALGO`
  }
}

// Usage
const balance = 1234567890n
console.log(formatAlgoAmount(balance))  // "1234.57 ALGO"

const fee = 1000n
console.log(formatAlgoAmount(fee))  // "0.001000 ALGO"
```

### 5. Handle Edge Cases

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

// Zero amounts
const zero = algo(0)
console.log(zero.microAlgos)  // 0n

// Very small amounts
const dust = microAlgo(1)
console.log(dust.algo)  // 0.000001

// Very large amounts
const large = microAlgo(Number.MAX_SAFE_INTEGER)
console.log(large.algo)  // 9007199254.740991

// Note: For amounts larger than Number.MAX_SAFE_INTEGER,
// use BigInt directly with microAlgo()
const veryLarge = microAlgo(10_000_000_000_000_000n)
console.log(veryLarge.algo)  // 10000000000
```

### 6. Compare Amounts Correctly

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

const amount1 = algo(10)
const amount2 = algo(5)

// Compare using microAlgos (BigInt comparison)
if (amount1.microAlgos > amount2.microAlgos) {
  console.log('amount1 is greater')
}

// Or compare using ALGO (number comparison)
if (amount1.algo > amount2.algo) {
  console.log('amount1 is greater')
}

// For equality, use microAlgos to avoid floating-point issues
if (amount1.microAlgos === amount2.microAlgos) {
  console.log('amounts are equal')
}
```

## Common Use Cases

### 1. Transaction Fee Calculation

```typescript
import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'

async function calculateTransactionCost(
  algorand: AlgorandClient,
  numTransactions: number
) {
  const suggestedParams = await algorand.client.algod.getTransactionParams().do()

  // Fee is in microAlgos
  const feePerTxn = microAlgo(suggestedParams.fee || 1000)
  const totalFee = microAlgo(feePerTxn.microAlgos * BigInt(numTransactions))

  console.log(`Fee per transaction: ${feePerTxn.algo} ALGO`)
  console.log(`Total fee for ${numTransactions} txns: ${totalFee.algo} ALGO`)

  return totalFee
}
```

### 2. Balance Display Component

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

interface BalanceDisplayProps {
  microAlgos: bigint
  showMicroAlgos?: boolean
}

function BalanceDisplay({ microAlgos, showMicroAlgos = false }: BalanceDisplayProps) {
  const amount = microAlgo(microAlgos)

  if (showMicroAlgos) {
    return (
      <div>
        <div className="balance-algo">{amount.algo.toFixed(6)} ALGO</div>
        <div className="balance-micro">{amount.microAlgos.toLocaleString()} µALGO</div>
      </div>
    )
  }

  return <div className="balance">{amount.algo.toFixed(6)} ALGO</div>
}
```

### 3. Payment Amount Validator

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

function validatePaymentAmount(
  amountAlgo: number,
  maxAlgo: number,
  minAlgo: number = 0.001
): { valid: boolean; error?: string; amount?: AlgoAmount } {
  // Check minimum
  if (amountAlgo < minAlgo) {
    return {
      valid: false,
      error: `Amount must be at least ${minAlgo} ALGO`,
    }
  }

  // Check maximum
  if (amountAlgo > maxAlgo) {
    return {
      valid: false,
      error: `Amount cannot exceed ${maxAlgo} ALGO`,
    }
  }

  // Check precision (6 decimal places max)
  const microAlgos = Math.round(amountAlgo * 1_000_000)
  const roundedAlgo = microAlgos / 1_000_000

  if (Math.abs(roundedAlgo - amountAlgo) > 0.0000001) {
    return {
      valid: false,
      error: 'Amount has too many decimal places (max 6)',
    }
  }

  return {
    valid: true,
    amount: microAlgo(BigInt(microAlgos)),
  }
}

// Usage
const result = validatePaymentAmount(10.5, 100)
if (result.valid) {
  console.log(`Valid amount: ${result.amount!.algo} ALGO`)
} else {
  console.error(result.error)
}
```

### 4. Asset Value Calculator

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

interface AssetHolding {
  assetId: bigint
  amount: bigint
  priceInAlgo: number
}

function calculatePortfolioValue(holdings: AssetHolding[]) {
  let totalValue = 0n

  for (const holding of holdings) {
    // Convert asset amount and price to microAlgos
    const assetValue = BigInt(holding.amount) *
                      algo(holding.priceInAlgo).microAlgos /
                      BigInt(holding.amount > 0 ? holding.amount : 1)
    totalValue += assetValue
  }

  const portfolioValue = microAlgo(totalValue)

  return {
    microAlgos: portfolioValue.microAlgos,
    algo: portfolioValue.algo,
    formatted: `${portfolioValue.algo.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })} ALGO`,
  }
}
```

### 5. Savings Goal Tracker

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

interface SavingsGoal {
  targetMicroAlgos: bigint
  currentMicroAlgos: bigint
}

function trackSavingsGoal(goal: SavingsGoal) {
  const target = microAlgo(goal.targetMicroAlgos)
  const current = microAlgo(goal.currentMicroAlgos)

  const remaining = microAlgo(goal.targetMicroAlgos - goal.currentMicroAlgos)
  const percentComplete = Number(
    (goal.currentMicroAlgos * 100n) / goal.targetMicroAlgos
  )

  return {
    target: target.algo,
    current: current.algo,
    remaining: remaining.algo,
    percentComplete: percentComplete.toFixed(2),
    isComplete: goal.currentMicroAlgos >= goal.targetMicroAlgos,
  }
}

// Usage
const savings = trackSavingsGoal({
  targetMicroAlgos: 1_000_000_000n,   // 1000 ALGO goal
  currentMicroAlgos: 750_000_000n,    // 750 ALGO saved
})

console.log(`Goal: ${savings.target} ALGO`)
console.log(`Current: ${savings.current} ALGO`)
console.log(`Remaining: ${savings.remaining} ALGO`)
console.log(`Progress: ${savings.percentComplete}%`)
```

## Understanding Precision

### Decimal Precision in ALGO

ALGO supports up to **6 decimal places**:

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

// Valid precision (6 decimals)
const precise = algo(1.123456)
console.log(precise.algo)  // 1.123456
console.log(precise.microAlgos)  // 1123456n

// Beyond 6 decimals gets truncated
const tooMuch = algo(1.1234567)
console.log(tooMuch.algo)  // 1.123456 (truncated)
```

### Working with BigInt

For amounts larger than `Number.MAX_SAFE_INTEGER`, use `BigInt`:

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

// Numbers larger than 2^53 - 1 should use BigInt
const huge = microAlgo(10_000_000_000_000_000n)  // Note the 'n' suffix

console.log(huge.microAlgos)  // 10000000000000000n
console.log(huge.algo)  // 10000000000
```

### Avoiding Floating-Point Errors

When comparing amounts, use microAlgos to avoid floating-point precision issues:

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

const amount1 = algo(0.1 + 0.2)  // JavaScript: 0.30000000000000004
const amount2 = algo(0.3)

// Comparing .algo might fail due to floating-point
console.log(amount1.algo === amount2.algo)  // Might be false!

// Comparing .microAlgos is reliable (BigInt comparison)
console.log(amount1.microAlgos === amount2.microAlgos)  // Always correct
```

## Running This Example

```bash
# Install dependencies
npm install

# Run the example
npm start
```

**Expected Output**:
```
=== ALGO Amount Conversions ===

1. Identity Conversion (ALGO to ALGO):
   Created: algo(100)
   Retrieved: 100 ALGO

2. Small Amount Conversion (microAlgos to ALGO):
   Created: microAlgo(1000)
   Retrieved: 0.001 ALGO
   This shows 1000 µALGO = 0.001 ALGO

3. Large Amount Conversion (microAlgos to ALGO):
   Created: microAlgo(100_000_000)
   Retrieved: 100 ALGO
   This demonstrates: 100,000,000 µALGO = 100 ALGO

4. Understanding the Conversion Factor:
   1 ALGO = 1,000,000 microAlgos
   microAlgo(1_000_000).algo = 1 ALGO

5. Practical Example - Transaction Fee Display:
   Minimum transaction fee: 1000 µALGO
   In ALGO: 0.001 ALGO

6. Accessing Both Units:
   Amount created: algo(5.5)
   In ALGO: 5.5 ALGO
   In microAlgos: 5500000 µALGO
```

## Related Concepts

- **Payment Transactions**: [01-account-creation-and-funding](../01-account-creation-and-funding)
- **Asset Transfers**: [76-transfer-asa-between-accounts](../76-transfer-asa-between-accounts)
- **AlgorandClient**: The main client for interacting with Algorand
- **Amount Type**: Type-safe amount handling throughout AlgoKit Utils

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Developer Portal](https://developer.algorand.org/)
- [Algorand Transaction Fees](https://developer.algorand.org/docs/get-details/transactions/#fees)
