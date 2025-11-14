# Update Application with Deploy-Time Parameters

This example demonstrates how to update an application with different **deploy-time parameters** using TEAL template substitution.

## Core Concept

**Deploy-time parameters** (also called template variables or compile-time constants) are values that are:

- **Substituted into TEAL code** before compilation using string interpolation
- **Hard-coded into the compiled bytecode** - they become part of the program
- **Immutable without redeployment** - cannot be changed by methods or state updates
- **More efficient** than global state for frequently accessed constants
- **Different per deployment** - each deployment can have different values

This is different from **global state**, which:
- Can be modified by smart contract methods at runtime
- Uses storage space and costs to read/write
- Provides flexibility but with overhead

This example shows:
1. Creating an application with `max_value = 100` (deploy-time parameter)
2. Testing that the limit is enforced in the TEAL code
3. Updating the application with `max_value = 200`
4. Verifying the new limit works and allows values beyond the old limit

## What This Example Shows

### 1. TEAL Template Substitution

```typescript
function createApprovalProgram(maxValue: number): string {
  return `#pragma version 10

// ... other code

method_increment:
// Get current counter
byte "counter"
app_global_get

// Increment it
int 1
+

// Check against max_value (deploy-time parameter)
dup
int ${maxValue}  // This is the hard-coded max value
<=
assert  // Reject if exceeds max

// Store new value
byte "counter"
dig 1
app_global_put

// Return new value
itob
byte 0x151f7c75
swap
concat
log

int 1
return`
}
```

The `${maxValue}` is replaced with the actual number (e.g., `100` or `200`) before the TEAL is compiled. This creates different bytecode for each version.

### 2. Creating with Deploy-Time Parameters

```typescript
// Create v1 with max_value = 100
const approvalProgramV1 = createApprovalProgram(100)

const createResult = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: approvalProgramV1,
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 2,
    globalByteSlices: 0,
    localInts: 0,
    localByteSlices: 0,
  },
})
```

This creates a contract where the TEAL code has `int 100` hard-coded.

### 3. Updating with Different Parameters

```typescript
// Create v2 with max_value = 200
const approvalProgramV2 = createApprovalProgram(200)

// Update the application
const updateResult = await algorand.send.appUpdate({
  sender: deployer.addr,
  appId,
  approvalProgram: approvalProgramV2,
  clearStateProgram: clearProgram,
})
```

This updates the contract so the TEAL code now has `int 200` hard-coded instead.

### 4. Verifying the Parameter Change

```typescript
// Before update: counter can go up to 100
// Trying to increment to 101 would fail with assert

// After update: counter can go up to 200
// Can now increment beyond 100
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId,
    method: incrementMethod,
    args: [],
  })
  .send()

// Counter reaches 105, which is > 100 (old limit) but < 200 (new limit)
// ✅ Success! The new limit is in effect
```

### 5. State Preservation

Even though the program code changed, the global state is preserved:

```typescript
// Before update:
//   counter: 5
//   max_value: 100

// After update:
//   counter: 5  (preserved!)
//   max_value: 100  (also preserved - only TEAL code changed)
```

The `max_value` in global state shows 100 because it was set during creation and we didn't update it. But the hard-coded limit in the TEAL code is now 200.

## Common Use Cases

### 1. Maximum Supply Limits

Different deployments can have different supply limits:

```typescript
function createTokenProgram(maxSupply: number): string {
  return `#pragma version 10

method_mint:
// Check total supply doesn't exceed max
byte "total_supply"
app_global_get
txna ApplicationArgs 1
btoi
+
int ${maxSupply}  // Hard-coded max supply
<=
assert

// ... proceed with mint
`
}

// Testnet deployment: 1 million tokens
const testnetProgram = createTokenProgram(1_000_000)

// Mainnet deployment: 10 million tokens
const mainnetProgram = createTokenProgram(10_000_000)
```

### 2. Fee Percentages

Hard-code different fee rates for different environments:

```typescript
function createDexProgram(feeBasisPoints: number): string {
  return `#pragma version 10

method_swap:
// Calculate fee
txna ApplicationArgs 1
btoi
int ${feeBasisPoints}  // e.g., 30 for 0.3%
*
int 10000
/

// ... process swap with fee
`
}

// Development: 0% fees
const devProgram = createDexProgram(0)

// Production: 0.3% fees
const prodProgram = createDexProgram(30)
```

### 3. Admin Addresses

Hard-code admin addresses for access control:

```typescript
function createProgram(adminAddress: string): string {
  return `#pragma version 10

method_admin_action:
// Verify caller is admin
txn Sender
addr ${adminAddress}  // Hard-coded admin address
==
assert

// ... perform admin action
`
}

const program = createProgram('7Z7X7...')  // Admin's address
```

### 4. Feature Flags

Enable/disable features per deployment:

```typescript
function createProgram(premiumEnabled: boolean): string {
  return `#pragma version 10

method_premium_feature:
// Check if premium is enabled
int ${premiumEnabled ? 1 : 0}
assert  // Reject if premium not enabled

// ... premium feature logic
`
}

// Free tier deployment
const freeProgram = createProgram(false)

// Premium deployment
const premiumProgram = createProgram(true)
```

### 5. Rate Limits

Different rate limits for different deployments:

```typescript
function createProgram(maxPerDay: number): string {
  return `#pragma version 10

method_action:
// Check daily count
byte "daily_count"
app_global_get
int ${maxPerDay}  // Hard-coded rate limit
<
assert

// ... perform action
`
}

// Basic tier: 10 per day
const basicProgram = createProgram(10)

// Pro tier: 100 per day
const proProgram = createProgram(100)
```

## API Reference

### Template Substitution Pattern

```typescript
function createApprovalProgram(params: {
  maxValue: number
  adminAddr?: string
  feeBps?: number
}): string {
  return `#pragma version 10

// Use parameters in TEAL
int ${params.maxValue}
addr ${params.adminAddr || 'AAAAAAA...'}
int ${params.feeBps || 0}

// ... rest of TEAL code
`
}

// Generate TEAL with specific parameters
const tealCode = createApprovalProgram({
  maxValue: 1000,
  adminAddr: 'ABC123...',
  feeBps: 30,
})

// Compile and deploy
const result = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: tealCode,
  // ... other params
})
```

### `appUpdate()` Method

Updates an existing application with new programs:

```typescript
const updateResult = await algorand.send.appUpdate({
  sender: deployer.addr,      // Must be creator
  appId,                      // App to update
  approvalProgram: newTEAL,   // New approval program
  clearStateProgram: newClear,// New clear program
  note: optionalNote,         // Optional note
  lease: optionalLease,       // Optional lease
  rekeyTo: optionalRekey,     // Optional rekey
})
```

## Deploy-Time Parameters vs. Global State

| Aspect | Deploy-Time Parameters | Global State |
|--------|------------------------|--------------|
| **Modification** | Requires app update | Can change via methods |
| **Performance** | No read cost (in bytecode) | Costs to read from storage |
| **Flexibility** | Fixed per deployment | Dynamic at runtime |
| **Storage** | No storage used | Uses schema allocation |
| **Use Case** | Constants, config | Runtime state, counters |
| **Examples** | Max supply, admin address | User balances, status |

## Best Practices

### 1. Use Deploy-Time Parameters for Constants

✅ **Good:**
```typescript
function createProgram(maxSupply: number): string {
  return `int ${maxSupply}  // Hard-coded constant`
}
```

❌ **Bad:**
```typescript
// Using global state for a constant
byte "max_supply"
app_global_get  // Wastes a read operation every time
```

**Why:** Constants don't change and don't need the flexibility of global state.

### 2. Validate Parameters Before Deployment

✅ **Good:**
```typescript
function createProgram(maxValue: number): string {
  if (maxValue <= 0) {
    throw new Error('maxValue must be positive')
  }
  if (maxValue > 1_000_000) {
    throw new Error('maxValue cannot exceed 1 million')
  }

  return `int ${maxValue}`
}
```

❌ **Bad:**
```typescript
function createProgram(maxValue: number): string {
  // No validation - could deploy with invalid values
  return `int ${maxValue}`
}
```

**Why:** Catch errors before deployment, not during execution.

### 3. Document Parameter Meanings

✅ **Good:**
```typescript
/**
 * Creates approval program with configurable parameters
 *
 * @param maxSupply - Maximum token supply (1-1000000)
 * @param feeBps - Fee in basis points (0-10000, e.g., 30 = 0.3%)
 * @param adminAddr - Address of contract administrator
 * @returns TEAL approval program code
 */
function createProgram(
  maxSupply: number,
  feeBps: number,
  adminAddr: string
): string {
  return `...`
}
```

❌ **Bad:**
```typescript
function createProgram(a: number, b: number, c: string): string {
  return `...`
}
```

**Why:** Clear documentation prevents mistakes and helps other developers.

### 4. Use TypeScript for Type Safety

✅ **Good:**
```typescript
type ProgramParams = {
  maxValue: number
  adminAddress: string
  enabled: boolean
}

function createProgram(params: ProgramParams): string {
  return `
    int ${params.maxValue}
    addr ${params.adminAddress}
    int ${params.enabled ? 1 : 0}
  `
}
```

❌ **Bad:**
```typescript
function createProgram(...params: any[]): string {
  return `int ${params[0]}` // Unclear what params[0] is
}
```

**Why:** Type safety catches errors at compile time.

### 5. Store Parameter Values for Reference

✅ **Good:**
```typescript
// Store deployment parameters in global state for reference
byte "deployed_max_value"
int ${maxValue}
app_global_put

// Use hard-coded value for actual checks (more efficient)
// ...
int ${maxValue}
<=
assert
```

❌ **Bad:**
```typescript
// Only hard-code, no reference stored
int ${maxValue}
// If someone asks "what's the limit?", can't easily check on-chain
```

**Why:** Provides a way to query the configuration without analyzing bytecode.

### 6. Version Your Deployments

✅ **Good:**
```typescript
const deploymentConfig = {
  v1: { maxValue: 100, fee: 30 },
  v2: { maxValue: 200, fee: 25 },
  v3: { maxValue: 500, fee: 20 },
}

const program = createProgram(deploymentConfig.v2)
```

❌ **Bad:**
```typescript
// Magic numbers scattered throughout
const program = createProgram(200, 25)
```

**Why:** Makes it clear what configuration is being deployed.

### 7. Test with Different Parameters

✅ **Good:**
```typescript
// Test suite
describe('Counter App', () => {
  it('enforces max_value = 100', async () => {
    const app = await deploy(createProgram(100))
    // ... test enforcement
  })

  it('enforces max_value = 200', async () => {
    const app = await deploy(createProgram(200))
    // ... test enforcement
  })
})
```

❌ **Bad:**
```typescript
// Only test with one parameter value
const app = await deploy(createProgram(100))
```

**Why:** Ensures the template substitution works correctly for all values.

## Common Pitfalls

### 1. Forgetting to Escape Special Characters

**Problem:**
```typescript
function createProgram(message: string): string {
  return `byte "${message}"`  // Problem if message contains quotes!
}

const program = createProgram('Hello "World"')
// Results in: byte "Hello "World""  // Invalid TEAL!
```

**Solution:**
```typescript
function createProgram(message: string): string {
  const escaped = message.replace(/"/g, '\\"')
  return `byte "${escaped}"`
}
```

### 2. Type Mismatches

**Problem:**
```typescript
function createProgram(adminAddr: string): string {
  return `
    txn Sender
    byte ${adminAddr}  // Wrong! Should be 'addr'
    ==
  `
}
```

**Solution:**
```typescript
function createProgram(adminAddr: string): string {
  return `
    txn Sender
    addr ${adminAddr}  // Correct
    ==
  `
}
```

### 3. Not Preserving State After Update

**Problem:**
```typescript
// Update changes max_value in TEAL but doesn't migrate state
create:
byte "max_value"
int ${maxValue}  // Will reset to new value on re-creation!
app_global_put
```

**Result:** If someone re-creates instead of updates, state is lost.

**Solution:**
```typescript
// Only set on initial creation
txn ApplicationID
int 0
==
bnz create

// On update, preserve existing state
// Don't reinitialize max_value
```

### 4. Hardcoding Secrets

**Problem:**
```typescript
function createProgram(apiKey: string): string {
  return `byte "${apiKey}"`  // ❌ Secret is now in bytecode!
}
```

**Result:** API key is visible to anyone who reads the application bytecode.

**Solution:**
- Never hardcode secrets in TEAL
- Use hashes or public keys for verification
- Store secrets off-chain

### 5. Integer Overflow

**Problem:**
```typescript
function createProgram(maxValue: number): string {
  // maxValue could be > 2^64-1
  return `int ${maxValue}`
}

const program = createProgram(Number.MAX_SAFE_INTEGER + 1000)
// Invalid or unexpected behavior
```

**Solution:**
```typescript
function createProgram(maxValue: number): string {
  if (maxValue > 2n**64n - 1n) {
    throw new Error('maxValue exceeds uint64 max')
  }
  return `int ${maxValue}`
}
```

### 6. Inconsistent Parameter Names

**Problem:**
```typescript
// v1
const programV1 = createProgram({ maxValue: 100 })

// v2 - renamed parameter!
const programV2 = createProgram({ maximumValue: 200 })
// Breaks if using same function
```

**Solution:**
- Keep parameter names consistent across versions
- Use configuration objects with defined types

### 7. Not Testing the Update Path

**Problem:**
```typescript
// Only test fresh deployment
const app = await deploy(createProgram(100))
// Test...

// Never test:
// 1. Update from v1 to v2
// 2. State preservation
// 3. Parameter change enforcement
```

**Solution:**
```typescript
// Test update workflow
const appV1 = await deploy(createProgram(100))
await testV1(appV1)

await update(appV1.appId, createProgram(200))
await testV2(appV1.appId)  // Same app ID
```

## When to Use Deploy-Time Parameters

**Use deploy-time parameters when:**
- The value is constant for the lifetime of a deployment
- Performance is critical (frequent access)
- You need different values for different environments (dev/test/prod)
- The value logically shouldn't change without a code update
- You want to save global state storage

**Use global state when:**
- The value needs to change based on contract logic
- Methods need to update the value
- The value represents runtime state (balances, counts, etc.)
- Flexibility is more important than performance

## Example Scenarios

### Scenario 1: Token with Adjustable Supply Cap

**Initial:** Deploy with 1M max supply
**Later:** Business needs change, update to 10M max supply
**Solution:** Use deploy-time parameter, update app when needed

### Scenario 2: DEX with Fee Adjustments

**Initial:** Deploy with 0.3% fee
**Later:** Market conditions change, reduce to 0.25%
**Solution:** Use deploy-time parameter for fee percentage

### Scenario 3: Multi-Tier Service

**Approach:** Deploy separate apps with different limits
**Example:**
- Free tier: `createProgram({ maxDaily: 10 })`
- Pro tier: `createProgram({ maxDaily: 100 })`
- Enterprise: `createProgram({ maxDaily: 1000 })`

Each tier is a separate deployment with its own app ID.

## Related Examples

- **Example 131**: Update application with ABI update method
- **Example 130**: Smart contract deployment with ABI creation method
- **Example 127**: Retrieve latest app when multiple apps have same name

## Resources

- [TEAL Language Specification](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Application Update Guide](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#update-application)
