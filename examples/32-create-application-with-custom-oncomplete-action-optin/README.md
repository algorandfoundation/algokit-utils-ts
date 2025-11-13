# Create Application with Custom OnComplete Action (OptIn) - Comparison Example

This example demonstrates how to create an Algorand application with a custom OnComplete action, specifically comparing the differences between NoOp (default) and OptIn OnComplete actions during application creation.

## What This Example Shows

This example teaches you how to:
- Create applications with different OnComplete actions (NoOp vs OptIn)
- Understand when the creator is opted in vs not opted in
- Verify OnComplete action values in transactions
- Compare the behavior differences between NoOp and OptIn
- Derive and verify application addresses from app IDs
- Access confirmation details after app creation

## Why This Matters

Understanding the difference between OnComplete actions is crucial for app deployment:

1. **Opt-In Requirement**: Some apps need the creator opted in immediately
2. **Transaction Efficiency**: OptIn combines two operations into one
3. **Local State**: OptIn is required for apps that need per-account storage
4. **Gas Savings**: One transaction instead of two reduces costs
5. **Deployment Strategy**: Choose the right OnComplete for your use case

Key concepts:
- **NoOp (0)**: Default OnComplete, just creates the app without opt-in
- **OptIn (1)**: Creates app AND opts the creator in atomically
- **OnComplete Action**: Determines what happens when transaction completes
- **Local State**: Per-account storage that requires opt-in
- **Application Address**: Deterministic address derived from app ID
- **Confirmation**: Transaction receipt with round number and app ID

Common use cases:
- **NoOp Use Cases**: Apps without local state, factory contracts, logic-only apps
- **OptIn Use Cases**: User apps, games, token contracts, escrow apps
- **Comparison**: Understanding which approach fits your app's needs
- **Testing**: Verify opt-in status for different deployment strategies
- **Education**: Learning fundamental OnComplete behavior

## How It Works

The example demonstrates two main scenarios:

### Scenario 1: Creating App with OptIn OnComplete

This scenario shows detailed app creation with OptIn:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import { readFileSync } from 'fs'

const algorand = AlgorandClient.defaultLocalNet()
const account = await algorand.account.fromEnvironment('ACCOUNT')

// Load app spec
const appSpec = JSON.parse(readFileSync('artifacts/application.json', 'utf-8'))

const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
})

// Create with OptIn OnComplete
const { result, appClient } = await factory.send.bare.create({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  updatable: true,
  deletable: true,
  deployTimeParams: {
    VALUE: 1,
  },
})

console.log('App ID:', appClient.appId.toString())
console.log('App Address:', appClient.appAddress.toString())
console.log('Transaction ID:', result.txIds[0])
```

The creation process:
- Loads a real app specification from artifacts
- Creates factory with app spec and default sender
- Uses `OptInOC` to opt creator in during creation
- Returns both result (transaction data) and appClient (for future interactions)

### Scenario 2: Comparing NoOp vs OptIn

This scenario directly compares the two approaches:

```typescript
// 1. Create with NoOp (default)
const app1 = await factory.send.bare.create({
  deployTimeParams: { VALUE: 1 },
  updatable: true,
  deletable: true,
})
console.log('OnComplete:', app1.result.transactions[0].applicationCall?.onComplete ?? 0, '(NoOp)')
// Creator is NOT opted in

// 2. Create with OptIn
const app2 = await factory.send.bare.create({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  deployTimeParams: { VALUE: 1 },
  updatable: true,
  deletable: true,
})
console.log('OnComplete:', app2.result.transactions[0].applicationCall?.onComplete, '(OptIn)')
// Creator IS opted in
```

Key differences:
- **NoOp**: OnComplete value is 0 (or undefined, defaults to NoOp)
- **OptIn**: OnComplete value is 1
- **NoOp**: Creator not opted in, cannot store local state
- **OptIn**: Creator opted in, can immediately use local state

## Verification Steps

The example performs several verification steps:

### 1. Verify OnComplete Action

```typescript
const onCompleteValue = result.transactions[0].applicationCall?.onComplete
console.log('OnComplete action:', onCompleteValue)
console.log('Is OptIn:', onCompleteValue === algosdk.OnApplicationComplete.OptInOC)
console.log('OptIn value:', algosdk.OnApplicationComplete.OptInOC) // 1
```

This confirms:
- The correct OnComplete value was used
- OptInOC has a value of 1
- Transaction contains the expected OnComplete

### 2. Verify Application Address

```typescript
const derivedAddress = algosdk.getApplicationAddress(appClient.appId).toString()
const appAddress = appClient.appAddress.toString()
console.log('App Address:', appAddress)
console.log('Derived Address:', derivedAddress)
console.log('Addresses match:', appAddress === derivedAddress)
```

This confirms:
- App address can be derived from app ID
- Factory-returned address matches derived address
- Address derivation is deterministic

### 3. Access Confirmation Details

```typescript
const confirmation = result.confirmations?.[0]
if (confirmation) {
  console.log('Application Index:', appClient.appId.toString())
  console.log('Confirmed Round:', confirmation.confirmedRound)
}
```

This provides:
- Round number when transaction was confirmed
- Application index (same as app ID)
- Transaction finality confirmation

## OnComplete Enum Values

The `OnApplicationComplete` enum has these values:

```typescript
// OnApplicationComplete enum values:
NoOpOC = 0,              // Default: just execute, no special action
OptInOC = 1,             // Opt sender into the app
CloseOutOC = 2,          // Close out sender's local state
ClearStateOC = 3,        // Force clear sender's local state
UpdateApplicationOC = 4, // Update application code
DeleteApplicationOC = 5  // Delete the application
```

**Valid for creation:**
- NoOpOC (0): Default, creates app without opt-in
- OptInOC (1): Creates app and opts creator in

**Invalid for creation:**
- CloseOutOC, ClearStateOC, UpdateApplicationOC, DeleteApplicationOC
- These require the app to already exist

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed
- Docker Desktop running (for LocalNet)
- Funded test account

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
Creating application with OptIn onComplete action...
Creator account: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA
App created by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA with ID 1023 via transaction <txn-id>

Application created successfully with OptIn!
App ID: 1023
App Address: WRET36SSWIUBQV7QWUVEFMXLN6ZIUHWULZIVKT3MFCLAQH3HQI63OVK3S4
Transaction ID: <txn-id>

Transaction details:
OnComplete action: 1
Is OptIn: true
OptIn value: 1

Verifying app address...
App Address: WRET36SSWIUBQV7QWUVEFMXLN6ZIUHWULZIVKT3MFCLAQH3HQI63OVK3S4
Derived Address: WRET36SSWIUBQV7QWUVEFMXLN6ZIUHWULZIVKT3MFCLAQH3HQI63OVK3S4
Addresses match: true

Confirmation details:
Application Index: 1023
Confirmed Round: 23n

The creator account is now opted-in to the application!
The app is updatable and deletable by the creator.

--- Demonstrating different OnComplete actions ---

1. Creating app with NoOp (default)...
App created by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA with ID 1024 via transaction <txn-id>
   App ID: 1024
   OnComplete: 0 (NoOp)

2. Creating app with OptIn...
App created by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA with ID 1025 via transaction <txn-id>
   App ID: 1025
   OnComplete: 1 (OptIn)
   Creator is now opted-in!

Key difference:
- NoOp (0): App is created, but creator is NOT opted-in
- OptIn (1): App is created AND creator IS opted-in (can store local state)

All examples completed successfully!
```

## Common Patterns

### Choosing Between NoOp and OptIn

```typescript
// Use NoOp when app doesn't need local state
const logicOnlyApp = await factory.send.bare.create({
  // No onComplete specified, defaults to NoOp
  updatable: false,
  deletable: false,
})

// Use OptIn when app needs local state
const userApp = await factory.send.bare.create({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  updatable: true,
  deletable: true,
})
```

### Conditional OnComplete Based on App Requirements

```typescript
// Check if app has local state schema
const hasLocalState = appSpec.state?.local !== undefined

const { result, appClient } = await factory.send.bare.create({
  onComplete: hasLocalState
    ? algosdk.OnApplicationComplete.OptInOC
    : algosdk.OnApplicationComplete.NoOpOC,
  updatable: true,
  deletable: true,
})
```

### Verifying Opt-In Status After Creation

```typescript
// Create with OptIn
const { result, appClient } = await factory.send.bare.create({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  updatable: true,
  deletable: true,
})

// Verify account is opted in
const accountInfo = await algorand.client.algod
  .accountInformation(account.addr)
  .do()

const isOptedIn = accountInfo.appsLocalState?.some(
  (app: any) => app.id === appClient.appId
) ?? false

console.log('Creator opted in:', isOptedIn) // true
```

### Creating Multiple Apps with Different OnComplete

```typescript
// Batch create apps with different strategies
const apps = []

// Factory app (NoOp)
apps.push(await factory.send.bare.create({
  deployTimeParams: { VALUE: 1 },
}))

// User app (OptIn)
apps.push(await factory.send.bare.create({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  deployTimeParams: { VALUE: 2 },
}))

// Logic app (NoOp)
apps.push(await factory.send.bare.create({
  deployTimeParams: { VALUE: 3 },
}))

console.log(`Created ${apps.length} apps with mixed OnComplete actions`)
```

## Best Practices

1. **Use OptIn Only When Needed**
   ```typescript
   // Good: OptIn for apps requiring local state
   const { result, appClient } = await factory.send.bare.create({
     onComplete: algosdk.OnApplicationComplete.OptInOC,
   })

   // Avoid: OptIn for pure logic apps (wastes resources)
   ```

2. **Always Verify OnComplete Value**
   ```typescript
   const onComplete = result.transactions[0].applicationCall?.onComplete
   if (onComplete !== algosdk.OnApplicationComplete.OptInOC) {
     console.warn('Unexpected OnComplete value:', onComplete)
   }
   ```

3. **Document OnComplete Choice**
   ```typescript
   /**
    * Creates user application with OptIn.
    * OptIn is required because app uses local state to track user scores.
    */
   const { result, appClient } = await factory.send.bare.create({
     onComplete: algosdk.OnApplicationComplete.OptInOC,
   })
   ```

4. **Handle Address Objects Correctly**
   ```typescript
   // Good: Convert to string for comparison
   const appAddress = appClient.appAddress.toString()
   const derivedAddress = algosdk.getApplicationAddress(appClient.appId).toString()
   console.log('Match:', appAddress === derivedAddress)

   // Avoid: Comparing Address objects directly
   console.log('Match:', appClient.appAddress === algosdk.getApplicationAddress(appClient.appId)) // false!
   ```

5. **Access Transaction Details from Result**
   ```typescript
   // Good: Access from result structure
   const txnId = result.txIds[0]
   const onComplete = result.transactions[0].applicationCall?.onComplete
   const confirmation = result.confirmations?.[0]

   // Avoid: Trying to access from deprecated properties
   ```

## Comparison with Example 31

This example (32) differs from example 31 in these ways:

**Example 31:** Focused tutorial on OptIn OnComplete
- Single comprehensive walkthrough
- Detailed explanation of each step
- Verification of opt-in status
- Educational focus

**Example 32:** Comparison and verification
- Direct comparison between NoOp and OptIn
- Two separate scenarios in one run
- Demonstrates both approaches side-by-side
- Testing focus

Both examples are valuable:
- Use Example 31 for learning OptIn OnComplete in depth
- Use Example 32 for understanding the differences between approaches

## Key Takeaways

- NoOp (0) is the default OnComplete action when creating apps
- OptIn (1) combines app creation with account opt-in in one transaction
- NoOp apps cannot use local state for the creator unless they opt in separately
- OptIn apps allow immediate local state usage
- Only NoOp and OptIn are valid OnComplete actions during creation
- OnComplete value can be verified from `result.transactions[0].applicationCall?.onComplete`
- Application addresses are deterministically derived from app IDs
- Address objects must be converted to strings for comparison
- Use `algosdk.OnApplicationComplete` enum for type-safe OnComplete values
- Creator opt-in status can be verified from account information
- Choose OnComplete based on whether your app requires local state
- This example provides a practical comparison to understand both approaches

This example is particularly useful for developers who need to understand the behavioral differences between OnComplete actions and choose the right approach for their application deployment strategy.
