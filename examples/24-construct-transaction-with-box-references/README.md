# Construct Transaction with Box References

This example demonstrates how to construct application call transactions with box references without immediately executing them. This is useful when you need to inspect, modify, or batch transactions before sending them to the network.

## What This Example Shows

This example teaches you how to:
- Construct transactions using `createTransaction.call()` instead of `send.call()`
- Use explicit box reference format with `{ appId, name }`
- Use shorthand box reference format with just the name string
- Mix both explicit and shorthand formats in the same transaction
- Include multiple box references in a single transaction
- Inspect constructed transactions before execution
- Understand when to construct vs. send transactions

## Why This Matters

Transaction construction is essential for advanced Algorand development:

1. **Transaction Inspection**: Review transactions before sending
2. **Complex Groups**: Build atomic transaction groups step by step
3. **Conditional Logic**: Decide whether to send based on transaction details
4. **Testing**: Construct transactions for testing without executing
5. **Custom Signing**: Handle custom signature requirements

Key concepts:
- **createTransaction.call()**: Constructs a transaction without sending
- **send.call()**: Constructs AND sends a transaction immediately
- **Box References**: Declarations of which boxes a transaction will access
- **Explicit Format**: `{ appId, name }` for full control
- **Shorthand Format**: Just the name string for current app boxes

Common use cases:
- **Atomic Groups**: Build multi-transaction groups before sending
- **Fee Optimization**: Calculate fees before submission
- **Signature Collection**: Construct for multi-signature workflows
- **Transaction Inspection**: Verify details before execution
- **Conditional Sending**: Send only if conditions are met

## How It Works

The example demonstrates constructing transactions with box references in different formats:

### 1. Create an Application

First, deploy an application that uses box storage:

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const testAccount = await algorand.account.fromEnvironment('LOCALNET')

const appFactory = algorand.client.getAppFactory({
  appSpec: appSpec,
  defaultSender: testAccount.addr,
})

const { appClient } = await appFactory.send.bare.create({
  deployTimeParams: {
    UPDATABLE: 0,
    DELETABLE: 0,
    VALUE: 1,
  },
})
```

### 2. Explicit Box Reference Format

Construct a transaction with explicit box references:

```typescript
const transactionWithExplicitBoxRef = await appClient.createTransaction.call({
  method: 'call_abi',
  args: ['test'],
  boxReferences: [
    {
      appId: appClient.appId,  // Explicit appId for current app
      name: 'box1'              // Box name as string
    }
  ],
})
```

The explicit format gives you full control:
- **appId**: Specify which application owns the box
- **name**: The box name (string or Uint8Array)
- Use this when referencing boxes from other applications

### 3. Shorthand Box Reference Format

Use the shorthand format for current app boxes:

```typescript
const transactionWithShorthandBoxRef = await appClient.createTransaction.call({
  method: 'call_abi',
  args: ['test'],
  boxReferences: ['box1'],  // Shorthand: just the box name
})
```

The shorthand format is more concise:
- Just provide the box name as a string
- Automatically assumes current application
- More readable for simple cases

### 4. Multiple Box References

You can mix both formats in the same transaction:

```typescript
const transactionWithMultipleBoxes = await appClient.createTransaction.call({
  method: 'call_abi',
  args: ['test'],
  boxReferences: [
    { appId: appClient.appId, name: 'box1' },  // Explicit
    { appId: appClient.appId, name: 'box2' },  // Explicit
    'box3',                                     // Shorthand
  ],
})
```

This flexibility allows you to:
- Reference boxes from multiple applications
- Mix explicit and shorthand formats
- Keep code readable while maintaining control

### 5. When to Use Each Format

**Explicit Format** (`{ appId, name }`):
```typescript
boxReferences: [
  { appId: 1234, name: 'box1' },      // Box from app 1234
  { appId: 5678, name: 'box2' },      // Box from app 5678
]
```
- Use when referencing boxes from specific apps
- Required for cross-application box access
- Gives full control over which app owns each box

**Shorthand Format** (just the name):
```typescript
boxReferences: ['box1', 'box2', 'box3']
```
- Use when all boxes are in the current app
- More concise and readable
- Automatically uses current application's appId

**Mixed Format**:
```typescript
boxReferences: [
  { appId: 1234, name: 'otherAppBox' },  // From another app
  'currentAppBox1',                       // From current app
  'currentAppBox2',                       // From current app
]
```
- Use when accessing boxes from multiple apps
- Keeps code concise while maintaining flexibility

## Construct vs. Send

Understanding the difference between constructing and sending:

**Construct** (`createTransaction.call()`):
```typescript
const txn = await appClient.createTransaction.call({
  method: 'myMethod',
  args: ['arg1'],
})

// Transaction is built but NOT sent
// You can inspect it, modify it, or add it to a group
```

**Send** (`send.call()`):
```typescript
const result = await appClient.send.call({
  method: 'myMethod',
  args: ['arg1'],
})

// Transaction is built AND sent immediately
// You get the result back
```

**When to use each**:
- Use `createTransaction` for:
  - Building atomic transaction groups
  - Inspecting before sending
  - Custom signing workflows
  - Testing without execution

- Use `send` for:
  - Simple, immediate transactions
  - When you don't need to inspect first
  - Standard single-transaction calls

## Prerequisites

- Node.js and npm installed
- AlgoKit installed (`pip install algokit` or `pipx install algokit`)
- Docker installed and running
- LocalNet running (`algokit localnet start`)

## Running the Example

1. Start LocalNet:
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

```
=== Construct Transaction with Box References ===

1. Using account: Y2SMRLH2JXMGHOX2Z5LZW36L6MKBP4F2BG433KC434ZXIAAWAO5UJ66TK4

2. Creating app...
  ✓ App created with ID: 1005

3. Method 1: Explicit Box Reference Format
   Constructing transaction with explicit box references...
  ✓ Transaction constructed successfully

  Transaction details:
    App ID: 1005
    Method: call_abi
    Box references: Explicit format with appId and name
      Format: { appId: 1005, name: 'box1' }

4. Method 2: Shorthand Box Reference Format
   Constructing transaction with shorthand box references...
  ✓ Transaction constructed successfully

  Transaction details:
    App ID: 1005
    Method: call_abi
    Box references: Shorthand format (name only)
      Format: 'box1'

5. Multiple Box References
   Constructing transaction with multiple boxes...
  ✓ Transaction constructed successfully

  Transaction details:
    App ID: 1005
    Method: call_abi
    Box references: 3 boxes
      Box 1: { appId: 1005, name: 'box1' } (explicit)
      Box 2: { appId: 1005, name: 'box2' } (explicit)
      Box 3: 'box3' (shorthand)

6. Box Reference Format Comparison

  Explicit format:
    boxReferences: [{ appId: 1234, name: "myBox" }]
    • Use when: Referencing boxes from specific apps
    • Advantage: Full control over which app owns the box

  Shorthand format:
    boxReferences: ["myBox"]
    • Use when: Referencing boxes in the current app
    • Advantage: More concise and readable

  You can mix both formats in the same transaction!

=== Summary ===
✅ Successfully demonstrated transaction construction with box references!

Key points:
  • createTransaction.call() constructs without executing
  • Explicit format: { appId, name } for full control
  • Shorthand format: just the name string for current app
  • Both formats can be mixed in the same transaction
  • Multiple box references can be included
  • Use send.call() when ready to execute the transaction

=== Key Takeaways ===
• Use createTransaction.call() to construct without sending
• Explicit format gives full control over appId and name
• Shorthand format is convenient for current app boxes
• Inspect constructed transactions before sending
• Use send.call() when ready to execute the transaction
```

## Common Patterns

### Construct for Inspection

```typescript
const txn = await appClient.createTransaction.call({
  method: 'myMethod',
  args: ['arg1'],
  boxReferences: ['box1'],
})

// Inspect the transaction
console.log(`Transaction ID: ${txn.transaction.txID()}`)
console.log(`Fee: ${txn.transaction.txn.fee} microAlgos`)

// Send if conditions are met
if (txn.transaction.txn.fee < 2000) {
  await appClient.send.call({
    method: 'myMethod',
    args: ['arg1'],
    boxReferences: ['box1'],
  })
}
```

### Build Atomic Transaction Group

```typescript
const txn1 = await appClient.createTransaction.call({
  method: 'method1',
  args: [],
  boxReferences: ['box1'],
})

const txn2 = await appClient.createTransaction.call({
  method: 'method2',
  args: [],
  boxReferences: ['box2'],
})

// Combine into atomic group and send
await algorand.send.newGroup().addTransaction(txn1).addTransaction(txn2).send()
```

### Cross-Application Box References

```typescript
const txn = await appClient.createTransaction.call({
  method: 'accessMultipleApps',
  args: [],
  boxReferences: [
    { appId: appClient.appId, name: 'myBox' },  // Current app
    { appId: 1234, name: 'otherBox' },          // Another app
  ],
})
```

### Dynamic Box Names

```typescript
const userId = 'user123'
const boxName = `user_${userId}`

const txn = await appClient.createTransaction.call({
  method: 'updateUser',
  args: [userId],
  boxReferences: [boxName],  // Shorthand with dynamic name
})
```

## Error Handling

**Missing Box Reference**
If your contract tries to access a box that isn't referenced:
```
logic eval error: invalid Box reference
```

Solution: Include all boxes your contract will access in the `boxReferences` array.

**Wrong App ID**
If you specify the wrong `appId` for a box:
```
logic eval error: invalid Box reference
```

Solution: Ensure the `appId` matches the application that owns the box.

## Key Takeaways

- Use `createTransaction.call()` to construct transactions without sending them
- Explicit format `{ appId, name }` gives full control over box references
- Shorthand format (just the name string) is convenient for current app boxes
- Both formats can be mixed in the same transaction for flexibility
- Multiple box references can be included in a single transaction
- Constructed transactions can be inspected before execution
- Use `send.call()` when you're ready to execute the transaction
- Transaction construction is essential for building atomic transaction groups
- Inspect transactions to verify fees, parameters, and box references
- The shorthand format automatically uses the current application's appId
- You can reference boxes from multiple applications in one transaction
- Transaction construction enables advanced workflows like custom signing
- Always include all boxes that your contract will access

