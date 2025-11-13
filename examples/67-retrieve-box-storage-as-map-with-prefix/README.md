# Retrieve Box Storage as Map with Prefix

Demonstrates how to retrieve and work with box storage on Algorand, showing how boxes provide efficient key-value storage for smart contracts.

## What This Example Shows

1. **Box Storage Creation** - Creating boxes in a deployed application
2. **Box Retrieval** - Listing all boxes for an application
3. **Box Value Reading** - Reading values from specific boxes
4. **Box Maps Concept** - Understanding prefix-based organization
5. **App Account Funding** - Funding app accounts for box MBR (Minimum Balance Requirement)
6. **algod API Usage** - Using getApplicationBoxes() and getApplicationBoxByName()

## Why This Matters

Box storage is essential for:
- **Large Data Storage**: Store more data than global/local state allows
- **Dynamic Data**: Create and delete storage as needed
- **Key-Value Pairs**: Efficient lookups by box name
- **Cost Efficiency**: Pay only for storage you use
- **Organized Data**: Use prefixes to group related data

## How It Works

### 1. Deploy Application

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const deployer = await algorand.account.fromEnvironment('DEPLOYER', algo(10))

const factory = algorand.client.getAppFactory({
  appSpec: appSpec as any,
  defaultSender: deployer.addr,
})

const { result: app } = await factory.deploy({
  deployTimeParams: { VALUE: 1 },
  deletable: true,
  updatable: true,
})
```

### 2. Fund App Account for Box Storage

```typescript
const appAddress = getApplicationAddress(app.appId)
await algorand.send.payment({
  sender: deployer.addr,
  receiver: appAddress,
  amount: algo(0.5), // Fund for box MBR
})
```

**Why**: Box storage requires the app account to maintain minimum balance.

### 3. Create Box

```typescript
await appClient.send.call({
  method: 'set_box',
  args: [new Uint8Array([1, 2, 3, 4]), 'test data'],
})
```

### 4. Retrieve Boxes

```typescript
const boxes = await algorand.client.algod.getApplicationBoxes(app.appId).do()

for (const box of boxes.boxes) {
  const boxValue = await algorand.client.algod
    .getApplicationBoxByName(app.appId, box.name)
    .do()
  console.log(`Value: ${Buffer.from(boxValue.value).toString('utf-8')}`)
}
```

## Prerequisites

- AlgoKit installed
- Docker Desktop (for LocalNet)
- Node.js and npm

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
=== Box Map Retrieval Example ===

Using deployer account: CE3U3ARY6G5OQGFSJUBY3QUREETSPZYXQ2LODEKQLPROEZE44USUU4AIQY

Step 1: Deploying application with box storage support...
✓ App deployed with ID: 1126
  App address: 56H5MINYAAFY5R5ONKCGUFZXXJL6YTN3CYZAOZHBBROOTPKLKBOVHOXXR4
✓ App account funded for box storage

Step 2: Creating box storage...
✓ Box created with key [1, 2, 3, 4] and value "test data"

Step 3: Retrieving box values...

=== Box Storage Contents ===
Total boxes: 1

Box Names:
  - Box name (hex): 01020304
    Value: test data

✅ Successfully retrieved box storage!

=== Box Map Concept ===
Box maps organize data with prefixes for efficient retrieval:
  - Prefix "user:" for user data (e.g., "user:alice", "user:bob")
  - Prefix "config:" for config data (e.g., "config:fee", "config:limit")
  - This allows filtering and organizing related data together
```

## Key Concepts

### Box Storage MBR

Each box requires minimum balance:
- **Box MBR** = 2,500 + 400 * (box_name_length + box_value_length) microAlgos
- App account must maintain this balance
- MBR is returned when box is deleted

### Box Name Prefixes

Organize boxes with prefixes:
```
user:alice -> { balance: 100, level: 5 }
user:bob   -> { balance: 200, level: 3 }
config:fee -> 1000
config:max -> 10000
```

This allows:
- Efficient filtering by prefix
- Logical data organization
- Namespace separation

### Box Storage APIs

```typescript
// List all boxes
await algod.getApplicationBoxes(appId).do()

// Get specific box value
await algod.getApplicationBoxByName(appId, boxName).do()
```

## Common Patterns

### 1. Create and Read Box

```typescript
// Create
await appClient.send.call({
  method: 'set_box',
  args: [boxName, boxValue],
})

// Read
const box = await algod.getApplicationBoxByName(appId, boxName).do()
const value = Buffer.from(box.value).toString('utf-8')
```

### 2. List All Boxes

```typescript
const boxes = await algod.getApplicationBoxes(appId).do()
console.log(`Total boxes: ${boxes.boxes.length}`)

for (const box of boxes.boxes) {
  console.log(`Box: ${Buffer.from(box.name).toString('hex')}`)
}
```

### 3. Box with Prefix Organization

```typescript
// Create boxes with prefixes
await createBox('user:alice', userData1)
await createBox('user:bob', userData2)
await createBox('config:fee', configData)

// Filter by prefix
const allBoxes = await algod.getApplicationBoxes(appId).do()
const userBoxes = allBoxes.boxes.filter((box) =>
  Buffer.from(box.name).toString().startsWith('user:')
)
```

### 4. Calculate Box MBR

```typescript
function calculateBoxMBR(boxNameLength: number, boxValueLength: number): number {
  return 2500 + 400 * (boxNameLength + boxValueLength)
}

// Fund app for 10 boxes of 32-byte names and 128-byte values
const boxMBR = calculateBoxMBR(32, 128) * 10
await fundAppAccount(appAddress, boxMBR)
```

## Best Practices

### 1. Always Fund App Account First

**Good**:
```typescript
// Fund before creating boxes
await algorand.send.payment({
  sender: deployer.addr,
  receiver: appAddress,
  amount: algo(0.5),
})

// Then create boxes
await appClient.send.call({ method: 'set_box', args: [...] })
```

**Avoid**:
```typescript
// Creating box without funding
await appClient.send.call({ method: 'set_box', args: [...] })
// Will fail: insufficient balance
```

### 2. Use Meaningful Box Names

**Good**:
```typescript
// Descriptive names with prefixes
await createBox('user:alice', userData)
await createBox('transaction:tx123', txData)
```

**Avoid**:
```typescript
// Opaque names
await createBox('box1', data)
await createBox('x', moreData)
```

### 3. Handle Box Not Found Errors

**Good**:
```typescript
try {
  const box = await algod.getApplicationBoxByName(appId, boxName).do()
  return Buffer.from(box.value)
} catch (error) {
  if (error.status === 404) {
    console.log('Box not found')
    return null
  }
  throw error
}
```

### 4. Clean Up Unused Boxes

**Good**:
```typescript
// Delete boxes when no longer needed
await appClient.send.call({
  method: 'delete_box',
  args: [boxName],
})
// MBR is returned to app account
```

## Key Takeaways

1. **Box storage** provides flexible key-value storage for smart contracts
2. **Fund app accounts** before creating boxes to cover MBR
3. **Use prefixes** to organize and filter related data
4. **getApplicationBoxes()** lists all boxes for an application
5. **getApplicationBoxByName()** retrieves specific box values
6. **Box MBR** is returned when boxes are deleted
7. **Higher fees** may be needed for box operations due to budget requirements
