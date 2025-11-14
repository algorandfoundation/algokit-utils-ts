# Example 120: Pass Transaction as ABI Method Argument

This example demonstrates how to pass a transaction as an argument to an ABI method, creating an atomic transaction group where the smart contract can validate and process the transaction.

## Core Concept

In Algorand's ABI, methods can accept **transaction references** as arguments. When you pass a transaction to an ABI method, the SDK automatically creates an atomic transaction group where:

1. The referenced transaction is placed first in the group
2. The app call follows immediately after
3. The smart contract uses `gtxn` opcodes to access the transaction's properties
4. Both transactions execute atomically (all succeed or all fail)

Key characteristics:
- **Transaction types as ABI arguments**: pay, axfer, appl, afrz, acfg, keyreg
- **Automatic group formation**: SDK handles transaction group creation
- **Atomic execution**: Referenced transaction and app call succeed or fail together
- **Transaction validation**: Smart contract can validate transaction properties
- **Cross-transaction logic**: Enable complex protocols requiring transaction inspection

## What This Example Shows

This example demonstrates:

1. **Creating a payment transaction**: Building a transaction to pass as an argument
2. **Defining an ABI method with transaction argument**: Method signature with `pay` type
3. **Passing transaction to ABI method**: Using the transaction as a method argument
4. **Deploying a validating contract**: Smart contract that processes transaction arguments
5. **Accessing transaction properties**: Using `gtxn` opcodes in TEAL to read transaction data

## Transaction Group Structure

```
Group of 2 transactions:
┌─────────────────────────────────────────┐
│ [0] Payment Transaction                 │
│     From: sender                        │
│     To: sender                          │
│     Amount: 5000 microALGOs            │
│     Referenced by: Transaction [1]      │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ [1] App Call Transaction                │
│     Method: call_abi_txn(pay, string)   │
│     Args: [ref to txn 0, "test"]        │
│     Accesses: gtxn 0 Amount             │
│     Returns: "Sent 5000. test"          │
└─────────────────────────────────────────┘
```

## ABI Transaction Types

### Supported Transaction Types

```typescript
// Payment transaction
{ type: 'pay', name: 'payment', desc: 'Payment transaction' }

// Asset transfer
{ type: 'axfer', name: 'assetTransfer', desc: 'Asset transfer transaction' }

// Application call
{ type: 'appl', name: 'appCall', desc: 'Application call transaction' }

// Asset freeze
{ type: 'afrz', name: 'assetFreeze', desc: 'Asset freeze transaction' }

// Asset config
{ type: 'acfg', name: 'assetConfig', desc: 'Asset configuration transaction' }

// Key registration
{ type: 'keyreg', name: 'keyReg', desc: 'Key registration transaction' }
```

### Method Signature Example

```typescript
const method = new algosdk.ABIMethod({
  name: 'call_abi_txn',
  args: [
    { type: 'pay', name: 'txn', desc: 'Payment transaction to process' },
    { type: 'string', name: 'value', desc: 'Additional string value' },
  ],
  returns: { type: 'string', desc: 'Description of the payment' },
})
```

## Key API Pattern

The critical pattern for passing transactions as arguments:

```typescript
// Step 1: Create the transaction to pass as an argument
const paymentTxn = await algorand.createTransaction.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: (0.005).algos(),
})

// Step 2: Define the ABI method that accepts a transaction
const method = new algosdk.ABIMethod({
  name: 'call_abi_txn',
  args: [
    { type: 'pay', name: 'payment', desc: 'Payment to validate' },
    { type: 'string', name: 'note', desc: 'Additional data' },
  ],
  returns: { type: 'string', desc: 'Result' },
})

// Step 3: Call the method with the transaction as an argument
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: sender.addr,
    appId: appId,
    method: method,
    args: [paymentTxn, 'test'], // Transaction as first argument
  })
  .send()
```

Key points:
- Transaction must be created using `algorand.createTransaction.*` methods
- Pass the transaction object directly in the `args` array
- SDK automatically positions the transaction before the app call in the group
- Smart contract accesses the transaction using `gtxn 0` (or appropriate index)

## Step-by-Step Breakdown

### Step 1: Initialize AlgorandClient

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const sender = (await algorand.account.localNetDispenser()).account
```

### Step 2: Deploy Smart Contract with Transaction Argument Method

The smart contract needs to:
- Accept the correct ABI method selector
- Validate transaction group structure
- Access the referenced transaction using `gtxn` opcodes
- Process transaction data and return results

```teal
// call_abi_txn(pay,string)string
txn ApplicationArgs 0
method "call_abi_txn(pay,string)string"
==
bnz call_abi_txn

call_abi_txn:
// Verify we're in a group
global GroupSize
int 2
>=
assert

// Verify transaction 0 is a payment
gtxn 0 TypeEnum
int pay
==
assert

// Access payment amount
gtxn 0 Amount
// ... process the amount
```

### Step 3: Create Transaction to Pass as Argument

```typescript
const paymentTxn = await algorand.createTransaction.payment({
  sender: sender.addr,
  receiver: sender.addr,
  amount: (0.005).algos(), // 5000 microALGOs
})
```

This creates a transaction object that can be passed to the ABI method.

### Step 4: Define ABI Method Signature

```typescript
const callAbiTxnMethod = new algosdk.ABIMethod({
  name: 'call_abi_txn',
  args: [
    { type: 'pay', name: 'txn', desc: 'Payment transaction to process' },
    { type: 'string', name: 'value', desc: 'Additional string value' },
  ],
  returns: { type: 'string', desc: 'Description of the payment' },
})
```

### Step 5: Call Method with Transaction Argument

```typescript
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: sender.addr,
    appId: appId,
    method: callAbiTxnMethod,
    args: [paymentTxn, 'test'], // Pass transaction as first argument
  })
  .send()
```

### Step 6: Access Results

```typescript
console.log('Transaction IDs:', result.txIds)
// [0] Payment transaction
// [1] App call transaction

console.log('Group ID:', result.groupId)
console.log('Return value:', result.returns?.[0]?.returnValue)
```

## Use Cases

### 1. Payment Verification Service

Verify payment amount and receiver before providing a service:

```typescript
const paymentTxn = await algorand.createTransaction.payment({
  sender: customer.addr,
  receiver: serviceProvider.addr,
  amount: serviceFee,
})

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: customer.addr,
    appId: serviceAppId,
    method: verifyPaymentAndProvideServiceMethod,
    args: [paymentTxn],
  })
  .send()
```

Smart contract validates:
- Payment receiver is correct
- Payment amount meets minimum requirement
- Then provides the service

### 2. Asset Transfer Validation

Validate an asset transfer before processing:

```typescript
const assetTransferTxn = await algorand.createTransaction.assetTransfer({
  sender: seller.addr,
  receiver: escrow.addr,
  assetId: nftAssetId,
  amount: 1n,
})

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: seller.addr,
    appId: escrowAppId,
    method: depositAssetMethod,
    args: [assetTransferTxn],
  })
  .send()
```

Smart contract validates:
- Correct asset ID
- Correct receiver (escrow address)
- Correct amount

### 3. Fee Delegation Pattern

One account pays fees while another performs action:

```typescript
const feePaymentTxn = await algorand.createTransaction.payment({
  sender: sponsor.addr,
  receiver: applicationAddress,
  amount: (0.1).algos(),
})

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: appId,
    method: performActionMethod,
    args: [feePaymentTxn],
  })
  .send()
```

### 4. Conditional Execution Based on Payment

Execute different logic based on payment amount:

```typescript
const paymentTxn = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: app.addr,
  amount: tierAmount,
})

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: appId,
    method: selectTierMethod,
    args: [paymentTxn], // Tier determined by payment amount
  })
  .send()
```

### 5. Multi-Asset Atomic Swap

Validate multiple asset transfers in a swap:

```typescript
const aliceAssetTxn = await algorand.createTransaction.assetTransfer({
  sender: alice.addr,
  receiver: bob.addr,
  assetId: assetA,
  amount: 100n,
})

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: alice.addr,
    appId: swapAppId,
    method: initiateSwapMethod,
    args: [aliceAssetTxn],
  })
  .send()
```

## Smart Contract Implementation

### TEAL Example: Payment Processing

```teal
// Verify group structure
global GroupSize
int 2
>=
assert

// Verify transaction 0 is a payment
gtxn 0 TypeEnum
int pay
==
assert

// Access payment properties
gtxn 0 Sender      // Payment sender
gtxn 0 Receiver    // Payment receiver
gtxn 0 Amount      // Payment amount
gtxn 0 CloseRemainderTo  // Check for close-to

// Validate payment receiver
gtxn 0 Receiver
global CurrentApplicationAddress
==
assert

// Validate minimum payment amount
gtxn 0 Amount
int 1000000  // 1 ALGO minimum
>=
assert
```

### TEAL Example: Asset Transfer Validation

```teal
// Verify transaction 0 is an asset transfer
gtxn 0 TypeEnum
int axfer
==
assert

// Access asset transfer properties
gtxn 0 XferAsset      // Asset ID
gtxn 0 AssetAmount    // Transfer amount
gtxn 0 AssetSender    // Original asset holder (for clawback)
gtxn 0 AssetReceiver  // Asset recipient
gtxn 0 AssetCloseTo   // Asset close-to address

// Validate correct asset
gtxn 0 XferAsset
int EXPECTED_ASSET_ID
==
assert

// Validate amount
gtxn 0 AssetAmount
int 1
>=
assert
```

### TEAL Example: Application Call Validation

```teal
// Verify transaction 0 is an app call
gtxn 0 TypeEnum
int appl
==
assert

// Access app call properties
gtxn 0 ApplicationID    // App being called
gtxn 0 OnCompletion     // Call type (NoOp, OptIn, etc.)
gtxn 0 ApplicationArgs 0  // First app argument

// Validate correct app
gtxn 0 ApplicationID
int EXPECTED_APP_ID
==
assert
```

## Transaction Group Mechanics

### Automatic Positioning

When you pass a transaction as an argument:

```typescript
// This transaction will be position [0]
const paymentTxn = await algorand.createTransaction.payment({ /* ... */ })

// This will be position [1], automatically referencing [0]
await algorand.newGroup().addAppCallMethodCall({
  args: [paymentTxn], // SDK positions paymentTxn at [0]
}).send()
```

### Multiple Transaction Arguments

You can pass multiple transactions:

```typescript
const payment1 = await algorand.createTransaction.payment({ /* ... */ })
const payment2 = await algorand.createTransaction.payment({ /* ... */ })

await algorand.newGroup().addAppCallMethodCall({
  method: processMultiplePaymentsMethod,
  args: [payment1, payment2, 'note'],
}).send()

// Group structure:
// [0] payment1
// [1] payment2
// [2] app call (can access gtxn 0 and gtxn 1)
```

### Mixed Argument Types

Combine transaction arguments with regular arguments:

```typescript
await algorand.newGroup().addAppCallMethodCall({
  method: complexMethod,
  args: [
    paymentTxn,      // Transaction argument -> becomes gtxn 0
    'string value',  // Regular argument -> encoded in app args
    12345n,          // Regular argument -> encoded in app args
  ],
}).send()
```

## Common Patterns

### Pattern 1: Payment Validation + Service Delivery

```typescript
// User pays, contract validates and delivers service
const payment = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: serviceAddress,
  amount: serviceFee,
})

const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: serviceAppId,
    method: purchaseServiceMethod,
    args: [payment],
  })
  .send()
```

TEAL validation:
```teal
// Verify payment receiver
gtxn 0 Receiver
addr SERVICE_ADDRESS
==
assert

// Verify payment amount
gtxn 0 Amount
int SERVICE_FEE
==
assert
```

### Pattern 2: Escrow with Transaction Validation

```typescript
// Deposit funds into escrow with validation
const deposit = await algorand.createTransaction.payment({
  sender: depositor.addr,
  receiver: escrowAddress,
  amount: depositAmount,
})

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: depositor.addr,
    appId: escrowAppId,
    method: depositMethod,
    args: [deposit, lockPeriod],
  })
  .send()
```

### Pattern 3: Fee Payment by Third Party

```typescript
// Sponsor pays fees for user action
const feePayment = await algorand.createTransaction.payment({
  sender: sponsor.addr,
  receiver: appAddress,
  amount: feesAmount,
})

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: appId,
    method: sponsoredActionMethod,
    args: [feePayment],
  })
  .send()
```

## Best Practices

### 1. Validate Transaction Type

Always verify the transaction type matches expectations:

```teal
// ✅ Good: Verify transaction type
gtxn 0 TypeEnum
int pay
==
assert

// ❌ Bad: Assume transaction type without checking
gtxn 0 Amount  // Will fail if not a payment!
```

### 2. Validate Transaction Properties

Check all relevant properties:

```teal
// ✅ Good: Comprehensive validation
gtxn 0 Receiver
addr EXPECTED_RECEIVER
==
assert

gtxn 0 Amount
int MIN_AMOUNT
>=
assert

gtxn 0 CloseRemainderTo
global ZeroAddress
==
assert  // Prevent close-out attacks
```

### 3. Check Group Size

Ensure expected number of transactions:

```teal
// ✅ Good: Verify group size
global GroupSize
int 2
==
assert  // Expect exactly 2 transactions
```

### 4. Use Descriptive Argument Names

```typescript
// ✅ Good: Clear argument names
const method = new algosdk.ABIMethod({
  args: [
    { type: 'pay', name: 'userPayment', desc: 'Payment from user to service' },
    { type: 'string', name: 'serviceId', desc: 'ID of service to purchase' },
  ],
  // ...
})

// ❌ Less clear
const method = new algosdk.ABIMethod({
  args: [
    { type: 'pay' },
    { type: 'string' },
  ],
  // ...
})
```

### 5. Document Transaction Requirements

```typescript
/**
 * Purchases a service by validating payment.
 *
 * @param payment - Payment transaction that must:
 *   - Be sent from the customer
 *   - Be sent to the service provider address
 *   - Include the exact service fee amount
 *   - Not include a close-remainder-to field
 * @param serviceId - The ID of the service to purchase
 */
async function purchaseService(payment: Transaction, serviceId: string) {
  // ...
}
```

## Security Considerations

### 1. Prevent Close-Remainder-To Attacks

```teal
// Verify no close-remainder-to
gtxn 0 CloseRemainderTo
global ZeroAddress
==
assert
```

Without this check, a malicious user could drain their account after the payment.

### 2. Verify Transaction Sender

```teal
// Verify payment sender is the app caller
gtxn 0 Sender
txn Sender
==
assert
```

Prevents someone from submitting another person's payment.

### 3. Validate Receiver Address

```teal
// Verify payment goes to correct address
gtxn 0 Receiver
global CurrentApplicationAddress
==
assert
```

Prevents payment to wrong address.

### 4. Check for Rekeying

```teal
// Ensure no rekeying in the payment
gtxn 0 RekeyTo
global ZeroAddress
==
assert
```

Prevents unauthorized account control changes.

### 5. Validate Amount Exactly or as Minimum

```teal
// Option 1: Exact amount
gtxn 0 Amount
int EXACT_FEE
==
assert

// Option 2: Minimum amount
gtxn 0 Amount
int MIN_FEE
>=
assert
```

Prevents underpayment attacks.

## Error Handling

### Transaction Type Mismatch

```typescript
try {
  await algorand.newGroup().addAppCallMethodCall({
    method: methodExpectingPayment,
    args: [assetTransferTxn], // Wrong transaction type!
  }).send()
} catch (error) {
  if (error.message.includes('logic eval error')) {
    console.error('Transaction type validation failed in smart contract')
  }
}
```

### Group Size Validation Failure

```typescript
try {
  // Trying to send just the app call without the payment
  await algorand.send.appCall({
    method: methodExpectingPayment,
    // Missing payment transaction!
  })
} catch (error) {
  console.error('Smart contract expects payment transaction in group')
}
```

### Amount Validation Failure

```typescript
const payment = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: app.addr,
  amount: (0.001).algos(), // Too small!
})

try {
  await algorand.newGroup().addAppCallMethodCall({
    args: [payment],
  }).send()
} catch (error) {
  console.error('Payment amount below minimum requirement')
}
```

## Debugging Tips

### 1. Log Transaction Group Structure

```typescript
console.log('Transaction group:')
result.txIds.forEach((txId, i) => {
  console.log(`  [${i}] ${txId}`)
})
console.log('Group ID:', result.groupId)
```

### 2. Inspect Transaction Properties

```typescript
console.log('Payment details:')
console.log('  Sender:', paymentTxn.from?.toString())
console.log('  Receiver:', algosdk.encodeAddress(paymentTxn.to!.publicKey))
console.log('  Amount:', paymentTxn.amount)
```

### 3. Check TEAL Simulation

Use simulation mode to see TEAL execution:

```typescript
const simResult = await algorand.send.simulate({
  transactions: [paymentTxn, appCallTxn],
})
console.log('Simulation logs:', simResult.txnGroups[0].txnResults)
```

### 4. Verify Method Signature

```typescript
console.log('Method signature:', method.getSignature())
// Output: call_abi_txn(pay,string)string

console.log('Method selector:', Buffer.from(method.getSelector()).toString('hex'))
```

## Common Pitfalls

### Pitfall 1: Wrong Transaction Type

```typescript
// ❌ Wrong: Passing asset transfer when method expects payment
const assetTxn = await algorand.createTransaction.assetTransfer({ /* ... */ })

await algorand.newGroup().addAppCallMethodCall({
  method: methodExpectingPayment, // Expects type: 'pay'
  args: [assetTxn], // Type: 'axfer' - will fail!
}).send()

// ✅ Correct: Match transaction type to method signature
const paymentTxn = await algorand.createTransaction.payment({ /* ... */ })

await algorand.newGroup().addAppCallMethodCall({
  method: methodExpectingPayment,
  args: [paymentTxn],
}).send()
```

### Pitfall 2: Forgetting to Create Transaction First

```typescript
// ❌ Wrong: Trying to pass transaction parameters
await algorand.newGroup().addAppCallMethodCall({
  method: method,
  args: [
    { sender: user.addr, receiver: app.addr, amount: 5000 }, // Not a transaction!
  ],
}).send()

// ✅ Correct: Create transaction first
const paymentTxn = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: app.addr,
  amount: 5000,
})

await algorand.newGroup().addAppCallMethodCall({
  method: method,
  args: [paymentTxn],
}).send()
```

### Pitfall 3: Not Validating in Smart Contract

```teal
// ❌ Wrong: Assuming transaction properties without validation
gtxn 0 Amount  // Could be any amount!

// ✅ Correct: Validate before using
gtxn 0 TypeEnum
int pay
==
assert

gtxn 0 Amount
int MIN_AMOUNT
>=
assert
```

### Pitfall 4: Wrong gtxn Index

```typescript
// When you pass a transaction as an argument:
// Transaction is at index 0
// App call is at index 1

// ❌ Wrong: Using wrong index
gtxn 1 Amount  // This is the app call, not the payment!

// ✅ Correct: Use index 0 for the transaction argument
gtxn 0 Amount  // This is the payment transaction
```

## Related Examples

- [Example 119: Nested Method Calls - Method Call as Argument](../119-nested-method-calls---method-call-as-argument/README.md) - Passing app calls as arguments
- [Example 121: Pass Transaction as Method Argument](../121-pass-transaction-as-method-argument/README.md) - Alternative transaction argument patterns
- [Example 118: Multi-Account Transaction Groups](../118-multi-account-transaction-groups-with-different-signers/README.md) - Transaction groups with multiple signers

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
1. Deploy a smart contract with a method accepting a payment transaction
2. Create a payment transaction
3. Call the ABI method with the payment as an argument
4. Execute both transactions atomically
5. Display transaction IDs and confirmation
6. Show the method return value

You should see output showing:
- Application deployment confirmation
- Payment transaction details
- Transaction group execution with both transaction IDs
- Method return value: "Sent 5000. test"

## Key Takeaways

1. **Transactions as arguments**: ABI methods can accept transactions using type keywords
2. **Automatic grouping**: SDK creates atomic transaction groups automatically
3. **Smart contract access**: Use `gtxn` opcodes to read transaction properties
4. **Type validation essential**: Always verify transaction type in smart contract
5. **Common types**: pay, axfer, appl, afrz, acfg, keyreg
6. **Security critical**: Validate all transaction properties (receiver, amount, etc.)
7. **Atomic execution**: All transactions in group succeed or all fail
8. **Position matters**: Transaction arguments are positioned before the app call

This pattern is fundamental for building smart contracts that need to validate, process, or respond to specific transactions!
