# Detect Network Environment (LocalNet vs TestNet/MainNet)

This example demonstrates how to detect which network environment your Algorand client is connected to, enabling environment-specific application logic and safety measures.

## What This Example Shows

This example teaches you how to:
- Detect if connected to LocalNet (development environment)
- Detect if connected to TestNet or MainNet (public networks)
- Use `isLocalNet()` method for network detection
- Implement environment-specific configuration
- Apply different safety measures based on network type
- Adjust transaction parameters based on environment

## Why This Matters

Network detection is crucial for safe development and deployment:

1. **Development Safety**: Prevent accidental operations on production networks
2. **Environment-Specific Logic**: Run different code in dev vs production
3. **Configuration Management**: Adjust timeouts, fees, and parameters by network
4. **User Communication**: Display appropriate warnings and messages
5. **Testing Workflows**: Safely test without risking real funds
6. **Production Safeguards**: Add extra validation for MainNet operations

Key concepts:
- **LocalNet Detection**: `isLocalNet()` returns true for LocalNet
- **Public Networks**: TestNet and MainNet return false for `isLocalNet()`
- **Environment-Specific Params**: Different timeouts, fees, notes by network
- **Safe Development**: LocalNet can be reset without affecting real assets
- **Production Caution**: TestNet/MainNet require careful handling

Common use cases:
- **Development vs Production**: Different behavior in each environment
- **Transaction Parameters**: Adjust fees and timeouts by network
- **Safety Checks**: Require confirmations for MainNet operations
- **Testing Workflows**: Use LocalNet for safe, fast iteration
- **Deployment Pipelines**: Validate network before operations

## How It Works

### 1. Check LocalNet Connection

Detect if connected to LocalNet:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const localNet = AlgorandClient.defaultLocalNet()

const isLocal = await localNet.client.isLocalNet()
console.log(`✓ Is LocalNet: ${isLocal}`) // true

if (isLocal) {
  console.log('→ Running in development mode')
  console.log('→ LocalNet can be reset without affecting real funds')
}
```

LocalNet characteristics:
- Returns `true` for `isLocalNet()`
- Safe for testing and development
- Can be reset without consequences
- Fast transaction confirmation
- No real funds at risk

### 2. Check TestNet Connection

Detect TestNet (public network):

```typescript
const testNet = AlgorandClient.testNet()

const isLocal = await testNet.client.isLocalNet()
console.log(`✓ Is LocalNet: ${isLocal}`) // false

if (!isLocal) {
  console.log('→ Running on public network')
  console.log('→ TestNet uses real blockchain consensus')
}
```

TestNet characteristics:
- Returns `false` for `isLocalNet()`
- Public blockchain network
- Real consensus mechanism
- Slower than LocalNet
- Requires network connection

### 3. Check MainNet Connection

Detect MainNet (production network):

```typescript
const mainNet = AlgorandClient.mainNet()

const isLocal = await mainNet.client.isLocalNet()
console.log(`✓ Is LocalNet: ${isLocal}`) // false

if (!isLocal) {
  console.log('→ Running on MainNet - PRODUCTION environment')
  console.log('→ Use maximum caution - real assets at risk')
}
```

MainNet characteristics:
- Returns `false` for `isLocalNet()`
- Production blockchain network
- Real assets and value
- Requires maximum caution
- Irreversible operations

### 4. Environment-Specific Configuration

Adjust parameters based on network:

```typescript
async function getOptimalTransactionParams(algorand: AlgorandClient) {
  const isLocal = await algorand.client.isLocalNet()

  if (isLocal) {
    return {
      fee: 1000, // Minimum fee for LocalNet
      timeout: 4, // Short timeout OK for LocalNet
      note: 'Development transaction',
      environment: 'LocalNet',
    }
  } else {
    return {
      fee: 1000, // Minimum fee, but might want higher
      timeout: 20, // Longer timeout for public networks
      note: 'Production transaction',
      environment: 'Public Network (TestNet/MainNet)',
    }
  }
}

const localParams = await getOptimalTransactionParams(localNet)
// { fee: 1000, timeout: 4, note: 'Development transaction', ... }

const testParams = await getOptimalTransactionParams(testNet)
// { fee: 1000, timeout: 20, note: 'Production transaction', ... }
```

Configuration differences:
- **Timeouts**: Shorter for LocalNet (4 rounds) vs public (20 rounds)
- **Fees**: Can use minimum on LocalNet, might increase for production
- **Notes**: Different metadata for tracking environment
- **Validation**: More strict checks for public networks

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed (optional, for LocalNet)
- Docker Desktop running (for LocalNet)
- LocalNet running (optional, example handles if not running)

## Running the Example

1. (Optional) Start LocalNet:
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
=== Network Detection Example ===

Step 1: Checking LocalNet connection...
✓ Is LocalNet: true
  → Running in development mode - safe to reset network state
  → LocalNet can be reset without affecting real funds

Step 2: Checking TestNet connection...
✓ Is LocalNet: false
  → Running on public network - use production safety measures
  → TestNet uses real blockchain consensus

Step 3: Checking MainNet connection...
✓ Is LocalNet: false
  → Running on MainNet - PRODUCTION environment
  → Use maximum caution - real assets at risk

Step 4: Environment-specific configuration...
✓ LocalNet params: {
  fee: 1000,
  timeout: 4,
  note: 'Development transaction',
  environment: 'LocalNet'
}
✓ TestNet params: {
  fee: 1000,
  timeout: 20,
  note: 'Production transaction',
  environment: 'Public Network (TestNet/MainNet)'
}

💡 Key Takeaways:
   • Use isLocalNet() to detect development vs production
   • LocalNet is for safe testing without real funds
   • TestNet/MainNet are public networks requiring caution
   • Adjust timeouts, fees, and behavior based on network

=== Network detection complete ===
✅ Example completed successfully
```

## Common Patterns

### Safe Operations Based on Environment

```typescript
async function performOperation(algorand: AlgorandClient) {
  const isLocal = await algorand.client.isLocalNet()

  if (isLocal) {
    // Safe to perform risky operations
    console.log('LocalNet - proceeding without confirmation')
    await riskyOperation()
  } else {
    // Require confirmation for public networks
    console.log('Public network - requiring user confirmation')
    const confirmed = await getUserConfirmation()
    if (confirmed) {
      await riskyOperation()
    }
  }
}
```

### Environment-Specific Logging

```typescript
async function logTransaction(algorand: AlgorandClient, txId: string) {
  const isLocal = await algorand.client.isLocalNet()

  if (isLocal) {
    console.log(`[DEV] Transaction: ${txId}`)
  } else {
    console.log(`[PROD] Transaction: ${txId}`)
    // Also send to production monitoring
    await sendToMonitoring(txId)
  }
}
```

### Network-Based Fee Strategy

```typescript
async function calculateOptimalFee(algorand: AlgorandClient) {
  const isLocal = await algorand.client.isLocalNet()

  if (isLocal) {
    // Minimum fee for LocalNet
    return 1000
  } else {
    // Higher fee for faster confirmation on public networks
    return 2000
  }
}
```

### Conditional Feature Enablement

```typescript
async function getFeaturesEnabled(algorand: AlgorandClient) {
  const isLocal = await algorand.client.isLocalNet()

  return {
    debugMode: isLocal,
    verboseLogging: isLocal,
    requireConfirmations: !isLocal,
    enableExperimentalFeatures: isLocal,
  }
}
```

### Environment-Specific Error Handling

```typescript
async function handleTransactionError(
  algorand: AlgorandClient,
  error: Error
) {
  const isLocal = await algorand.client.isLocalNet()

  if (isLocal) {
    // Detailed error info for development
    console.error('Full error stack:', error)
    console.error('This is LocalNet - safe to debug')
  } else {
    // Limited error info for production
    console.error('Transaction failed:', error.message)
    // Alert monitoring system
    await alertOps(error)
  }
}
```

## Best Practices

1. **Always Check Network Before Critical Operations**
   ```typescript
   async function deleteApplication(algorand: AlgorandClient, appId: number) {
     const isLocal = await algorand.client.isLocalNet()

     if (!isLocal) {
       console.warn('WARNING: Deleting application on public network!')
       const confirmed = await confirmDeletion()
       if (!confirmed) return
     }

     // Proceed with deletion
   }
   ```

2. **Use Different Timeouts by Network**
   ```typescript
   async function getNetworkTimeouts(algorand: AlgorandClient) {
     const isLocal = await algorand.client.isLocalNet()

     return {
       transactionTimeout: isLocal ? 4 : 20,
       apiTimeout: isLocal ? 5000 : 30000,
       retryAttempts: isLocal ? 2 : 5,
     }
   }
   ```

3. **Implement Environment-Aware Logging**
   ```typescript
   async function log(algorand: AlgorandClient, level: string, message: string) {
     const isLocal = await algorand.client.isLocalNet()
     const prefix = isLocal ? '[DEV]' : '[PROD]'

     console.log(`${prefix} [${level}] ${message}`)

     if (!isLocal) {
       // Send to production logging service
       await logToService(level, message)
     }
   }
   ```

4. **Validate Network Matches Intent**
   ```typescript
   async function validateNetwork(
     algorand: AlgorandClient,
     expectedNetwork: 'local' | 'public'
   ) {
     const isLocal = await algorand.client.isLocalNet()

     if (expectedNetwork === 'local' && !isLocal) {
       throw new Error('Expected LocalNet but connected to public network!')
     }

     if (expectedNetwork === 'public' && isLocal) {
       throw new Error('Expected public network but connected to LocalNet!')
     }
   }
   ```

## Key Takeaways

- Use `algorand.client.isLocalNet()` to detect network environment
- LocalNet returns `true`, TestNet and MainNet return `false`
- Implement different logic for development vs production
- Adjust timeouts, fees, and parameters based on network
- Add safety confirmations for public network operations
- LocalNet is safe for testing without risking real funds
- TestNet and MainNet require careful handling
- Environment detection enables safer development workflows
- Always validate network before critical operations
- Use network-specific configuration for optimal behavior

This example demonstrates essential network detection patterns for building safe, environment-aware Algorand applications
