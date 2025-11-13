# Working with AlgoAmount: Formatting and Conversion

This example demonstrates how to work with `AlgoAmount` objects in AlgoKit Utils, including creating amounts, converting between units, formatting for display, and using amounts in calculations with BigInt precision.

## Overview

The `AlgoAmount` type in AlgoKit Utils provides a type-safe way to work with Algorand amounts. It offers:
- Automatic conversion between ALGO and microAlgo units
- Formatted string output with comma separators for readability
- BigInt-based arithmetic for precise calculations
- Type safety to prevent amount-related bugs

This example focuses on:
1. Creating amounts in microAlgos using `microAlgo()`
2. Creating amounts in ALGOs using `algo()`
3. Converting between units using `.microAlgos` and `.algo` properties
4. Formatting amounts as readable strings with `toString()`
5. Using amounts in calculations with BigInt arithmetic

## Key Concepts

### AlgoAmount Type

The `AlgoAmount` type encapsulates an amount with both representation forms:
```typescript
interface AlgoAmount {
  microAlgos: bigint   // Amount in microAlgos (base unit)
  algo: number         // Amount in ALGO (display unit)
  toString(): string   // Formatted string with comma separators
}
```

### Creating Amounts

Two helper functions create `AlgoAmount` objects:

1. **`algo(value: number)`** - Creates from ALGO units
   ```typescript
   const amount = algo(100)
   console.log(amount.microAlgos)  // 100000000n
   console.log(amount.algo)        // 100
   ```

2. **`microAlgo(value: number | bigint)`** - Creates from microAlgo units
   ```typescript
   const amount = microAlgo(100_000_000)
   console.log(amount.microAlgos)  // 100000000n
   console.log(amount.algo)        // 100
   ```

### Formatting with toString()

The `toString()` method automatically formats amounts with comma separators:
```typescript
const amount = algo(100)
console.log(amount.toString())      // "100,000,000 µALGO"
console.log(`Amount: ${amount}`)    // "Amount: 100,000,000 µALGO"
```

This formatting is applied automatically in template literals and string concatenation.

### BigInt for Precision

All microAlgo values use `BigInt` for precise integer arithmetic:
- No floating-point rounding errors
- Supports amounts larger than `Number.MAX_SAFE_INTEGER`
- Type-safe arithmetic operations

## Code Examples

### Example 1: Creating and Accessing Amounts

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

// Create from microAlgos
const small = microAlgo(100)
console.log(small.microAlgos)  // 100n
console.log(small.algo)        // 0.0001

// Create from ALGOs
const large = algo(100)
console.log(large.microAlgos)  // 100000000n
console.log(large.algo)        // 100
```

### Example 2: Formatting for Display

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

const amount = algo(1234.567890)

// Automatic formatting with comma separators
console.log(amount.toString())           // "1,234,567,890 µALGO"
console.log(`Balance: ${amount}`)        // "Balance: 1,234,567,890 µALGO"

// Access numeric values directly
console.log(`ALGO: ${amount.algo}`)                    // "ALGO: 1234.56789"
console.log(`microAlgos: ${amount.microAlgos}`)       // "microAlgos: 1234567890"
```

### Example 3: Calculations with BigInt

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

const amount1 = algo(50)
const amount2 = algo(25)

// Add using microAlgos property (BigInt arithmetic)
const sum = amount1.microAlgos + amount2.microAlgos
console.log(sum)  // 75000000n

// Subtract
const diff = amount1.microAlgos - amount2.microAlgos
console.log(diff)  // 25000000n

// Multiply (careful with units!)
const doubled = amount1.microAlgos * 2n
console.log(doubled)  // 100000000n
```

### Example 4: Converting Calculation Results Back to AlgoAmount

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

const amount1 = algo(50)
const amount2 = algo(30)

// Perform calculation
const sum = amount1.microAlgos + amount2.microAlgos

// Convert back to AlgoAmount for formatting
const result = microAlgo(sum)
console.log(`Total: ${result}`)  // "Total: 80,000,000 µALGO"
console.log(`In ALGO: ${result.algo}`)  // "In ALGO: 80"
```

### Example 5: Array of Amounts

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

const amounts = [
  algo(1),
  algo(10),
  algo(100),
  algo(1000),
  microAlgo(500),
]

// Display all amounts
amounts.forEach((amount, index) => {
  console.log(`${index + 1}. ${amount}`)
})

// Output:
// 1. 1,000,000 µALGO
// 2. 10,000,000 µALGO
// 3. 100,000,000 µALGO
// 4. 1,000,000,000 µALGO
// 5. 500 µALGO
```

### Example 6: Sum Multiple Amounts

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

const balances = [algo(10), algo(20), algo(30), algo(40)]

// Calculate total using reduce
const total = balances.reduce(
  (sum, amount) => sum + amount.microAlgos,
  0n
)

const totalAmount = microAlgo(total)
console.log(`Total balance: ${totalAmount}`)  // "Total balance: 100,000,000 µALGO"
console.log(`Total in ALGO: ${totalAmount.algo}`)  // "Total in ALGO: 100"
```

### Example 7: Percentage Calculations

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

const totalAmount = algo(1000)
const percentage = 15  // 15%

// Calculate percentage (note: divide by 100 * 100 to avoid decimals)
const percentAmount = (totalAmount.microAlgos * BigInt(percentage)) / 100n

const result = microAlgo(percentAmount)
console.log(`${percentage}% of ${totalAmount.algo} ALGO`)
console.log(`= ${result}`)  // "150,000,000 µALGO"
console.log(`= ${result.algo} ALGO`)  // "150"
```

### Example 8: Fee Calculation

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

const minFeePerTxn = microAlgo(1000)
const numTransactions = 10

// Calculate total fees
const totalFee = minFeePerTxn.microAlgos * BigInt(numTransactions)
const totalFeeAmount = microAlgo(totalFee)

console.log(`Fee per transaction: ${minFeePerTxn}`)
console.log(`Number of transactions: ${numTransactions}`)
console.log(`Total fees: ${totalFeeAmount}`)
console.log(`Total in ALGO: ${totalFeeAmount.algo}`)

// Output:
// Fee per transaction: 1,000 µALGO
// Number of transactions: 10
// Total fees: 10,000 µALGO
// Total in ALGO: 0.01
```

## Best Practices

### 1. Always Use AlgoAmount in Function Signatures

**Good** - Type-safe:
```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import type { AlgoAmount } from '@algorandfoundation/algokit-utils'

async function sendPayment(
  algorand: AlgorandClient,
  receiver: string,
  amount: AlgoAmount
) {
  await algorand.send.payment({
    sender: 'SENDER_ADDRESS',
    receiver,
    amount,  // Type-safe!
  })
}
```

**Avoid** - Ambiguous:
```typescript
// BAD: Is this ALGO or microAlgos?
async function sendPayment(
  algorand: AlgorandClient,
  receiver: string,
  amount: number
) {
  // ...
}
```

### 2. Use .microAlgos for Calculations

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

// Good - BigInt arithmetic, no precision loss
const amount1 = algo(10.5)
const amount2 = algo(5.25)
const sum = amount1.microAlgos + amount2.microAlgos  // 15750000n
const result = microAlgo(sum)

// Avoid - Floating-point arithmetic can lose precision
const sum2 = amount1.algo + amount2.algo  // 15.75 (might have rounding errors)
```

### 3. Format for User Display with toString()

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

const balance = algo(12345.67)

// Good - Formatted with comma separators
console.log(`Balance: ${balance}`)
// "Balance: 12,345,670,000 µALGO"

// Also good - Shows ALGO amount
console.log(`Balance: ${balance.algo} ALGO`)
// "Balance: 12345.67 ALGO"

// Avoid - Raw BigInt is hard to read
console.log(`Balance: ${balance.microAlgos}`)
// "Balance: 12345670000" (no separators)
```

### 4. Handle Edge Cases

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

// Zero amount
const zero = algo(0)
console.log(zero.toString())  // "0 µALGO"

// Very small amount (1 microAlgo)
const tiny = microAlgo(1)
console.log(tiny.algo)  // 0.000001

// Very large amount
const huge = microAlgo(10_000_000_000_000n)
console.log(huge.toString())  // "10,000,000,000,000 µALGO"
console.log(huge.algo)         // 10000000
```

### 5. Convert Results Back to AlgoAmount

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

function calculateInterest(
  principal: AlgoAmount,
  rate: number,
  years: number
): AlgoAmount {
  // Calculate using BigInt
  const interest = (principal.microAlgos * BigInt(rate) * BigInt(years)) / 100n

  // Convert back to AlgoAmount for type safety
  return microAlgo(interest)
}

const principal = algo(1000)
const interest = calculateInterest(principal, 5, 2)

console.log(`Principal: ${principal}`)
console.log(`Interest: ${interest}`)
console.log(`Total: ${microAlgo(principal.microAlgos + interest.microAlgos)}`)
```

### 6. Use Proper Types for Large Numbers

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

// Good - Use BigInt for large numbers
const largeAmount = microAlgo(9_007_199_254_740_991n)  // Larger than Number.MAX_SAFE_INTEGER

// Avoid - Number might lose precision
const riskyAmount = microAlgo(9007199254740991)  // At the limit, might round
```

## Common Use Cases

### 1. Display Account Balance

```typescript
import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'

async function displayBalance(algorand: AlgorandClient, address: string) {
  const accountInfo = await algorand.account.getInformation(address)

  const balance = microAlgo(accountInfo.balance)

  console.log('Account Balance:')
  console.log(`  Formatted: ${balance}`)
  console.log(`  In ALGO: ${balance.algo.toFixed(6)} ALGO`)
  console.log(`  In microAlgos: ${balance.microAlgos.toLocaleString()} µALGO`)
}
```

### 2. Calculate Total Portfolio Value

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

interface AssetBalance {
  name: string
  amount: AlgoAmount
}

function calculatePortfolio(balances: AssetBalance[]) {
  const total = balances.reduce(
    (sum, asset) => sum + asset.amount.microAlgos,
    0n
  )

  const totalAmount = microAlgo(total)

  console.log('Portfolio Summary:')
  balances.forEach(asset => {
    console.log(`  ${asset.name}: ${asset.amount}`)
  })
  console.log(`  Total: ${totalAmount}`)
  console.log(`  Total in ALGO: ${totalAmount.algo}`)

  return totalAmount
}

// Usage
const portfolio = [
  { name: 'Savings', amount: algo(1000) },
  { name: 'Trading', amount: algo(500) },
  { name: 'Staking', amount: algo(2500) },
]

calculatePortfolio(portfolio)
```

### 3. Transaction Cost Estimator

```typescript
import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import type { AlgoAmount } from '@algorandfoundation/algokit-utils'

async function estimateTransactionCost(
  algorand: AlgorandClient,
  numPayments: number,
  numAssetTransfers: number
): Promise<AlgoAmount> {
  const suggestedParams = await algorand.client.algod.getTransactionParams().do()

  const feePerTxn = microAlgo(suggestedParams.fee || 1000)
  const totalTxns = BigInt(numPayments + numAssetTransfers)

  const totalFee = feePerTxn.microAlgos * totalTxns
  const totalFeeAmount = microAlgo(totalFee)

  console.log('Transaction Cost Estimate:')
  console.log(`  Fee per transaction: ${feePerTxn}`)
  console.log(`  Number of payments: ${numPayments}`)
  console.log(`  Number of asset transfers: ${numAssetTransfers}`)
  console.log(`  Total transactions: ${totalTxns}`)
  console.log(`  Total fees: ${totalFeeAmount}`)
  console.log(`  Total in ALGO: ${totalFeeAmount.algo}`)

  return totalFeeAmount
}
```

### 4. Split Amount Among Recipients

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'
import type { AlgoAmount } from '@algorandfoundation/algokit-utils'

function splitAmount(
  totalAmount: AlgoAmount,
  numRecipients: number
): AlgoAmount[] {
  const perRecipient = totalAmount.microAlgos / BigInt(numRecipients)
  const remainder = totalAmount.microAlgos % BigInt(numRecipients)

  const splits = []

  for (let i = 0; i < numRecipients; i++) {
    // Give remainder to first recipient
    const amount = i === 0
      ? perRecipient + remainder
      : perRecipient

    splits.push(microAlgo(amount))
  }

  return splits
}

// Usage
const total = algo(100)
const splits = splitAmount(total, 3)

console.log(`Splitting ${total} among 3 recipients:`)
splits.forEach((amount, i) => {
  console.log(`  Recipient ${i + 1}: ${amount}`)
})

// Output:
// Splitting 100,000,000 µALGO among 3 recipients:
//   Recipient 1: 33,333,334 µALGO
//   Recipient 2: 33,333,333 µALGO
//   Recipient 3: 33,333,333 µALGO
```

### 5. Budget Tracker

```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'
import type { AlgoAmount } from '@algorandfoundation/algokit-utils'

interface BudgetCategory {
  name: string
  budgeted: AlgoAmount
  spent: AlgoAmount
}

function trackBudget(categories: BudgetCategory[]) {
  console.log('Budget Report:')
  console.log()

  let totalBudgeted = 0n
  let totalSpent = 0n

  categories.forEach(cat => {
    const remaining = cat.budgeted.microAlgos - cat.spent.microAlgos
    const percentUsed = Number(
      (cat.spent.microAlgos * 100n) / cat.budgeted.microAlgos
    )

    totalBudgeted += cat.budgeted.microAlgos
    totalSpent += cat.spent.microAlgos

    console.log(`${cat.name}:`)
    console.log(`  Budgeted: ${cat.budgeted}`)
    console.log(`  Spent: ${cat.spent}`)
    console.log(`  Remaining: ${microAlgo(remaining)}`)
    console.log(`  Used: ${percentUsed.toFixed(1)}%`)
    console.log()
  })

  console.log('Total:')
  console.log(`  Budgeted: ${microAlgo(totalBudgeted)}`)
  console.log(`  Spent: ${microAlgo(totalSpent)}`)
  console.log(`  Remaining: ${microAlgo(totalBudgeted - totalSpent)}`)
}

// Usage
const budget = [
  { name: 'Development', budgeted: algo(5000), spent: algo(3500) },
  { name: 'Marketing', budgeted: algo(2000), spent: algo(1200) },
  { name: 'Operations', budgeted: algo(3000), spent: algo(2800) },
]

trackBudget(budget)
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
=== Working with AlgoAmount ===

1. Creating amounts in microAlgos:
   Created: microAlgo(100)
   Value as BigInt: 100

2. Creating amounts in ALGOs and converting:
   Created: algo(100)
   Converted to microAlgos: 100000000
   (1 ALGO = 1,000,000 microAlgos)

3. Formatting amounts for display:
   Amount: algo(100)
   Formatted string: 100,000,000 µALGO
   (Automatic comma separators for readability)

4. More formatting examples:
   1. 1,000,000 µALGO
   2. 10,000,000 µALGO
   3. 1,000,000,000 µALGO
   4. 500 µALGO

5. Using amounts in calculations:
   Amount 1: 50,000,000 µALGO
   Amount 2: 25,000,000 µALGO
   Sum (in microAlgos): 75000000

=== Key Takeaways ===
• Use algo() for human-friendly ALGO units
• Use microAlgo() for precise microAlgo units
• Access .microAlgos property to get BigInt value for calculations
• toString() automatically formats with comma separators
• All values use BigInt for precise integer arithmetic
```

## Related Concepts

- **Amount Creation**: [80-working-with-algo-and-microalgo-amounts](../80-working-with-algo-and-microalgo-amounts)
- **Payment Transactions**: Using amounts in actual transactions
- **BigInt Arithmetic**: JavaScript BigInt for precise calculations
- **Type Safety**: TypeScript types for preventing amount bugs

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [JavaScript BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [Algorand Developer Portal](https://developer.algorand.org/)
