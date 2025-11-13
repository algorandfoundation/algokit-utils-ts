# Retrieve Value from Box Map by Key

Demonstrates how to retrieve specific box storage values by key, showing targeted lookups without listing all boxes.

## What This Example Shows

1. **Box Storage Creation** - Creating multiple boxes with different keys
2. **Targeted Retrieval** - Retrieving specific box values by key
3. **Direct Lookup** - Using `getApplicationBoxByName()` for efficient access
4. **Error Handling** - Handling non-existent box keys gracefully
5. **Box Key Structure** - Working with byte array keys (4-byte keys in this example)
6. **Multiple Box Management** - Managing different boxes for different purposes
7. **Box Not Found** - Detecting and handling 404 errors for missing boxes

## Why This Matters

Retrieving boxes by key is essential for:
- **Efficient Lookups**: Access specific data without listing all boxes
- **User Data Access**: Retrieve individual user records
- **Configuration Retrieval**: Fetch specific config values
- **Performance**: O(1) access time for known keys
- **Scalability**: Works efficiently even with many boxes
- **API Efficiency**: Reduces network overhead by fetching only needed data

## How It Works

### 1. Deploy Application and Fund Account

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

// Fund app account for box storage
const appAddress = getApplicationAddress(app.appId)
await algorand.send.payment({
  sender: deployer.addr,
  receiver: appAddress,
  amount: algo(1),
})
```

**Why**: App account must be funded before creating boxes to cover MBR.

### 2. Create Boxes with Different Keys

```typescript
const appClient = factory.getAppClientById({ appId: app.appId })

// Create box with key 1
const key1 = new Uint8Array([0, 0, 0, 1])
await appClient.send.call({
  method: 'set_box',
  args: [key1, 'User 1: Alice, balance=100'],
})

// Create box with key 2
const key2 = new Uint8Array([0, 0, 0, 2])
await appClient.send.call({
  method: 'set_box',
  args: [key2, 'User 2: Bob, balance=200'],
})

// Create box with key 100
const key100 = new Uint8Array([0, 0, 0, 100])
await appClient.send.call({
  method: 'set_box',
  args: [key100, 'Config: fee=1000'],
})
```

**Why**: Creating multiple boxes with different keys demonstrates the map-like structure.

### 3. Retrieve Specific Box by Key

```typescript
// Direct lookup by key
const box1 = await algorand.client.algod
  .getApplicationBoxByName(app.appId, key1)
  .do()
const value1 = Buffer.from(box1.value).toString('utf-8')
console.log(`Found: ${value1}`)
```

**Key Point**: `getApplicationBoxByName()` provides O(1) direct access to a specific box.

### 4. Handle Non-Existent Keys

```typescript
try {
  const key99 = new Uint8Array([0, 0, 0, 99])
  await algorand.client.algod
    .getApplicationBoxByName(app.appId, key99)
    .do()
} catch (error) {
  if (error.status === 404) {
    console.log('Box not found')
  }
}
```

**Why**: Gracefully handle cases where a box doesn't exist.

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
=== Retrieve Box Value by Key Example ===

Using deployer account: CE3U3ARY6G5OQGFSJUBY3QUREETSPZYXQ2LODEKQLPROEZE44USUU4AIQY

Step 1: Deploying application with box storage support...
✓ App deployed with ID: 1126
  App address: 56H5MINYAAFY5R5ONKCGUFZXXJL6YTN3CYZAOZHBBROOTPKLKBOVHOXXR4
✓ App account funded for box storage

Step 2: Creating boxes with different keys...
✓ Box created with key [0, 0, 0, 1] for User 1
✓ Box created with key [0, 0, 0, 2] for User 2
✓ Box created with key [0, 0, 0, 100] for config

Step 3: Retrieving box values by specific keys...

Retrieving box with key [0, 0, 0, 1]...
  ✓ Found: User 1: Alice, balance=100

Retrieving box with key [0, 0, 0, 2]...
  ✓ Found: User 2: Bob, balance=200

Retrieving box with key [0, 0, 0, 100]...
  ✓ Found: Config: fee=1000

Trying to retrieve non-existent box with key [0, 0, 0, 99]...
  ✓ Box not found (expected)

=== Summary ===
Successfully retrieved specific box values by key!

✅ Example completed successfully
```

## Key Concepts

### Direct Box Retrieval

`getApplicationBoxByName()` provides efficient direct access:
- **No Iteration**: Doesn't require listing all boxes first
- **O(1) Access**: Constant time lookup by key
- **Network Efficient**: Single API call per box
- **Type Safe**: Returns exact box value for known key

### Box Key Structure

Keys in this example use 4-byte arrays:
```typescript
const key1 = new Uint8Array([0, 0, 0, 1])    // User 1
const key2 = new Uint8Array([0, 0, 0, 2])    // User 2
const key100 = new Uint8Array([0, 0, 0, 100]) // Config
```

**Why 4 bytes**: The HelloWorld contract's `set_box` method requires `byte[4]` (static 4-byte array).

### Error Handling

```typescript
try {
  const box = await algod.getApplicationBoxByName(appId, key).do()
  return Buffer.from(box.value)
} catch (error) {
  if (error.status === 404) {
    // Box doesn't exist
    return null
  }
  throw error
}
```

## Common Patterns

### 1. Retrieve User Data by ID

```typescript
async function getUserData(appId: bigint, userId: number) {
  const key = new Uint8Array([0, 0, 0, userId])
  try {
    const box = await algod.getApplicationBoxByName(appId, key).do()
    return Buffer.from(box.value).toString('utf-8')
  } catch (error) {
    if (error.status === 404) return null
    throw error
  }
}

const aliceData = await getUserData(appId, 1)
const bobData = await getUserData(appId, 2)
```

### 2. Check if Box Exists

```typescript
async function boxExists(appId: bigint, key: Uint8Array): Promise<boolean> {
  try {
    await algod.getApplicationBoxByName(appId, key).do()
    return true
  } catch (error) {
    if (error.status === 404) return false
    throw error
  }
}

if (await boxExists(appId, key1)) {
  console.log('Box exists')
}
```

### 3. Get Box with Default Value

```typescript
async function getBoxOrDefault(
  appId: bigint,
  key: Uint8Array,
  defaultValue: string
): Promise<string> {
  try {
    const box = await algod.getApplicationBoxByName(appId, key).do()
    return Buffer.from(box.value).toString('utf-8')
  } catch (error) {
    if (error.status === 404) return defaultValue
    throw error
  }
}

const fee = await getBoxOrDefault(appId, key100, '0')
```

### 4. Batch Retrieve with Parallel Requests

```typescript
async function getMultipleBoxes(
  appId: bigint,
  keys: Uint8Array[]
): Promise<Map<string, string>> {
  const results = new Map()

  const promises = keys.map(async (key) => {
    try {
      const box = await algod.getApplicationBoxByName(appId, key).do()
      const keyHex = Buffer.from(key).toString('hex')
      const value = Buffer.from(box.value).toString('utf-8')
      return { keyHex, value }
    } catch (error) {
      if (error.status === 404) return null
      throw error
    }
  })

  const settled = await Promise.all(promises)
  settled.forEach((result) => {
    if (result) results.set(result.keyHex, result.value)
  })

  return results
}
```

## Best Practices

### 1. Always Handle 404 Errors

**Good**:
```typescript
try {
  const box = await algod.getApplicationBoxByName(appId, key).do()
  return Buffer.from(box.value)
} catch (error) {
  if (error.status === 404) {
    return null // or throw custom error
  }
  throw error
}
```

**Avoid**:
```typescript
// Assuming box always exists
const box = await algod.getApplicationBoxByName(appId, key).do()
// Will throw if box doesn't exist
```

### 2. Use Consistent Key Encoding

**Good**:
```typescript
// Helper function for consistent encoding
function encodeKey(id: number): Uint8Array {
  const buffer = new ArrayBuffer(4)
  const view = new DataView(buffer)
  view.setUint32(0, id, false) // big-endian
  return new Uint8Array(buffer)
}

const key1 = encodeKey(1)
const key2 = encodeKey(2)
```

**Avoid**:
```typescript
// Inconsistent key creation
const key1 = new Uint8Array([0, 0, 0, 1])
const key2 = Buffer.from([0, 0, 2]) // Wrong length!
```

### 3. Validate Box Values

**Good**:
```typescript
async function getValidatedBox(appId: bigint, key: Uint8Array): Promise<string> {
  const box = await algod.getApplicationBoxByName(appId, key).do()
  const value = Buffer.from(box.value).toString('utf-8')

  if (!value || value.length === 0) {
    throw new Error('Box contains empty value')
  }

  return value
}
```

**Avoid**:
```typescript
// No validation
const box = await algod.getApplicationBoxByName(appId, key).do()
const value = Buffer.from(box.value).toString('utf-8')
// What if value is empty or corrupted?
```

### 4. Use Batch Operations When Possible

**Good**:
```typescript
// Fetch multiple boxes in parallel
const [box1, box2, box100] = await Promise.all([
  algod.getApplicationBoxByName(appId, key1).do(),
  algod.getApplicationBoxByName(appId, key2).do(),
  algod.getApplicationBoxByName(appId, key100).do(),
])
```

**Avoid**:
```typescript
// Sequential fetching
const box1 = await algod.getApplicationBoxByName(appId, key1).do()
const box2 = await algod.getApplicationBoxByName(appId, key2).do()
const box100 = await algod.getApplicationBoxByName(appId, key100).do()
// 3x slower for independent operations
```

## Comparison: getApplicationBoxByName vs getApplicationBoxes

| Aspect | getApplicationBoxByName | getApplicationBoxes |
|--------|-------------------------|---------------------|
| **Use Case** | Retrieve specific box | List all boxes |
| **Time Complexity** | O(1) | O(n) |
| **Network Calls** | 1 per box | 1 total |
| **When to Use** | Known key | Discovery/listing |
| **Returns** | Box value | List of box names |
| **Error on Missing** | Yes (404) | No (empty list) |
| **Performance** | Very fast | Slower with many boxes |

## Key Takeaways

1. **getApplicationBoxByName()** provides O(1) direct access to box values
2. **Always handle 404 errors** for non-existent boxes gracefully
3. **Use consistent key encoding** across your application
4. **Batch parallel retrievals** when fetching multiple independent boxes
5. **Validate box values** after retrieval to ensure data integrity
6. **Prefer direct lookup over listing** when you know the key
7. **Box keys must match contract expectations** (e.g., byte[4] in this example)
8. **Fund app account first** before creating boxes to cover MBR

