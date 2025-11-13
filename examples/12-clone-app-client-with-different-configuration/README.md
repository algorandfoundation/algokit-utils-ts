# Clone App Client with Different Configuration

This example demonstrates how to clone an existing app client with different configuration settings, such as a different default sender, while inheriting properties like the app ID and app name. This is particularly useful in multi-user scenarios where multiple accounts need to interact with the same application.

## What This Example Shows

This example teaches you how to:
- Clone an app client with a different default sender
- Maintain the same app ID and app name across cloned instances
- Create and fund a second account for multi-user scenarios
- Use multiple client instances to interact with the same application
- Understand inheritance of properties when cloning

## Why This Matters

Cloning app clients with different configurations is important for several reasons:

1. **Multi-User Applications**: Different users can interact with the same app using their own accounts
2. **Code Reusability**: Avoid redeploying or looking up the same app multiple times
3. **Configuration Flexibility**: Each client can have different settings (sender, signer, etc.)
4. **Testing**: Simulate multiple users interacting with the same application

Key concepts:
- **Clone with Override**: Clone a client and override specific properties like sender
- **Property Inheritance**: Cloned clients inherit app ID and app name from the original
- **Independent Signers**: Each client can use a different account for signing transactions
- **Shared Application State**: All clients interact with the same on-chain application

Common use cases:
- **Multiplayer Games**: Each player needs their own client instance
- **Marketplace Applications**: Buyers and sellers interact with different accounts
- **DAO Voting**: Each member votes using their own account
- **Testing Multi-User Workflows**: Simulate different users in test scenarios

## How It Works

The example demonstrates the complete workflow for cloning with different configuration:

### 1. Deploy an Application

First, deploy an application with the first account as the default sender:

```typescript
const account1 = await algorand.account.dispenserFromEnvironment()

const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account1.addr,
})

const { appClient } = await factory.send.bare.create({
  deployTimeParams: {
    UPDATABLE: 0,
    DELETABLE: 0,
    VALUE: 1,
  },
})

console.log(`App ID: ${appClient.appId}`)
console.log(`Default Sender: ${account1.addr}`)
```

This creates the original app client associated with account1.

### 2. Create and Fund a Second Account

Create a second account that will use the cloned client:

```typescript
const account2 = algorand.account.random()

// Fund the second account
await algorand.send.payment({
  sender: account1,
  receiver: account2.addr,
  amount: algos(1),
})
```

This second account will interact with the same application but through a cloned client.

### 3. Clone with a Different Sender

Clone the app client and override the sender:

```typescript
const clonedAppClient = appClient.clone({
  sender: account2,
})
```

The cloned client:
- Has the same app ID as the original
- Inherits the app name from the original
- Uses account2 for signing transactions

### 4. Verify Inherited Properties

Both clients reference the same application:

```typescript
console.log('App IDs:')
console.log(`   Original: ${appClient.appId}`)
console.log(`   Cloned:   ${clonedAppClient.appId}`)
console.log(`   Match: ${appClient.appId === clonedAppClient.appId ? '✅' : '❌'}`)

console.log('App Names:')
console.log(`   Original: ${appClient.appName}`)
console.log(`   Cloned:   ${clonedAppClient.appName}`)
console.log(`   Match: ${appClient.appName === clonedAppClient.appName ? '✅' : '❌'}`)
```

Both checks show ✅, confirming the properties are inherited correctly.

### 5. Use Both Clients

Both clients can interact with the same application using different accounts:

```typescript
// Original client uses account1
const result1 = await appClient.send.call({
  method: 'call_abi',
  args: ['from account1'],
})

// Cloned client uses account2
const result2 = await clonedAppClient.send.call({
  method: 'call_abi',
  args: ['from account2'],
})
```

Both calls succeed, demonstrating multi-user interaction with the same application.

## Prerequisites

- AlgoKit installed
- Docker installed (for LocalNet)
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
--- Deploying Application ---
✅ App deployed successfully!
   App ID: 1019
   App Name: TestingApp
   Default Sender: A7H7Q7Y7HKRQF36LTI2MQDW2Y3YG4G72X67C743OIMOQJZYW4LGZ7BZYUI

--- Creating Second Account ---
✅ Second account created: CI7H2UKDP62D6CEKHT4NCHFBMK4WYJUI6XZAQP6EXNWZU3UCEVMHOYTYXQ
   Funded with 1 ALGO

--- Cloning App Client ---
✅ App client cloned successfully!

--- Verifying Client Properties ---

App IDs:
   Original: 1019
   Cloned:   1019
   Match: ✅

App Names:
   Original: TestingApp
   Cloned:   TestingApp
   Match: ✅

--- Testing Both Clients ---

Original client (account1) result: Hello, from account1
Cloned client (account2) result: Hello, from account2

--- Use Case: Multiple Users Interacting with Same App ---

This pattern is useful when:
  • Multiple users need to interact with the same application
  • You want to reuse the same app configuration (name, appId, etc.)
  • Each user has their own signing account
  • You want to avoid redeploying or looking up the app multiple times

Example scenarios:
  • Multiplayer games where each player needs their own client
  • Marketplace apps where buyers and sellers interact differently
  • DAO voting where each member votes with their own account
  • Testing scenarios with multiple simulated users

✅ All examples completed successfully!
```

## Key Takeaways

- Use `appClient.clone({ sender: account })` to create a client with a different sender
- Cloned clients inherit app ID and app name from the original
- Each client can use a different account for signing transactions
- All clients interact with the same on-chain application instance
- This pattern is essential for multi-user applications
- Cloning avoids redeploying or looking up the app multiple times
- The original and cloned clients are independent instances
- You can override multiple properties when cloning (sender, signer, etc.)
- Both clients see the same application state
- This is particularly useful for testing multi-user workflows
