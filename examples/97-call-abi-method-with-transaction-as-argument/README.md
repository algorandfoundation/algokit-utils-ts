# Call ABI Method with Transaction as Argument

This example demonstrates how to call an ABI method that accepts a transaction as one of its arguments. This powerful pattern enables smart contracts to verify and react to other transactions in the same atomic group, creating complex transaction composition workflows.

## Key Concepts

- **Transaction Arguments**: ABI methods can accept transactions as parameters
- **Atomic Grouping**: The SDK automatically groups the transaction argument with the app call
- **Transaction Reference**: The contract receives a reference to the transaction in the same group
- **Pre-Created Transactions**: Create transactions before passing them as arguments
- **Transaction with Signer**: Wrap transactions with their signer for proper execution

## What This Example Shows

1. Deploying a smart contract that accepts transaction arguments
2. Creating a payment transaction to pass as an argument
3. Calling an ABI method with the transaction as a parameter
4. Automatic atomic grouping of transactions
5. Accessing the return value that processes the transaction argument

## Code Walkthrough

### Setup and Deploy App

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const alice = algorand.account.random()
await algorand.account.ensureFunded(alice, dispenser, (5).algos())

const bob = algorand.account.random()
await algorand.account.ensureFunded(bob, dispenser, (1).algos())

// Deploy the app
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
```

Create test accounts and deploy the TestingApp contract that has a method accepting transaction arguments.

### Create the Payment Transaction

```typescript
const paymentAmount = (0.5).algos()

const paymentTxn = await algorand.createTransaction.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: paymentAmount,
})
```

**Key point**: Create the transaction first using `algorand.createTransaction.payment()`. This returns a `Transaction` object that can be passed as an argument.

### Call Method with Transaction Argument

```typescript
const result = await appClient.send.callAbiTxn({
  args: {
    txn: { txn: paymentTxn, signer: alice.signer },
    value: 'Hello from transaction argument!',
  },
})
```

**Critical pattern**:
- Wrap the transaction with `{ txn: paymentTxn, signer: alice.signer }`
- The SDK automatically:
  1. Groups the payment and app call together
  2. Ensures atomic execution
  3. Encodes the transaction reference for ABI
  4. Signs both transactions
  5. Sends them as a group

### Process Results

```typescript
console.log('Transaction ID:', result.transaction.txID())
console.log('Group ID:', result.groupId)
console.log('Return value:', result.return)
```

The return value shows the contract successfully processed the payment transaction. In this example, it returns: `"Sent 500000. Hello from transaction argument!"`

## API Patterns (AlgoKit Utils v9.1.2)

### Create Transaction

```typescript
const transaction = await algorand.createTransaction.payment({
  sender: senderAddress,
  receiver: receiverAddress,
  amount: (1).algos(),
})
```

Returns an algosdk `Transaction` object.

### Pass Transaction as Argument

```typescript
const result = await appClient.send.methodName({
  args: {
    txn: { txn: transaction, signer: account.signer },
    // other arguments...
  },
})
```

**TransactionWithSigner format**:
- `txn`: The pre-created Transaction object
- `signer`: The signer that will sign this transaction

### Alternative: Inline Transaction Creation

For simpler cases, you can also create the transaction inline:

```typescript
const result = await appClient.send.methodName({
  args: {
    txn: {
      txn: await algorand.createTransaction.payment({
        sender: alice.addr,
        receiver: bob.addr,
        amount: (1).algos(),
      }),
      signer: alice.signer,
    },
    // other arguments...
  },
})
```

## Common Use Cases

### Payment Verification

Verify a payment was made before performing an action:

```typescript
// Create payment from user to contract
const payment = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: appAddress,
  amount: requiredPayment,
})

// Call method that verifies the payment
await appClient.send.processPayment({
  args: {
    payment: { txn: payment, signer: user.signer },
  },
})
```

### Asset Transfer Validation

Validate asset transfers in the contract:

```typescript
const assetTransfer = await algorand.createTransaction.assetTransfer({
  sender: user.addr,
  receiver: appAddress,
  assetId: tokenId,
  amount: 100n,
})

await appClient.send.acceptAssets({
  args: {
    transfer: { txn: assetTransfer, signer: user.signer },
  },
})
```

### Multi-Party Coordination

Coordinate actions between multiple accounts:

```typescript
// User sends payment
const userPayment = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: merchant.addr,
  amount: purchasePrice,
})

// App verifies and processes
await appClient.send.completePurchase({
  args: {
    payment: { txn: userPayment, signer: user.signer },
    orderId: 'ORDER-123',
  },
})
```

### Escrow Release

Release funds from an escrow based on conditions:

```typescript
const escrowPayment = await algorand.createTransaction.payment({
  sender: escrowAccount.addr,
  receiver: beneficiary.addr,
  amount: escrowAmount,
})

await appClient.send.releaseEscrow({
  args: {
    release: { txn: escrowPayment, signer: escrowAccount.signer },
    condition: 'FULFILLED',
  },
})
```

## Important Considerations

### Transaction Type Support

The `AppMethodCallTransactionArgument` type accepts:
- `TransactionWithSigner`: `{ txn: Transaction, signer: TransactionSigner }`
- `Transaction`: Bare Transaction object
- `Promise<Transaction>`: Async transaction creation
- `AppMethodCall`: Nested method calls

### Atomic Grouping

```typescript
// When you pass a transaction as an argument:
// 1. Payment transaction (txn argument)
// 2. App call transaction (method call)
// These are automatically grouped atomically
```

**Important**: All transactions in the group succeed or all fail. This ensures the contract can trust the transaction argument exists.

### Transaction Order

The transaction passed as an argument always comes **before** the app call in the group:

```
Group:
  [0] Payment transaction (argument)
  [1] App call transaction (method)
```

The contract accesses the transaction using `gtxn` opcodes with index 0.

### Signer Requirements

```typescript
// Correct: Provide signer
const result = await appClient.send.method({
  args: {
    txn: { txn: transaction, signer: account.signer },
  },
})

// Incorrect: Missing signer will cause signing errors
const result = await appClient.send.method({
  args: {
    txn: transaction,  // Missing signer wrapper
  },
})
```

### Transaction Parameters

The transaction must have valid parameters:
- **Sender**: Must match the signer
- **Amount**: Must be valid for the transaction type
- **Receiver**: Must be a valid address
- **Fee**: Will be set automatically if not specified

### Multiple Transaction Arguments

Some methods accept multiple transactions:

```typescript
const payment1 = await algorand.createTransaction.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: (1).algos(),
})

const payment2 = await algorand.createTransaction.payment({
  sender: bob.addr,
  receiver: charlie.addr,
  amount: (0.5).algos(),
})

await appClient.send.processTwoPayments({
  args: {
    payment1: { txn: payment1, signer: alice.signer },
    payment2: { txn: payment2, signer: bob.signer },
  },
})

// Resulting group:
// [0] payment1
// [1] payment2
// [2] app call
```

### Error Handling

```typescript
try {
  const result = await appClient.send.methodWithTxnArg({
    args: {
      txn: { txn: payment, signer: account.signer },
    },
  })
} catch (error) {
  // Common errors:
  // - Transaction validation failed
  // - Insufficient balance for payment
  // - Signer mismatch
  // - Contract logic rejected the transaction
  console.error('Failed to call method with transaction:', error)
}
```

## Smart Contract Considerations

### Accessing Transaction Arguments

In your Tealish/PyTeal smart contract:

```python
@abimethod
def call_abi_txn(payment: abi.PaymentTransaction, message: abi.String) -> abi.String:
    # Access the payment transaction
    assert payment.get().receiver() == Global.current_application_address()
    amount = payment.get().amount()

    # Process the transaction
    return abi.String(f"Received {amount} microAlgos: {message}")
```

### Transaction Verification

Common verifications in contracts:
- **Receiver**: Ensure payment goes to correct address
- **Amount**: Verify payment meets minimum requirements
- **Type**: Confirm transaction is the expected type
- **Sender**: Validate the sender is authorized

### Group Transaction Access

```python
# In the smart contract:
# txn argument is at index 0 (or earlier in the group)
# current app call is at index 1 (or later)

payment_txn = Gtxn[Txn.group_index() - 1]  # Previous transaction
assert payment_txn.type_enum() == TxnType.Payment
```

## Expected Output

```
Alice address: QAJRXA26I5QKT7N5OTU4QYNMPWZR2A4FLFATCPMCQMCHVSWEWO7NO6666Y
Bob address: M2UH2RU4AY6B3IUFJAB5WQRD7Q7AJVEA5PPVNO7PM6X4H6VJFWONRSGAAQ

Deploying app...
App deployed with ID: 1600

Creating payment transaction for 500000 microAlgos (0.5 ALGOs)
Payment: Alice → Bob

Calling ABI method with transaction argument...
Method: call_abi_txn(pay, string)

✅ Transaction group sent successfully!
Transaction ID: 3O5FF4DLOBIHCYWLVPHFE6OQ5XIZMPNMAITKD7ZSKJGWJ54QL45A
Group ID: 1MxUNDXCNRn0Rb1wW/C1Yh4aQZeX8IRLrIbsRgTrrt4=

Return value: Sent 500000. Hello from transaction argument!

The app call transaction received the payment transaction as an argument.
Payment of 500000 microAlgos was processed in the same atomic group.

✅ Example completed successfully!
```

## Running the Example

### Prerequisites

1. Start AlgoKit LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Execute

```bash
npm start
```

The example will:
1. Create and fund test accounts (Alice and Bob)
2. Deploy the TestingApp smart contract
3. Create a payment transaction (0.5 ALGO from Alice to Bob)
4. Call the ABI method with the transaction as an argument
5. Display the transaction results and return value

## Debugging Transaction Arguments

### Check Transaction Creation

```typescript
const txn = await algorand.createTransaction.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: (1).algos(),
})

console.log('Transaction type:', txn.type)
console.log('From:', algosdk.encodeAddress(txn.from.publicKey))
console.log('To:', algosdk.encodeAddress(txn.to.publicKey))
console.log('Amount:', txn.amount)
```

### Verify Group Formation

```typescript
const result = await appClient.send.method({
  args: { txn: { txn: payment, signer: alice.signer } },
})

console.log('Group ID:', result.groupId)
console.log('Transaction ID:', result.transaction.txID())
```

### Contract Tracing

Enable trace output to see how the contract processes the transaction:

```typescript
const result = await appClient.send.method({
  args: { txn: { txn: payment, signer: alice.signer } },
})

// Check the app call return value
console.log('Contract response:', result.return)
```

## Advanced Patterns

### Conditional Transaction Arguments

```typescript
const shouldPayApp = checkCondition()

const payment = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: shouldPayApp ? appAddress : otherAddress,
  amount: requiredAmount,
})

await appClient.send.conditionalMethod({
  args: {
    payment: { txn: payment, signer: user.signer },
    condition: shouldPayApp,
  },
})
```

### Transaction Argument with Reference Types

```typescript
// Payment with asset reference
const payment = await algorand.createTransaction.payment({
  sender: user.addr,
  receiver: appAddress,
  amount: (1).algos(),
})

await appClient.send.processPaymentAndAsset({
  args: {
    payment: { txn: payment, signer: user.signer },
  },
  assetReferences: [assetId],  // Additional references
})
```

### Nested Method Calls with Transactions

```typescript
// Pass both a transaction and a nested method call
await parentApp.send.complexOperation({
  args: {
    payment: { txn: payment, signer: user.signer },
    nestedCall: childApp.params.someMethod({ value: 42 }),
  },
})
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [ABI Transaction Arguments](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/ABI/)
- [Atomic Transfers](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [Group Transactions](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [Transaction Types](https://developer.algorand.org/docs/get-details/transactions/)
