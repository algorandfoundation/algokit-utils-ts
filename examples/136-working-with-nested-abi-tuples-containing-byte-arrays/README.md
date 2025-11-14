# Working with Nested ABI Tuples Containing Byte Arrays

This example demonstrates how to work with **nested ABI tuples** containing byte arrays when calling Algorand smart contract methods using AlgoKit Utils.

## What You'll Learn

- How to define ABI methods with nested tuple parameters
- Passing complex nested structures to smart contracts
- Working with byte arrays inside tuples
- Understanding ABI encoding for nested data structures
- Using both number arrays and Uint8Arrays for byte data
- Common nested tuple patterns in Algorand development

## Example Output

When you run this example, you'll see:

```
=== Working with Nested ABI Tuples and Byte Arrays ===

Using deployer account: LEFKTDT7HUYSP6KCYTFEXGFM3QJ7ZUYOSCZKGVSUEYZC2DOL3H7VAQ45LQ

=== Deploying Smart Contract ===

✅ Application deployed!
   App ID: 1639n

=== Defining ABI Method ===

Method signature: process_nested_tuple((byte[2],(byte[1],bool)))string
Parameter type: (byte[2],(byte[1],bool))
  - Outer tuple contains:
    1. byte[2] - static array of 2 bytes
    2. (byte[1],bool) - inner tuple
  - Inner tuple contains:
    1. byte[1] - static array of 1 byte
    2. bool - boolean value

=== Preparing Nested Tuple Data ===

Nested tuple structure:
  Outer tuple: [byte[2], (byte[1], bool)]
  byte[2]: [ 65, 66 ] (ASCII: AB)
  Inner tuple: [ [ 67 ], true ]
    byte[1]: [ 67 ] (ASCII: C)
    bool: true

=== Calling Method with Nested Tuple ===

✅ Method call successful!
   Transaction ID: JXJLU5NL356AI53S3ER43BGP2Y5MVQ2SY4QS7B3YLOSFWKKYGPJA

Return value from contract:
   "Successfully processed nested tuple with byte arrays and bool!"
```

## Understanding Nested ABI Tuples

### What Are ABI Tuples?

ABI tuples are composite data types that group multiple values of different types together. They're similar to structs in other languages.

**Simple tuple example:**
```typescript
(uint64,bool)  // A tuple containing an integer and a boolean
```

**Nested tuple example:**
```typescript
(byte[2],(byte[1],bool))  // Outer tuple containing byte array and inner tuple
```

### Why Use Nested Tuples?

Nested tuples allow you to represent complex data structures in smart contracts:

1. **Structured data** - Group related information together
2. **Type safety** - Each element has a defined type
3. **Efficient encoding** - Compact binary representation
4. **Composability** - Tuples can contain other tuples

### Common Use Cases

- **User profiles:** `(address,(string,uint64,bool))` - address with name, age, verified status
- **Token metadata:** `((string,string),byte[])` - (name, symbol), icon data
- **Transaction data:** `(uint64,(address,uint64))` - amount with (recipient, fee)
- **Coordinate systems:** `((int64,int64),(int64,int64))` - two points with x,y coordinates

## Code Walkthrough

### Step 1: Deploying the Contract

First, we deploy a smart contract that accepts nested tuples:

```typescript
const approvalProgram = `#pragma version 10

// ... (creation and routing code)

method_process_nested_tuple:
// This method receives a nested tuple: (byte[2],(byte[1],bool))
// The tuple is passed as ApplicationArgs[1]

// Get the argument (it's at index 1)
txna ApplicationArgs 1

// Tuple structure: (byte[2],(byte[1],bool))
// Total size: 2 bytes + (1 byte + 1 bool) = 4 bytes
// Layout: [byte0, byte1, byte2, bool_as_byte]

// Extract first byte from byte[2]
dup
int 0
int 1
extract3  // Get byte at position 0

// Extract second byte from byte[2]
dig 1
int 1
int 1
extract3  // Get byte at position 1

// Extract byte from inner tuple's byte[1]
dig 2
int 2
int 1
extract3  // Get byte at position 2

// Extract bool from inner tuple
dig 3
int 3
int 1
extract3  // Get bool byte at position 3
btoi      // Convert to int (0 or 1)

// Process the values...
// Return success message
byte "Successfully processed nested tuple with byte arrays and bool!"
// ... ABI encoding
log

int 1
return`
```

**TEAL insights:**

The nested tuple `(byte[2],(byte[1],bool))` is encoded as a flat byte array:
- **Position 0-1:** The two bytes from `byte[2]`
- **Position 2:** The single byte from inner tuple's `byte[1]`
- **Position 3:** The boolean (encoded as 0x00 or 0x01)

To extract values, we use:
- `extract3` - Extracts a substring given start position and length
- `dig N` - Duplicates the Nth item from the stack top
- `btoi` - Converts byte to integer (for the boolean)

### Step 2: Defining the ABI Method

We define the method signature with the nested tuple parameter:

```typescript
const processNestedTupleMethod = new algosdk.ABIMethod({
  name: 'process_nested_tuple',
  args: [
    {
      type: '(byte[2],(byte[1],bool))', // Nested tuple type string
      name: 'nested_data',
    },
  ],
  returns: { type: 'string' },
})
```

**Type breakdown:**

```
(byte[2],(byte[1],bool))
│       │              │
│       └──────────────┴─ Inner tuple: (byte[1],bool)
│                           ├─ byte[1]: static array of 1 byte
│                           └─ bool: boolean value
│
└─ byte[2]: static array of 2 bytes
```

**Method signature:**
```
process_nested_tuple((byte[2],(byte[1],bool)))string
```

The signature is used by the TEAL code to route the call to the correct handler.

### Step 3: Preparing Nested Tuple Data

JavaScript representation is intuitive - just use nested arrays:

```typescript
const nestedTupleValue = [
  [65, 66],        // byte[2] - outer array (ASCII 'A', 'B')
  [[67], true],    // (byte[1], bool) - inner tuple (ASCII 'C', true)
]
```

**Structure visualization:**

```
nestedTupleValue = [
  [65, 66],      ← byte[2]
  [             ← Inner tuple starts
    [67],       ← byte[1]
    true        ← bool
  ]
]
```

**Display the data:**

```typescript
console.log('Nested tuple structure:')
console.log('  Outer tuple: [byte[2], (byte[1], bool)]')
console.log('  byte[2]:', nestedTupleValue[0], '(ASCII:', String.fromCharCode(...nestedTupleValue[0]) + ')')
console.log('  Inner tuple:', nestedTupleValue[1])
console.log('    byte[1]:', nestedTupleValue[1][0], '(ASCII:', String.fromCharCode(...nestedTupleValue[1][0]) + ')')
console.log('    bool:', nestedTupleValue[1][1])
```

Output:
```
Nested tuple structure:
  Outer tuple: [byte[2], (byte[1], bool)]
  byte[2]: [ 65, 66 ] (ASCII: AB)
  Inner tuple: [ [ 67 ], true ]
    byte[1]: [ 67 ] (ASCII: C)
    bool: true
```

### Step 4: Calling the Method

AlgoKit Utils automatically handles ABI encoding:

```typescript
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId,
    method: processNestedTupleMethod,
    args: [nestedTupleValue],  // Pass the nested structure directly
  })
  .send()

console.log('✅ Method call successful!')
console.log('   Transaction ID:', result.txIds[0])

if (result.returns && result.returns.length > 0) {
  const returnValue = result.returns[0].returnValue
  console.log('Return value from contract:')
  console.log(`   "${returnValue}"`)
  // Output: "Successfully processed nested tuple with byte arrays and bool!"
}
```

**What happens under the hood:**

1. **ABI Encoding:** The nested tuple is encoded into a flat byte array
2. **Transaction Creation:** The encoded data is added to ApplicationArgs[1]
3. **TEAL Execution:** The contract decodes the byte array
4. **Return Value:** The contract encodes and returns the result
5. **ABI Decoding:** AlgoKit Utils decodes the return value

### Step 5: Using Different Formats

You can use number arrays or Uint8Arrays interchangeably:

**Number arrays:**
```typescript
const nestedTupleValue = [
  [72, 105],        // byte[2] (ASCII 'H', 'i')
  [[33], false],    // (byte[1], bool) (ASCII '!', false)
]
```

**Uint8Arrays:**
```typescript
const nestedTupleValue = [
  new Uint8Array([88, 89]),           // byte[2] (ASCII 'X', 'Y')
  [new Uint8Array([90]), true],       // (byte[1], bool) (ASCII 'Z', true)
]
```

**Mixed (also works):**
```typescript
const nestedTupleValue = [
  [88, 89],                           // Number array
  [new Uint8Array([90]), true],       // Uint8Array in inner tuple
]
```

All three formats work correctly - AlgoKit Utils handles the conversion automatically!

## ABI Encoding Deep Dive

### How Nested Tuples Are Encoded

The nested tuple `(byte[2],(byte[1],bool))` with values `[[65, 66], [[67], true]]` is encoded as:

```
Byte position:  0     1     2     3
               ┌─────┬─────┬─────┬─────┐
               │ 65  │ 66  │ 67  │ 01  │
               └─────┴─────┴─────┴─────┘
                 ^     ^     ^     ^
                 │     │     │     └─ bool (0x01 = true)
                 │     │     └─ byte[1][0]
                 │     └─ byte[2][1]
                 └─ byte[2][0]
```

**Encoding rules:**

1. **Static arrays** are encoded inline (no length prefix)
2. **Tuples** are encoded by concatenating their elements
3. **Booleans** are encoded as single bytes (0x00 or 0x01)
4. **Nested structures** are flattened into a single byte array

### Decoding in TEAL

To decode the tuple in TEAL:

```teal
txna ApplicationArgs 1  # Get the encoded tuple

# Extract byte[2][0] (position 0, length 1)
dup
int 0
int 1
extract3
# Stack: [original, byte0]

# Extract byte[2][1] (position 1, length 1)
dig 1  # Bring original back
int 1
int 1
extract3
# Stack: [original, byte0, byte1]

# Extract inner tuple's byte[1][0] (position 2, length 1)
dig 2  # Bring original back
int 2
int 1
extract3
# Stack: [original, byte0, byte1, byte2]

# Extract inner tuple's bool (position 3, length 1)
dig 3  # Bring original back
int 3
int 1
extract3
btoi  # Convert to 0 or 1
# Stack: [original, byte0, byte1, byte2, bool_int]
```

## Common Nested Tuple Patterns

### Pattern 1: User Data with Metadata

```typescript
// Type: (address,(string,uint64,bool))
const userMethod = new algosdk.ABIMethod({
  name: 'register_user',
  args: [
    {
      type: '(address,(string,uint64,bool))',
      name: 'user_data',
    },
  ],
  returns: { type: 'void' },
})

// Call with nested data
const userData = [
  'WALLETADDRESS...', // address
  [
    'Alice',          // string - username
    25n,              // uint64 - age
    true,             // bool - verified
  ],
]

await algorand.newGroup().addAppCallMethodCall({
  sender: deployer.addr,
  appId,
  method: userMethod,
  args: [userData],
}).send()
```

### Pattern 2: NFT Metadata

```typescript
// Type: ((string,string),(byte[],uint64))
const mintMethod = new algosdk.ABIMethod({
  name: 'mint_nft',
  args: [
    {
      type: '((string,string),(byte[],uint64))',
      name: 'nft_metadata',
    },
  ],
  returns: { type: 'uint64' },
})

// Call with NFT data
const nftMetadata = [
  [
    'Cool NFT',     // string - name
    'CNFT',         // string - symbol
  ],
  [
    new Uint8Array([/* IPFS hash */]), // byte[] - metadata URI
    1000n,                              // uint64 - total supply
  ],
]

const result = await algorand.newGroup().addAppCallMethodCall({
  sender: deployer.addr,
  appId,
  method: mintMethod,
  args: [nftMetadata],
}).send()
```

### Pattern 3: Coordinate System

```typescript
// Type: ((int64,int64),(int64,int64))
const distanceMethod = new algosdk.ABIMethod({
  name: 'calculate_distance',
  args: [
    {
      type: '((int64,int64),(int64,int64))',
      name: 'points',
    },
  ],
  returns: { type: 'uint64' },
})

// Call with coordinate pairs
const points = [
  [10n, 20n],  // Point 1: (x=10, y=20)
  [30n, 40n],  // Point 2: (x=30, y=40)
]

const result = await algorand.newGroup().addAppCallMethodCall({
  sender: deployer.addr,
  appId,
  method: distanceMethod,
  args: [points],
}).send()
```

### Pattern 4: Transaction Bundle

```typescript
// Type: (uint64,(address,uint64),(address,uint64))
const batchPayMethod = new algosdk.ABIMethod({
  name: 'batch_payment',
  args: [
    {
      type: '(uint64,(address,uint64),(address,uint64))',
      name: 'payment_data',
    },
  ],
  returns: { type: 'void' },
})

// Call with payment bundle
const paymentData = [
  1000000n,  // uint64 - total amount
  [
    'RECIPIENT1...', // address
    400000n,         // uint64 - amount for recipient 1
  ],
  [
    'RECIPIENT2...', // address
    600000n,         // uint64 - amount for recipient 2
  ],
]

await algorand.newGroup().addAppCallMethodCall({
  sender: deployer.addr,
  appId,
  method: batchPayMethod,
  args: [paymentData],
}).send()
```

## Type Conversions

### Automatic Conversions

AlgoKit Utils automatically handles these conversions:

| JavaScript Type | ABI Type | Notes |
|----------------|----------|-------|
| `number[]` | `byte[]`, `byte[N]` | Numbers must be 0-255 |
| `Uint8Array` | `byte[]`, `byte[N]` | Preferred for binary data |
| `boolean` | `bool` | true/false → 0x01/0x00 |
| `bigint` | `uint64`, `int64` | Use `n` suffix: `123n` |
| `string` | `string`, `address` | UTF-8 encoding |
| `Array` | Tuples | Nested arrays for nested tuples |

### Manual Type Handling

If you need manual control, use algosdk's ABI types:

```typescript
import algosdk from 'algosdk'

// Define the tuple type
const tupleType = algosdk.ABIType.from('(byte[2],(byte[1],bool))')

// Encode manually
const encoded = tupleType.encode([
  new Uint8Array([65, 66]),
  [new Uint8Array([67]), true],
])

console.log('Encoded bytes:', encoded)
// Output: Uint8Array [65, 66, 67, 1]

// Decode manually
const decoded = tupleType.decode(encoded)
console.log('Decoded value:', decoded)
// Output: [ Uint8Array [65, 66], [ Uint8Array [67], true ] ]
```

## Best Practices

### 1. Use Descriptive Types

**Good:**
```typescript
// Clear structure for user registration
const userMethod = new algosdk.ABIMethod({
  name: 'register_user',
  args: [
    {
      type: '(address,(string,uint64,bool))',
      name: 'user_data', // (wallet, (name, age, verified))
    },
  ],
  returns: { type: 'uint64' }, // Returns user ID
})
```

**Bad:**
```typescript
// Unclear what the tuple contains
const userMethod = new algosdk.ABIMethod({
  name: 'register_user',
  args: [
    {
      type: '(address,(string,uint64,bool))',
      name: 'data', // ❌ Not descriptive
    },
  ],
  returns: { type: 'uint64' },
})
```

### 2. Document Nested Structures

**Good:**
```typescript
/**
 * Register a new user with profile data
 *
 * @param user_data - Nested tuple structure:
 *   - [0]: address - User's wallet address
 *   - [1]: tuple - Profile data
 *     - [1][0]: string - Username
 *     - [1][1]: uint64 - Age
 *     - [1][2]: bool - Verified status
 */
const userData = [
  'WALLET...', // address
  ['Alice', 25n, true], // (username, age, verified)
]
```

### 3. Validate Input Data

**Good:**
```typescript
function validateUserData(data: any): boolean {
  if (!Array.isArray(data) || data.length !== 2) {
    throw new Error('User data must be a 2-element array')
  }

  const [address, profile] = data

  if (typeof address !== 'string') {
    throw new Error('Address must be a string')
  }

  if (!Array.isArray(profile) || profile.length !== 3) {
    throw new Error('Profile must be a 3-element array')
  }

  const [username, age, verified] = profile

  if (typeof username !== 'string') {
    throw new Error('Username must be a string')
  }

  if (typeof age !== 'bigint') {
    throw new Error('Age must be a bigint')
  }

  if (typeof verified !== 'boolean') {
    throw new Error('Verified must be a boolean')
  }

  return true
}

// Use before sending
validateUserData(userData)
await algorand.newGroup().addAppCallMethodCall({
  sender: deployer.addr,
  appId,
  method: userMethod,
  args: [userData],
}).send()
```

### 4. Keep Nesting Reasonable

**Good:**
```typescript
// 2-3 levels deep is manageable
type: '(address,(string,uint64))'
type: '((string,string),(byte[],uint64))'
```

**Avoid:**
```typescript
// ❌ Too deeply nested, hard to work with
type: '(address,((string,(uint64,bool)),(byte[],(uint64,(bool,string)))))'
```

If your structure is too nested, consider:
- Breaking it into multiple method calls
- Using box storage for complex data
- Flattening the structure

### 5. Use Uint8Array for Binary Data

**Good:**
```typescript
const imageData = new Uint8Array([/* binary data */])
const metadata = [
  ['NFT Name', 'NFTSYM'],
  [imageData, 1000n],
]
```

**Acceptable but less clear:**
```typescript
const imageData = [0x89, 0x50, 0x4E, 0x47, /* ... */]
const metadata = [
  ['NFT Name', 'NFTSYM'],
  [imageData, 1000n],
]
```

## Troubleshooting

### Error: "Type mismatch"

```
Cause: Data structure doesn't match ABI type definition
Fix: Ensure nested arrays match the tuple structure exactly
```

**Example:**
```typescript
// ❌ Wrong: Missing inner tuple
const wrongData = [
  [65, 66],
  67,      // Should be [[67], true]
  true,
]

// ✅ Correct: Proper nesting
const correctData = [
  [65, 66],
  [[67], true],  // Inner tuple properly structured
]
```

### Error: "Byte value out of range"

```
Cause: Number arrays contain values outside 0-255 range
Fix: Ensure all byte values are valid (0-255)
```

**Example:**
```typescript
// ❌ Wrong: 256 is out of range
const wrongData = [
  [256, 66],  // 256 > 255
  [[67], true],
]

// ✅ Correct: All values in valid range
const correctData = [
  [255, 66],  // 0-255 is valid
  [[67], true],
]
```

### Error: "Array length mismatch"

```
Cause: Static array has wrong number of elements
Fix: Match the array length specified in the type
```

**Example:**
```typescript
// Type: (byte[2],(byte[1],bool))

// ❌ Wrong: byte[2] should have exactly 2 elements
const wrongData = [
  [65, 66, 67],  // 3 elements, expected 2
  [[68], true],
]

// ✅ Correct: Exact length match
const correctData = [
  [65, 66],     // Exactly 2 elements
  [[67], true], // Inner byte[1] has exactly 1 element
]
```

## Key Takeaways

1. **Nested tuples enable complex data structures** - Combine multiple types and levels
2. **Intuitive JavaScript syntax** - Use nested arrays to represent nested tuples
3. **Automatic ABI encoding** - AlgoKit Utils handles conversion automatically
4. **Flexible input formats** - Use number arrays or Uint8Arrays for byte data
5. **Type safety** - ABI types ensure correct data structure
6. **TEAL decoding** - Use extract3 and stack manipulation to access values
7. **Document your structures** - Make nested data easy to understand
8. **Validate inputs** - Check data structure before sending to contract

Nested tuples are powerful tools for building sophisticated smart contracts. They allow you to:
- Pass complex structured data to methods
- Return composite values from contracts
- Model real-world entities and relationships
- Maintain type safety across the stack

Master nested tuples to build advanced Algorand applications!

## Running the Example

```bash
npm start
```

Make sure you have LocalNet running:
```bash
algokit localnet start
```

## Learn More

- [ARC-4 ABI Specification](https://arc.algorand.foundation/ARCs/arc-0004)
- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [algosdk ABI Reference](https://algorand.github.io/js-algorand-sdk/)
