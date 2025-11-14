# Example 118: Multi-Account Transaction Groups with Different Signers

This example demonstrates how to compose and send transaction groups where different transactions are signed by different accounts. This is a fundamental pattern for building multi-party applications on Algorand.

## Core Concept

In Algorand, **atomic transactions** allow multiple transactions to be grouped together such that they either all succeed or all fail. When different parties need to participate in a single atomic operation, each party signs only their own transaction(s) in the group.

Key characteristics:
- **Atomic execution**: All transactions in the group succeed or fail together
- **Multiple signers**: Each transaction can be signed by a different account
- **Cross-account coordination**: Enables complex multi-party operations
- **Trust minimization**: No single party needs to control all accounts

## What This Example Shows

This example demonstrates:

1. **Creating multiple accounts**: Setting up a deployer and a second signer
2. **Deploying a validator app**: An app that validates group transactions
3. **Building a transaction group**: Composing transactions from different accounts
4. **Explicit signer specification**: Passing `{ transaction, signer }` pairs
5. **Atomic group execution**: Sending all transactions together

## Transaction Group Structure

```
Group of 2 transactions:
┌─────────────────────────────────────────┐
│ [0] Payment Transaction                 │
│     From: secondSigner                  │
│     To: deployer                        │
│     Amount: 5000 microALGOs            │
│     Signed by: secondSigner ✓          │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ [1] App Call Transaction                │
│     From: deployer                      │
│     To: App ID                          │
│     Signed by: deployer ✓               │
│     Validates: payment in position 0    │
└─────────────────────────────────────────┘
```

## Smart Contract Validation

The deployed application validates the transaction group:

```teal
// Verify we're in a group with at least 2 transactions
global GroupSize
int 2
>=
assert

// Verify the previous transaction (txn 0) is a payment
gtxn 0 TypeEnum
int pay
==
assert

// Verify the payment amount is at least 5000 microALGOs
gtxn 0 Amount
int 5000
>=
assert
```

This ensures:
- The group has multiple transactions
- Transaction 0 is a payment
- The payment meets minimum requirements

## Key API Pattern

The critical pattern for multi-account groups is:

```typescript
await algorand
  .newGroup()
  .addTransaction(paymentTxn, secondSigner.signer)
  .addTransaction(appCallTxn, deployer.signer)
  .send()
```

Key points:
- Use `algorand.newGroup()` to start building a transaction group
- Chain `.addTransaction(transaction, signer)` calls to add each transaction
- Pass the `.signer` property from each account (not the account itself)
- Call `.send()` to execute the group atomically

## Step-by-Step Breakdown

### Step 1: Set Up Accounts

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

// Create deployer account
const deployer = algorand.account.random()
await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

// Create second signer account
const secondSigner = algorand.account.random()
await algorand.account.ensureFunded(secondSigner, dispenser, (1).algos())
```

### Step 2: Deploy Validator Application

```typescript
const deployment = {
  sender: deployer.addr,
  metadata: {
    name: 'MultiSignerApp',
    version: '1.0',
    updatable: false,
    deletable: false,
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram, // Validates group structure
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
}

const appResult = await algorand.appDeployer.deploy(deployment)
```

### Step 3: Create Individual Transactions

```typescript
// Payment from second signer
const paymentTxn = await algorand.createTransaction.payment({
  sender: secondSigner.addr,
  receiver: deployer.addr,
  amount: (0.005).algos(), // 5000 microALGOs
})

// App call from deployer
const appCallTxn = await algorand.createTransaction.appCall({
  sender: deployer.addr,
  appId: appResult.appId,
})
```

### Step 4: Send Grouped Transactions with Different Signers

```typescript
const result = await algorand
  .newGroup()
  .addTransaction(paymentTxn, secondSigner.signer)
  .addTransaction(appCallTxn, deployer.signer)
  .send()

// Access results
console.log('Transaction IDs:', result.txIds)
console.log('Group ID:', result.groupId)
console.log('Confirmed in round:', result.confirmations[0].confirmedRound)
```

## Use Cases

### 1. Escrow Services

```typescript
// Buyer sends payment, escrow releases funds
await algorand
  .newGroup()
  .addTransaction(buyerPayment, buyer.signer)
  .addTransaction(escrowRelease, escrow.signer)
  .send()
```

### 2. Atomic Swaps

```typescript
// Alice and Bob swap assets atomically
await algorand
  .newGroup()
  .addTransaction(aliceAssetTransfer, alice.signer)
  .addTransaction(bobAssetTransfer, bob.signer)
  .send()
```

### 3. Multi-Signature Operations

```typescript
// Multiple parties authorize a single action
await algorand
  .newGroup()
  .addTransaction(approval1, approver1.signer)
  .addTransaction(approval2, approver2.signer)
  .addTransaction(execution, executor.signer)
  .send()
```

### 4. Payment + Opt-In

```typescript
// One account pays fees, another opts in
await algorand
  .newGroup()
  .addTransaction(feePayment, payer.signer)
  .addTransaction(assetOptIn, recipient.signer)
  .send()
```

### 5. Conditional Transfers

```typescript
// Transfer only if condition is met
await algorand
  .newGroup()
  .addTransaction(conditionCheck, validator.signer)
  .addTransaction(conditionalTransfer, sender.signer)
  .send()
```

## Transaction Group Rules

### Automatic Group Assignment

When using `algorand.newGroup()`:
- All transactions are automatically assigned the same group ID
- Group size is validated (max 16 transactions)
- Transaction ordering is preserved

### Manual Group Creation

You can also manually create groups:

```typescript
import algosdk from 'algosdk'

// Assign group ID manually
const txns = [paymentTxn, appCallTxn]
algosdk.assignGroupID(txns)

// Sign individually
const signedPayment = paymentTxn.signTxn(secondSigner.privateKey)
const signedAppCall = appCallTxn.signTxn(deployer.privateKey)

// Send as group
await algod.sendRawTransaction([signedPayment, signedAppCall]).do()
```

## Common Patterns

### Pattern 1: Payment + Service

A user pays for a service, and the service provider executes an action:

```typescript
const paymentTxn = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: serviceProvider.addr,
  amount: serviceFee,
})

const serviceTxn = await algorand.createTransaction.appCall({
  sender: serviceProvider.addr,
  appId: serviceAppId,
  methodArgs: [user.addr], // Identify who paid
})

await algorand
  .newGroup()
  .addTransaction(paymentTxn, user.signer)
  .addTransaction(serviceTxn, serviceProvider.signer)
  .send()
```

### Pattern 2: Opt-In + Fund

One account opts into an asset while another pays the minimum balance:

```typescript
const optInTxn = await algorand.createTransaction.assetOptIn({
  sender: recipient.addr,
  assetId: assetId,
})

const fundingTxn = await algorand.createTransaction.payment({
  sender: funder.addr,
  receiver: recipient.addr,
  amount: (0.1).algos(), // Cover minimum balance
})

await algorand
  .newGroup()
  .addTransaction(fundingTxn, funder.signer)
  .addTransaction(optInTxn, recipient.signer)
  .send()
```

### Pattern 3: Multi-Step Protocol

Complex protocols requiring multiple parties:

```typescript
const step1 = await algorand.createTransaction.appCall({
  sender: party1.addr,
  appId: protocolAppId,
  methodArgs: ['initiate'],
})

const step2 = await algorand.createTransaction.payment({
  sender: party2.addr,
  receiver: protocolEscrow,
  amount: deposit,
})

const step3 = await algorand.createTransaction.appCall({
  sender: party3.addr,
  appId: protocolAppId,
  methodArgs: ['finalize'],
})

await algorand
  .newGroup()
  .addTransaction(step1, party1.signer)
  .addTransaction(step2, party2.signer)
  .addTransaction(step3, party3.signer)
  .send()
```

## Validation in Smart Contracts

Smart contracts can validate transaction groups using `gtxn` opcodes:

### Check Transaction Type

```teal
// Verify transaction 0 is a payment
gtxn 0 TypeEnum
int pay
==
assert
```

### Check Sender

```teal
// Verify transaction 1 sender is a specific account
gtxn 1 Sender
addr SPECIFIC_ADDRESS
==
assert
```

### Check Amount

```teal
// Verify payment amount
gtxn 0 Amount
int 1000000  // 1 ALGO
>=
assert
```

### Check Receiver

```teal
// Verify payment receiver
gtxn 0 Receiver
global CurrentApplicationAddress
==
assert
```

### Check Group Size

```teal
// Verify group has exactly 3 transactions
global GroupSize
int 3
==
assert
```

## Error Handling

### Group Validation Errors

```typescript
try {
  await algorand
    .newGroup()
    .addTransaction(tx1, signer1.signer)
    .addTransaction(tx2, signer2.signer)
    .send()
} catch (error) {
  if (error.message.includes('logic eval error')) {
    console.error('Smart contract validation failed')
  } else if (error.message.includes('overspend')) {
    console.error('Insufficient balance for transaction')
  } else if (error.message.includes('invalid group')) {
    console.error('Group structure validation failed')
  }
}
```

### Individual Transaction Errors

If any transaction in a group fails, the entire group fails:

```typescript
// If tx1 succeeds but tx2 fails:
// - Both transactions are rolled back
// - No state changes are applied
// - Fees are still charged for failed attempts
```

## Best Practices

### 1. Order Matters

Place transactions in the correct order for validation:

```typescript
// ✅ Good: Payment before app call that checks it
await algorand
  .newGroup()
  .addTransaction(payment, payer.signer)
  .addTransaction(appCall, validator.signer) // Can check gtxn 0
  .send()

// ❌ Bad: App call before payment
await algorand
  .newGroup()
  .addTransaction(appCall, validator.signer) // Can't check payment yet
  .addTransaction(payment, payer.signer)
  .send()
```

### 2. Validate Group Size

Always check group size in your smart contract:

```teal
global GroupSize
int 2
==
assert  // Expect exactly 2 transactions
```

### 3. Use Descriptive Variable Names

```typescript
// ✅ Good
const buyerPayment = await algorand.createTransaction.payment({ /* ... */ })
const sellerDelivery = await algorand.createTransaction.assetTransfer({ /* ... */ })

// ❌ Less clear
const tx1 = await algorand.createTransaction.payment({ /* ... */ })
const tx2 = await algorand.createTransaction.assetTransfer({ /* ... */ })
```

### 4. Document Expected Order

```typescript
/**
 * Transaction group for atomic swap:
 * [0] Alice sends ASA to Bob
 * [1] Bob sends ALGO to Alice
 */
await algorand
  .newGroup()
  .addTransaction(aliceAssetTransfer, alice.signer)
  .addTransaction(bobPayment, bob.signer)
  .send()
```

### 5. Handle Fees Appropriately

```typescript
// One account can pay fees for multiple transactions
const tx1 = await algorand.createTransaction.payment({
  sender: sender1.addr,
  receiver: receiver.addr,
  amount: (1).algos(),
  fee: (0.002).algos(), // Pay for both transactions
})

const tx2 = await algorand.createTransaction.appCall({
  sender: sender2.addr,
  appId: appId,
  fee: (0).algos(), // Fee covered by tx1
})
```

## Security Considerations

### 1. Verify All Group Members

Always validate the entire group structure:

```teal
// Check group size
global GroupSize
int 3
==
assert

// Check each transaction type
gtxn 0 TypeEnum
int pay
==
assert

gtxn 1 TypeEnum
int axfer
==
assert
```

### 2. Validate Senders

Don't trust transaction senders without validation:

```teal
// Verify sender is authorized
gtxn 0 Sender
txn Sender  // Must match app call sender
==
assert
```

### 3. Check for Rekeying

Prevent unauthorized rekeying in group transactions:

```teal
// Ensure no rekeying
gtxn 0 RekeyTo
global ZeroAddress
==
assert
```

### 4. Validate Amounts

Always check payment amounts meet requirements:

```teal
// Minimum payment check
gtxn 0 Amount
int 1000000  // 1 ALGO minimum
>=
assert
```

## Debugging Tips

### 1. Log Transaction IDs

```typescript
const result = await algorand.send.newGroup({ /* ... */ })
console.log('Transaction IDs:')
result.txIds.forEach((txId, i) => {
  console.log(`  [${i}] ${txId}`)
})
```

### 2. Inspect Group ID

```typescript
// All transactions in a group share the same group ID
const groupId = paymentTxn.group
console.log('Group ID:', groupId)
```

### 3. Test Individually First

```typescript
// Test each transaction individually before grouping
await algorand.send.payment({ /* payment params */ })
await algorand.send.appCall({ /* app call params */ })

// Then group them
await algorand.send.newGroup({ /* ... */ })
```

### 4. Use Sandbox for Testing

The example uses LocalNet, which provides:
- Fast block times
- Easy account funding
- Full control over the environment

## Common Pitfalls

### Pitfall 1: Wrong Signer

```typescript
// ❌ Wrong: Using deployer for both
await algorand
  .newGroup()
  .addTransaction(paymentTxn, deployer.signer) // Should be secondSigner!
  .addTransaction(appCallTxn, deployer.signer)
  .send()

// ✅ Correct: Each transaction has its proper signer
await algorand
  .newGroup()
  .addTransaction(paymentTxn, secondSigner.signer)
  .addTransaction(appCallTxn, deployer.signer)
  .send()
```

### Pitfall 2: Incorrect Order

```typescript
// ❌ Wrong: App checks payment but payment comes after
await algorand
  .newGroup()
  .addTransaction(appCallTxn, deployer.signer) // Checks gtxn 0
  .addTransaction(paymentTxn, payer.signer)     // But this is gtxn 1!
  .send()
```

### Pitfall 3: Missing Group ID

```typescript
// ❌ Wrong: Sending individually
await algorand.send.payment({ /* ... */ })
await algorand.send.appCall({ /* ... */ })

// ✅ Correct: Sending as group
await algorand
  .newGroup()
  .addTransaction(payment, sender.signer)
  .addTransaction(appCall, caller.signer)
  .send()
```

## Related Examples

- [Example 33: ARC-56 Error Handling](../33-arc56-error-handling/README.md) - Error handling in app calls
- [Example 32: Fund App Account](../32-fund-app-account/README.md) - Funding application accounts
- [Example 24: Method Calls with ABI](../24-method-calls-with-abi/README.md) - ABI method calls

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
1. Create and fund two accounts (deployer and second signer)
2. Deploy a validator application
3. Create a transaction group with different signers
4. Send the group atomically
5. Display transaction IDs confirming both transactions succeeded

You should see confirmation that both transactions were included in the same group and signed by different accounts.

## Key Takeaways

1. **Atomic groups enable multi-party operations**: All transactions succeed or fail together
2. **Each transaction can have its own signer**: Use `{ transaction, signer }` pairs
3. **Order matters for validation**: Smart contracts can check previous transactions in the group
4. **Group ID links transactions**: All transactions share the same group ID
5. **No trust required**: Each party only signs their own transaction(s)
6. **Maximum 16 transactions**: Groups can contain up to 16 transactions
7. **Fees are per transaction**: Each transaction in the group requires its own fee

This pattern is fundamental for building trustless, multi-party applications on Algorand!
