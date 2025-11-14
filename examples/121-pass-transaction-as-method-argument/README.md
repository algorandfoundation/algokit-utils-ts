# Example 121: Pass Transaction as Method Argument

This example demonstrates how to pass a transaction as an argument to a smart contract method within a multi-transaction group, showcasing complex transaction group patterns.

## Core Concept

This example builds on [Example 120](../120-pass-transaction-as-abi-method-argument/README.md) by showing how to combine transaction arguments with additional group operations. When you pass a transaction as a method argument, the SDK:

1. Adds the referenced transaction to the group
2. Encodes the transaction reference in the method arguments
3. Positions the referenced transaction before the app call
4. Maintains the atomic nature of the entire group

Key difference from Example 120:
- **Example 120**: Simple 2-transaction group (payment + app call)
- **Example 121**: Complex multi-transaction group (multiple operations + app call with txn arg)

## What This Example Shows

This example demonstrates:

1. **Creating a multi-transaction group**: Adding multiple operations to a single group
2. **Passing transaction references**: Using a transaction as a method argument
3. **Mixing transaction types**: Combining different operations atomically
4. **Complex workflow patterns**: Multi-step processes with validation
5. **Transaction positioning**: Understanding how the SDK arranges transactions

## Transaction Group Structure

```
Group of 4 transactions:
┌─────────────────────────────────────────┐
│ [0] Payment Transaction                 │
│     Added via: .addPayment()            │
│     Purpose: First operation            │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ [1] Payment Transaction                 │
│     Added via: .addPayment()            │
│     Purpose: Second operation           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ [2] Payment Transaction                 │
│     Added via: args (auto-added by SDK) │
│     Purpose: Referenced by app call     │
│     Referenced by: Transaction [3]      │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ [3] App Call Transaction                │
│     Method: txnArg(txn)                 │
│     Args: [ref to txn 2]                │
│     Accesses: gtxn 2 properties         │
│     Returns: Sender address             │
└─────────────────────────────────────────┘
```

**Important**: When you pass a transaction as an argument, the SDK automatically adds it to the group!

## Key API Pattern

The pattern for combining transaction arguments with other operations:

```typescript
// Create the transaction to pass as an argument
const paymentTxn = await algorand.createTransaction.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: (0.005).algos(),
})

// Define the method that accepts a transaction
const method = new algosdk.ABIMethod({
  name: 'txnArg',
  args: [{ type: 'txn', name: 'payment', desc: 'Transaction reference' }],
  returns: { type: 'address', desc: 'Sender address' },
})

// Build the group with multiple operations
const result = await algorand
  .newGroup()
  .addPayment({ /* first payment */ })      // Transaction [0]
  .addPayment({ /* second payment */ })     // Transaction [1]
  .addAppCallMethodCall({                   // Transaction [3]
    method: method,
    args: [paymentTxn],  // SDK adds this as transaction [2]
  })
  .send()
```

Key points:
- Use `.addPayment()`, `.addAssetTransfer()`, etc. for explicit group transactions
- Pass transaction objects in `args` for transaction arguments
- SDK handles positioning and encoding automatically
- Access referenced transactions using `gtxn` in TEAL

## Step-by-Step Breakdown

### Step 1: Create the Transaction Argument

```typescript
const paymentTxn = await algorand.createTransaction.payment({
  sender: sender.addr,
  receiver: sender.addr,
  amount: (0).microAlgo(),
  note: new TextEncoder().encode('Payment as arg'),
})
```

### Step 2: Build Multi-Transaction Group

```typescript
const result = await algorand
  .newGroup()
  // Add explicit group transactions
  .addPayment({
    sender: sender.addr,
    receiver: sender.addr,
    amount: (0).microAlgo(),
    note: new TextEncoder().encode('First payment'),
  })
  .addPayment({
    sender: sender.addr,
    receiver: sender.addr,
    amount: (0).microAlgo(),
    note: new TextEncoder().encode('Second payment'),
  })
  // Add app call with transaction argument
  .addAppCallMethodCall({
    sender: sender.addr,
    appId: appId,
    method: txnArgMethod,
    args: [paymentTxn], // Referenced transaction (auto-added)
  })
  .send()
```

### Step 3: Access Results

```typescript
console.log('Transaction IDs:', result.txIds)
// [0] First explicit payment
// [1] Second explicit payment
// [2] Payment from args (auto-added)
// [3] App call

console.log('Return value:', result.returns?.[0]?.returnValue)
```

## Use Cases

### 1. Multi-Step Payment Workflow

User pays, system processes, contract validates:

```typescript
const userPayment = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: serviceProvider.addr,
  amount: serviceFee,
})

await algorand
  .newGroup()
  .addPayment({ /* processing fee */ })
  .addPayment({ /* service fee */ })
  .addAppCallMethodCall({
    method: validateAndProvideServiceMethod,
    args: [userPayment], // Validates this specific payment
  })
  .send()
```

### 2. Escrow with Multiple Contributors

Multiple parties contribute, contract validates all:

```typescript
const aliceContribution = await algorand.createTransaction.payment({
  sender: alice.addr,
  receiver: escrow.addr,
  amount: aliceAmount,
})

await algorand
  .newGroup()
  .addPayment({ /* Bob's contribution */ })
  .addPayment({ /* Carol's contribution */ })
  .addAppCallMethodCall({
    method: validateEscrowMethod,
    args: [aliceContribution], // Validates Alice's specific contribution
  })
  .send()
```

### 3. Complex Atomic Swap

Multi-asset swap with validation:

```typescript
const aliceAsset = await algorand.createTransaction.assetTransfer({
  sender: alice.addr,
  receiver: bob.addr,
  assetId: assetA,
  amount: 100n,
})

await algorand
  .newGroup()
  .addAssetTransfer({ /* Bob sends asset B to Alice */ })
  .addPayment({ /* Fee payment */ })
  .addAppCallMethodCall({
    method: validateSwapMethod,
    args: [aliceAsset], // Validates Alice's transfer
  })
  .send()
```

## Smart Contract Implementation

### TEAL Example

```teal
txnArg(txn)address:
// Verify group size
global GroupSize
int 4  // Expect 4 transactions
>=
assert

// The transaction argument is positioned by the SDK
// In a group of 4, if there are 2 explicit payments before the app call:
// [0] first explicit payment
// [1] second explicit payment
// [2] transaction argument (auto-added)
// [3] app call (current transaction)

// Access the referenced transaction
// The SDK encodes which transaction to reference
// For simplicity, this example accesses transaction [0]
gtxn 0 Sender

// Return the sender address
byte 0x151f7c75  // ABI return prefix
swap
concat
log
int 1
return
```

## Common Patterns

### Pattern 1: Payment Verification in Complex Workflow

```typescript
const payment = await algorand.createTransaction.payment({
  sender: payer.addr,
  receiver: app.addr,
  amount: fee,
})

await algorand
  .newGroup()
  .addPayment({ /* Step 1: Setup payment */ })
  .addAssetOptIn({ /* Step 2: Asset opt-in */ })
  .addAppCallMethodCall({
    method: verifyAndExecuteMethod,
    args: [payment], // Step 3: Verify and execute
  })
  .send()
```

### Pattern 2: Multi-Party Validation

```typescript
const partyATransaction = await algorand.createTransaction.payment({
  sender: partyA.addr,
  receiver: protocol.addr,
  amount: contribution,
})

await algorand
  .newGroup()
  .addPayment({ /* Party B contribution */ })
  .addPayment({ /* Party C contribution */ })
  .addAppCallMethodCall({
    method: validateAllPartiesMethod,
    args: [partyATransaction], // Validate Party A specifically
  })
  .send()
```

## Comparison with Example 120

| Aspect | Example 120 | Example 121 |
|--------|-------------|-------------|
| Group Size | 2 transactions | 3+ transactions |
| Pattern | Simple txn arg | Complex workflow |
| Transactions | 1 payment + app call | Multiple ops + app call |
| Use Case | Basic validation | Multi-step protocols |
| Complexity | Beginner | Intermediate |

### When to Use Example 120 Pattern

- Simple payment verification
- Basic transaction validation
- Single operation + validation
- Learning transaction arguments

### When to Use Example 121 Pattern

- Multi-step workflows
- Multiple party operations
- Complex protocol implementations
- Advanced DApp logic

## Best Practices

### 1. Document Transaction Order

```typescript
/**
 * Transaction group order:
 * [0] First payment - setup
 * [1] Second payment - contribution
 * [2] Payment argument - validation target (auto-added)
 * [3] App call - validates and executes
 */
await algorand.newGroup()
  .addPayment({ /* ... */ })
  .addPayment({ /* ... */ })
  .addAppCallMethodCall({ args: [paymentTxn] })
  .send()
```

### 2. Understand Auto-Added Transactions

Remember: Transaction arguments are **automatically added** to the group by the SDK.

```typescript
// This creates 3 transactions, not 2!
await algorand
  .newGroup()
  .addPayment({ /* ... */ })     // Transaction [0]
  .addAppCallMethodCall({         // Transaction [2]
    args: [paymentTxn],  // Transaction [1] - auto-added!
  })
  .send()
```

### 3. Validate in Smart Contract

```teal
// Always verify group structure
global GroupSize
int EXPECTED_SIZE
==
assert

// Validate transaction types
gtxn 0 TypeEnum
int pay
==
assert
```

## Error Handling

### Group Size Mismatch

```typescript
try {
  await algorand
    .newGroup()
    .addPayment({ /* ... */ })
    .addAppCallMethodCall({ args: [txn] })
    .send()
} catch (error) {
  if (error.message.includes('group size')) {
    console.error('Smart contract expects different group size')
    // Remember: txn argument is auto-added!
  }
}
```

## Debugging Tips

### 1. Log Actual Group Size

```typescript
console.log('Group size:', result.txIds.length)
// May be larger than expected due to auto-added transactions
```

### 2. Inspect Transaction Order

```typescript
result.txIds.forEach((txId, i) => {
  console.log(`  [${i}] ${txId}`)
})
```

### 3. Understand SDK Behavior

The SDK automatically:
- Adds transaction arguments to the group
- Positions them correctly
- Encodes transaction references
- Assigns group IDs

## Related Examples

- [Example 120: Pass Transaction as ABI Method Argument](../120-pass-transaction-as-abi-method-argument/README.md) - Simpler 2-transaction pattern
- [Example 119: Nested Method Calls](../119-nested-method-calls---method-call-as-argument/README.md) - Passing app calls as arguments
- [Example 118: Multi-Account Transaction Groups](../118-multi-account-transaction-groups-with-different-signers/README.md) - Multiple signers

## Running This Example

1. Ensure AlgoKit LocalNet is running:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the example:
   ```bash
   npm start
   ```

## Expected Output

The example will:
1. Deploy a smart contract with txnArg method
2. Create a multi-transaction group
3. Pass a transaction as a method argument
4. Execute all transactions atomically
5. Display all 4 transaction IDs (including auto-added transaction)
6. Show the method return value matching the sender address

## Key Takeaways

1. **Transaction arguments are auto-added**: SDK adds them to the group
2. **Group size increases**: More transactions than you explicitly add
3. **Order matters**: Referenced transactions positioned before app call
4. **Use for complex workflows**: Multi-step operations with validation
5. **All atomic**: All transactions succeed or all fail
6. **Flexible pattern**: Combine with any transaction types
7. **SDK handles complexity**: Automatic positioning and encoding

This pattern is essential for building complex, multi-step protocols on Algorand!
