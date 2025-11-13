# Construct Application Call Transaction with Box References

This example demonstrates how to construct and send application call transactions that include box storage references. Box references are required when your smart contract needs to access box storage during execution.

## What This Example Shows

This example teaches you how to:
- Include box references in application calls
- Specify multiple box references in a single transaction
- Use different formats for box names (strings or Uint8Array)
- Reference boxes from the current application
- Understand why box references are necessary

## Why This Matters

Box references are essential for smart contracts using box storage:

1. **Box Storage Access**: Contracts must declare which boxes they'll access
2. **AVM Requirement**: The Algorand Virtual Machine requires explicit box references
3. **Multiple Boxes**: You can reference multiple boxes in one transaction
4. **Storage Efficiency**: Box storage provides efficient key-value storage for contracts
5. **Cost Management**: Only pay for the boxes you actually use

Key concepts:
- **Box Storage**: Key-value storage for smart contracts
- **Box References**: Declarations of which boxes a transaction will access
- **boxReferences Parameter**: How to specify boxes in transaction calls
- **appId**: Identifies which application owns the box

Common use cases:
- **Data Storage**: Store application data in boxes
- **User Records**: Individual boxes for user data
- **Game State**: Store game state across transactions
- **NFT Metadata**: Store metadata in box storage
- **Cross-Contract Storage**: Access boxes from other applications

## How It Works

The example demonstrates including box references in an application call:

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

### 2. Call with Box References

Include box references when calling the application:

```typescript
const call = await appClient.send.call({
  method: 'call_abi',
  args: ['test'],
  boxReferences: [
    {
      appId: appClient.appId,  // Reference the current app
      name: 'box1'             // Box name as string
    },
    {
      appId: appClient.appId,
      name: 'box2'             // You can reference multiple boxes
    }
  ],
})
```

The `boxReferences` parameter tells the AVM which boxes this transaction is allowed to access.

### 3. Box Reference Format

Each box reference contains:
- **appId**: The application ID that owns the box
- **name**: The box name (string or Uint8Array)

```typescript
// String name
{ appId: 1234, name: 'myBox' }

// Uint8Array name
{ appId: 1234, name: new TextEncoder().encode('myBox') }

// Current app (use appClient.appId)
{ appId: appClient.appId, name: 'box1' }
```

### 4. Multiple Box References

You can reference multiple boxes in a single transaction:

```typescript
boxReferences: [
  { appId: appClient.appId, name: 'box1' },
  { appId: appClient.appId, name: 'box2' },
  { appId: appClient.appId, name: 'box3' },
]
```

This is necessary when your contract accesses multiple boxes during execution.

### 5. Cross-Application Box References

You can also reference boxes from other applications:

```typescript
boxReferences: [
  { appId: appClient.appId, name: 'myBox' },      // Current app
  { appId: 5678, name: 'otherAppBox' },           // Another app
]
```

The calling contract must have permission to access the other application's boxes.

## Box Storage Basics

**What are Boxes?**
- Key-value storage for smart contracts
- Each box has a name (key) and contents (value)
- Boxes are owned by applications
- More cost-effective than global/local storage for large data

**Box Costs**
- Pay per byte of storage used
- Minimum balance increase based on box size
- More efficient than account storage for large data

**Why References?**
- The AVM needs to know which boxes will be accessed
- Prevents contracts from accessing arbitrary storage
- Enables efficient transaction processing
- Required for box read/write operations

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
=== Construct Application Call Transaction with Box References ===

1. Using account: Y2SMRLH2JXMGHOX2Z5LZW36L6MKBP4F2BG433KC434ZXIAAWAO5UJ66TK4

2. Creating app...
  ✓ App created with ID: 1002

3. Calling method with box references...
  ✓ Transaction sent successfully
  ✓ Transaction ID: MADNOJBEEDNVWITEUR4YU6SP5VNQXVFZQ3LL4QHL7CUUTYHSVSQA

  Box references included in transaction:
    Box 1:
      appId: 1002
      name: "box1"
    Box 2:
      appId: 1002
      name: "box2"

4. Box reference formats:
  You can specify box names as:
    • Strings: { appId: 0, name: "myBox" }
    • Uint8Array: { appId: 0, name: new TextEncoder().encode("myBox") }
    • Reference boxes from other apps: { appId: 123, name: "box" }

=== Summary ===
✅ Successfully demonstrated box reference construction!

Key points:
  • Box references are required when contracts access box storage
  • Specify boxes using the boxReferences parameter
  • You can reference multiple boxes in a single transaction
  • Box names can be strings or Uint8Array
  • Box references tell the AVM which boxes can be accessed

=== Key Takeaways ===
• Use boxReferences parameter to specify box storage access
• Provide appId and name for each box reference
• Multiple boxes can be referenced in one transaction
• Box references are essential for box storage operations
```

## Common Patterns

### Single Box Access

```typescript
await appClient.send.call({
  method: 'readBox',
  args: [],
  boxReferences: [
    { appId: appClient.appId, name: 'userData' }
  ],
})
```

### Multiple Box Access

```typescript
await appClient.send.call({
  method: 'processMultipleBoxes',
  args: [],
  boxReferences: [
    { appId: appClient.appId, name: 'box1' },
    { appId: appClient.appId, name: 'box2' },
    { appId: appClient.appId, name: 'box3' },
  ],
})
```

### Dynamic Box Names

```typescript
const userId = 'user123'
const boxName = `user_${userId}`

await appClient.send.call({
  method: 'updateUser',
  args: [userId],
  boxReferences: [
    { appId: appClient.appId, name: boxName }
  ],
})
```

## Error Handling

**Missing Box Reference**
If your contract tries to access a box that isn't referenced, you'll get an error:
```
logic eval error: invalid Box reference
```

Solution: Include all boxes your contract will access in the `boxReferences` array.

**Invalid Box Name**
Box names must match exactly (case-sensitive):
```typescript
// Contract expects 'userData'
boxReferences: [
  { appId: appClient.appId, name: 'userData' }  // ✓ Correct
  // { appId: appClient.appId, name: 'userdata' }  // ✗ Wrong case
]
```

## Key Takeaways

- Use `boxReferences` parameter to specify box storage access in application calls
- Each box reference needs an `appId` and `name`
- Box names can be strings or Uint8Array
- Multiple boxes can be referenced in a single transaction
- Box references are required for any box read/write operations
- The AVM validates that only referenced boxes are accessed
- You can reference boxes from other applications (with proper permissions)
- Box storage is more cost-effective than global/local storage for large data
- Missing box references will cause transaction failures
- Box references enable efficient and secure box storage operations
