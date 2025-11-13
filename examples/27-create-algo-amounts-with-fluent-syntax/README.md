# Create Algo Amounts with Fluent Syntax

This example demonstrates how to create AlgoAmount instances using the fluent `algo()` and `microAlgo()` functions. These functions provide an intuitive and readable way to work with Algorand amounts in your applications.

## What This Example Shows

This example teaches you how to:
- Use `algo()` function to create amounts from ALGO values
- Use `microAlgo()` function to create amounts from microALGO values
- Access both `.algos` and `.microAlgos` properties on AlgoAmount instances
- Work with fractional ALGO amounts
- Convert between ALGO and microALGO units automatically
- Write more readable code using fluent syntax

## Why This Matters

Fluent amount creation is essential for readable and maintainable code:

1. **Code Readability**: `algo(10)` is more intuitive than raw numbers
2. **Type Safety**: AlgoAmount provides type-safe amount handling
3. **Unit Conversion**: Automatic conversion between ALGOs and microALGOs
4. **Error Prevention**: Reduces mistakes with units
5. **Developer Experience**: Fluent API makes code self-documenting

Key concepts:
- **algo()**: Creates AlgoAmount from ALGO value (e.g., `algo(10)` = 10 ALGOs)
- **microAlgo()**: Creates AlgoAmount from microALGO value (e.g., `microAlgo(1000000)` = 1 ALGO)
- **AlgoAmount**: Immutable value object representing an Algorand amount
- **.algos**: Property to access the amount in ALGO units
- **.microAlgos**: Property to access the amount in microALGO units

Common use cases:
- **Transaction Amounts**: Specify payment amounts clearly
- **Minimum Balances**: Define balance requirements
- **Fee Calculations**: Work with transaction fees
- **Account Funding**: Specify funding amounts
- **Smart Contract Arguments**: Pass amounts to contracts

## How It Works

The example demonstrates various ways to create and use AlgoAmount instances:

### 1. Creating Amounts with algo()

Create amounts using ALGO units:

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

const amount = algo(100)
console.log(amount.algos)        // 100
console.log(amount.microAlgos)   // 100000000
```

The `algo()` function:
- Takes a number in ALGO units
- Returns an AlgoAmount instance
- Automatically converts to microALGOs internally
- Provides access to both units

### 2. Creating Small Amounts

Work with fractional ALGO amounts:

```typescript
const smallAmount = algo(0.5)
console.log(smallAmount.algos)       // 0.5
console.log(smallAmount.microAlgos)  // 500000
```

Fractional ALGOs are useful for:
- Small payments
- Minimum balances (0.1 ALGO)
- Precise amount specifications

### 3. Creating Large Amounts

Handle large ALGO values:

```typescript
const largeAmount = algo(1_000_000)
console.log(largeAmount.algos)       // 1000000
console.log(largeAmount.microAlgos)  // 1000000000000
```

JavaScript's numeric separators (`_`) make large numbers readable.

### 4. Creating Amounts with microAlgo()

Create amounts using microALGO units:

```typescript
import { microAlgo } from '@algorandfoundation/algokit-utils'

const microAmount = microAlgo(500_000)
console.log(microAmount.algos)       // 0.5
console.log(microAmount.microAlgos)  // 500000
```

Use `microAlgo()` when:
- Working with precise amounts
- Dealing with blockchain raw values
- Need exact microALGO counts

### 5. Practical Usage

Fluent syntax improves code readability:

```typescript
// Define amounts clearly
const paymentAmount = algo(50)
const minimumBalance = algo(0.1)
const feeAmount = microAlgo(1000)

// Use in your code
console.log(`Payment: ${paymentAmount.algos} ALGOs`)
console.log(`Min balance: ${minimumBalance.algos} ALGOs`)
console.log(`Fee: ${feeAmount.microAlgos} microALGOs`)
```

### 6. Unit Conversion

AlgoAmount handles conversions automatically:

```typescript
const amount = algo(25)

// Both properties are always available
console.log(`${amount.algos} ALGOs`)           // 25 ALGOs
console.log(`${amount.microAlgos} microALGOs`) // 25000000 microALGOs

// 1 ALGO = 1,000,000 microALGOs
```

### 7. Function Equivalence

Both functions can create the same amount:

```typescript
const fromAlgo = algo(1)
const fromMicroAlgo = microAlgo(1_000_000)

console.log(fromAlgo.algos === fromMicroAlgo.algos)  // true
// Both represent 1 ALGO
```

## ALGO vs microALGO

Understanding the unit system:

### ALGO (Base Unit)
- Human-readable unit
- 1 ALGO = 1,000,000 microALGOs
- Use `algo()` for creating
- Access via `.algos` property

### microALGO (Smallest Unit)
- Blockchain's base unit
- 1 microALGO = 0.000001 ALGO
- Use `microAlgo()` for creating
- Access via `.microAlgos` property

**When to use each:**

| Use Case | Function | Example |
|----------|----------|---------|
| User-facing amounts | `algo()` | `algo(10)` |
| Transaction fees | `microAlgo()` | `microAlgo(1000)` |
| Account balances | `algo()` | `algo(100.5)` |
| Precise calculations | `microAlgo()` | `microAlgo(123456)` |
| Smart contract calls | Either | Depends on contract |

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
=== Create Algo Amounts with Fluent Syntax ===

1. Using algo() Function
   Creating amounts in ALGO units...

   Created: algo(100)
   Type: AlgoAmount
   Value in ALGOs: 100
   Value in microALGOs: 100000000

2. Small Amounts (Fractional ALGOs)
   Creating fractional ALGO amounts...

   Created: algo(0.5)
   Value in ALGOs: 0.5
   Value in microALGOs: 500000

3. Large Amounts
   Creating large ALGO amounts...

   Created: algo(1,000,000)
   Value in ALGOs: 1000000
   Value in microALGOs: 1000000000000

4. Using microAlgo() Function
   Creating amounts in microALGO units...

   Created: microAlgo(500,000)
   Value in ALGOs: 0.5
   Value in microALGOs: 500000

5. Practical Usage Examples
   Using fluent syntax for readable code...

   Payment amount: 50 ALGOs
   Minimum balance: 0.1 ALGOs
   Fee amount: 1000 microALGOs (0.001 ALGOs)

6. Unit Conversion
   AlgoAmount provides both ALGO and microALGO values...

   25 ALGOs = 25000000 microALGOs

7. Function Comparison
   algo() vs microAlgo() - same value, different input...

   algo(1):
     ALGOs: 1
     microALGOs: 1000000

   microAlgo(1,000,000):
     ALGOs: 1
     microALGOs: 1000000

   Both represent the same amount: true

=== Summary ===
✅ Successfully demonstrated AlgoAmount creation!

Key points:
  • algo() creates amounts from ALGO values
  • microAlgo() creates amounts from microALGO values
  • Both functions return AlgoAmount instances
  • Access .algos for ALGO value
  • Access .microAlgos for microALGO value
  • Fluent syntax makes code more readable

=== Key Takeaways ===
• Use algo() for human-readable amounts (e.g., algo(10))
• Use microAlgo() for precise amounts (e.g., microAlgo(1000))
• AlgoAmount handles conversions automatically
• Both .algos and .microAlgos properties are always available
```

## Common Patterns

### Payment Transactions

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()

await algorand.send.payment({
  sender: senderAddress,
  receiver: receiverAddress,
  amount: algo(10),  // Send 10 ALGOs
})
```

### Account Funding

```typescript
await algorand.account.ensureFunded(
  accountAddress,
  dispenserAddress,
  algo(100),  // Ensure account has at least 100 ALGOs
)
```

### Fee Calculation

```typescript
const baseFee = microAlgo(1000)   // 1000 microALGOs
const totalFee = microAlgo(baseFee.microAlgos * 3)  // 3x base fee

console.log(`Total fee: ${totalFee.algos} ALGOs`)
```

### Minimum Balance Requirements

```typescript
const accountMinBalance = algo(0.1)        // 0.1 ALGO
const asaOptInCost = microAlgo(100_000)    // 0.1 ALGO
const totalRequired = algo(accountMinBalance.algos + asaOptInCost.algos)
```

### Smart Contract Calls

```typescript
// Fund application account
await algorand.send.payment({
  sender: fundingAccount.addr,
  receiver: appAccount,
  amount: algo(5),  // Fund with 5 ALGOs
})
```

### Conditional Amounts

```typescript
const isPremium = true
const paymentAmount = isPremium ? algo(100) : algo(10)

await sendPayment(paymentAmount)
```

## Integration with AlgorandClient

AlgoAmount works seamlessly with AlgorandClient:

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()

// All amount parameters accept AlgoAmount
await algorand.send.payment({
  sender: account1.addr,
  receiver: account2.addr,
  amount: algo(50),  // Fluent syntax
})

// Works with account funding
await algorand.account.ensureFunded(
  account.addr,
  dispenser.addr,
  algo(10),
  {
    minFundingIncrement: algo(5)
  }
)
```

## Best Practices

1. **Use algo() for User-Facing Code**
   ```typescript
   // Good: Clear and readable
   const payment = algo(10)

   // Avoid: Requires mental conversion
   const payment = microAlgo(10_000_000)
   ```

2. **Use microAlgo() for Precise Calculations**
   ```typescript
   // Good: Exact microALGO amounts
   const fee = microAlgo(1000)

   // Avoid: Floating point issues possible
   const fee = algo(0.001)
   ```

3. **Always Access via Properties**
   ```typescript
   // Good: Type-safe access
   console.log(amount.algos)
   console.log(amount.microAlgos)

   // Avoid: Direct access to internals
   console.log(amount._value)
   ```

4. **Use Numeric Separators for Readability**
   ```typescript
   // Good: Easy to read
   const large = algo(1_000_000)
   const precise = microAlgo(123_456_789)

   // Avoid: Hard to parse
   const large = algo(1000000)
   ```

## Key Takeaways

- Use `algo()` function to create amounts from ALGO values
- Use `microAlgo()` function to create amounts from microALGO values
- Both functions return AlgoAmount instances with `.algos` and `.microAlgos` properties
- AlgoAmount handles unit conversions automatically
- Fluent syntax improves code readability and maintainability
- 1 ALGO = 1,000,000 microALGOs
- Use `algo()` for user-facing amounts, `microAlgo()` for precise calculations
- Both properties (`.algos` and `.microAlgos`) are always available on any AlgoAmount
- AlgoAmount instances are immutable value objects
- Seamlessly integrates with AlgorandClient APIs
- Reduces errors by providing type-safe amount handling
- Makes code self-documenting through clear function names

