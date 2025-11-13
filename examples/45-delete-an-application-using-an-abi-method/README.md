# Delete an Application Using an ABI Method

This example demonstrates how to delete a smart contract application using an ABI method that can execute custom cleanup logic and return values.

## What This Example Shows

This example teaches you how to:
- Create applications that can be deleted (using deploy-time parameters)
- Delete applications using ABI methods instead of bare calls
- Pass arguments to delete methods for custom cleanup logic
- Get return values from delete operations
- Verify that an application has been deleted from the blockchain
- Work with deploy-time parameters (TMPL_DELETABLE)

## Why This Matters

ABI delete methods provide more control and feedback during application deletion:

1. **Custom Cleanup Logic**: Execute cleanup code before the app is deleted
2. **Return Values**: Get confirmation or status information from the delete operation
3. **Argument Passing**: Pass parameters to control how cleanup is performed
4. **Type Safety**: ABI methods provide typed arguments and return values
5. **Auditability**: Return values can be logged for tracking deletions
6. **Conditional Logic**: Implement checks before allowing deletion

Key concepts:
- **Deletable Applications**: Apps must be created with `TMPL_DELETABLE=1`
- **ABI Delete Method**: Method with `delete_application: 'CALL'` call config
- **Deploy-Time Parameters**: Template variables set at deployment
- **Return Values**: ABI methods can return data during deletion
- **Transaction Finality**: Once deleted, app cannot be recovered

Common use cases:
- **Cleanup Operations**: Clear state, transfer assets, or notify other contracts
- **Access Control**: Verify only authorized users can delete
- **Logging**: Return confirmation messages for audit trails
- **Conditional Deletion**: Check conditions before allowing deletion
- **Multi-Step Cleanup**: Execute multiple cleanup operations

## How It Works

### 1. Initialize AlgorandClient and Load App Spec

Set up the client and load the app specification:

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
- Loading app specification with delete method
- Ready for deployment

### 2. Create App Factory

Create the factory with the app spec:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: testAccount.addr,
})
```

Factory provides:
- Consistent configuration for app operations
- Methods for creating and calling apps
- Returns app client for interaction
- Manages ABI method encoding/decoding

### 3. Create Deletable Application

Deploy the application with TMPL_DELETABLE=1:

```typescript
const deployTimeParams = {
  TMPL_UPDATABLE: 0,  // Cannot be updated
  TMPL_DELETABLE: 1,  // Can be deleted
  TMPL_VALUE: 1,      // Example parameter
}

const { appClient } = await factory.send.bare.create({
  deployTimeParams,
})

console.log(`✓ App created with ID: ${appClient.appId}`)
console.log(`  App address: ${appClient.appAddress}`)
```

Deploy-time parameters:
- `TMPL_UPDATABLE`: Controls whether app can be updated (0=no, 1=yes)
- `TMPL_DELETABLE`: Controls whether app can be deleted (0=no, 1=yes)
- `TMPL_VALUE`: Example parameter (contract-specific)
- Must use `TMPL_` prefix
- Set at creation, cannot be changed
- Enforced by contract logic

### 4. Verify Application Exists

Check that the app is on the blockchain:

```typescript
const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
console.log('✓ App exists on blockchain')
console.log(`  Creator: ${appInfo.params.creator}`)
```

Verification confirms:
- App is deployed successfully
- App ID is valid
- Creator matches expected account
- App is ready for operations

### 5. Delete Application with ABI Method

Call the delete method with arguments:

```typescript
const deleteResult = await appClient.send.delete({
  method: 'delete_abi',
  args: ['string_io'],
})

console.log(`✓ Delete method returned: "${deleteResult.return}"`)
console.log(`  Transaction ID: ${deleteResult.txIds[0]}`)
```

Delete operation:
- Uses ABI method `delete_abi`
- Passes argument `'string_io'` for cleanup
- Method executes cleanup logic
- Returns confirmation message
- App is deleted after method completes

Return value access:
- `deleteResult.return`: The decoded return value from ABI method
- `deleteResult.txIds[0]`: Transaction ID of the delete operation
- Return value matches method signature (string in this case)

### 6. Verify Deletion

Confirm the app no longer exists:

```typescript
try {
  await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
  console.log('❌ Error: App still exists!')
} catch (error) {
  console.log('✓ App successfully deleted from the blockchain')
}
```

Verification shows:
- App cannot be queried
- App ID is invalid
- Deletion was successful
- App cannot be recovered

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
=== Delete an Application Using an ABI Method ===

Test account address: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

Step 1: Creating a deletable application...
✓ App created with ID: 1066
  App address: CAWE6IMVH2EFRTB4VJBDGZFNCW7AMJZKCCD3XA2LZPO3FMVDJSW4IVESBE
  App is deletable and can be removed from the blockchain

Step 2: Verifying app exists...
✓ App exists on blockchain
  Creator: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

Step 3: Deleting the app with ABI method...
✓ Delete method returned: "string_io"
  Transaction ID: PX6TAMSOAWUNDBTDY54S53ELKIQSE6QFSWPT3V65GHXKAPO64IXQ

Step 4: Verifying app was deleted...
✓ App successfully deleted from the blockchain
  The app no longer exists and cannot be queried

✅ Example completed successfully
```

## Common Patterns

### Delete with Confirmation Message

```typescript
// Method that returns a confirmation message
const deleteResult = await appClient.send.delete({
  method: 'delete_abi',
  args: ['cleanup_complete'],
})

console.log('Delete confirmed:', deleteResult.return)
```

### Delete with Cleanup Data

```typescript
// Method that returns cleanup stats
const deleteResult = await appClient.send.delete({
  method: 'deleteWithStats',
  args: [],
})

// Returns tuple: (uint64,uint64) = (items_cleared, assets_transferred)
const [itemsCleared, assetsTransferred] = deleteResult.return as [bigint, bigint]
console.log(`Cleared ${itemsCleared} items, transferred ${assetsTransferred} assets`)
```

### Conditional Delete

```typescript
// Method that checks conditions before deleting
try {
  const deleteResult = await appClient.send.delete({
    method: 'conditionalDelete',
    args: [password],
  })

  console.log('Delete successful:', deleteResult.return)
} catch (error) {
  console.error('Delete failed - conditions not met:', error.message)
}
```

### Delete with Asset Transfer

```typescript
// Method that transfers assets before deletion
const deleteResult = await appClient.send.delete({
  method: 'deleteAndTransfer',
  args: [recipientAddress],
})

console.log(`Assets transferred to ${recipientAddress}`)
console.log('App deleted successfully')
```

### Delete with Multi-Step Cleanup

```typescript
// Method that performs multiple cleanup operations
const deleteResult = await appClient.send.delete({
  method: 'fullCleanup',
  args: [],
})

// Return value describes cleanup performed
const cleanupSummary = deleteResult.return as string
console.log('Cleanup summary:', cleanupSummary)
```

### Verify App is Deletable Before Attempting

```typescript
// Check if app is deletable before trying to delete
const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()

// Check if delete approval program allows deletion
if (appInfo.params['creator'] !== testAccount.addr) {
  console.error('Only creator can delete this app')
  process.exit(1)
}

// Attempt deletion
const deleteResult = await appClient.send.delete({
  method: 'delete_abi',
  args: ['cleanup'],
})
```

### Handle Delete Errors

```typescript
// Handle various delete failure scenarios
try {
  const deleteResult = await appClient.send.delete({
    method: 'delete_abi',
    args: ['cleanup'],
  })

  console.log('Delete successful:', deleteResult.return)
} catch (error: any) {
  if (error.message.includes('unauthorized')) {
    console.error('Error: Not authorized to delete this app')
  } else if (error.message.includes('immutable')) {
    console.error('Error: App is marked as permanent and cannot be deleted')
  } else {
    console.error('Delete failed:', error.message)
  }
}
```

### Delete with Event Logging

```typescript
// Method that logs deletion event
const deleteResult = await appClient.send.delete({
  method: 'deleteWithLog',
  args: [reason, timestamp],
})

// Log the event
console.log('Deletion event:')
console.log(`  Reason: ${reason}`)
console.log(`  Timestamp: ${timestamp}`)
console.log(`  Confirmation: ${deleteResult.return}`)
console.log(`  Tx ID: ${deleteResult.txIds[0]}`)
```

### Delete Multiple Apps

```typescript
// Delete multiple apps with cleanup
const appIds = [1001, 1002, 1003]

for (const appId of appIds) {
  const appClient = algorand.client.getAppClient({
    id: appId,
    appSpec,
    sender: testAccount.addr,
  })

  try {
    const deleteResult = await appClient.send.delete({
      method: 'delete_abi',
      args: ['batch_cleanup'],
    })

    console.log(`App ${appId} deleted: ${deleteResult.return}`)
  } catch (error) {
    console.error(`Failed to delete app ${appId}:`, error.message)
  }
}
```

## Best Practices

1. **Always Set TMPL_DELETABLE Correctly**
   ```typescript
   // Good: Explicitly set deletable parameter
   const deployTimeParams = {
     TMPL_UPDATABLE: 0,
     TMPL_DELETABLE: 1,  // App can be deleted
     TMPL_VALUE: 1,
   }

   // Avoid: Setting wrong value or omitting parameter
   const deployTimeParams = {
     TMPL_DELETABLE: 0,  // App cannot be deleted!
   }
   ```

2. **Use Meaningful Return Values**
   ```typescript
   // Good: Return descriptive confirmation
   const deleteResult = await appClient.send.delete({
     method: 'delete_abi',
     args: ['cleanup_complete'],
   })
   console.log('Delete result:', deleteResult.return)

   // Avoid: Ignoring return value
   await appClient.send.delete({
     method: 'delete_abi',
     args: ['cleanup_complete'],
   })
   // Missing confirmation message
   ```

3. **Verify Deletion**
   ```typescript
   // Good: Verify app was actually deleted
   try {
     await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
     throw new Error('App still exists!')
   } catch (error: any) {
     if (error.message.includes('application does not exist')) {
       console.log('✓ App successfully deleted')
     } else {
       throw error
     }
   }
   ```

4. **Handle Deletion Errors**
   ```typescript
   // Good: Catch and handle errors appropriately
   try {
     const deleteResult = await appClient.send.delete({
       method: 'delete_abi',
       args: ['cleanup'],
     })
     console.log('Delete successful')
   } catch (error: any) {
     console.error('Delete failed:', error.message)
     // Handle error appropriately
   }
   ```

5. **Document Cleanup Logic**
   ```typescript
   // Good: Document what the delete method does
   /**
    * Deletes the application with cleanup
    * @param cleanupMessage - Message to include in cleanup
    * @returns Confirmation message from cleanup operation
    */
   const deleteResult = await appClient.send.delete({
     method: 'delete_abi',
     args: ['cleanup_complete'],
   })
   ```

6. **Use Type-Safe Arguments**
   ```typescript
   // Good: Type-safe arguments
   const cleanupMessage = 'cleanup_complete'
   const deleteResult = await appClient.send.delete({
     method: 'delete_abi',
     args: [cleanupMessage],
   })

   // Avoid: Magic strings or wrong types
   const deleteResult = await appClient.send.delete({
     method: 'delete_abi',
     args: [123],  // Wrong type - expects string
   })
   ```

7. **Check Creator Before Deletion**
   ```typescript
   // Good: Verify you're authorized to delete
   const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()

   if (appInfo.params.creator !== testAccount.addr) {
     throw new Error('Only creator can delete this app')
   }

   const deleteResult = await appClient.send.delete({
     method: 'delete_abi',
     args: ['cleanup'],
   })
   ```

## ABI Delete Methods

### Method Configuration

Delete methods must be configured in the app spec:

```json
{
  "contract": {
    "methods": [
      {
        "name": "delete_abi",
        "args": [
          {
            "type": "string",
            "name": "cleanup_message"
          }
        ],
        "returns": {
          "type": "string"
        }
      }
    ]
  },
  "hints": {
    "delete_abi": {
      "call_config": {
        "delete_application": "CALL"
      }
    }
  }
}
```

Key configuration:
- **Method Definition**: Defines arguments and return type
- **Call Config**: `delete_application: "CALL"` marks it as a delete method
- **Arguments**: Can be any ABI types
- **Return Type**: Can be any ABI type

### Delete Method Patterns

**Simple Confirmation**:
```typescript
// Method: delete_abi(string)string
const result = await appClient.send.delete({
  method: 'delete_abi',
  args: ['confirmed'],
})
// Returns: string confirmation message
```

**With Cleanup Stats**:
```typescript
// Method: deleteWithStats()(uint64,uint64)
const result = await appClient.send.delete({
  method: 'deleteWithStats',
  args: [],
})
const [cleared, transferred] = result.return as [bigint, bigint]
```

**Conditional Delete**:
```typescript
// Method: conditionalDelete(string,uint64)bool
const result = await appClient.send.delete({
  method: 'conditionalDelete',
  args: ['password', 123456],
})
const success = result.return as boolean
```

## Bare Delete vs ABI Delete

### Bare Delete

```typescript
// Simple delete without arguments or return value
const deleteResult = await appClient.send.bare.delete()
```

Use bare delete when:
- No cleanup logic needed
- No arguments required
- No return value needed
- Simple deletion operation

### ABI Delete

```typescript
// Delete with arguments and return value
const deleteResult = await appClient.send.delete({
  method: 'delete_abi',
  args: ['cleanup_message'],
})
console.log('Returned:', deleteResult.return)
```

Use ABI delete when:
- Need to pass arguments
- Want return values
- Require cleanup logic
- Need type safety
- Want confirmation messages

## Key Takeaways

- Applications must be created with `TMPL_DELETABLE=1` to be deletable
- ABI delete methods allow passing arguments and getting return values
- Access return value via `deleteResult.return`
- Delete methods execute cleanup logic before deletion
- Once deleted, apps cannot be recovered or queried
- Verify deletion by attempting to fetch the app (should fail)
- Use meaningful return values for audit trails
- Always handle deletion errors appropriately
- Deploy-time parameters control app mutability
- Transaction ID available via `deleteResult.txIds[0]`
- Delete methods must have `delete_application: 'CALL'` in call config
- Factory pattern simplifies app creation and management

This example demonstrates controlled application deletion with custom cleanup logic, essential for applications that need proper resource cleanup before being removed from the blockchain.
