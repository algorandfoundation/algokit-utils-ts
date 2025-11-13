# Atomic Transaction Group with ABI Method Call

This example demonstrates **creating an atomic transaction group** that combines a payment transaction with an ABI method call to a smart contract. It showcases AlgoKit Utils v9.1.2 APIs for composing complex atomic groups.

## Overview

### What are Atomic Transaction Groups?

On Algorand, **atomic transaction groups** ensure that either all transactions in the group succeed or all fail. This is crucial for:
- **Complex operations** requiring multiple steps
- **Cross-contract interactions** with payments
- **Conditional logic** spanning multiple transactions
- **DeFi operations** like swaps that need atomicity

### Why This Matters

- **All-or-nothing execution**: No partial failures
- **Composability**: Combine different transaction types (payment, app call, asset transfer, etc.)
- **Type safety**: ABI methods provide TypeScript types for arguments and return values
- **Simplified development**: AlgoKit Utils handles transaction grouping and signing

## Code Walkthrough

### Step 1: Initialize and Create Accounts

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

// Create and fund Alice (sender)
const alice = algorand.account.random()
await algorand.account.ensureFunded(alice, dispenser, (10).algos())

// Create and fund Bob (receiver)
const bob = algorand.account.random()
await algorand.account.ensureFunded(bob, dispenser, (1).algos())
```

**Key Points**:
- Alice will send the payment and call the app
- Bob will receive the payment
- Both need initial funding for transactions

### Step 2: Deploy the Smart Contract

```typescript
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: alice.addr,
})

const { appClient, result: createResult } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 123,
  },
})

const appId = BigInt(createResult.appId)
console.log(`Contract deployed with App ID: ${appId}`)
```

**What's Happening**:
- Using `getTypedAppFactory` to create a typed factory instance
- Deploying with `create.bare` for a bare (non-ABI) create call
- Template variables configure the app's update/delete permissions
- The `appClient` provides typed method access

### Step 3: Check Balances Before Transaction

```typescript
const alicePreBalanceInfo = await algorand.account.getInformation(alice.addr)
const bobPreBalanceInfo = await algorand.account.getInformation(bob.addr)
const alicePreBalance = alicePreBalanceInfo.amount as unknown as number
const bobPreBalance = bobPreBalanceInfo.amount as unknown as number

console.log(`Balances before transaction:`)
console.log(`Alice: ${alicePreBalance} microAlgos`)
console.log(`Bob: ${bobPreBalance} microAlgos`)
```

**Why Check Balances**:
- Demonstrates the payment actually transferred funds
- Shows transaction fees impact on sender
- Useful for debugging and verification

### Step 4: Create the Atomic Transaction Group

```typescript
const groupResult = await algorand.newGroup()
  .addPayment({
    sender: alice.addr,
    receiver: bob.addr,
    amount: (0.1).algos(),
  })
  .addAppCallMethodCall({
    sender: alice.addr,
    appId,
    method: appClient.appClient.getABIMethod('call_abi')!,
    args: ['atomic group demo'],
    signer: alice,
  })
  .send()
```

**Breaking Down the Group**:

1. **`algorand.newGroup()`**: Creates a new atomic transaction group builder
2. **`.addPayment(...)`**: Adds a payment transaction
   - Transfers 0.1 ALGO from Alice to Bob
   - Will be transaction 0 in the group
3. **`.addAppCallMethodCall(...)`**: Adds an ABI method call
   - Calls the `call_abi` method on the deployed app
   - Passes `'atomic group demo'` as the argument
   - Will be transaction 1 in the group
   - Requires explicit signer since it's not using the default
4. **`.send()`**: Signs and submits the group atomically

**Important Notes**:
- Transactions are grouped and assigned the same group ID
- All transactions must succeed or all will fail
- The signer must be provided when not using the default sender

### Step 5: Verify Results

```typescript
console.log(`✓ Atomic transaction group executed successfully!`)
console.log(`Transaction IDs: ${groupResult.txIds.join(', ')}`)
console.log(`Group ID: ${groupResult.groupId}`)

// Check balances after
const alicePostBalanceInfo = await algorand.account.getInformation(alice.addr)
const bobPostBalanceInfo = await algorand.account.getInformation(bob.addr)
const alicePostBalance = alicePostBalanceInfo.amount as unknown as number
const bobPostBalance = bobPostBalanceInfo.amount as unknown as number

console.log(`Balances after transaction:`)
console.log(`Alice: ${alicePostBalance} microAlgos (spent ${alicePreBalance - alicePostBalance} microAlgos including fees)`)
console.log(`Bob: ${bobPostBalance} microAlgos (received ${bobPostBalance - bobPreBalance} microAlgos)`)

// Access the return value from the ABI method call
const returnValue = groupResult.returns?.[0]?.returnValue?.valueOf()
console.log(`Smart contract method result: "${returnValue}"`)
```

**Results Show**:
- Both transactions have unique IDs but share a group ID
- Alice's balance decreased by payment amount + fees
- Bob's balance increased by payment amount
- The method return value is accessible from `groupResult.returns`

**Important**: The `returns` array only contains method call results, not regular transactions. Since we have one payment and one method call, `returns[0]` is the method call result.

## API Patterns (AlgoKit Utils v9.1.2)

### Creating Atomic Groups

```typescript
await algorand.newGroup()
  .addPayment({ sender, receiver, amount })
  .addAppCallMethodCall({ sender, appId, method, args, signer })
  .send()
```

**Available Transaction Types**:
- `.addPayment()`: Payment transaction
- `.addAssetTransfer()`: Asset transfer transaction
- `.addAssetOptIn()`: Asset opt-in transaction
- `.addAppCall()`: Raw app call transaction
- `.addAppCallMethodCall()`: ABI method call (recommended for typed contracts)
- `.addAssetCreate()`: Asset creation transaction

### Getting ABI Methods

```typescript
// From typed app client
const method = appClient.appClient.getABIMethod('methodName')!

// The method object contains:
// - name: string
// - args: Array of argument descriptions
// - returns: Return type description
```

### Accessing Return Values

```typescript
// For groups with method calls
const groupResult = await algorand.newGroup()
  .addAppCallMethodCall({ ... })
  .send()

// Access returns array (only contains method call results)
const returnValue = groupResult.returns?.[0]?.returnValue?.valueOf()
```

**Return Value Notes**:
- Only method calls (not other transaction types) appear in `returns`
- Index corresponds to method call order in the group
- Use `.valueOf()` to get the JavaScript value
- Types depend on the ABI method's return type

## Running This Example

```bash
# Install dependencies
npm install

# Ensure AlgoKit LocalNet is running
algokit localnet start

# Run the example
npm start
```

**Expected Output**:
```
Setting up accounts...
Alice: <Alice's address>
Bob: <Bob's address>

Contract deployed with App ID: 1359

Balances before transaction:
Alice: 10099000 microAlgos
Bob: 1100000 microAlgos

Building atomic transaction group...
1. Payment: Alice → Bob (100000 microAlgos)
2. App call: call_abi("atomic group demo")

✓ Atomic transaction group executed successfully!
Transaction IDs: <txid1>, <txid2>
Group ID: <groupId>

Balances after transaction:
Alice: 9997000 microAlgos (spent 102000 microAlgos including fees)
Bob: 1200000 microAlgos (received 100000 microAlgos)

Smart contract method result: "Hello, atomic group demo"
Expected output: "Hello, atomic group demo"

✓ Both transactions executed atomically!
  - Payment transferred 100000 microAlgos from Alice to Bob
  - Smart contract method returned the expected value
```

## Common Use Cases

### 1. Payment with App Call (This Example)

```typescript
// Transfer funds and notify a smart contract
await algorand.newGroup()
  .addPayment({
    sender: user.addr,
    receiver: app.addr,
    amount: (1).algos(),
  })
  .addAppCallMethodCall({
    sender: user.addr,
    appId,
    method: appClient.appClient.getABIMethod('deposit')!,
    args: [],
    signer: user,
  })
  .send()
```

### 2. Multi-Step DeFi Operation

```typescript
// Swap tokens atomically
await algorand.newGroup()
  .addAssetTransfer({
    sender: user.addr,
    receiver: dexApp.addr,
    assetId: tokenA,
    amount: 1000n,
  })
  .addAppCallMethodCall({
    sender: user.addr,
    appId: dexAppId,
    method: dexClient.appClient.getABIMethod('swap')!,
    args: [tokenA, tokenB, 1000n],
    signer: user,
  })
  .send()
```

### 3. Asset Opt-In with Funding

```typescript
// Opt into asset and receive funding in one group
await algorand.newGroup()
  .addPayment({
    sender: funder.addr,
    receiver: user.addr,
    amount: (0.1).algos(), // Cover minimum balance
  })
  .addAssetOptIn({
    sender: user.addr,
    assetId: tokenId,
  })
  .send()
```

### 4. Multiple App Calls

```typescript
// Call multiple apps in sequence
await algorand.newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: appId1,
    method: app1Client.appClient.getABIMethod('prepare')!,
    args: [],
    signer: user,
  })
  .addAppCallMethodCall({
    sender: user.addr,
    appId: appId2,
    method: app2Client.appClient.getABIMethod('execute')!,
    args: [],
    signer: user,
  })
  .send()
```

## Important Considerations

### 1. Transaction Limits

- **Maximum 16 transactions** per atomic group
- Each transaction has its own fee (minimum 1000 microAlgos)
- Total group size limited by network parameters

### 2. Signer Requirements

```typescript
// When using newGroup(), you may need to provide explicit signers
.addAppCallMethodCall({
  sender: alice.addr,
  appId,
  method,
  args,
  signer: alice, // Required if not using default sender
})
```

### 3. Transaction Order Matters

- Transactions execute in the order added
- Later transactions can reference earlier ones
- Some operations (like payments) must precede app calls that use them

### 4. Atomic Execution

- **All succeed or all fail** - no partial execution
- If any transaction fails, the entire group is rejected
- Fees are still charged for failed groups

### 5. Return Values

- Only ABI method calls have return values
- Returns array index corresponds to method call order (not transaction order)
- Non-method transactions don't appear in the returns array

## Key Takeaways

1. **Atomic Groups**: Use `algorand.newGroup()` to create all-or-nothing transaction groups
2. **Type Safety**: ABI method calls provide TypeScript types for arguments and returns
3. **Composability**: Combine payments, asset transfers, and app calls in one group
4. **Explicit Signers**: Provide signers when not using the default sender
5. **Return Access**: Method call return values are in `groupResult.returns` array
6. **Transaction Order**: Add transactions in the order they should execute
7. **Maximum 16 Transactions**: Plan complex operations within this limit

## Learn More

- [Algorand Atomic Transfers Documentation](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [ABI Specifications](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md)
- [AlgoKit Utils TypeScript Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Transaction Groups Best Practices](https://developer.algorand.org/docs/get-details/atomic_transfers/#best-practices)
