# Detect Network Type (MainNet vs LocalNet)

This example demonstrates how to verify whether an Algorand client is connected to LocalNet or a public network (MainNet/TestNet), which is critical for preventing accidental use of test behavior in production environments.

## What This Example Shows

This example teaches you how to:
- Verify that MainNet clients are correctly identified as public networks
- Verify that TestNet clients are correctly identified as public networks
- Verify that LocalNet clients are correctly identified as local networks
- Use `isLocalNet()` for network type validation
- Implement environment-specific behavior based on network type
- Add safety checks before production operations

## Why This Matters

Network type detection prevents critical errors in production:

1. **Production Safety**: Ensure production networks aren't treated as test environments
2. **Validation**: Verify network type matches expected environment
3. **Deployment Safety**: Prevent deploying test code to production
4. **User Protection**: Avoid risky operations on wrong networks
5. **Environment Awareness**: Run appropriate logic for each network type
6. **Debugging**: Clearly identify which network is in use

Key concepts:
- **MainNet Detection**: Public production network (isLocalNet = false)
- **TestNet Detection**: Public test network (isLocalNet = false)
- **LocalNet Detection**: Private dev network (isLocalNet = true)
- **Genesis Hash Checking**: How networks are identified
- **Environment Validation**: Matching actual vs expected network

Common use cases:
- **Pre-Deployment Checks**: Verify correct network before operations
- **Safety Gates**: Require confirmations for MainNet operations
- **Environment-Specific Logic**: Different behavior per network
- **Configuration Validation**: Ensure config matches network
- **Error Prevention**: Stop accidental production operations

## How It Works

### 1. Check MainNet (Public Production Network)

Verify MainNet is correctly identified as NOT LocalNet:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const mainNet = AlgorandClient.mainNet()

const isMainNetLocalNet = await mainNet.client.isLocalNet()
console.log(`✓ MainNet is LocalNet: ${isMainNetLocalNet}`) // false

if (!isMainNetLocalNet) {
  console.log('→ Correctly identified as public production network')
  console.log('→ This is the REAL Algorand blockchain with real assets')
}
```

MainNet characteristics:
- Returns `false` for `isLocalNet()`
- Public production blockchain
- Real assets with monetary value
- Requires maximum caution
- Cannot be reset or restarted

### 2. Check TestNet (Public Test Network)

Verify TestNet is correctly identified as NOT LocalNet:

```typescript
const testNet = AlgorandClient.testNet()

const isTestNetLocalNet = await testNet.client.isLocalNet()
console.log(`✓ TestNet is LocalNet: ${isTestNetLocalNet}`) // false

if (!isTestNetLocalNet) {
  console.log('→ Correctly identified as public test network')
  console.log('→ This is a public network with test tokens')
}
```

TestNet characteristics:
- Returns `false` for `isLocalNet()`
- Public test blockchain
- Test tokens (no monetary value)
- Real consensus mechanism
- Cannot be reset

### 3. Check LocalNet (Private Development Network)

Verify LocalNet is correctly identified as LocalNet:

```typescript
const localNet = AlgorandClient.defaultLocalNet()

const isLocalNetLocalNet = await localNet.client.isLocalNet()
console.log(`✓ LocalNet is LocalNet: ${isLocalNetLocalNet}`) // true

if (isLocalNetLocalNet) {
  console.log('→ Correctly identified as LocalNet')
  console.log('→ This is a local development environment')
}
```

LocalNet characteristics:
- Returns `true` for `isLocalNet()`
- Private development network
- Can be reset anytime
- Fast for testing
- No real assets

### 4. Environment-Specific Behavior

Implement different logic based on network type:

```typescript
async function performOperation(algorand: AlgorandClient, networkName: string) {
  const isLocal = await algorand.client.isLocalNet()

  console.log(`${networkName}:`)
  if (isLocal) {
    console.log('  ⚠️  LocalNet detected - using test mode')
    console.log('  → Relaxed validation')
    console.log('  → Fast transactions')
    console.log('  → Safe to experiment')
  } else {
    console.log('  ✓ Public network detected - using production mode')
    console.log('  → Strict validation required')
    console.log('  → Careful with real assets')
    console.log('  → Confirmations needed')
  }
}

await performOperation(mainNet, 'MainNet')
await performOperation(testNet, 'TestNet')
await performOperation(localNet, 'LocalNet')
```

Different behaviors by network:
- **LocalNet**: Relaxed validation, fast iterations
- **Public Networks**: Strict validation, user confirmations

## Prerequisites

- Node.js and npm installed
- No LocalNet required (connects to public networks)
- Internet connection for MainNet/TestNet access

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
=== Network Type Detection Example ===

Step 1: Creating MainNet client...
Checking if MainNet client is LocalNet...
✓ MainNet is LocalNet: false
  → Correctly identified as public production network
  → This is the REAL Algorand blockchain with real assets

Step 2: Creating TestNet client...
Checking if TestNet client is LocalNet...
✓ TestNet is LocalNet: false
  → Correctly identified as public test network
  → This is a public network with test tokens

Step 3: Creating LocalNet client...
Checking if LocalNet client is LocalNet...
✓ LocalNet is LocalNet: true
  → Correctly identified as LocalNet
  → This is a local development environment

Step 4: Environment-specific behavior...

MainNet:
  ✓ Public network detected - using production mode
  → Strict validation required
  → Careful with real assets
  → Confirmations needed

TestNet:
  ✓ Public network detected - using production mode
  → Strict validation required
  → Careful with real assets
  → Confirmations needed

LocalNet:
  ⚠️  LocalNet detected - using test mode
  → Relaxed validation
  → Fast transactions
  → Safe to experiment

💡 Key Takeaways:
   • MainNet and TestNet are public networks (isLocalNet = false)
   • LocalNet is a private development network (isLocalNet = true)
   • Always validate network type before critical operations
   • Use network detection to enable environment-specific behavior

✅ Network detection complete
```

## Key Takeaways

- Use `algorand.client.isLocalNet()` to check network type
- MainNet and TestNet return `false` (public networks)
- LocalNet returns `true` (private development network)
- Always validate network type before critical operations
- Implement environment-specific logic based on detection
- Prevents accidental production operations with test code
- Genesis hash is used internally to determine network type
- Network detection is essential for deployment safety
- Use for pre-deployment validation checks
- Critical for protecting users and real assets

This example demonstrates essential network type detection for safe, production-ready Algorand applications
