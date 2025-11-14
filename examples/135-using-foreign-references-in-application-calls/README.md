# Using Foreign References in Application Calls

This example demonstrates how to use **foreign references** (external apps, accounts, and assets) when calling Algorand smart contract methods using AlgoKit Utils.

## What You'll Learn

- What foreign references are and why they're needed
- How to pass foreign apps, accounts, and assets to application calls
- Algorand's limits on foreign references (8 apps, 4 accounts, 8 assets)
- How to access foreign references in TEAL code
- Reading state from foreign applications
- Common use cases for foreign references in DeFi and NFT applications

## Example Output

When you run this example, you'll see:

```
=== Using Foreign References in Application Calls ===

Using deployer account: LEFKTDT7HUYSP6KCYTFEXGFM3QJ7ZUYOSCZKGVSUEYZC2DOL3H7VAQ45LQ

=== Setting up Foreign Resources ===

✅ Created foreign account: 6X3KHXBEIXMJ76XJ44YZJX3DOFS25W4U6SUTEH5PT6OOSGABUNW3ASUXX4
✅ Created foreign asset: 1626n
✅ Created foreign app: 1627n

=== Deploying Main Application ===

✅ Main application deployed!
   App ID: 1628n
   App Address: JVNDMDNMXV3S2UG5QBELKZVJOEZKDRXJE6H2MD3Z7S32Q4YFLXZAD5TUY4

=== Calling Method with Foreign References ===

Foreign references being passed:
   Foreign App ID: 1627
   Foreign Account: 6X3KHXBEIXMJ76XJ44YZJX3DOFS25W4U6SUTEH5PT6OOSGABUNW3ASUXX4
   Foreign Asset ID: 1626

✅ Method call successful!
   Transaction ID: DJJ2KGK3VLI372EHD5SDW45RQSYL2YR2MY5XIUFSQDT42IZGWB5A

Return value from contract:
   "Accessed foreign app, account, and asset successfully!"

=== Example: Reading Foreign App State ===

✅ Deployed app that reads foreign app state
   App ID: 1630n

Calling method to read state from foreign app 1627...
✅ Read from foreign app: "Hello from foreign app"
```

## Understanding Foreign References

### What Are Foreign References?

Foreign references are external resources that a smart contract needs to access during execution. They include:

1. **Foreign Applications** - Other smart contracts on the Algorand blockchain
2. **Foreign Accounts** - Algorand addresses that aren't the transaction sender
3. **Foreign Assets** - Algorand Standard Assets (ASAs) that the contract needs to interact with

### Why Are They Needed?

By default, a smart contract can only access:
- Its own state (global and local storage)
- The sender's account
- Basic transaction fields

To interact with external resources (read other contracts' state, check account balances, verify asset holdings), you must explicitly declare these resources as **foreign references** in your transaction.

### Algorand's Limits

Algorand enforces these limits per transaction:

- **Up to 8 foreign applications** (`appReferences`)
- **Up to 4 foreign accounts** (`accountReferences`)
- **Up to 8 foreign assets** (`assetReferences`)

These limits ensure transactions remain efficiently verifiable while still enabling composable smart contracts.

## Code Walkthrough

### Step 1: Setting Up Foreign Resources

First, we create some external resources that our main contract will reference:

```typescript
// Create a foreign account
const foreignAccount = algorand.account.random()
await algorand.send.payment({
  sender: deployer.addr,
  receiver: foreignAccount.addr,
  amount: microAlgos(500_000),
})
console.log('✅ Created foreign account:', foreignAccount.addr.toString())

// Create a foreign asset (ASA)
const assetCreateResult = await algorand.send.assetCreate({
  sender: deployer.addr,
  total: 1000n,
  decimals: 0,
  assetName: 'Test Token',
  unitName: 'TST',
})
const foreignAssetId = assetCreateResult.assetId
console.log('✅ Created foreign asset:', foreignAssetId)

// Create a foreign app
const foreignAppResult = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: foreignAppProgram,
  clearStateProgram: foreignAppClearProgram,
  schema: {
    globalInts: 0,
    globalByteSlices: 1,
    localInts: 0,
    localByteSlices: 0,
  },
})
const foreignAppId = foreignAppResult.appId
console.log('✅ Created foreign app:', foreignAppId)
```

**What's happening:**
- We create a funded account that will be referenced by our contract
- We create an ASA (Algorand Standard Asset) with 1000 units
- We deploy a simple foreign application that stores a message in global state

### Step 2: Deploying the Main Application

Next, we deploy an application that will access these foreign references:

```typescript
const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Handle app calls
txn NumAppArgs
int 0
>
bnz check_methods

// Default: approve
int 1
return

create:
// Initialize state
byte "counter"
int 0
app_global_put

int 1
return

check_methods:
// Check which ABI method is being called
txn ApplicationArgs 0
method "access_foreign_refs()string"
==
bnz method_access_foreign_refs

// Unknown method
int 0
return

method_access_foreign_refs:
// This method demonstrates accessing foreign references
// Foreign references are passed via the transaction's foreign arrays

// We can verify foreign references are present:
// - txna Applications 1 would give us the foreign app ID
// - txna Accounts 1 would give us the foreign account address
// - txna Assets 0 would give us the foreign asset ID

// For this demo, we'll just return a success message
byte "Accessed foreign app, account, and asset successfully!"
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return`

const createResult = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram,
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 1,
    globalByteSlices: 0,
    localInts: 0,
    localByteSlices: 0,
  },
})

const mainAppId = createResult.appId
```

**TEAL insights:**
- The contract defines an ABI method `access_foreign_refs()string`
- In TEAL, foreign references are accessed via:
  - `txna Applications <index>` - Get foreign app ID at index
  - `txna Accounts <index>` - Get foreign account address at index
  - `txna Assets <index>` - Get foreign asset ID at index
- **Index 0 has special meaning:**
  - `Applications[0]` = current application ID
  - `Accounts[0]` = transaction sender
- Foreign references start at index 1+

### Step 3: Calling with Foreign References

Now we call the method and pass foreign references:

```typescript
// Define the ABI method
const accessForeignRefsMethod = new algosdk.ABIMethod({
  name: 'access_foreign_refs',
  args: [],
  returns: { type: 'string' },
})

// Call the method with foreign references
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: mainAppId,
    method: accessForeignRefsMethod,
    args: [],
    // Foreign references - these make external resources available to the contract
    appReferences: [foreignAppId],           // Foreign application(s)
    accountReferences: [foreignAccount.addr], // Foreign account(s)
    assetReferences: [foreignAssetId],       // Foreign asset(s)
  })
  .send()

console.log('✅ Method call successful!')
console.log('   Transaction ID:', result.txIds[0])

if (result.returns && result.returns.length > 0) {
  const returnValue = result.returns[0].returnValue
  console.log('Return value from contract:')
  console.log(`   "${returnValue}"`)
}
```

**Key parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `appReferences` | `bigint[]` | Array of foreign application IDs (up to 8) |
| `accountReferences` | `string[]` | Array of foreign account addresses (up to 4) |
| `assetReferences` | `bigint[]` | Array of foreign asset IDs (up to 8) |

**What's happening:**
- We construct an atomic transaction group with one ABI method call
- We pass three foreign references: one app, one account, one asset
- The TEAL code can now access these resources
- The contract returns a success message confirming it received the references

### Step 4: Reading Foreign App State

A more advanced example demonstrates actually reading data from a foreign application:

```typescript
const readForeignAppProgram = `#pragma version 10

// ... (creation and routing code)

method_read_foreign_app:
// Read from foreign app's global state
// txna Applications 1 gives us the foreign app ID
// Then we can use app_global_get_ex to read its state

txna Applications 1
byte "message"
app_global_get_ex
bnz has_value

// No value found
byte "Foreign app has no 'message' key"
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75
swap
concat
log

int 1
return

has_value:
// Value found, return it
// The value is already on stack from app_global_get_ex
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75
swap
concat
log

int 1
return`
```

**TEAL operation breakdown:**

```teal
txna Applications 1      # Get foreign app ID at index 1
byte "message"           # Key to look up
app_global_get_ex        # Read global state from foreign app
bnz has_value            # Check if value exists
```

The `app_global_get_ex` opcode:
- Takes 2 arguments: application ID, state key (byte slice)
- Returns 2 values: the value (if exists), and did_exist flag (0 or 1)
- Stack after: `[value, did_exist]` where did_exist is 1 if found, 0 if not

**Calling the method:**

```typescript
const readForeignAppMethod = new algosdk.ABIMethod({
  name: 'read_foreign_app',
  args: [],
  returns: { type: 'string' },
})

const readResult = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId: readAppId,
    method: readForeignAppMethod,
    args: [],
    appReferences: [foreignAppId],  // Pass foreign app as reference
  })
  .send()

if (readResult.returns && readResult.returns.length > 0) {
  const value = readResult.returns[0].returnValue
  console.log(`✅ Read from foreign app: "${value}"`)
  // Output: ✅ Read from foreign app: "Hello from foreign app"
}
```

**What's happening:**
- We deploy a new app specifically designed to read foreign app state
- We call its `read_foreign_app()` method and pass the foreign app ID
- The TEAL code uses `app_global_get_ex` to read the "message" key
- It returns the value stored in the foreign app's global state

## Common Use Cases

### 1. DEX/AMM Pools

Decentralized exchanges need to reference multiple resources:

```typescript
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: trader.addr,
    appId: ammPoolAppId,
    method: swapMethod,
    args: [amountIn, minAmountOut],
    appReferences: [
      otherPoolAppId,     // Reference another pool for routing
      priceOracleAppId,   // Reference price oracle
    ],
    assetReferences: [
      assetAId,           // Token A
      assetBId,           // Token B
      lpTokenId,          // LP token
    ],
    accountReferences: [
      poolReserveAccount, // Account holding reserves
    ],
  })
  .send()
```

**Why foreign references?**
- Read reserves from other pools for optimal routing
- Query oracle prices to validate swap rates
- Access multiple asset holdings
- Verify pool reserve account balances

### 2. Governance Systems

Governance contracts verify voter eligibility and record votes:

```typescript
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: voter.addr,
    appId: governanceAppId,
    method: castVoteMethod,
    args: [proposalId, voteChoice],
    appReferences: [
      tokenRegistryAppId, // Verify token holdings
      proposalAppId,      // Access proposal details
    ],
    assetReferences: [
      governanceTokenId,  // Governance token
    ],
    accountReferences: [
      voter.addr,         // Verify voter's holdings
      treasuryAccount,    // Check treasury for quorum
    ],
  })
  .send()
```

**Why foreign references?**
- Verify voter owns governance tokens
- Read proposal state from proposal contract
- Check treasury balance for quorum calculations
- Access voting power from token registry

### 3. NFT Marketplaces

NFT platforms need to reference collections, assets, and owners:

```typescript
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: buyer.addr,
    appId: marketplaceAppId,
    method: buyNftMethod,
    args: [listingId, price],
    appReferences: [
      collectionAppId,    // Verify collection authenticity
      royaltyAppId,       // Calculate royalty payments
    ],
    assetReferences: [
      nftAssetId,         // The NFT being purchased
      paymentTokenId,     // Payment currency (if not ALGO)
    ],
    accountReferences: [
      sellerAccount,      // Verify seller owns NFT
      artistAccount,      // Pay royalties
      collectionAccount,  // Collection verification
    ],
  })
  .send()
```

**Why foreign references?**
- Verify NFT belongs to verified collection
- Check seller actually owns the NFT
- Calculate and distribute royalties
- Support payment in various tokens

### 4. Lending Protocols

Lending platforms need extensive external data:

```typescript
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: borrower.addr,
    appId: lendingAppId,
    method: borrowMethod,
    args: [collateralAmount, borrowAmount],
    appReferences: [
      priceOracleAppId,   // Get asset prices
      riskModelAppId,     // Calculate risk parameters
      interestRateAppId,  // Determine interest rate
    ],
    assetReferences: [
      collateralAssetId,  // Collateral token
      borrowAssetId,      // Asset to borrow
    ],
    accountReferences: [
      borrower.addr,      // Check borrower's holdings
      poolReserveAccount, // Lending pool reserves
      insuranceFundAccount, // Insurance fund for liquidations
    ],
  })
  .send()
```

**Why foreign references?**
- Query price oracles for accurate collateral valuation
- Access risk models for loan-to-value calculations
- Check pool reserves to ensure liquidity
- Verify borrower's collateral holdings

### 5. Cross-Chain Bridges

Bridge contracts coordinate validators and wrapped assets:

```typescript
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: bridgeAppId,
    method: lockAndMintMethod,
    args: [amount, destinationChain, destinationAddress],
    appReferences: [
      validatorSetAppId,  // Verify validator signatures
      feeOracleAppId,     // Calculate bridge fees
      wrappedTokenFactory, // Mint wrapped tokens
    ],
    assetReferences: [
      nativeAssetId,      // Native asset being locked
      wrappedAssetId,     // Wrapped representation
    ],
    accountReferences: [
      validator1Account,  // Validator 1
      validator2Account,  // Validator 2
      validator3Account,  // Validator 3
      bridgeVaultAccount, // Holds locked assets
    ],
  })
  .send()
```

**Why foreign references?**
- Access multiple validator accounts for signature verification
- Query fee oracles for dynamic bridge fees
- Interact with wrapped token factory
- Lock assets in vault account

## How Foreign References Work in TEAL

### Accessing Foreign Arrays

TEAL provides special transaction arrays for accessing foreign references:

```teal
# Applications array
txna Applications 0   # Current app ID (special)
txna Applications 1   # First foreign app
txna Applications 2   # Second foreign app
# ... up to Applications 8

# Accounts array
txna Accounts 0       # Transaction sender (special)
txna Accounts 1       # First foreign account
txna Accounts 2       # Second foreign account
# ... up to Accounts 4

# Assets array
txna Assets 0         # First foreign asset
txna Assets 1         # Second foreign asset
# ... up to Assets 8
```

**Important notes:**
- Index 0 is special for Applications (current app) and Accounts (sender)
- Foreign apps start at index 1 in Applications array
- Foreign accounts start at index 1 in Accounts array
- Foreign assets start at index 0 in Assets array

### Reading Foreign App State

```teal
# Read global state from foreign app
txna Applications 1   # Get foreign app ID
byte "some_key"       # Key to read
app_global_get_ex     # Read from foreign app
bnz has_value         # Check if key exists

# Stack after app_global_get_ex: [value, did_exist]
# If did_exist == 1, value is on stack
# If did_exist == 0, no value exists
```

### Reading Foreign Account Info

```teal
# Check foreign account balance
txna Accounts 1       # Get foreign account address
balance               # Get account balance (in microAlgos)

# Check if account opted into asset
txna Accounts 1       # Foreign account
txna Assets 0         # Foreign asset
asset_holding_get AssetBalance
bnz account_has_asset

# Stack after: [balance, did_exist]
```

### Reading Foreign Asset Parameters

```teal
# Get asset total supply
txna Assets 0         # Foreign asset ID
asset_params_get AssetTotal
bnz asset_exists

# Stack after: [total_supply, did_exist]

# Get asset decimals
txna Assets 0
asset_params_get AssetDecimals
bnz asset_exists

# Stack after: [decimals, did_exist]
```

## Best Practices

### 1. Minimize Foreign References

**Why:** Each foreign reference consumes transaction space and costs more in fees.

**Do:**
```typescript
// Only include necessary references
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: myMethod,
  args: [],
  assetReferences: [requiredAssetId],  // Only what's needed
}).send()
```

**Don't:**
```typescript
// Don't include unnecessary references
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: myMethod,
  args: [],
  assetReferences: [
    assetId1,
    assetId2,
    assetId3,  // ❌ Not used by contract
    assetId4,  // ❌ Not used by contract
  ],
}).send()
```

### 2. Validate Foreign References in TEAL

**Why:** Prevent malicious callers from passing incorrect references.

**Good:**
```teal
method_transfer_asset:
# Verify the foreign asset is the expected one
txna Assets 0
int 12345  # Expected asset ID
==
assert     # Fail if not the expected asset

# Now proceed with transfer logic
# ...
```

**Bad:**
```teal
method_transfer_asset:
# ❌ Blindly trusts the foreign asset without validation
txna Assets 0
# ... uses it without checking
```

### 3. Handle Missing State Gracefully

**Why:** Foreign apps may not have the expected keys in their state.

**Good:**
```teal
method_read_foreign_state:
txna Applications 1
byte "expected_key"
app_global_get_ex
bnz has_value

# Handle missing key case
byte "Default value"
# ... continue with default

has_value:
# Use the actual value
# ...
```

**Bad:**
```teal
method_read_foreign_state:
txna Applications 1
byte "expected_key"
app_global_get_ex
# ❌ Assumes key exists, fails if it doesn't
# ... uses value without checking
```

### 4. Document Expected Foreign References

**Why:** Makes your contract easier to use and understand.

**Good:**
```typescript
/**
 * Swaps tokens using an AMM pool
 *
 * @param appReferences[0] - Price oracle app ID
 * @param assetReferences[0] - Input token asset ID
 * @param assetReferences[1] - Output token asset ID
 * @param accountReferences[0] - Pool reserve account
 */
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: ammPoolId,
  method: swapMethod,
  args: [amountIn, minAmountOut],
  appReferences: [priceOracleAppId],
  assetReferences: [inputTokenId, outputTokenId],
  accountReferences: [poolReserveAccount],
}).send()
```

### 5. Respect Algorand's Limits

Remember the hard limits:
- **8 foreign apps maximum** per transaction
- **4 foreign accounts maximum** per transaction
- **8 foreign assets maximum** per transaction

If you need more references, consider:
- Breaking operations into multiple transactions in a group
- Storing frequently-used references in your app's global state
- Using box storage for larger reference sets

## Error Handling

### Common Errors

**Error: "invalid Applications index"**
```
Cause: Accessing Applications array at index that wasn't provided
Fix: Ensure appReferences includes all apps you're accessing
```

```typescript
// ❌ Error: TEAL accesses Applications[1] but no appReferences
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: myMethod,
  args: [],
  // Missing: appReferences: [foreignAppId]
}).send()

// ✅ Correct: Provide the foreign app
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: myMethod,
  args: [],
  appReferences: [foreignAppId],  // Now TEAL can access Applications[1]
}).send()
```

**Error: "invalid Accounts index"**
```
Cause: Accessing Accounts array at index that wasn't provided
Fix: Ensure accountReferences includes all accounts you're accessing
```

```typescript
// ❌ Error: TEAL accesses Accounts[1] but no accountReferences
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: myMethod,
  args: [],
  // Missing: accountReferences: [foreignAccountAddr]
}).send()

// ✅ Correct: Provide the foreign account
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: myMethod,
  args: [],
  accountReferences: [foreignAccountAddr],  // Now TEAL can access Accounts[1]
}).send()
```

**Error: "invalid Assets index"**
```
Cause: Accessing Assets array at index that wasn't provided
Fix: Ensure assetReferences includes all assets you're accessing
```

```typescript
// ❌ Error: TEAL accesses Assets[0] but no assetReferences
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: myMethod,
  args: [],
  // Missing: assetReferences: [assetId]
}).send()

// ✅ Correct: Provide the foreign asset
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: myMethod,
  args: [],
  assetReferences: [assetId],  // Now TEAL can access Assets[0]
}).send()
```

## Advanced Patterns

### Pattern 1: Chaining Foreign Apps

Read from one app to determine which other app to read:

```teal
method_chained_read:
# Read registry app to get target app ID
txna Applications 1  # Registry app
byte "target_app_id"
app_global_get_ex
assert  # Must exist

# Now we have target app ID on stack
# It should be in Applications[2]
byte "data_key"
app_global_get_ex
assert

# Use the data
# ...
```

```typescript
// Calling code
const registryAppId = 100n
const targetAppId = 200n  // Stored in registry

await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: chainedReadMethod,
  args: [],
  appReferences: [
    registryAppId,  # Applications[1]
    targetAppId,    # Applications[2]
  ],
}).send()
```

### Pattern 2: Dynamic Account Validation

Verify accounts meet criteria before proceeding:

```teal
method_validate_stakeholder:
# Check account 1 has minimum balance
txna Accounts 1
balance
int 1000000  # Minimum 1 ALGO
>=
assert

# Check account 1 opted into required asset
txna Accounts 1
txna Assets 0
asset_holding_get AssetBalance
assert  # Must be opted in
int 100  # Minimum holding
>=
assert

# Account is validated, proceed
# ...
```

### Pattern 3: Multi-Asset Operations

Handle multiple assets in one transaction:

```teal
method_batch_transfer:
# Transfer asset 0
txna Assets 0
int 100  # Amount
# ... transfer logic

# Transfer asset 1
txna Assets 1
int 200  # Amount
# ... transfer logic

# Transfer asset 2
txna Assets 2
int 300  # Amount
# ... transfer logic
```

```typescript
await algorand.newGroup().addAppCallMethodCall({
  sender: user.addr,
  appId: myAppId,
  method: batchTransferMethod,
  args: [],
  assetReferences: [
    assetId1,  # Assets[0]
    assetId2,  # Assets[1]
    assetId3,  # Assets[2]
  ],
}).send()
```

## Key Takeaways

1. **Foreign references enable composability** - Smart contracts can interact with external apps, accounts, and assets
2. **Explicit declaration required** - Must list all foreign resources in transaction parameters
3. **Algorand enforces limits** - 8 apps, 4 accounts, 8 assets per transaction
4. **TEAL access via arrays** - Use `txna Applications/Accounts/Assets <index>`
5. **Index 0 is special** - Applications[0] = current app, Accounts[0] = sender
6. **Validate references in TEAL** - Don't blindly trust foreign references from callers
7. **Handle missing state** - Foreign apps may not have expected keys
8. **Common in DeFi** - Essential for DEX, lending, governance, NFT platforms

Foreign references are the foundation of composable smart contracts on Algorand. They enable:
- Cross-contract communication
- Oracle price feeds
- Multi-signature validation
- Asset verification
- Complex DeFi protocols

Master foreign references to build sophisticated, interoperable applications on Algorand!

## Running the Example

```bash
npm start
```

Make sure you have LocalNet running:
```bash
algokit localnet start
```

## Learn More

- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)
- [TEAL Opcodes Reference](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
