# Format AlgoAmount Values as Strings

This example demonstrates how to format AlgoAmount values (microAlgos and Algos) as human-readable strings for UI display, logging, and user communication purposes.

## What This Example Shows

This example teaches you how to:
- Format AlgoAmount values as readable strings
- Work with microAlgos (µALGO) - the smallest unit
- Convert between microAlgos and Algos
- Display amounts in UI components
- Log transaction amounts with proper formatting
- Use AlgoAmount's automatic string conversion

## Why This Matters

Proper formatting of amounts is crucial for user experience and clarity:

1. **User Clarity**: Display amounts in units users understand
2. **Precision**: Show exact values without loss of precision
3. **Consistency**: Maintain consistent formatting across application
4. **Readability**: Automatic comma separators for large numbers
5. **Unit Awareness**: Clear indication of unit (µALGO)
6. **Debugging**: Easily log and debug transaction amounts

Key concepts:
- **MicroAlgos (µALGO)**: Smallest unit (1 ALGO = 1,000,000 µALGO)
- **Algos (ALGO)**: Standard unit for user-facing amounts
- **Automatic Formatting**: `toString()` called automatically when converting to string
- **Comma Separators**: Large numbers formatted with commas
- **Unit Suffix**: Amounts automatically include µALGO suffix

Common use cases:
- **Transaction Logging**: Display transaction amounts in logs
- **UI Display**: Show balances and amounts to users
- **Error Messages**: Include amounts in error descriptions
- **Debugging**: Print amounts during development
- **Reports**: Generate formatted reports with amounts

## How It Works

### 1. Format Tiny Amounts (MicroAlgos)

Format small amounts in microAlgos:

```typescript
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'

const oneMicroAlgo = AlgoAmount.MicroAlgos(1)
console.log(`Amount: ${oneMicroAlgo}`)
// Output: "Amount: 1 µALGO"

const hundredMicroAlgos = AlgoAmount.MicroAlgos(100)
console.log(`Amount: ${hundredMicroAlgos}`)
// Output: "Amount: 100 µALGO"
```

MicroAlgo formatting:
- Displays exact microAlgo value
- Includes µALGO suffix automatically
- No decimal places for whole numbers
- Best for small amounts

### 2. Format Standard Algo Amounts

Format larger amounts in Algos:

```typescript
const oneAlgo = AlgoAmount.Algos(1)
console.log(`Amount: ${oneAlgo}`)
// Output: "Amount: 1,000,000 µALGO"

const tenAlgos = AlgoAmount.Algos(10)
console.log(`Amount: ${tenAlgos}`)
// Output: "Amount: 10,000,000 µALGO"
```

Algo formatting:
- Converts to microAlgos internally
- Displays with comma separators
- Shows full precision
- Includes µALGO suffix

### 3. Format Fractional Algos

Handle decimal Algo amounts:

```typescript
const halfAlgo = AlgoAmount.Algos(0.5)
console.log(`Amount: ${halfAlgo}`)
// Output: "Amount: 500,000 µALGO"

const quarterAlgo = AlgoAmount.Algos(0.25)
console.log(`Amount: ${quarterAlgo}`)
// Output: "Amount: 250,000 µALGO"
```

Fractional handling:
- Precise conversion to microAlgos
- No rounding errors
- Full precision maintained
- Comma separators for readability

### 4. Convert Between Units

Access different unit representations:

```typescript
const amount = AlgoAmount.Algos(5)

console.log(`5 ALGO equals:`)
console.log(`  - ${amount.microAlgos} microAlgos`)    // 5000000
console.log(`  - ${amount.algos} Algos`)              // 5
console.log(`  - String: ${amount}`)                  // "5,000,000 µALGO"
```

Unit access:
- `amount.microAlgos`: Get microAlgo value as number
- `amount.algos`: Get Algo value as number
- `amount.toString()`: Get formatted string
- Automatic conversion between units

### 5. Practical Use Cases

Log transaction amounts:

```typescript
function logTransaction(sender: string, receiver: string, amount: AlgoAmount) {
  console.log(`Transaction: ${sender} -> ${receiver}`)
  console.log(`Amount: ${amount}`) // Automatically formatted!
}

logTransaction(
  'SENDER123...',
  'RECEIVER456...',
  AlgoAmount.MicroAlgos(1000)
)
// Output:
// Transaction: SENDER123... -> RECEIVER456...
// Amount: 1,000 µALGO
```

Display balance in UI:

```typescript
function displayBalance(address: string, balance: AlgoAmount) {
  return `Account ${address} has a balance of ${balance}`
}

const message = displayBalance(
  'ACCOUNT789...',
  AlgoAmount.Algos(42.5)
)
console.log(message)
// Output: "Account ACCOUNT789... has a balance of 42,500,000 µALGO"
```

## Prerequisites

- Node.js and npm installed
- No special setup required

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
=== Formatting AlgoAmount Values ===

1 microAlgo formatted: 1 µALGO
100 microAlgos formatted: 100 µALGO
1 milliAlgo (1,000 µALGO) formatted: 1,000 µALGO
10 milliAlgos (10,000 µALGO) formatted: 10,000 µALGO

1 Algo formatted: 1,000,000 µALGO
10 Algos formatted: 10,000,000 µALGO

0.5 Algos formatted: 500,000 µALGO

=== Converting Between Units ===

5 ALGO equals:
  - 5000000 microAlgos
  - 5 Algos
  - String representation: 5,000,000 µALGO

=== Practical Use Cases ===

Transaction: SENDER123... -> RECEIVER456...
Amount: 1,000 µALGO

Account ACCOUNT789... has a balance of 42,500,000 µALGO
```

## Common Patterns

### Format Transaction Fee

```typescript
const fee = AlgoAmount.MicroAlgos(1000)
console.log(`Transaction fee: ${fee}`)
// Output: "Transaction fee: 1,000 µALGO"
```

### Display Account Balance

```typescript
const balance = AlgoAmount.Algos(150.5)
console.log(`Your balance: ${balance}`)
// Output: "Your balance: 150,500,000 µALGO"
```

### Show Minimum Balance

```typescript
const minBalance = AlgoAmount.MicroAlgos(100000)
console.log(`Minimum balance required: ${minBalance}`)
// Output: "Minimum balance required: 100,000 µALGO"
```

### Log Payment Amount

```typescript
function logPayment(amount: AlgoAmount) {
  console.log(`Processing payment of ${amount}`)
}

logPayment(AlgoAmount.Algos(10))
// Output: "Processing payment of 10,000,000 µALGO"
```

### Format Error Messages

```typescript
function insufficientFunds(required: AlgoAmount, available: AlgoAmount) {
  throw new Error(
    `Insufficient funds: need ${required}, have ${available}`
  )
}

try {
  insufficientFunds(
    AlgoAmount.Algos(5),
    AlgoAmount.Algos(3)
  )
} catch (error) {
  console.log(error.message)
  // Output: "Insufficient funds: need 5,000,000 µALGO, have 3,000,000 µALGO"
}
```

### Display Asset Transfer

```typescript
function showTransfer(from: string, to: string, amount: AlgoAmount) {
  return `Transfer ${amount} from ${from} to ${to}`
}

console.log(showTransfer(
  'Alice',
  'Bob',
  AlgoAmount.MicroAlgos(500000)
))
// Output: "Transfer 500,000 µALGO from Alice to Bob"
```

### Format Transaction Summary

```typescript
interface TransactionSummary {
  amount: AlgoAmount
  fee: AlgoAmount
}

function summarize(tx: TransactionSummary): string {
  const total = AlgoAmount.MicroAlgos(
    tx.amount.microAlgos + tx.fee.microAlgos
  )
  return `Amount: ${tx.amount}, Fee: ${tx.fee}, Total: ${total}`
}

console.log(summarize({
  amount: AlgoAmount.Algos(1),
  fee: AlgoAmount.MicroAlgos(1000)
}))
// Output: "Amount: 1,000,000 µALGO, Fee: 1,000 µALGO, Total: 1,001,000 µALGO"
```

## Best Practices

1. **Always Use AlgoAmount for Currency Values**
   ```typescript
   // Good: Type-safe and properly formatted
   const amount = AlgoAmount.Algos(5)
   console.log(`Amount: ${amount}`)

   // Avoid: Raw numbers lose context
   const rawAmount = 5000000
   console.log(`Amount: ${rawAmount}`) // No units, unclear
   ```

2. **Let Automatic Formatting Handle Display**
   ```typescript
   // Good: Let AlgoAmount handle formatting
   const balance = AlgoAmount.Algos(42)
   console.log(`Balance: ${balance}`)

   // Avoid: Manual formatting prone to errors
   console.log(`Balance: ${balance.microAlgos} microAlgos`)
   ```

3. **Use Algos for User Input, MicroAlgos Internally**
   ```typescript
   // Good: Accept user input in Algos
   function sendPayment(algoAmount: number) {
     const amount = AlgoAmount.Algos(algoAmount)
     // Internal operations use microAlgos
     const fee = AlgoAmount.MicroAlgos(1000)
     console.log(`Sending ${amount} with fee ${fee}`)
   }

   sendPayment(5) // User provides 5 ALGO
   ```

4. **Include Amounts in Log Messages**
   ```typescript
   // Good: Formatted amounts in logs
   function processTransaction(amount: AlgoAmount) {
     console.log(`Processing transaction for ${amount}`)
     // ... transaction logic
     console.log(`Transaction completed: ${amount}`)
   }
   ```

5. **Format Error Messages with Amounts**
   ```typescript
   // Good: Clear error messages with formatted amounts
   function validatePayment(amount: AlgoAmount, balance: AlgoAmount) {
     if (amount.microAlgos > balance.microAlgos) {
       throw new Error(
         `Insufficient balance: attempting to send ${amount} ` +
         `but only have ${balance}`
       )
     }
   }
   ```

## Key Takeaways

- Use `AlgoAmount.MicroAlgos()` for small amounts
- Use `AlgoAmount.Algos()` for user-facing amounts
- Automatic string conversion via `toString()` or template literals
- Formatted with comma separators for readability
- Includes µALGO suffix automatically
- Access `.microAlgos` for numeric microAlgo value
- Access `.algos` for numeric Algo value
- No manual formatting needed - let AlgoAmount handle it
- Maintains full precision without rounding errors
- Ideal for logging, UI display, and error messages

This example demonstrates essential amount formatting patterns for building user-friendly Algorand applications with clear, consistent currency display.
