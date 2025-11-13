# Create AlgoAmount Using microAlgo() Function

This example demonstrates creating AlgoAmount instances using the `microAlgo()` function, which is ideal for working with precise microALGO values. This function is particularly useful when dealing with blockchain values, transaction fees, and exact calculations.

## What This Example Shows

This example teaches you how to:
- Use `microAlgo()` function to create amounts from microALGO values
- Work with precise blockchain amounts
- Calculate transaction fees accurately
- Compute minimum balance requirements
- Compare `microAlgo()` with `algo()` function
- Perform arithmetic with AlgoAmount instances
- Access both `.algos` and `.microAlgos` properties

## Why This Matters

The `microAlgo()` function is essential for precise amount handling:

1. **Precision**: Work with exact blockchain values without rounding errors
2. **Transaction Fees**: Calculate fees precisely in microALGOs
3. **Minimum Balances**: Compute account requirements accurately
4. **Blockchain Values**: Match the blockchain's native unit
5. **Mathematical Operations**: Perform exact calculations

Key concepts:
- **microAlgo()**: Creates AlgoAmount from microALGO value (e.g., `microAlgo(1000)` = 0.001 ALGO)
- **microALGO**: Algorand's smallest unit (1 ALGO = 1,000,000 microALGOs)
- **Precision**: No floating-point errors when working in microALGOs
- **AlgoAmount**: Immutable value object with automatic conversion
- **Type Safety**: Prevents unit confusion errors

Common use cases:
- **Transaction Fees**: Standard fee is 1,000 microALGOs
- **Minimum Balances**: Base minimum is 100,000 microALGOs
- **Asset Opt-ins**: Each opt-in requires 100,000 microALGOs
- **Precise Calculations**: When exact amounts matter
- **Blockchain Integration**: Working with raw blockchain values

## How It Works

The example demonstrates eight scenarios for working with `microAlgo()`:

### 1. Basic microAlgo() Usage

Create amounts from microALGO values:

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

const amount = microAlgo(100)
console.log(amount.microAlgos)  // 100
console.log(amount.algos)       // 0.0001
```

The `microAlgo()` function:
- Takes a number in microALGO units
- Returns an AlgoAmount instance
- Provides access to both ALGOs and microALGOs
- Ensures precision for exact calculations

### 2. One ALGO in microALGOs

Understand the conversion:

```typescript
const oneAlgo = microAlgo(1_000_000)
console.log(oneAlgo.microAlgos)  // 1000000
console.log(oneAlgo.algos)       // 1

// 1 ALGO = 1,000,000 microALGOs
```

This is the fundamental conversion:
- Always use 1,000,000 when converting manually
- JavaScript numeric separators make it readable
- AlgoAmount handles conversion automatically

### 3. Transaction Fees

Work with standard Algorand transaction fees:

```typescript
const txnFee = microAlgo(1000)
console.log(txnFee.microAlgos)  // 1000
console.log(txnFee.algos)       // 0.001

// Standard Algorand transaction fee is 1,000 microALGOs (0.001 ALGO)
```

Transaction fees are always specified in microALGOs:
- Minimum fee: 1,000 microALGOs
- Use `microAlgo()` for precision
- Avoid fractional ALGO calculations

### 4. Comparison with algo()

Both functions can create the same amount:

```typescript
const fromMicro = microAlgo(5_000_000)
const fromAlgo = algo(5)

console.log(fromMicro.microAlgos === fromAlgo.microAlgos)  // true
// Both represent 5 ALGOs
```

**When to use each:**
- Use `microAlgo()` when you have microALGO values
- Use `algo()` when you have ALGO values
- Both create identical AlgoAmount instances

### 5. Calculating Transaction Costs

Compute total costs with multiple transactions:

```typescript
const baseFee = microAlgo(1000)
const numTransactions = 10
const totalFee = microAlgo(Number(baseFee.microAlgos) * numTransactions)

console.log(totalFee.microAlgos)  // 10000
console.log(totalFee.algos)       // 0.01
```

Important notes:
- Convert to `Number()` before arithmetic operations
- Create new AlgoAmount for the result
- Maintains precision throughout calculation

### 6. Minimum Balance Calculation

Calculate account minimum balances:

```typescript
const baseMinBalance = microAlgo(100_000)  // 0.1 ALGO
const assetOptIn = microAlgo(100_000)      // 0.1 ALGO per asset
const numAssets = 3

const totalMinBalance = microAlgo(
  Number(baseMinBalance.microAlgos) + (Number(assetOptIn.microAlgos) * numAssets)
)

console.log(totalMinBalance.algos)       // 0.4
console.log(totalMinBalance.microAlgos)  // 400000
```

Minimum balance requirements:
- Base account: 100,000 microALGOs (0.1 ALGO)
- Each asset opt-in: +100,000 microALGOs
- Smart contract state: Additional amounts
- Box storage: Per-byte costs

### 7. AlgoAmount Properties

Access both units easily:

```typescript
const amount = microAlgo(250_000)

console.log(amount.microAlgos)  // 250000 (exact microALGOs)
console.log(amount.algos)       // 0.25 (converted to ALGOs)

// Both properties always available
```

## microAlgo() vs algo()

Understanding when to use each function:

| Aspect | microAlgo() | algo() |
|--------|------------|--------|
| Input unit | microALGOs | ALGOs |
| Best for | Fees, precise values | User amounts |
| Example | `microAlgo(1000)` | `algo(0.001)` |
| Result | 0.001 ALGO | 0.001 ALGO |
| Precision | Perfect | Floating-point |
| Use case | Blockchain values | Human-readable |

**Recommendation:**
- **Transaction fees**: Use `microAlgo(1000)` instead of `algo(0.001)`
- **User inputs**: Use `algo(10)` instead of `microAlgo(10_000_000)`
- **Minimum balances**: Use `microAlgo(100_000)` for precision
- **Display values**: Use `.algos` property for user-facing output

## Prerequisites

- Node.js and npm installed
- No network connection required (this is a standalone utility example)

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
=== Create AlgoAmount Using microAlgo() Function ===

1. Basic microAlgo() Usage
   Creating amounts from microALGO values...

   Created: microAlgo(100)
   Type: AlgoAmount
   Value in microALGOs: 100
   Value in ALGOs: 0.0001

2. One ALGO in microALGOs
   Understanding the conversion...

   Created: microAlgo(1,000,000)
   microALGOs: 1000000
   ALGOs: 1
   Note: 1 ALGO = 1,000,000 microALGOs

3. Small Precise Amounts
   Working with transaction fees...

   Created: microAlgo(50)
   microALGOs: 50
   ALGOs: 0.00005

4. Typical Transaction Fee
   Standard Algorand transaction fee...

   Created: microAlgo(1000)
   microALGOs: 1000
   ALGOs: 0.001
   Standard fee: 0.001 ALGO

5. Comparison: microAlgo() vs algo()
   Same value, different input...

   microAlgo(5,000,000):
     microALGOs: 5000000
     ALGOs: 5

   algo(5):
     microALGOs: 5000000
     ALGOs: 5

   Both equal: true

6. Practical Example: Calculating Costs
   Computing total transaction costs...

   Base fee: 1000 microALGOs (0.001 ALGOs)
   Number of transactions: 10
   Total cost: 10000 microALGOs (0.01 ALGOs)

7. Minimum Balance Calculation
   Calculating account minimum balances...

   Base minimum: 0.1 ALGO
   Per asset opt-in: 0.1 ALGO
   Number of assets: 3
   Total minimum balance: 0.4 ALGOs (400000 microALGOs)

8. AlgoAmount Properties
   Understanding the AlgoAmount class...

   Created: microAlgo(250,000)
   Type: AlgoAmount
   .microAlgos property: 250000
   .algos property: 0.25
   Both properties always available

=== Summary ===
✅ Successfully demonstrated microAlgo() function!

Key points:
  • microAlgo() creates AlgoAmount from microALGO values
  • Ideal for precise blockchain amounts
  • Perfect for transaction fees and exact calculations
  • Returns AlgoAmount with both .algos and .microAlgos
  • 1 ALGO = 1,000,000 microALGOs
  • Use for fee calculations and minimum balances

=== Key Takeaways ===
• Use microAlgo() for precise microALGO amounts
• Use algo() for human-readable ALGO amounts
• Both create the same AlgoAmount type
• Choose based on your input: microALGOs or ALGOs
• AlgoAmount handles all conversions automatically
```

## Common Patterns

### Transaction Fee Calculation

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

// Standard transaction fee
const baseFee = microAlgo(1000)

// Calculate fees for multiple transactions
const batchSize = 5
const totalFees = microAlgo(Number(baseFee.microAlgos) * batchSize)

console.log(`Total fees: ${totalFees.algos} ALGOs`)
```

### Account Minimum Balance

```typescript
// Base account minimum
const accountMin = microAlgo(100_000)

// Asset opt-ins
const assetOptIns = 5
const assetCost = microAlgo(100_000 * assetOptIns)

// Total requirement
const totalMin = microAlgo(
  Number(accountMin.microAlgos) + Number(assetCost.microAlgos)
)
```

### Smart Contract Fee Budgets

```typescript
// Application call base fee
const appCallFee = microAlgo(1000)

// Inner transaction fees (if contract sends transactions)
const innerTxns = 3
const innerFees = microAlgo(1000 * innerTxns)

// Total fee budget
const totalBudget = microAlgo(
  Number(appCallFee.microAlgos) + Number(innerFees.microAlgos)
)
```

### Payment with Fee

```typescript
import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()

await algorand.send.payment({
  sender: account.addr,
  receiver: recipientAddr,
  amount: microAlgo(500_000),  // 0.5 ALGO
  staticFee: microAlgo(2000),  // 2x standard fee
})
```

## Best Practices

1. **Use microAlgo() for Fees**
   ```typescript
   // Good: Exact fee amount
   const fee = microAlgo(1000)

   // Avoid: Floating-point issues
   const fee = algo(0.001)
   ```

2. **Convert Before Arithmetic**
   ```typescript
   // Good: Convert to Number first
   const total = microAlgo(Number(fee.microAlgos) * count)

   // Avoid: Direct BigInt arithmetic
   const total = microAlgo(fee.microAlgos * count)  // Error!
   ```

3. **Use Numeric Separators**
   ```typescript
   // Good: Easy to read
   const minBalance = microAlgo(100_000)
   const oneAlgo = microAlgo(1_000_000)

   // Avoid: Hard to parse
   const minBalance = microAlgo(100000)
   ```

4. **Choose Right Function**
   ```typescript
   // Good: Use appropriate function
   const userPayment = algo(10)        // User-facing
   const txnFee = microAlgo(1000)      // Precision-critical

   // Avoid: Wrong function for use case
   const txnFee = algo(0.001)          // Floating-point risk
   const userPayment = microAlgo(10_000_000)  // Not readable
   ```

## Key Takeaways

- Use `microAlgo()` function for precise microALGO amounts
- Ideal for transaction fees (standard: 1,000 microALGOs)
- Perfect for minimum balance calculations
- Always returns AlgoAmount with both `.algos` and `.microAlgos` properties
- 1 ALGO = 1,000,000 microALGOs (fundamental conversion)
- Convert to `Number()` before performing arithmetic operations
- Use numeric separators for readability (`100_000` vs `100000`)
- Choose `microAlgo()` for precision, `algo()` for readability
- Both functions create identical AlgoAmount instances
- Seamlessly integrates with AlgorandClient APIs
- Prevents floating-point errors in critical calculations
- Makes code explicit about working with blockchain's native unit

