# Create an Algorand Standard Asset (ASA)

This example demonstrates how to create an Algorand Standard Asset (ASA), the native token standard on Algorand. ASAs can represent fungible tokens, NFTs, stablecoins, or any other type of digital asset.

## What This Example Shows

This example teaches you how to:
- Initialize an Algorand client for LocalNet
- Get a funded account from environment variables
- Create an ASA with a total supply using `algorand.send.assetCreate`
- Access the asset ID and transaction confirmation
- Verify the asset was created successfully
- Understand basic ASA properties

## Why This Matters

Algorand Standard Assets are fundamental to the Algorand ecosystem:

1. **Native Token Standard**: ASAs are built into the protocol, not smart contracts
2. **Low Cost**: Creating an asset costs only 0.001 ALGO (1000 microALGO)
3. **High Performance**: Same speed and finality as ALGO transactions
4. **Built-in Features**: Freeze, clawback, and manager capabilities included
5. **Universal Standard**: All Algorand wallets and tools support ASAs

Key concepts:
- **Asset ID**: Unique identifier assigned by the blockchain (incremental counter)
- **Total Supply**: Maximum number of asset units that will ever exist
- **Decimals**: Number of decimal places for fractional units (default: 0)
- **Creator**: Account that creates and initially owns all units
- **Immutability**: Once created, total supply cannot be changed
- **Minimum Balance**: Each asset opt-in requires 0.1 ALGO minimum balance

Common use cases:
- **Fungible Tokens**: Currencies, points, rewards
- **NFTs**: Unique digital assets (total supply of 1, decimals of 0)
- **Stablecoins**: USD-pegged or other fiat-backed tokens
- **Security Tokens**: Regulated assets with compliance features
- **Game Assets**: In-game currencies or items

## How It Works

### 1. Initialize AlgorandClient

Set up the client for LocalNet:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
```

Client initialization:
- Connects to LocalNet algod and indexer
- Uses default LocalNet configuration
- Provides access to account, transaction, and asset methods
- Handles network communication automatically

### 2. Get a Funded Account

Load an account from environment variables:

```typescript
const alice = await algorand.account.fromEnvironment('ALICE')
console.log('Creator account:', alice.addr.toString())
```

Account setup:
- Loads account from `ALICE_MNEMONIC` environment variable
- Creates account if it doesn't exist on LocalNet (stored in KMD)
- Automatically funds new accounts with 1000 ALGO on LocalNet
- The account will become the asset creator and initial owner

### 3. Create the Asset

Create an ASA with minimal configuration:

```typescript
const createResult = await algorand.send.assetCreate({
  sender: alice.addr,  // sender must be an address string
  total: 100n,         // Total supply of 100 units
})
```

Asset creation:
- `sender` must be an address string (`alice.addr`), not account object
- `total` is a BigInt representing the maximum supply
- Asset ID is automatically assigned by the blockchain
- Creator receives all units immediately
- Transaction requires ~0.001 ALGO fee

### 4. Access Asset Information

Get the asset ID and transaction details:

```typescript
console.log('Asset ID:', createResult.assetId.toString())
console.log('Transaction ID:', createResult.txIds[0])
console.log('Confirmation Round:', createResult.confirmations?.[0]?.confirmedRound)
```

Result structure:
- `assetId`: BigInt, the unique identifier for this asset
- `txIds`: Array of transaction IDs (one for asset creation)
- `confirmations`: Array of confirmation objects with round numbers
- Asset ID is a sequential counter starting from 1

### 5. Verify Asset Creation

Confirm the asset was created successfully:

```typescript
if (createResult.assetId > 0n) {
  console.log('Verification passed: Asset ID', createResult.assetId.toString(), 'is valid')
}
```

Verification checks:
- Asset ID greater than 0 indicates successful creation
- Asset ID 0 is reserved and never used
- Asset IDs are assigned sequentially by the blockchain
- Once assigned, asset ID is permanent and unique

## Asset Properties

ASAs have various configurable properties. This example uses the minimal set:

### Required Properties

```typescript
{
  sender: string,  // Creator account address
  total: bigint,   // Total supply (immutable after creation)
}
```

### Optional Properties (Defaults Shown)

```typescript
{
  decimals: 0,           // Number of decimal places (0 = no fractions)
  defaultFrozen: false,  // Whether accounts start frozen
  unitName: undefined,   // Short name (e.g., "USDC")
  assetName: undefined,  // Full name (e.g., "USD Coin")
  url: undefined,        // URL with asset information
  metadataHash: undefined, // 32-byte hash of metadata
  manager: undefined,    // Address that can change manager, reserve, freeze, clawback
  reserve: undefined,    // Address of reserve (uncirculated) holdings
  freeze: undefined,     // Address that can freeze asset holdings
  clawback: undefined,   // Address that can revoke asset holdings
}
```

## Asset Roles

ASAs support four optional management roles:

### Manager Address
- Can change the manager, reserve, freeze, and clawback addresses
- Can set addresses to empty to make asset immutable
- Cannot change total supply or decimals

### Reserve Address
- Holds uncirculated asset units
- Purely informational, no special permissions
- Useful for tracking circulating supply

### Freeze Address
- Can freeze/unfreeze asset holdings in specific accounts
- Frozen accounts cannot send or receive the asset
- Useful for compliance or emergency situations

### Clawback Address
- Can revoke (take back) asset units from any account
- Bypasses account opt-in requirements
- Useful for compliance or erroneous transfers

**Note**: This example doesn't set any of these addresses, making the asset fully immutable after creation.

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
LocalNet account 'ALICE' doesn't yet exist; created account MPQ4ZIVP3AIPACW4ZIDX22JC6UFKEFOR6XVT6XLC2K6KCCT6CF5DY7HJYQ with keys stored in KMD and funding with 1000 ALGO
Creating a new Algorand Standard Asset...
Creator account: MPQ4ZIVP3AIPACW4ZIDX22JC6UFKEFOR6XVT6XLC2K6KCCT6CF5DY7HJYQ
Created asset with 100 units and 0 decimals created by MPQ4ZIVP3AIPACW4ZIDX22JC6UFKEFOR6XVT6XLC2K6KCCT6CF5DY7HJYQ with ID 1039 via transaction JTHYGVWMMHIACSFLZKYJ4Q4VMCXDTZBFK5ZPXY7KO2OBX56QGJOQ

✅ Asset created successfully!
Asset ID: 1039
Transaction ID: JTHYGVWMMHIACSFLZKYJ4Q4VMCXDTZBFK5ZPXY7KO2OBX56QGJOQ
Confirmation Round: 39

✓ Verification passed: Asset ID 1039 is valid

Example completed successfully! Asset ID: 1039
```

## Common Patterns

### Create a Named Token

```typescript
const createResult = await algorand.send.assetCreate({
  sender: alice.addr,
  total: 1_000_000n,     // 1 million tokens
  decimals: 2,           // 2 decimal places (like USD cents)
  unitName: 'MYTKN',     // Ticker symbol (max 8 chars)
  assetName: 'My Token', // Full name (max 32 chars)
})
```

### Create an NFT (Non-Fungible Token)

```typescript
const createResult = await algorand.send.assetCreate({
  sender: alice.addr,
  total: 1n,                        // Only 1 unit exists
  decimals: 0,                      // No fractional units
  unitName: 'NFT001',               // Unique identifier
  assetName: 'My First NFT',        // Display name
  url: 'https://example.com/nft/1', // Link to metadata
  metadataHash: new Uint8Array(32), // SHA-256 hash of metadata
})
```

### Create Asset with Metadata

```typescript
import { createHash } from 'crypto'

// Hash your metadata
const metadata = JSON.stringify({ name: 'My Asset', description: '...' })
const metadataHash = createHash('sha256').update(metadata).digest()

const createResult = await algorand.send.assetCreate({
  sender: alice.addr,
  total: 1_000_000n,
  unitName: 'MYTKN',
  assetName: 'My Token',
  url: 'https://example.com/metadata.json',
  metadataHash: metadataHash,
})
```

### Create Asset with Manager Addresses

```typescript
const createResult = await algorand.send.assetCreate({
  sender: alice.addr,
  total: 1_000_000n,
  manager: alice.addr,      // Alice can update these addresses
  reserve: alice.addr,      // Alice holds reserve units
  freeze: alice.addr,       // Alice can freeze accounts
  clawback: alice.addr,     // Alice can clawback assets
})

// Later, Alice can make the asset immutable by clearing addresses
await algorand.send.assetConfig({
  sender: alice.addr,
  assetId: createResult.assetId,
  manager: '',  // Clear manager (now immutable)
})
```

### Create Fractional Token (Divisible Units)

```typescript
const createResult = await algorand.send.assetCreate({
  sender: alice.addr,
  total: 1_000_000_000_000n, // 1 trillion base units
  decimals: 6,                // 6 decimal places
  unitName: 'USDC',           // Like USDC
  assetName: 'USD Coin',
})

// With 6 decimals, this represents 1,000,000 USDC
// (1,000,000,000,000 base units / 10^6 = 1,000,000)
```

### Get Asset Information After Creation

```typescript
const createResult = await algorand.send.assetCreate({
  sender: alice.addr,
  total: 100n,
})

// Look up asset information
const assetInfo = await algorand.client.algod
  .getAssetByID(Number(createResult.assetId))
  .do()

console.log('Asset params:', assetInfo.params)
console.log('Total supply:', assetInfo.params.total)
console.log('Decimals:', assetInfo.params.decimals)
console.log('Creator:', assetInfo.params.creator)
```

## Best Practices

1. **Use BigInt for Total Supply**
   ```typescript
   // Good: Use BigInt literal
   const createResult = await algorand.send.assetCreate({
     sender: alice.addr,
     total: 1_000_000n,
   })

   // Avoid: Using regular number (may lose precision for large values)
   total: 1000000,  // Works but not type-safe
   ```

2. **Choose Appropriate Decimals**
   ```typescript
   // Good: Match common standards
   decimals: 0,  // For NFTs or whole-unit tokens
   decimals: 2,  // For currency-like tokens (like cents)
   decimals: 6,  // For USDC-compatible tokens
   decimals: 18, // For Ethereum-compatible tokens

   // Avoid: Random decimals without reason
   decimals: 5,  // Unusual, may confuse users
   ```

3. **Validate Total Supply**
   ```typescript
   // Good: Calculate total with decimals
   const decimals = 6
   const supply = 1_000_000 // 1 million tokens
   const total = BigInt(supply) * BigInt(10 ** decimals)

   const createResult = await algorand.send.assetCreate({
     sender: alice.addr,
     total: total,
     decimals: decimals,
   })

   // Verify
   console.log(`Created ${supply.toLocaleString()} tokens`)
   ```

4. **Handle Asset IDs as BigInt**
   ```typescript
   // Good: Convert to string for display
   console.log('Asset ID:', createResult.assetId.toString())

   // Good: Convert to number only when necessary and safe
   const assetIdNumber = Number(createResult.assetId)
   const assetInfo = await algorand.client.algod.getAssetByID(assetIdNumber).do()

   // Avoid: Arithmetic with large BigInts and numbers mixed
   ```

5. **Set Names and Unit Names Carefully**
   ```typescript
   // Good: Clear, concise names
   unitName: 'USDC',          // Ticker (max 8 chars)
   assetName: 'USD Coin',     // Full name (max 32 chars)

   // Avoid: Too long or unclear
   unitName: 'MYLONGTOKEN',   // 8+ chars will be truncated
   assetName: 'My Super Long Asset Name Here', // 32+ chars truncated
   ```

6. **Store Asset ID for Future Use**
   ```typescript
   const createResult = await algorand.send.assetCreate({
     sender: alice.addr,
     total: 100n,
   })

   // Good: Store asset ID for later operations
   const assetId = createResult.assetId
   console.log(`Remember this asset ID: ${assetId}`)

   // Use it for transfers, opt-ins, etc.
   await algorand.send.assetTransfer({
     sender: alice.addr,
     receiver: bob.addr,
     assetId: assetId,
     amount: 10n,
   })
   ```

## Understanding Costs

Creating and managing ASAs has associated costs:

- **Asset Creation**: ~0.001 ALGO (1,000 microALGO)
- **Minimum Balance Increase**: 0.1 ALGO per asset created
- **Asset Opt-In**: 0.1 ALGO minimum balance increase per asset per account
- **Asset Transfer**: Standard transaction fee (~0.001 ALGO)
- **Asset Deletion**: Recovers 0.1 ALGO minimum balance

## Key Takeaways

- Use `algorand.send.assetCreate()` to create Algorand Standard Assets
- Sender must be an address string (`alice.addr`), not account object
- Total supply is a BigInt and cannot be changed after creation
- Asset IDs are automatically assigned by the blockchain (sequential counter)
- Creator receives all asset units initially
- Decimals determine fractional unit precision (default: 0)
- Asset creation costs ~0.001 ALGO + 0.1 ALGO minimum balance increase
- Asset IDs are BigInt, use `.toString()` for display
- Access transaction details via `createResult.txIds[0]` and `createResult.confirmations?.[0]`
- NFTs are ASAs with total supply of 1 and decimals of 0
- Manager, reserve, freeze, and clawback addresses are optional
- Omitting management addresses makes the asset immutable
- All Algorand wallets and tools support ASAs natively

This example provides the foundation for creating tokens, NFTs, and other digital assets on Algorand using the native ASA standard.
