# Calculate Transaction Fees

This example demonstrates how to calculate standard Algorand transaction fees for single and multiple transactions, which is essential for budgeting and fee estimation in your applications.

## What This Example Shows

This example teaches you how to:
- Use the `transactionFees()` helper function to calculate fees
- Calculate fees for single transactions
- Calculate fees for multiple transactions (useful for atomic groups)
- Understand Algorand's flat fee structure (1000 microAlgos per transaction)
- Budget for transaction costs in your application

## Why This Matters

Understanding transaction fees is crucial for application development because:

1. **Cost Budgeting**: Applications need to budget for transaction fees
2. **Atomic Groups**: Multi-transaction groups require calculating total fees
3. **User Experience**: Users need to know the cost before submitting transactions
4. **Account Balance**: Accounts must have sufficient balance to cover both transfers and fees
5. **Fee Estimation**: Helps estimate costs for complex operations

Key concepts:
- **Flat Fee Structure**: Algorand uses a flat fee of 1000 microAlgos (0.001 ALGO) per transaction
- **Predictable Costs**: Fee calculation is straightforward - multiply transactions by 1000 microAlgos
- **Atomic Groups**: Each transaction in a group requires its own fee
- **Minimum Fee**: The minimum fee is always 1000 microAlgos, regardless of transaction size

Common use cases:
- **Atomic Transaction Groups**: Calculate total fees for multi-transaction operations
- **User Interfaces**: Display estimated costs to users before they confirm
- **Smart Contracts**: Ensure accounts have sufficient balance for operations
- **Batch Operations**: Budget for multiple transactions in a workflow

## How It Works

The example demonstrates fee calculation for different scenarios:

### 1. Single Transaction Fee
```typescript
const singleTxFee = transactionFees(1)
console.log('Single transaction fee:', singleTxFee.microAlgos, 'microAlgos')
console.log('Single transaction fee:', singleTxFee.algos, 'Algos')
```

Output:
- `1000n microAlgos`
- `0.001 Algos`

Every single transaction on Algorand costs exactly 1000 microAlgos (0.001 ALGO).

### 2. Multiple Transactions (Atomic Groups)
```typescript
const tenTxFees = transactionFees(10)
console.log('Fee for 10 transactions:', tenTxFees.microAlgos, 'microAlgos')
console.log('Fee for 10 transactions:', tenTxFees.algos, 'Algos')
```

Output:
- `10000n microAlgos`
- `0.01 Algos`

For atomic transaction groups or batch operations, multiply the number of transactions by 1000 microAlgos.

### 3. Budgeting for Atomic Groups
```typescript
const atomicGroupSize = 3
const totalFees = transactionFees(atomicGroupSize)
console.log(`Total fees for atomic group of ${atomicGroupSize} transactions:`,
  totalFees.microAlgos, 'microAlgos')
```

This is particularly useful when creating atomic transaction groups where you need to ensure the sender has enough balance to cover all transaction fees.

### 4. Fee Estimation
```typescript
const estimatedTransactions = 5
const estimatedCost = transactionFees(estimatedTransactions)
console.log(`Estimated cost for ${estimatedTransactions} transactions:`,
  estimatedCost.algos, 'Algos')
```

Use this to provide users with cost estimates before they execute operations.

## How the Fee Calculation Works

The `transactionFees(n)` function:
1. Takes the number of transactions as input
2. Multiplies by 1000 microAlgos (the standard Algorand fee)
3. Returns an `AlgoAmount` object with:
   - `.microAlgos`: The fee in microAlgos (as `bigint`)
   - `.algos`: The fee in Algos (as `number`)

Formula: `fees = numberOfTransactions × 1000 microAlgos`

## Prerequisites

- Node.js and npm installed
- No blockchain connection needed (pure calculation)

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
Single transaction fee: 1000n microAlgos
Single transaction fee: 0.001 Algos

Fee for 10 transactions: 10000n microAlgos
Fee for 10 transactions: 0.01 Algos

Total fees for atomic group of 3 transactions: 3000n microAlgos

Estimated cost for 5 transactions: 0.005 Algos
```

## Key Takeaways

- Algorand uses a flat fee structure: 1000 microAlgos (0.001 ALGO) per transaction
- Use `transactionFees(n)` to calculate fees for `n` transactions
- The function returns an `AlgoAmount` object with `.microAlgos` and `.algos` properties
- Each transaction in an atomic group requires its own fee
- The fee is the same regardless of transaction size or complexity
- This calculation doesn't require a blockchain connection
- Always ensure accounts have sufficient balance to cover both the transaction amount and fees
- Fees are predictable and easy to calculate for budgeting purposes
- Use `.microAlgos` for precise BigInt calculations
- Use `.algos` for user-friendly display values
