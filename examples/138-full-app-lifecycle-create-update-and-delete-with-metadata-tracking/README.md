# Full App Lifecycle: Create, Update, and Delete

This example demonstrates the complete lifecycle of Algorand smart contract applications, including creation, updating, querying, and deletion operations.

## Overview

Managing the full lifecycle of smart contract applications is a fundamental skill for blockchain developers. This example walks through every stage of an application's life on the Algorand blockchain, from deployment to deletion.

The example demonstrates:
1. **Creating multiple applications** with different schemas
2. **Updating an application** with a new approval program
3. **Querying application information** from the blockchain
4. **Deleting an application** permanently
5. **Verifying state changes** throughout the lifecycle

## What You'll Learn

- How to create multiple applications with custom schemas
- How to update an application's approval program
- How to query application information using algod API
- How to delete applications and verify deletion
- Understanding application addresses and IDs
- Best practices for managing application lifecycles

## Application Lifecycle Stages

### 1. Creation

When you create an application on Algorand, you must specify:
- **Approval Program**: The TEAL code that defines application logic
- **Clear State Program**: The TEAL code that runs when accounts clear their local state
- **Global State Schema**: How much global storage the app needs (integers and byte slices)
- **Local State Schema**: How much local storage per account the app needs

```typescript
const appResult = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: '#pragma version 10\nint 1\nreturn',
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 1, // 1 integer in global state
    globalByteSlices: 0,
    localInts: 0,
    localByteSlices: 0,
  },
})

const appId = appResult.appId
const appAddress = algosdk.getApplicationAddress(appId)
```

**Key points:**
- Each application gets a unique application ID
- Applications have their own blockchain address (derived from the app ID)
- The schema (storage allocation) is fixed at creation and cannot be changed
- The creator becomes the application's owner

### 2. Updating

Applications can be updated to change their approval and clear state programs:

```typescript
const updatedApprovalProgram = `#pragma version 10
// Updated version with counter functionality
txn ApplicationID
int 0
==
bnz create

// Default: just approve
int 1
return

create:
// Initialize counter to 0
byte "counter"
int 0
app_global_put
int 1
return`

const updateResult = await algorand.send.appUpdate({
  appId: appId,
  sender: deployer.addr,
  approvalProgram: updatedApprovalProgram,
  clearStateProgram: clearProgram,
})
```

**Important:**
- Only the application creator can update it
- Updates must be signed by the creator
- The schema cannot be changed during an update
- Updates are immediate and affect all future transactions

### 3. Querying

You can query application information at any time:

```typescript
const appInfo = await algorand.client.algod.getApplicationByID(appId).do()

console.log('Creator:', appInfo.params.creator)
console.log('Global Ints:', appInfo.params['global-state-schema']?.['num-uint'])
console.log('Global Bytes:', appInfo.params['global-state-schema']?.['num-byte-slice'])
```

The response includes:
- Creator address
- Current approval and clear state programs
- Global and local state schemas
- Current global state values
- Application parameters

### 4. Deletion

Applications can be permanently deleted from the blockchain:

```typescript
const deleteResult = await algorand.send.appDelete({
  appId: appId,
  sender: deployer.addr,
})
```

**After deletion:**
- The application ID cannot be reused
- All global state is destroyed
- The application address becomes invalid
- Queries for the application will fail

**Verification:**
```typescript
try {
  await algorand.client.algod.getApplicationByID(appId).do()
  console.log('App still exists')
} catch (error) {
  if (error.message.includes('application does not exist')) {
    console.log('App successfully deleted')
  }
}
```

## Example Walkthrough

This example creates three different applications to demonstrate various scenarios:

### Application 1: MyCounterApp
- **Initial Schema**: 1 global integer
- **Action**: Created, then updated with new program
- **Final State**: Active with updated program

```typescript
// Create with basic schema
const app1Result = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: '#pragma version 10\nint 1\nreturn',
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 1, // Room for a counter
    globalByteSlices: 0,
    localInts: 0,
    localByteSlices: 0,
  },
})

// Later: Update with counter logic
const updateResult = await algorand.send.appUpdate({
  appId: app1Id,
  sender: deployer.addr,
  approvalProgram: updatedApprovalProgram, // Now includes counter logic
  clearStateProgram: clearProgram,
})
```

### Application 2: MyVotingApp
- **Initial Schema**: 2 global integers
- **Action**: Created only, no modifications
- **Final State**: Active in original state

```typescript
const app2Result = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: '#pragma version 10\nint 1\nreturn',
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 2, // Room for vote counts
    globalByteSlices: 0,
    localInts: 0,
    localByteSlices: 0,
  },
})
```

### Application 3: MyTokenApp
- **Initial Schema**: 1 global byte slice
- **Action**: Created, then deleted
- **Final State**: Deleted (removed from chain)

```typescript
// Create
const app3Result = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: '#pragma version 10\nint 1\nreturn',
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 0,
    globalByteSlices: 1, // Room for token name
    localInts: 0,
    localByteSlices: 0,
  },
})

// Later: Delete
const deleteResult = await algorand.send.appDelete({
  appId: app3Id,
  sender: deployer.addr,
})
```

## Application Addresses

Every application has a unique blockchain address derived from its ID:

```typescript
const appId = 1010
const appAddress = algosdk.getApplicationAddress(appId)
// Returns: VSFZF5BRBVJY7P5QQN73JQ27DX3RP6PWSHW4I3SFFFZYFNTGCM3ZC2DHLE
```

**Use cases for application addresses:**
- Sending ALGOs to the application
- Sending assets to the application
- Checking application balances
- Using the app as a receiver in transactions

## Schema Design Considerations

When designing your application's schema, consider:

**Global State:**
- Stores data visible to all users
- Limited to 64 key-value pairs maximum
- Each key can store either a uint64 or byte slice (up to 128 bytes)
- Costs are paid once at creation

**Local State:**
- Stores data per opted-in account
- Also limited to 16 key-value pairs per account
- Each account pays minimum balance for their local state
- Useful for user-specific data like balances or permissions

**Schema cannot be changed after creation**, so plan carefully:

```typescript
schema: {
  globalInts: 10,        // Reserve enough integers
  globalByteSlices: 5,   // Reserve enough byte slices
  localInts: 4,          // Per-account integers
  localByteSlices: 2,    // Per-account byte slices
}
```

## Update Strategy

### When to Update
- Bug fixes in logic
- Feature additions
- Performance improvements
- Security patches

### What Can Be Updated
- ✅ Approval program logic
- ✅ Clear state program logic
- ❌ State schema (cannot change)
- ❌ Application ID (permanent)

### Update Best Practices

1. **Test thoroughly** before updating on MainNet
2. **Version your programs** to track changes
3. **Consider immutability** - some apps should not be updatable
4. **Plan upgrade paths** in your initial design
5. **Communicate changes** to your users

### Making Apps Immutable

To make an app immutable after creation, update it with programs that reject updates:

```teal
#pragma version 10
// This program rejects all transactions
int 0
return
```

Once updated with this program, no further updates are possible.

## Deletion Considerations

### When to Delete
- Testing applications that are no longer needed
- Migrating to a new application version
- Recovering minimum balance from unused apps
- Discontinuing a service

### What Happens on Deletion
- Application removed from blockchain
- Global state destroyed
- Minimum balance returned to creator
- Application ID becomes invalid
- Application address becomes inaccessible

### Deletion Requirements
- Must be signed by creator
- Application must not have any accounts opted in with local state
- All local state must be cleared before deletion

## Running the Example

### Prerequisites
```bash
# Start LocalNet
algokit localnet start

# Install dependencies
npm install
```

### Execute
```bash
npm start
```

### Expected Output

```
=== Full App Lifecycle: Create, Update, Delete with Metadata Tracking ===

Using deployer account: F2T4H...

=== STEP 1: Creating Three Apps with Metadata ===

Creating MyCounterApp...
✅ MyCounterApp created with ID: 1010
   App Address: VSFZF5BRBVJY7P5QQN73JQ27DX3RP6PWSHW4I3SFFFZYFNTGCM3ZC2DHLE

Creating MyVotingApp...
✅ MyVotingApp created with ID: 1011
   App Address: YCVGIALPB5UCXY3QS4ICXLGXXAAFCA35QAEUB2MSBH7J6UJQU5D3LEY36Q

Creating MyTokenApp...
✅ MyTokenApp created with ID: 1012
   App Address: 3X4ABWUJOBYVXI6HC245NYWR5VYXDMFIAQDKQLNV5G3GQ7FRWZAUVAQ3YM

=== STEP 2: Updating App 1 with New Program ===

Updating MyCounterApp (ID: 1010)...
   New feature: Counter functionality added
✅ MyCounterApp updated successfully
   Confirmed in round: 13

=== STEP 3: Querying App Information ===

MyCounterApp (ID: 1010):
   Creator: F2T4H...
   Global State Schema:
     - Integers: 1
     - Byte Slices: 0

MyVotingApp (ID: 1011):
   Creator: F2T4H...
   Global State Schema:
     - Integers: 2
     - Byte Slices: 0

MyTokenApp (ID: 1012):
   Creator: F2T4H...
   Global State Schema:
     - Integers: 0
     - Byte Slices: 1

=== STEP 4: Deleting App 3 ===

Deleting MyTokenApp (ID: 1012)...
✅ MyTokenApp deleted successfully
   Confirmed in round: 14

Verifying deletion...
✅ App successfully deleted and removed from chain

=== Lifecycle Summary ===

1. MyCounterApp (ID: 1010):
   ✅ Created
   ✅ Updated with new program
   ✅ Still active on chain

2. MyVotingApp (ID: 1011):
   ✅ Created
   ✅ No modifications
   ✅ Still active on chain

3. MyTokenApp (ID: 1012):
   ✅ Created
   ✅ Deleted
   ✅ Removed from chain

✨ Example completed successfully!
```

## Key Takeaways

1. **Application Lifecycle**: Create → Update (optional) → Delete
2. **Schema is Permanent**: Plan your storage needs carefully at creation
3. **Creator Control**: Only the creator can update or delete an application
4. **Application Addresses**: Each app has a unique address for receiving assets
5. **Updates are Immediate**: Changes to approval programs affect all future transactions
6. **Deletion is Permanent**: Deleted applications cannot be recovered
7. **Query Anytime**: Application information is always accessible via algod API

## Common Use Cases

### Development & Testing
- Create test applications on LocalNet
- Update programs during development
- Delete when moving to new versions

### Production Deployment
- Deploy with well-tested programs
- Use immutable contracts for critical applications
- Version control for upgradeable contracts

### Maintenance
- Update to fix bugs
- Add new features
- Deprecate old applications

### Migration
- Deploy new version
- Migrate data/users
- Delete old version

## Best Practices

1. **Test Extensively**: Always test on LocalNet/TestNet before MainNet
2. **Document Changes**: Keep records of all updates and reasons
3. **Plan for Immutability**: Decide if your app should be updatable
4. **Reserve Adequate Storage**: Schema cannot be changed later
5. **Monitor Application State**: Regularly query to verify correct operation
6. **Clean Up**: Delete unused test applications to recover minimum balance
7. **Version Control**: Track program versions for audibility

## Additional Resources

- [Algorand Application Specification](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/)
- [TEAL Reference](https://developer.algorand.org/docs/get-details/dapps/avm/teal/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)

## Related Examples

- Example 135: Using foreign references in application calls
- Example 136: Working with nested ABI tuples
- Example 137: ARC-56 error handling in smart contracts

---

This example provides the foundation for managing Algorand smart contract applications throughout their entire lifecycle, from creation through updates to eventual deletion.
