# Create Application with Custom OnComplete Action

This example demonstrates how to create an Algorand application with a custom OnComplete action during creation. By using OptIn as the OnComplete action, you can combine app creation and account opt-in into a single transaction.

## What This Example Shows

This example teaches you how to:
- Create an application with a custom OnComplete action
- Use OptIn OnComplete to combine creation and opt-in in one transaction
- Verify the OnComplete action used in a transaction
- Check if an account is opted into an application
- Understand which OnComplete actions are valid during creation
- Save transaction fees by combining operations

## Why This Matters

Custom OnComplete actions during creation provide significant efficiency gains:

1. **Transaction Fee Savings**: Combine two operations (create + opt-in) into one
2. **Reduced Complexity**: One transaction instead of two separate calls
3. **Atomic Operation**: Creation and opt-in happen together or not at all
4. **Convenience**: Automatically opt in the creator when deploying
5. **Better UX**: Simpler deployment flow for users

Key concepts:
- **OnComplete Action**: Specifies what happens when a transaction completes
- **NoOp (0)**: Default action, just executes the transaction
- **OptIn (1)**: Additionally opts the sender into the application
- **Valid During Creation**: Only NoOp and OptIn can be used when creating
- **Account Opt-In**: Accounts must opt into apps to have local state
- **Local State**: Per-account storage within an application

Common use cases:
- **User Apps**: Apps where the creator should be immediately opted in
- **Game Contracts**: Creator wants to participate from deployment
- **Token Contracts**: Creator needs to hold tokens upon creation
- **Escrow Apps**: Creator wants to interact with the app immediately
- **Testing**: Quickly deploy and opt in for development/testing

## How It Works

The example demonstrates seven scenarios for custom OnComplete actions:

### 1. Setting Up AlgorandClient and Account

Initialize the client and get a funded account:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()

// Get a funded creator account
const creator = await algorand.account.fromEnvironment('CREATOR')
console.log(`Creator account: ${creator.addr}`)
```

The creator account:
- Used to create the application
- Will be automatically opted in during creation
- Must have sufficient ALGO for fees and minimum balance

### 2. Loading Application Specification

Load the app spec containing the contract:

```typescript
import { readFileSync } from 'fs'
import * as path from 'path'

const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

console.log(`Contract name: ${appSpec.contract.name}`)
```

The app spec includes:
- Contract ABI with method signatures
- TEAL approval and clear programs
- State schema definitions (global and local)
- Method configurations

### 3. Creating App Factory

Create a factory from the app spec:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: creator.addr,
})
```

The factory:
- Provides typed interface for app creation
- Manages deployment process
- Handles different OnComplete actions
- Returns app client after creation

### 4. Creating Application with OptIn OnComplete Action

Create the application using OptIn OnComplete:

```typescript
import algosdk from 'algosdk'

const { result, appClient } = await factory.send.bare.create({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  updatable: true,
  deletable: true,
  deployTimeParams: {
    VALUE: 1,
  },
})

console.log(`App ID: ${appClient.appId}`)
console.log(`App Address: ${appClient.appAddress}`)
console.log(`Transaction ID: ${result.txIds[0]}`)
```

The deployment:
- Uses `onComplete: algosdk.OnApplicationComplete.OptInOC`
- Creator is automatically opted in during creation
- Single transaction for both operations
- More efficient than separate transactions

**OnComplete Values:**
- `algosdk.OnApplicationComplete.NoOpOC` (0): Default, just create
- `algosdk.OnApplicationComplete.OptInOC` (1): Create and opt in
- Other values (2-5) are invalid during creation

### 5. Verifying OnComplete Action

Check that OptIn was used:

```typescript
const onComplete = result.transactions[0].applicationCall?.onComplete

console.log(`OnComplete: ${onComplete === algosdk.OnApplicationComplete.OptInOC ? 'OptIn ✓' : 'Other'}`)
console.log(`OnComplete Value: ${onComplete}`)
console.log(`Expected Value: ${algosdk.OnApplicationComplete.OptInOC}`)
```

Verification confirms:
- The correct OnComplete action was used
- Value matches OptInOC (1)
- Transaction completed successfully

### 6. Verifying Account Opted In

Confirm the creator is opted into the app:

```typescript
const accountInfo = await algorand.client.algod.accountInformation(creator.addr).do()
const optedInApps = accountInfo.appsLocalState || []
const isOptedIn = optedInApps.some((app: any) => app.id === appClient.appId)

console.log(`Creator opted in: ${isOptedIn ? '✓ YES' : '✗ NO'}`)
console.log(`Total apps opted into: ${accountInfo.totalAppsOptedIn}`)
```

Account information includes:
- `appsLocalState`: Array of applications the account is opted into
- `totalAppsOptedIn`: Count of opted-in applications
- Each app entry has `id`, `schema`, and optional `keyValue` (state data)

### 7. Understanding OnComplete Actions

Available OnComplete actions during creation:

**Valid for creation:**
- **NoOp (0)**: Default, just create the app
- **OptIn (1)**: Create and opt the sender into the app

**Invalid for creation:**
- **CloseOut (2)**: Cannot close out during creation
- **UpdateApplication (4)**: Cannot update during creation
- **DeleteApplication (5)**: Cannot delete during creation

OnComplete actions control what happens when the transaction completes. For creation, only NoOp and OptIn make sense since the app doesn't exist yet to update, delete, or close out of.

## Account Opt-In Explained

When an account opts into an application:

1. **Local State Allocation**: The account allocates storage for the app's local state
2. **Minimum Balance Increase**: Account's minimum balance increases (100,000 microALGOs per app + schema cost)
3. **Permission Granted**: The app can now read/write to this account's local state
4. **Required for Interaction**: Many app operations require the account to be opted in

Without opt-in:
- Account cannot hold app-specific data
- App calls requiring local state will fail
- Cannot participate in certain app features

With OptIn during creation:
- Creator is immediately ready to interact with the app
- No need for separate opt-in transaction
- Saves 1000 microALGOs in transaction fees

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
=== Create Application with Custom OnComplete Action ===

1. Setting Up AlgorandClient and Account
   Connecting to LocalNet...

   Creator account: <account-address>

2. Loading Application Specification
   Reading app spec...\n
   App spec loaded successfully
   Contract name: TestingApp

3. Creating App Factory
   Getting app factory from spec...\n
   Factory created successfully

4. Creating Application with OptIn OnComplete Action
   Using OptIn to combine creation and opt-in...\n

App created by <account-address> with ID 1014 via transaction <txn-id>
   ✓ Application created with OptIn action!
   App ID: 1014
   App Address: <app-address>
   Transaction ID: <txn-id>

5. Verifying OnComplete Action
   Checking that OptIn was used...\n
   📋 Transaction Details:
   OnComplete: OptIn ✓
   OnComplete Value: 1
   Expected Value: 1

6. Verifying Account Opted In
   Checking that creator is opted into the app...\n
   Creator opted in: ✓ YES
   Total apps opted into: 3

   The creator is now opted into the application!
   This happened automatically during creation using OptIn OnComplete.
   No separate opt-in transaction was needed!

7. Understanding OnComplete Actions
   Available OnComplete actions during creation...\n
   Valid for creation:
   • NoOp (0): Default, just create the app
   • OptIn (1): Create and opt the sender into the app

   Invalid for creation:
   • CloseOut (2): Cannot close out during creation
   • UpdateApplication (4): Cannot update during creation
   • DeleteApplication (5): Cannot delete during creation

=== Summary ===
✅ Successfully created application with OptIn OnComplete action!

Key points:
  • Used OptIn OnComplete action during creation
  • Creator automatically opted into the app
  • Single transaction for both creation and opt-in
  • Saves transaction fees compared to separate transactions
  • Useful for apps that require immediate opt-in

=== Key Takeaways ===
• OnComplete actions control what happens when transaction completes
• OptIn during creation combines two operations into one
• Only NoOp and OptIn are valid for creation
• Use algosdk.OnApplicationComplete enum for type safety
• Verify opt-in status by checking account's apps-local-state
```

## Common Patterns

### Creating App with Immediate Opt-In

```typescript
// Create app and opt in the creator in one transaction
const { result, appClient } = await factory.send.bare.create({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  updatable: true,
  deletable: true,
})

// Creator is now opted in and ready to interact
await appClient.send.call({
  method: 'interact',
  args: [/* ... */],
})
```

### Creating App Without Opt-In (Default)

```typescript
// Create app without opting in (default behavior)
const { result, appClient } = await factory.send.bare.create({
  // onComplete defaults to NoOpOC if not specified
  updatable: true,
  deletable: true,
})

// Creator is NOT opted in yet
// Need to opt in separately if required
await appClient.send.optIn({
  sender: creator.addr,
})
```

### Conditional Opt-In Based on Requirements

```typescript
// Determine if opt-in is needed based on app requirements
const requiresOptIn = appSpec.contract.methods.some(
  (m: any) => m.name === 'create' && m.args.length > 0
)

const { result, appClient } = await factory.send.bare.create({
  onComplete: requiresOptIn
    ? algosdk.OnApplicationComplete.OptInOC
    : algosdk.OnApplicationComplete.NoOpOC,
  updatable: true,
  deletable: true,
})
```

### Verifying Opt-In Status After Creation

```typescript
const { result, appClient } = await factory.send.bare.create({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  updatable: true,
  deletable: true,
})

// Verify the creator is opted in
const accountInfo = await algorand.client.algod
  .accountInformation(creator.addr)
  .do()

const isOptedIn = accountInfo.appsLocalState?.some(
  (app: any) => app.id === appClient.appId
) ?? false

if (!isOptedIn) {
  throw new Error('Creator should be opted in but is not!')
}

console.log('✓ Creator is opted in and ready to interact')
```

### Using ABI Method with OptIn

```typescript
// Create app using ABI method with OptIn OnComplete
const { result, appClient } = await factory.send.create({
  method: 'create_with_init',
  args: [initialValue],
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  deployTimeParams: {
    VALUE: 100,
  },
})

// Creator is opted in and initial state is set
console.log(`Created app ${appClient.appId} with creator opted in`)
```

## Best Practices

1. **Use OptIn When Appropriate**
   ```typescript
   // Good: Use OptIn when creator needs to interact immediately
   const { result, appClient } = await factory.send.bare.create({
     onComplete: algosdk.OnApplicationComplete.OptInOC,
   })

   // Avoid: Separate transactions when not necessary
   const { result, appClient } = await factory.send.bare.create()
   await appClient.send.optIn({ sender: creator.addr })
   ```

2. **Always Verify OnComplete Action**
   ```typescript
   const { result } = await factory.send.bare.create({
     onComplete: algosdk.OnApplicationComplete.OptInOC,
   })

   const actualOnComplete = result.transactions[0].applicationCall?.onComplete
   if (actualOnComplete !== algosdk.OnApplicationComplete.OptInOC) {
     throw new Error('OnComplete action mismatch')
   }
   ```

3. **Use Enum Constants for Type Safety**
   ```typescript
   // Good: Type-safe enum
   onComplete: algosdk.OnApplicationComplete.OptInOC

   // Avoid: Magic numbers
   onComplete: 1
   ```

4. **Document When OptIn Is Required**
   ```typescript
   /**
    * Creates the game application with creator auto-opted-in.
    * OptIn is required because the creator becomes the first player.
    */
   const { result, appClient } = await factory.send.bare.create({
     onComplete: algosdk.OnApplicationComplete.OptInOC,
   })
   ```

5. **Check Account Opt-In Status**
   ```typescript
   // Verify opt-in succeeded
   const accountInfo = await algorand.client.algod
     .accountInformation(creator.addr)
     .do()

   const isOptedIn = accountInfo.appsLocalState?.some(
     (app: any) => app.id === appClient.appId
   ) ?? false

   console.log(`Opt-in status: ${isOptedIn ? 'SUCCESS' : 'FAILED'}`)
   ```

## Key Takeaways

- OnComplete actions determine what happens when a transaction completes
- OptIn during creation combines app creation and account opt-in in one transaction
- Only NoOp and OptIn are valid OnComplete actions during creation
- Using OptIn saves transaction fees (1000 microALGOs) compared to separate transactions
- Verify OnComplete using `result.transactions[0].applicationCall?.onComplete`
- Check opt-in status using `accountInfo.appsLocalState`
- Account minimum balance increases when opting into apps
- Use `algosdk.OnApplicationComplete` enum for type-safe OnComplete values
- OptIn is atomic with creation - both succeed or both fail
- Particularly useful for apps where the creator needs to interact immediately
- Account property names are camelCase: `appsLocalState`, `totalAppsOptedIn`
- Always verify opt-in status after creation when using OptIn OnComplete

This pattern is essential for efficient app deployment when the creator needs to participate in the application from the moment it's created, saving both transaction fees and development complexity.
