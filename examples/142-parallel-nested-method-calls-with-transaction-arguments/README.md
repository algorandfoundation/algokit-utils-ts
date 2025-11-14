# Parallel Nested Method Calls with Transaction Arguments

This example demonstrates how to compose a method with **multiple nested method calls in parallel**, each with their own transaction arguments. This pattern enables complex multi-step operations that need to execute atomically within a single transaction group.

## Overview

Building on single nested method calls (Example 141), this example shows how a parent method can accept **multiple method call arguments simultaneously**, where each nested call has its own transaction argument. This is the foundation for advanced DeFi protocols, batch operations, and multi-party verification systems.

## What You'll Learn

- Parallel method composition with multiple nested calls
- Parent methods accepting multiple `appl` (method call) arguments
- Each nested call having its own transaction argument
- Transaction group composition for parallel operations
- Use of `undefined` placeholders for multiple transaction arguments
- Advanced patterns for complex dApp workflows

## Key Concepts

### Parallel Method Composition

Unlike serial nesting (one call inside another), parallel composition means multiple independent method calls are passed as separate arguments to a parent method:

```typescript
// Serial (Example 141):
parent(methodCall)
  └─ methodCall has transaction arg

// Parallel (This Example):
parent(methodCall1, methodCall2)
  ├─ methodCall1 has transaction arg
  └─ methodCall2 has transaction arg
```

### Method Signature with Multiple Call Arguments

The parent method accepts multiple method calls and their associated transactions:

```typescript
{
  name: 'doubleNestedTxnArg',
  args: [
    { type: 'pay', name: 'txn0' },     // Payment for call1
    { type: 'appl', name: 'call1' },   // First method call
    { type: 'pay', name: 'txn2' },     // Payment for call3
    { type: 'appl', name: 'call3' },   // Second method call
  ],
  returns: { type: 'uint64' },
}
```

### Transaction Group Structure

When you call the parent method, the composer builds a 5-transaction group:

```
Transaction Group:
[0] Payment (for call1's transaction argument)
[1] App call (call1 - txnArg method)
[2] Payment (for call3's transaction argument)
[3] App call (call3 - txnArg method)
[4] App call (parent - doubleNestedTxnArg method)
```

Each transaction references earlier transactions in the group by index.

### Placeholder Arguments

Use `undefined` for payment arguments that come from nested calls:

```typescript
args: [
  undefined,       // txn0 - payment from firstTxnCall
  firstTxnCall,    // call1 - app call with payment
  undefined,       // txn2 - payment from secondTxnCall
  secondTxnCall,   // call3 - app call with payment
]
```

## Example Walkthrough

### Step 1: Deploy Contract with Parallel Method Support

The contract needs a method that accepts multiple method call arguments:

```teal
// doubleNestedTxnArg expects 4 transaction arguments:
// - Payment at index-4 (txn0)
// - App call at index-3 (call1)
// - Payment at index-2 (txn2)
// - App call at index-1 (call3)

abi_route_doubleNestedTxnArg:
byte 0x151f7c75

// Verify call1 exists and is an app call
txn GroupIndex
int 1
-
dup
gtxns TypeEnum
int appl
==
assert

// Verify txn2 exists and is a payment
txn GroupIndex
int 2
-
dup
gtxns TypeEnum
int pay
==
assert

// Verify call3 exists and is an app call
txn GroupIndex
int 3
-
dup
gtxns TypeEnum
int appl
==
assert

// Verify txn0 exists and is a payment
txn GroupIndex
int 4
-
dup
gtxns TypeEnum
int pay
==
assert

callsub doubleNestedTxnArg
itob
concat
log
int 1
return
```

### Step 2: Create First Nested Method Call

```typescript
const firstTxnCall: AppCallMethodCall = {
  sender: deployer.addr,
  appId: appId,
  method: txnArgMethod,
  args: [
    algorand.createTransaction.payment({
      sender: deployer.addr,
      receiver: deployer.addr,
      amount: (0).microAlgo(),
    }),
  ],
}
```

This creates a method call to `txnArg(pay)address` with a 0 microAlgo payment.

### Step 3: Create Second Nested Method Call

```typescript
const secondTxnCall: AppCallMethodCall = {
  sender: deployer.addr,
  appId: appId,
  method: txnArgMethod,
  args: [
    algorand.createTransaction.payment({
      sender: deployer.addr,
      receiver: deployer.addr,
      amount: (1).microAlgo(),
    }),
  ],
  note: new Uint8Array([1]), // Differentiate from first call
}
```

This creates a second method call with a 1 microAlgo payment and a custom note to differentiate it.

### Step 4: Call Parent Method with Both Nested Calls

```typescript
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: appId,
    method: doubleNestedTxnArgMethod,
    args: [undefined, firstTxnCall, undefined, secondTxnCall],
  })
  .send()
```

**What happens:**
1. Composer extracts the payment from `firstTxnCall`
2. Composer extracts the payment from `secondTxnCall`
3. Composer builds a 5-transaction group in the correct order
4. All transactions are signed and sent atomically

**Result:**
- 3 return values: one from each method call
- All transactions succeed or all fail
- Automatic transaction ordering and reference management

## Running the Example

### Prerequisites

```bash
# Start LocalNet
algokit localnet start

# Verify algod is running
curl http://localhost:4001/versions

# Install dependencies
npm install
```

### Execute

```bash
npm start
```

### Expected Output

```
=== Parallel Nested Method Calls with Transaction Arguments ===

Using deployer account: F2T4H...

=== STEP 1: Deploying Test Contract ===

Deploying test contract...
✅ Test contract deployed with ID: 1106

=== STEP 2: Defining ABI Methods ===

ABI Methods defined:
  - txnArg(pay)address: Takes a payment transaction, returns sender
  - doubleNestedTxnArg(pay,appl,pay,appl)uint64:
    Takes 2 payment transactions and 2 app calls, returns app ID

=== STEP 3: Creating First Nested Method Call ===

✅ First nested call configured:
   Method: txnArg(pay)address
   Payment amount: 0 microAlgos

=== STEP 4: Creating Second Nested Method Call ===

✅ Second nested call configured:
   Method: txnArg(pay)address
   Payment amount: 1 microAlgo
   Note: [1] (to differentiate)

=== STEP 5: Calling Parent Method with Parallel Nested Calls ===

✅ Transaction group sent successfully!

Transaction IDs: [5 transaction IDs]

Return values from the transaction group:
  1. First txnArg call returned: F2T4H...
  2. Second txnArg call returned: F2T4H...
  3. doubleNestedTxnArg call returned: 1106

=== STEP 6: Transaction Group Analysis ===

Transaction group structure:
  Total transactions: 5
  Order of execution:
    [0] Payment (0 µA) - txn0 for call1
    [1] App call txnArg - call1 (uses txn [0])
    [2] Payment (1 µA) - txn2 for call3
    [3] App call txnArg - call3 (uses txn [2])
    [4] App call doubleNestedTxnArg - parent (uses all previous txns)

✨ Example completed successfully!
```

## Common Use Cases

### 1. Multi-Party Escrow with Dual Verification

```typescript
// Verify deposits from two parties
const buyerDepositCall: AppCallMethodCall = {
  sender: buyer.addr,
  appId: escrowAppId,
  method: verifyDepositMethod,
  args: [
    algorand.createTransaction.payment({
      sender: buyer.addr,
      receiver: escrowAddr,
      amount: buyerAmount,
    }),
  ],
}

const sellerDepositCall: AppCallMethodCall = {
  sender: seller.addr,
  appId: escrowAppId,
  method: verifyDepositMethod,
  args: [
    algorand.createTransaction.payment({
      sender: seller.addr,
      receiver: escrowAddr,
      amount: sellerAmount,
    }),
  ],
}

// Execute escrow with both deposits
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: escrowOperator.addr,
    appId: escrowAppId,
    method: executeEscrowMethod,
    args: [undefined, buyerDepositCall, undefined, sellerDepositCall],
  })
  .send()
```

### 2. DEX with Dual Asset Swap

```typescript
// Verify both asset transfers in a swap
const assetInCall: AppCallMethodCall = {
  sender: trader.addr,
  appId: dexAppId,
  method: verifyAssetInMethod,
  args: [
    algorand.createTransaction.assetTransfer({
      sender: trader.addr,
      receiver: poolAddr,
      assetId: assetInId,
      amount: amountIn,
    }),
  ],
}

const assetOutCall: AppCallMethodCall = {
  sender: poolOperator.addr,
  appId: dexAppId,
  method: verifyAssetOutMethod,
  args: [
    algorand.createTransaction.assetTransfer({
      sender: poolAddr,
      receiver: trader.addr,
      assetId: assetOutId,
      amount: amountOut,
    }),
  ],
}

// Execute atomic swap
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: trader.addr,
    appId: dexAppId,
    method: executeSwapMethod,
    args: [undefined, assetInCall, undefined, assetOutCall],
  })
  .send()
```

### 3. Lending Protocol with Dual Collateral

```typescript
// Accept collateral from two different assets
const collateral1Call: AppCallMethodCall = {
  sender: borrower.addr,
  appId: lendingAppId,
  method: verifyCollateralMethod,
  args: [
    algorand.createTransaction.assetTransfer({
      sender: borrower.addr,
      receiver: collateralAddr,
      assetId: collateralAsset1,
      amount: collateral1Amount,
    }),
  ],
}

const collateral2Call: AppCallMethodCall = {
  sender: borrower.addr,
  appId: lendingAppId,
  method: verifyCollateralMethod,
  args: [
    algorand.createTransaction.assetTransfer({
      sender: borrower.addr,
      receiver: collateralAddr,
      assetId: collateralAsset2,
      amount: collateral2Amount,
    }),
  ],
}

// Execute borrow with dual collateral
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: borrower.addr,
    appId: lendingAppId,
    method: borrowWithDualCollateralMethod,
    args: [borrowAmount, collateral1Call, undefined, collateral2Call],
  })
  .send()
```

### 4. Batch Payment Processing

```typescript
// Process multiple payments atomically
const payment1Call: AppCallMethodCall = {
  sender: payer.addr,
  appId: paymentProcessorId,
  method: verifyPaymentMethod,
  args: [
    algorand.createTransaction.payment({
      sender: payer.addr,
      receiver: recipient1,
      amount: amount1,
    }),
  ],
}

const payment2Call: AppCallMethodCall = {
  sender: payer.addr,
  appId: paymentProcessorId,
  method: verifyPaymentMethod,
  args: [
    algorand.createTransaction.payment({
      sender: payer.addr,
      receiver: recipient2,
      amount: amount2,
    }),
  ],
}

// Batch process both payments
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: payer.addr,
    appId: paymentProcessorId,
    method: batchProcessMethod,
    args: [undefined, payment1Call, undefined, payment2Call],
  })
  .send()
```

## Advanced Patterns

### More Than Two Parallel Calls

You can extend the pattern to handle more than two parallel calls:

```typescript
// Method accepting 3 parallel calls
{
  name: 'tripleNestedMethod',
  args: [
    { type: 'pay', name: 'txn0' },
    { type: 'appl', name: 'call1' },
    { type: 'pay', name: 'txn2' },
    { type: 'appl', name: 'call3' },
    { type: 'pay', name: 'txn4' },
    { type: 'appl', name: 'call5' },
  ],
  returns: { type: 'uint64' },
}

// Usage
args: [
  undefined, call1,
  undefined, call2,
  undefined, call3,
]
```

### Mixed Transaction Types

Parallel calls can have different transaction types:

```typescript
const paymentCall: AppCallMethodCall = {
  method: verifyPaymentMethod,
  args: [payment transaction],
  ...
}

const assetCall: AppCallMethodCall = {
  method: verifyAssetMethod,
  args: [asset transfer transaction],
  ...
}

// Parent accepts both
args: [undefined, paymentCall, undefined, assetCall]
```

### Combining Serial and Parallel Nesting

You can nest parallel compositions:

```typescript
// Inner parallel composition
const innerCall = {
  method: parallelMethod,
  args: [undefined, call1, undefined, call2],
  ...
}

// Outer method accepts the composed call
await algorand
  .newGroup()
  .addAppCallMethodCall({
    method: outerMethod,
    args: [innerCall],
  })
  .send()
```

## Best Practices

### 1. Differentiate Parallel Calls

Use different values to ensure calls are unique:

```typescript
// Good: Different amounts or notes
const call1: AppCallMethodCall = {
  args: [payment({ amount: (0).microAlgo() })],
  ...
}

const call2: AppCallMethodCall = {
  args: [payment({ amount: (1).microAlgo() })],
  note: new Uint8Array([1]),
  ...
}

// Bad: Identical calls may cause deduplication issues
const call1: AppCallMethodCall = {
  args: [payment({ amount: (0).microAlgo() })],
  ...
}

const call2: AppCallMethodCall = {
  args: [payment({ amount: (0).microAlgo() })],
  ...
}
```

### 2. Validate All Transaction Arguments in TEAL

Always verify each transaction exists and has the correct type:

```teal
// Verify all 4 transaction arguments
txn GroupIndex
int 1
-
gtxns TypeEnum
int appl
==
assert

txn GroupIndex
int 2
-
gtxns TypeEnum
int pay
==
assert

// ... validate remaining transactions
```

### 3. Use Clear Argument Names

```typescript
// Good: Descriptive names
args: [
  undefined,        // buyerPayment
  buyerDepositCall, // buyerVerification
  undefined,        // sellerPayment
  sellerDepositCall,// sellerVerification
]

// Bad: Unclear ordering
args: [undefined, call1, undefined, call2]
```

### 4. Document Transaction Group Structure

```typescript
/**
 * Executes dual collateral loan
 *
 * Transaction group structure:
 * [0] Payment - borrower to collateral pool (asset 1)
 * [1] App call - verify asset 1 collateral
 * [2] Payment - borrower to collateral pool (asset 2)
 * [3] App call - verify asset 2 collateral
 * [4] App call - execute borrow with dual collateral
 */
```

### 5. Test Each Call Independently First

```typescript
// Test first call alone
const result1 = await algorand
  .newGroup()
  .addAppCallMethodCall({
    method: verifyMethod,
    args: [payment1],
    ...
  })
  .send()

// Test second call alone
const result2 = await algorand
  .newGroup()
  .addAppCallMethodCall({
    method: verifyMethod,
    args: [payment2],
    ...
  })
  .send()

// Then test parallel composition
const resultBoth = await algorand
  .newGroup()
  .addAppCallMethodCall({
    method: parallelMethod,
    args: [undefined, call1, undefined, call2],
    ...
  })
  .send()
```

## Limitations and Considerations

### Transaction Group Size

- Maximum 16 transactions per group
- Each nested call adds 2 transactions (payment + app call)
- Parent method adds 1 transaction
- Example: 2 parallel calls = 5 transactions total

### Computational Budget

- Each app call consumes opcode budget
- Multiple parallel calls share the group budget
- Consider total computational cost

### Transaction Order Dependency

- Transaction references depend on group order
- Composer handles ordering automatically
- Manual construction is error-prone

### State Consistency

- All calls execute atomically
- Either all succeed or all fail
- Ensure state changes are consistent across all calls

## Troubleshooting

### "Transaction group failed"

**Problem**: One of the parallel calls failed

**Solution**: Test each nested call independently to isolate the issue

```typescript
// Test first call alone
try {
  await firstTxnCall.send()
} catch (e) {
  console.error('First call failed:', e)
}

// Test second call alone
try {
  await secondTxnCall.send()
} catch (e) {
  console.error('Second call failed:', e)
}
```

### "Invalid transaction reference"

**Problem**: TEAL trying to access wrong transaction index

**Solution**: Verify your TEAL matches the transaction order:

```teal
// For doubleNestedTxnArg at index 0 (end of group):
// call1 is at index-1
// txn2 is at index-2
// call3 is at index-3
// txn0 is at index-4

txn GroupIndex
int 1  // Distance to call1
-
```

### "Duplicate transaction in group"

**Problem**: Two nested calls create identical transactions

**Solution**: Add differentiating factors:

```typescript
// Add note or different amount
const call2: AppCallMethodCall = {
  ...call1,
  note: new Uint8Array([1]), // Makes it unique
}
```

### "Group size exceeds 16"

**Problem**: Too many parallel nested calls

**Solution**: Reduce the number of parallel calls or split into multiple groups

## Key Takeaways

1. **Parallel Composition**: Multiple method calls can be passed as arguments to a parent method
2. **Transaction Arguments**: Each nested call can have its own transaction argument
3. **Atomic Execution**: All transactions in the group succeed or fail together
4. **Automatic Ordering**: Composer handles transaction ordering and references
5. **Placeholder Usage**: Use `undefined` for transaction arguments from nested calls
6. **Production Ready**: Pattern used in complex DeFi protocols for multi-party operations

## Additional Resources

- [Algorand ABI Specification](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/ABI/)
- [Transaction Groups](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL Reference](https://developer.algorand.org/docs/get-details/dapps/avm/teal/)

## Related Examples

- Example 141: Nested Method Calls with Transaction Arguments
- Example 140: Multiple Layers of Nested App Calls
- Example 25: Method Calls with Transaction Args
- Example 24: Method Calls with ABI

---

This example demonstrates advanced parallel composition patterns for building complex, multi-party dApp interactions on Algorand.
