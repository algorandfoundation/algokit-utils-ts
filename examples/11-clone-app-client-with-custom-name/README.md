# Clone App Client with Custom Name

This example demonstrates how to clone an app client with a different app name while maintaining the same app ID, which is useful for managing multiple references to the same application with different configurations.

## What This Example Shows

This example teaches you how to:
- Clone an existing app client using the `clone()` method
- Override the app name in the cloned client
- Maintain the same app ID across different client instances
- Use both the original and cloned clients to interact with the same application
- Understand when and why to use app client cloning

## Why This Matters

App client cloning is important for several reasons:

1. **Organizational Flexibility**: Different parts of your application can reference the same smart contract with different names
2. **Configuration Management**: Clone clients to use different signers or default parameters
3. **Testing**: Create multiple client instances with different configurations for testing
4. **Code Clarity**: Use descriptive names that match the context where the client is used

Key concepts:
- **Clone Method**: Creates a new client instance referencing the same app
- **Same App ID**: Both clients interact with the identical on-chain application
- **Independent Configuration**: Each client can have different names and settings
- **Shared State**: All clients see the same application state

Common use cases:
- **Multi-Module Applications**: Different modules use different names for organizational clarity
- **Role-Based Access**: Clone with different signers for different user roles
- **Testing Scenarios**: Create multiple client instances with varied configurations
- **Migration**: Maintain backward compatibility while introducing new naming conventions

## How It Works

The example demonstrates the complete app client cloning workflow:

### 1. Deploy an Application

First, deploy an application with an initial name:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: testAccount.addr,
})

const { appClient } = await factory.send.bare.create({
  deployTimeParams: {
    UPDATABLE: 0,
    DELETABLE: 0,
    VALUE: 1,
  },
})

console.log(`App deployed with ID: ${appClient.appId}`)
console.log(`Original app name: ${appClient.appName}`)
```

This creates the original app client with the default app name from the app spec.

### 2. Clone with a Different Name

Clone the app client and override the app name:

```typescript
const clonedAppClient = appClient.clone({
  appName: 'cloned-app',
})
```

The `clone()` method creates a new client instance that:
- References the same app ID
- Has a different app name
- Can have different configuration options

### 3. Verify the Clone

Both clients reference the same application but have different names:

```typescript
console.log(`Original App ID: ${appClient.appId}`)
console.log(`Cloned App ID: ${clonedAppClient.appId}`)
console.log(`App IDs match: ${clonedAppClient.appId === appClient.appId}`) // true

console.log(`Original app name: ${appClient.appName}`)
console.log(`Cloned app name: ${clonedAppClient.appName}`)
console.log(`Names are different: ${clonedAppClient.appName !== appClient.appName}`) // true
```

### 4. Use Both Clients

Both clients can interact with the same application:

```typescript
// Original client
const result1 = await appClient.send.call({
  method: 'call_abi',
  args: ['World'],
})

// Cloned client
const result2 = await clonedAppClient.send.call({
  method: 'call_abi',
  args: ['Clone'],
})
```

Both clients successfully call methods on the same deployed application.

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
=== Clone App Client Example ===

Step 1: Deploying application...
App deployed with ID: 1017
Original app name: TestingApp

Step 2: Cloning app client with new name...

=== Results ===
Original App ID: 1017
Cloned App ID: 1017
App IDs match: true

Original app name: TestingApp
Cloned app name: cloned-app
Names are different: true

=== Testing Both Clients ===
Original client result: Hello, World
Cloned client result: Hello, Clone

✅ Clone successful! Both clients reference the same app with different names.

Use cases for cloning:
- Different organizational names for the same app
- Different default signers for different contexts
- Different default parameters while maintaining the same app ID
```

## Key Takeaways

- Use `appClient.clone()` to create a new client instance for the same application
- The cloned client maintains the same app ID as the original
- You can override properties like `appName` when cloning
- Both clients can interact with the same on-chain application
- Cloning is useful for organizational purposes and different configurations
- The original and cloned clients are independent instances
- Changes to configuration in one client don't affect the other
- Both clients see the same application state since they reference the same app ID
- Cloning is lightweight - it doesn't deploy a new application
- Use cloning when you need multiple references to the same app with different settings
