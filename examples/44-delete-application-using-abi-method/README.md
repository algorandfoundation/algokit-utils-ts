# Delete Application Using ABI Method

This example demonstrates how to delete a smart contract application using an ABI method, which allows you to include custom cleanup logic before the application is removed from the blockchain.

## What This Example Shows

This example teaches you how to:
- Create a deletable application with deploy-time parameters
- Delete an application using an ABI method
- Receive return values from deletion operations
- Verify that an application has been deleted
- Handle cleanup logic before deletion
- Use `TMPL_DELETABLE` parameter to control deletion

## Why This Matters

Understanding application deletion is essential for app lifecycle management:

1. **Resource Management**: Free up blockchain space by removing unused apps
2. **Cleanup Logic**: Execute custom cleanup before deletion (refunds, state transfers, etc.)
3. **Return Values**: Get confirmation and status from deletion operations
4. **Permanent vs Temporary**: Control whether apps can be deleted via template parameters
5. **Security**: Ensure only authorized parties can delete apps

Key concepts:
- **ABI Delete Method**: Custom method called during deletion (`OnComplete: DeleteApplication`)
- **Deploy-Time Parameters**: `TMPL_DELETABLE` controls if app can be deleted
- **Permanent Apps**: Apps with `TMPL_DELETABLE: 0` cannot be deleted
- **Return Values**: Delete methods can return data (e.g., confirmation messages)
- **Authorization**: Smart contract logic controls who can delete
- **Irreversible**: Once deleted, apps cannot be recovered

Common use cases:
- **Cleanup**: Return funds to users before deleting
- **State Migration**: Transfer important state to new contract
- **Logging**: Record deletion event with metadata
- **Refunds**: Return minimum balance requirements
- **Testing**: Clean up test contracts after validation

## How It Works

### 1. Initialize AlgorandClient and Load App Spec

Set up the client and load the application specification:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const algorand = AlgorandClient.defaultLocalNet()
const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

// Load app spec from file
const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))
```

Setup includes:
- Creating LocalNet client
- Getting funded account
- Loading app specification with delete_abi method
- Ready for deployment

### 2. Create App Factory with Deploy-Time Parameters

Create the factory and set deletable flag:

```typescript
// Create app factory
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: testAccount.addr,
})

// Define deploy-time parameters for the app
// TMPL_UPDATABLE: 0 means the app cannot be updated
// TMPL_DELETABLE: 1 means the app can be deleted
// TMPL_VALUE: 1 is an example parameter
const deployTimeParams = {
  TMPL_UPDATABLE: 0,
  TMPL_DELETABLE: 1,
  TMPL_VALUE: 1,
}
```

Deploy-time parameters:
- `TMPL_DELETABLE: 1` - App can be deleted
- `TMPL_DELETABLE: 0` - App is permanent (cannot be deleted)
- `TMPL_UPDATABLE: 0` - App cannot be updated
- `TMPL_VALUE` - Custom application parameter

### 3. Create the Deletable Application

Deploy the application with delete capability:

```typescript
// Create the app with a bare call (no ABI method)
const { appClient } = await factory.send.bare.create({
  deployTimeParams,
})

console.log(`✓ App created with ID: ${appClient.appId}`)
console.log(`  App address: ${appClient.appAddress}`)
console.log('  App is deletable and can be removed from the blockchain')
```

Creation:
- Uses bare create (no ABI method for creation)
- Applies deploy-time parameters
- Returns app client for subsequent operations
- App is now on the blockchain with deletable flag set

### 4. Verify App Exists

Confirm the application is on the blockchain:

```typescript
// Verify the app exists
const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
console.log('Step 2: Verifying app exists...')
console.log(`✓ App exists on blockchain`)
console.log(`  Creator: ${appInfo.params.creator}`)
```

Verification:
- Query algod for application information
- Confirms app exists and is accessible
- Shows creator address
- Ready for deletion

### 5. Delete Using ABI Method

Call the delete ABI method to remove the app:

```typescript
// Delete the app using an ABI method
const deleteResult = await appClient.send.delete({
  method: 'delete_abi',
  args: ['cleanup_complete'],
})

// The ABI method can return a value during deletion
console.log(`✓ Delete method returned: "${deleteResult.return}"`)
console.log(`  Transaction ID: ${deleteResult.txIds[0]}`)
```

Deletion process:
- Calls `delete_abi` method on the contract
- Passes argument (e.g., cleanup message)
- Method executes cleanup logic
- Returns value (e.g., status message)
- App is removed from blockchain after method completes

### 6. Verify Deletion

Confirm the app no longer exists:

```typescript
// Try to fetch the app - it should no longer exist
try {
  await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
  console.log('❌ Error: App still exists!')
} catch (error) {
  console.log('✓ App successfully deleted from the blockchain')
  console.log('  The app no longer exists and cannot be queried')
}
```

Verification:
- Attempts to query the deleted app
- Expects an error (app not found)
- Confirms permanent deletion
- App ID can be reused for new apps

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed
- Docker Desktop running (for LocalNet)
- LocalNet running

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
=== Delete Application Using ABI Method ===

Test account address: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

Step 1: Creating a deletable application...
✓ App created with ID: 1062
  App address: GB4JTX4EEV3Z4SBRJXQ3OH4HZYTCBHKV3HZ5A7YNFCYXXAGIZPWVKCUNRA
  App is deletable and can be removed from the blockchain

Step 2: Verifying app exists...
✓ App exists on blockchain
  Creator: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

Step 3: Deleting the app with ABI method...
✓ Delete method returned: "cleanup_complete"
  Transaction ID: R6JK2I55VRBNMAVKR7IJQU6JYEJPY5JRHOVQYEY2MDJKHXINXKQA

Step 4: Verifying app was deleted...
✓ App successfully deleted from the blockchain
  The app no longer exists and cannot be queried

✅ Example completed successfully
```

## Common Patterns

### Delete with Refund Logic

```typescript
// ABI method that refunds users before deletion
const deleteResult = await appClient.send.delete({
  method: 'delete_with_refund',
  args: [userAddress, refundAmount],
})

console.log('Refund status:', deleteResult.return)
```

### Conditional Deletion

```typescript
// Check if deletion is allowed
const canDelete = await appClient.send.call({
  method: 'can_delete',
})

if (canDelete.return) {
  const deleteResult = await appClient.send.delete({
    method: 'delete_abi',
    args: ['authorized_deletion'],
  })
  console.log('Deleted:', deleteResult.return)
} else {
  console.log('Deletion not authorized')
}
```

### Delete with State Transfer

```typescript
// Transfer state to new contract before deletion
const deleteResult = await appClient.send.delete({
  method: 'delete_and_migrate',
  args: [newContractAppId, stateSnapshot],
})

console.log('Migration result:', deleteResult.return)
```

### Bare Delete (No ABI Method)

```typescript
// Delete without custom cleanup logic
const deleteResult = await appClient.send.bare.delete()

console.log('App deleted via bare call')
console.log('Transaction ID:', deleteResult.txIds[0])
```

### Delete with Multiple Cleanup Steps

```typescript
// Multi-step cleanup before deletion
// Step 1: Close out positions
await appClient.send.call({
  method: 'close_positions',
})

// Step 2: Refund users
await appClient.send.call({
  method: 'refund_users',
})

// Step 3: Delete with final cleanup
const deleteResult = await appClient.send.delete({
  method: 'delete_abi',
  args: ['all_cleanup_complete'],
})

console.log('Final cleanup:', deleteResult.return)
```

### Handle Deletion Errors

```typescript
// Handle permanent apps that cannot be deleted
try {
  const deleteResult = await appClient.send.delete({
    method: 'delete_abi',
    args: ['attempt_delete'],
  })
  console.log('Deleted successfully')
} catch (error) {
  console.error('Deletion failed:', error.message)
  // App might be permanent (TMPL_DELETABLE: 0)
  // or delete logic rejected the attempt
}
```

### Delete with Event Logging

```typescript
// Log deletion event with metadata
const deleteResult = await appClient.send.delete({
  method: 'delete_with_log',
  args: [
    reason,        // Reason for deletion
    timestamp,     // When deleted
    operatorAddr   // Who deleted it
  ],
})

// Return value contains logged data
const logData = deleteResult.return as string
console.log('Deletion logged:', logData)
```

## Best Practices

1. **Always Set TMPL_DELETABLE Appropriately**
   ```typescript
   // Good: Explicitly decide if app should be deletable
   const deployTimeParams = {
     TMPL_DELETABLE: 1,  // For test apps, temporary contracts
     // OR
     TMPL_DELETABLE: 0,  // For permanent, critical contracts
   }

   // For production critical apps:
   const productionParams = {
     TMPL_UPDATABLE: 0,
     TMPL_DELETABLE: 0,  // Cannot be deleted
   }
   ```

2. **Include Authorization in Delete Logic**
   ```typescript
   // Good: Smart contract checks authorization
   // In your TEAL:
   // txn Sender
   // global CreatorAddress
   // ==
   // assert  // Only creator can delete

   // Then call delete
   await appClient.send.delete({
     method: 'delete_abi',
     args: ['authorized'],
   })
   ```

3. **Return Meaningful Values from Delete Methods**
   ```typescript
   // Good: Return status, confirmation, or cleanup results
   const deleteResult = await appClient.send.delete({
     method: 'delete_abi',
     args: ['cleanup_reason'],
   })

   const status = deleteResult.return as string
   if (status.includes('success')) {
     console.log('Cleanup successful before deletion')
   }
   ```

4. **Verify Deletion Completed**
   ```typescript
   // Good: Always verify deletion succeeded
   const appId = appClient.appId

   await appClient.send.delete({
     method: 'delete_abi',
     args: ['delete'],
   })

   // Verify it's gone
   try {
     await algorand.client.algod.getApplicationByID(Number(appId)).do()
     throw new Error('App was not deleted')
   } catch (error) {
     console.log('✓ Verified: App deleted successfully')
   }
   ```

5. **Handle Cleanup Before Deletion**
   ```typescript
   // Good: Execute cleanup steps before deleting
   // Refund any held funds
   await appClient.send.call({
     method: 'refund_all_users',
   })

   // Close any open positions
   await appClient.send.call({
     method: 'close_positions',
   })

   // Now safe to delete
   await appClient.send.delete({
     method: 'delete_abi',
     args: ['cleanup_complete'],
   })
   ```

6. **Document Deletion Conditions**
   ```typescript
   /**
    * Deletes the application after cleanup
    * 
    * Requirements:
    * - Caller must be the creator
    * - All user balances must be zero
    * - No active positions
    * 
    * @param reason - Reason for deletion (logged in return value)
    * @returns Confirmation message
    */
   async function deleteApp(reason: string) {
     return await appClient.send.delete({
       method: 'delete_abi',
       args: [reason],
     })
   }
   ```

7. **Test Deletion in Development**
   ```typescript
   // Good: Test deletion logic before production
   if (process.env.NODE_ENV === 'development') {
     // Create test app
     const { appClient } = await factory.send.bare.create({
       deployTimeParams: {
         TMPL_DELETABLE: 1,  // Deletable for testing
       },
     })

     // Test deletion
     const result = await appClient.send.delete({
       method: 'delete_abi',
       args: ['test_deletion'],
     })

     console.log('Test deletion successful:', result.return)
   }
   ```

## Comparison: Bare vs ABI Delete

### Bare Delete
```typescript
// No method called during deletion
const deleteResult = await appClient.send.bare.delete()

// No custom cleanup logic
// No return value
// Simpler but less flexible
```

### ABI Delete (This Example)
```typescript
// ABI method called during deletion
const deleteResult = await appClient.send.delete({
  method: 'delete_abi',
  args: ['cleanup_message'],
})

// Custom cleanup logic runs
// Returns value (status, confirmation, etc.)
const status = deleteResult.return as string
console.log('Cleanup status:', status)
```

**When to use:**
- **Bare**: Simple apps with no cleanup needed
- **ABI**: Apps requiring refunds, state migration, or logging

## Key Takeaways

- Use `TMPL_DELETABLE: 1` to make apps deletable
- ABI delete methods allow custom cleanup logic before deletion
- Delete methods can return values (confirmation, status, etc.)
- Access return value via `deleteResult.return`
- Always verify deletion by attempting to query the app (should fail)
- Deleted apps cannot be recovered - deletion is permanent
- App IDs can be reused after deletion
- Use bare delete for simple cases, ABI delete for cleanup logic
- Include authorization checks in smart contract delete logic
- Test deletion thoroughly in development before production
- Document deletion requirements and conditions
- Handle cleanup operations (refunds, state transfers) before deleting
- Permanent apps use `TMPL_DELETABLE: 0` and cannot be deleted
- Transaction ID is available via `deleteResult.txIds[0]`

This example demonstrates proper application deletion with ABI methods, essential for managing application lifecycles and ensuring clean removal of contracts from the blockchain.
