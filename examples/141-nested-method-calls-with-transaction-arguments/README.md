# Nested Method Calls with Transaction Arguments

This example demonstrates how to compose advanced method calls where a method takes another method call as an argument, and that nested method call itself takes a transaction as an argument. This pattern is essential for building complex, composable dApp workflows.

## Overview

In advanced dApp architectures, you often need to compose multiple smart contract interactions where:
- Methods accept transaction arguments (like payments)
- Methods accept other method calls as arguments
- Both patterns are combined: a method call with a transaction argument is passed to another method

This example shows the complete pattern, demonstrating how AlgoKit Utils automatically handles the complex transaction group composition.

## What You'll Learn

- Creating ABI methods that accept transaction arguments
- Composing nested method calls
- Using the `AppCallMethodCall` type for method composition
- Transaction group ordering and reference management
- Advanced patterns for DeFi and protocol interactions

## Key Concepts

### Transaction Arguments in ABI Methods

ABI methods can accept transactions as arguments using specific type declarations:

```typescript
{
  name: 'txnArg',
  args: [{ type: 'pay', name: 'txn' }],  // 'pay' = payment transaction
  returns: { type: 'address' },
}
```

**Supported transaction types:**
- `pay`: Payment transaction
- `axfer`: Asset transfer transaction
- `acfg`: Asset configuration transaction
- `afrz`: Asset freeze transaction
- `appl`: Application call transaction
- `keyreg`: Key registration transaction

### Method Call Arguments

Methods can also accept other method calls as arguments using the `appl` type:

```typescript
{
  name: 'methodArg',
  args: [{ type: 'appl', name: 'call' }],  // 'appl' = application call
  returns: { type: 'uint64' },
}
```

### Nested Composition

The advanced pattern combines both: a method accepts a method call argument, where that inner method call itself has a transaction argument:

```typescript
{
  name: 'nestedTxnArg',
  args: [
    { type: 'pay', name: 'txn' },      // Payment transaction
    { type: 'appl', name: 'call' },    // App call (which may have its own txn arg)
  ],
  returns: { type: 'uint64' },
}
```

### AppCallMethodCall Type

The `AppCallMethodCall` type represents a method call that can be passed as an argument:

```typescript
const innerCall: AppCallMethodCall = {
  sender: account.addr,
  appId: appId,
  method: txnArgMethod,
  args: [
    algorand.createTransaction.payment({
      sender: account.addr,
      receiver: account.addr,
      amount: (0).microAlgo(),
    }),
  ],
}
```

## Example Walkthrough

### Step 1: Deploy Contract with Transaction-Aware Methods

The example deploys a TEAL contract with four methods:

**1. `txnArg(pay)address`**: Takes a payment transaction, returns sender address
```teal
txn GroupIndex
int 1
-
dup
gtxns TypeEnum
int pay
==
assert
gtxns Sender  // Extract sender from the payment transaction
```

**2. `helloWorld()string`**: Simple method returning "Hello, World!"

**3. `methodArg(appl)uint64`**: Takes an app call, returns app ID
```teal
frame_dig -1
gtxns ApplicationID  // Extract app ID from the referenced transaction
```

**4. `nestedTxnArg(pay,appl)uint64`**: Takes payment and app call, returns app ID
```teal
// Verify both transaction arguments exist and have correct types
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
```

### Step 2: Simple Transaction Argument

First, demonstrate calling a method with a transaction argument:

```typescript
const txnRes = await algorand
  .newGroup()
  .addAppCallMethodCall({
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
  })
  .send()
```

**Result**: Transaction group with 2 transactions:
1. Payment transaction
2. App call to `txnArg` method (references transaction 0)

### Step 3: Simple Method Call Argument

Next, demonstrate passing a method call as an argument:

```typescript
const helloWorldCall: AppCallMethodCall = {
  sender: deployer.addr,
  appId: appId,
  method: helloWorldMethod,
}

const methodArgRes = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: appId,
    method: methodArgMethod,
    args: [helloWorldCall],
  })
  .send()
```

**Result**: Transaction group with 2 transactions:
1. App call to `helloWorld` method
2. App call to `methodArg` method (references transaction 0)

### Step 4: Nested Transaction Argument (Advanced)

Finally, the complete pattern: pass a method call (that has a transaction argument) to another method:

```typescript
// Step 4.1: Create inner method call with transaction argument
const txnArgCall: AppCallMethodCall = {
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

// Step 4.2: Pass it to outer method
const nestedTxnArgRes = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: appId,
    method: nestedTxnArgMethod,
    args: [undefined, txnArgCall],  // undefined = placeholder for payment
  })
  .send()
```

**Result**: Transaction group with 3 transactions:
1. Payment transaction (for txnArg)
2. App call to `txnArg` method (references transaction 0)
3. App call to `nestedTxnArg` method (references transactions 0 and 1)

**Key insight**: The composer automatically:
- Determines the correct transaction order
- Inserts necessary transactions into the group
- Sets up proper transaction references
- Ensures all transactions are signed correctly

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
=== Nested Method Calls with Transaction Arguments ===

Using deployer account: F2T4H...

=== STEP 1: Deploying Test Contract ===

Deploying test contract...
✅ Test contract deployed with ID: 1082

=== STEP 2: Defining ABI Methods ===

ABI Methods defined:
  - txnArg(pay)address: Takes a payment transaction, returns sender
  - helloWorld()string: Returns "Hello, World!"
  - methodArg(appl)uint64: Takes an app call, returns app ID
  - nestedTxnArg(pay,appl)uint64: Takes payment and app call, returns app ID

=== STEP 3: Method with Transaction Argument ===

Calling txnArg method with a payment transaction...
✅ Transaction successful!
   Returned address: F2T4H...
   Expected: F2T4H...

=== STEP 4: Method Call as Argument ===

✅ Nested method call successful!
   First return (helloWorld): Hello, World!
   Second return (app ID): 1082

=== STEP 5: Nested Method Call with Transaction Argument ===

✅ Nested transaction argument call successful!

Transaction group contained:
  1. Payment transaction (for txnArg)
  2. App call to txnArg method
  3. App call to nestedTxnArg method

Return values:
  - First return (sender address from txnArg): F2T4H...
  - Second return (app ID from nestedTxnArg): 1082

✨ Example completed successfully!
```

## Common Use Cases

### 1. DeFi Protocol with Payment Verification

```typescript
// Lending protocol that verifies collateral payment
const depositCall: AppCallMethodCall = {
  sender: user.addr,
  appId: collateralAppId,
  method: verifyDepositMethod,
  args: [
    algorand.createTransaction.payment({
      sender: user.addr,
      receiver: collateralPoolAddr,
      amount: collateralAmount,
    }),
  ],
}

// Borrow method accepts the verified deposit call
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: lendingAppId,
    method: borrowMethod,
    args: [borrowAmount, depositCall],
  })
  .send()
```

### 2. DEX with Asset Swap Verification

```typescript
// Inner call verifies asset transfer
const assetTransferCall: AppCallMethodCall = {
  sender: trader.addr,
  appId: dexAppId,
  method: verifyAssetInMethod,
  args: [
    algorand.createTransaction.assetTransfer({
      sender: trader.addr,
      receiver: dexPoolAddr,
      assetId: assetInId,
      amount: amountIn,
    }),
  ],
}

// Outer call executes swap
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: trader.addr,
    appId: dexAppId,
    method: swapMethod,
    args: [assetOutId, minAmountOut, assetTransferCall],
  })
  .send()
```

### 3. Governance with Vote and Delegation

```typescript
// Vote method accepts delegation proof
const delegationCall: AppCallMethodCall = {
  sender: delegate.addr,
  appId: governanceAppId,
  method: proveDelegationMethod,
  args: [
    algorand.createTransaction.payment({
      sender: delegate.addr,
      receiver: governanceAddr,
      amount: votingFee,
    }),
  ],
}

// Cast vote with delegation proof
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: delegate.addr,
    appId: governanceAppId,
    method: castVoteMethod,
    args: [proposalId, voteChoice, delegationCall],
  })
  .send()
```

### 4. NFT Marketplace with Royalty Payment

```typescript
// Verify royalty payment
const royaltyCall: AppCallMethodCall = {
  sender: buyer.addr,
  appId: marketplaceAppId,
  method: verifyRoyaltyMethod,
  args: [
    algorand.createTransaction.payment({
      sender: buyer.addr,
      receiver: artistAddr,
      amount: royaltyAmount,
    }),
  ],
}

// Execute NFT purchase
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: buyer.addr,
    appId: marketplaceAppId,
    method: purchaseNFTMethod,
    args: [nftId, price, royaltyCall],
  })
  .send()
```

## Advanced Patterns

### Multiple Nested Layers

You can nest even deeper:

```typescript
// Layer 1: Payment transaction
const paymentTxn = algorand.createTransaction.payment({...})

// Layer 2: Method call with payment
const innerCall: AppCallMethodCall = {
  method: txnArgMethod,
  args: [paymentTxn],
  ...
}

// Layer 3: Method call with nested call
const middleCall: AppCallMethodCall = {
  method: nestedTxnArgMethod,
  args: [undefined, innerCall],
  ...
}

// Layer 4: Outer method
await algorand
  .newGroup()
  .addAppCallMethodCall({
    method: outerMethod,
    args: [middleCall],
    ...
  })
  .send()
```

### Placeholder Arguments

Use `undefined` for transaction arguments that will be filled by nested method calls:

```typescript
// nestedTxnArg expects (pay, appl)
// The payment is provided by txnArgCall's inner transaction
// Use undefined as a placeholder
args: [undefined, txnArgCall]
```

### Transaction Group Ordering

The composer handles ordering automatically:

1. All transactions from nested calls are added first
2. Transactions are ordered depth-first (innermost first)
3. References are calculated based on final group order
4. All transactions must be compatible with the 16-transaction group limit

## Best Practices

### 1. Design Clear Method Signatures

```typescript
// Good: Clear, descriptive names
{
  name: 'purchaseWithCollateral',
  args: [
    { type: 'uint64', name: 'itemId' },
    { type: 'appl', name: 'collateralVerification' },
  ],
  ...
}

// Bad: Ambiguous names
{
  name: 'buy',
  args: [
    { type: 'uint64', name: 'id' },
    { type: 'appl', name: 'call' },
  ],
  ...
}
```

### 2. Validate Transaction Types in TEAL

Always verify transaction types in your smart contract:

```teal
// Verify the referenced transaction is a payment
txn GroupIndex
int 1
-
dup
gtxns TypeEnum
int pay
==
assert  // Fail if not a payment
```

### 3. Handle Placeholder Arguments

When a method expects both a transaction and a method call, and the transaction comes from the nested call:

```typescript
// Correct: Use undefined for the payment slot
args: [undefined, methodCallWithPayment]

// Incorrect: Providing both will create duplicate transactions
args: [paymentTxn, methodCallWithPayment]
```

### 4. Test Incrementally

Build complexity gradually:

1. Test methods with transaction arguments
2. Test methods with method call arguments
3. Combine into nested patterns
4. Add error handling and edge cases

### 5. Document Method Dependencies

```typescript
/**
 * Executes a purchase with collateral verification
 *
 * @param itemId - The ID of the item to purchase
 * @param collateralCall - Must be a call to verifyCollateral()
 *                         which itself takes a payment transaction
 *
 * Transaction group structure:
 * 1. Payment (collateral)
 * 2. App call (verifyCollateral)
 * 3. App call (purchaseWithCollateral) <- this method
 */
```

## Limitations and Considerations

### Transaction Group Limits

- Maximum 16 transactions per group
- Each nested level adds transactions
- Plan your composition depth accordingly

### Budget Constraints

- Each app call consumes opcode budget
- Nested calls share the group budget
- Consider budget when designing deep nesting

### Transaction Ordering

- Order matters for transaction references
- Composer handles this automatically
- Manual group construction is error-prone

### Error Propagation

- Any transaction failure fails the entire group
- Atomic execution means all-or-nothing
- Design error handling accordingly

## Troubleshooting

### "Invalid ApplicationArgs index"

**Problem**: Contract trying to access transaction that doesn't exist

**Solution**: Verify transaction group order matches your TEAL expectations

```teal
// Check the transaction exists
txn GroupIndex
int 1
>=  // Ensure we're not at index 0
assert
```

### "Transaction type mismatch"

**Problem**: Expected payment but got application call

**Solution**: Always validate transaction types:

```teal
gtxns TypeEnum
int pay
==
assert
```

### "Group size exceeds maximum"

**Problem**: Too many transactions in the group (>16)

**Solution**: Reduce nesting depth or split into multiple groups

### "Undefined transaction reference"

**Problem**: Used `undefined` placeholder incorrectly

**Solution**: Only use `undefined` when the transaction comes from a nested call

```typescript
// Correct: Payment comes from innerCall
args: [undefined, innerCall]

// Incorrect: No source for the payment
args: [undefined]
```

## Key Takeaways

1. **Transaction Arguments**: Methods can accept transactions as typed arguments
2. **Method Call Arguments**: Methods can accept other method calls as arguments
3. **Nested Composition**: Combine both patterns for complex workflows
4. **Automatic Handling**: AlgoKit Utils handles group composition automatically
5. **Atomic Execution**: All transactions succeed or fail together
6. **Production Ready**: Pattern used in real DeFi protocols and dApps

## Additional Resources

- [Algorand ABI Specification](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/ABI/)
- [Transaction Groups](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL Reference](https://developer.algorand.org/docs/get-details/dapps/avm/teal/)

## Related Examples

- Example 24: Method Calls with ABI
- Example 25: Method Calls with Transaction Args
- Example 140: Multiple Layers of Nested App Calls
- Example 142: Working with Complex Transaction Groups

---

This example demonstrates production-ready patterns for building composable, complex dApp interactions on Algorand using nested method calls with transaction arguments.
