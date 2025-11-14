# Create an Asset with Full Configuration

This example demonstrates how to create an Algorand Standard Asset (ASA) with all possible configuration options including metadata, role accounts (manager, reserve, freeze, clawback), decimals, and default frozen state.

## Key Concepts

- **Algorand Standard Assets (ASA)**: Tokens on the Algorand blockchain
- **Asset Metadata**: Name, unit name, URL, and metadata hash for asset information
- **Role Accounts**: Specialized accounts for asset management (manager, reserve, freeze, clawback)
- **Decimals**: Number of decimal places for fractional units
- **Default Frozen**: Whether accounts start frozen and need to be unfrozen before transfers
- **Asset Creation**: Creating assets with full configuration

## What This Example Shows

1. Creating and funding a creator account
2. Generating role accounts for asset management
3. Creating asset metadata including a 32-byte hash
4. Creating an asset with all configuration options
5. Retrieving and displaying asset information
6. Understanding role account capabilities

## Code Walkthrough

### Initialize and Create Creator

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const creator = algorand.account.random()
await algorand.account.ensureFunded(creator, dispenser, (5).algos())
```

Set up AlgorandClient and create a funded creator account for the asset.

### Generate Role Accounts

```typescript
const managerAccount = algorand.account.random()
const reserveAccount = algorand.account.random()
const freezeAccount = algorand.account.random()
const clawbackAccount = algorand.account.random()
```

Create separate accounts for each role. These accounts will have different permissions for managing the asset.

**Role Account Capabilities**:
- **Manager**: Can reconfigure the asset's manager, reserve, freeze, and clawback addresses
- **Reserve**: Purely informational account (no special permissions)
- **Freeze**: Can freeze/unfreeze asset holdings in specific accounts
- **Clawback**: Can revoke assets from any account and send to another

### Create Metadata Hash

```typescript
const metadataHash = new Uint8Array(32).fill(1)
```

Create a 32-byte metadata hash. In production, this would typically be a hash (like SHA-256) of asset metadata stored off-chain (e.g., IPFS, web server).

### Create Asset with Full Configuration

```typescript
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000n,              // Total supply
  decimals: 2,                    // Decimal places
  assetName: 'MyToken',           // Full name (up to 32 bytes)
  unitName: 'MTK',                // Ticker (up to 8 bytes)
  url: 'https://example.com/token', // Asset URL
  metadataHash: metadataHash,     // 32-byte hash
  manager: managerAccount.addr,   // Manager address
  reserve: reserveAccount.addr,   // Reserve address
  freeze: freezeAccount.addr,     // Freeze address
  clawback: clawbackAccount.addr, // Clawback address
  defaultFrozen: true,            // Start frozen
})

const assetId = BigInt(result.confirmation.assetIndex!)
```

**Key point**: All role accounts are optional. Set any to `undefined` or omit to make that role immutable.

### Retrieve Asset Information

```typescript
const assetInfo = await algorand.asset.getById(assetId)

console.log('Asset ID:', assetInfo.assetId)
console.log('Creator:', assetInfo.creator)
console.log('Total Supply:', assetInfo.total)
console.log('Decimals:', assetInfo.decimals)
console.log('Manager:', assetInfo.manager || 'None (immutable)')
```

Retrieve the created asset information to verify all configuration options were set correctly.

## API Patterns (AlgoKit Utils v9.1.2)

### Asset Creation Parameters

```typescript
await algorand.send.assetCreate({
  sender: string,              // REQUIRED: Creator account address
  total: bigint,               // REQUIRED: Total supply in base units
  decimals: number,            // REQUIRED: Decimal places (0-19)

  // Metadata (all optional)
  assetName?: string,          // Asset name (max 32 bytes)
  unitName?: string,           // Unit name/ticker (max 8 bytes)
  url?: string,                // URL (max 96 bytes)
  metadataHash?: Uint8Array,   // 32-byte hash

  // Role accounts (all optional)
  manager?: string,            // Manager address
  reserve?: string,            // Reserve address
  freeze?: string,             // Freeze address
  clawback?: string,           // Clawback address

  // Settings (optional)
  defaultFrozen?: boolean,     // Default frozen state (default: false)
})
```

### Asset Information Structure

```typescript
interface AssetInformation {
  assetId: bigint              // Asset ID
  creator: string              // Creator address
  total: bigint                // Total supply
  decimals: number             // Decimal places

  // Metadata
  assetName?: string           // Asset name
  unitName?: string            // Unit name
  url?: string                 // URL
  metadataHash?: Uint8Array    // Metadata hash

  // Role accounts
  manager?: string             // Manager address (undefined if immutable)
  reserve?: string             // Reserve address
  freeze?: string              // Freeze address
  clawback?: string            // Clawback address

  // Settings
  defaultFrozen: boolean       // Default frozen state
}
```

## Common Use Cases

### Creating a Basic Token

```typescript
// Simple token with no special controls
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000_000n,  // 1 billion tokens
  decimals: 6,            // 6 decimal places
  assetName: 'MyToken',
  unitName: 'MTK',
  url: 'https://mytoken.com',
})
```

### Creating a Security Token with Controls

```typescript
// Security token with freeze and clawback for compliance
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 10_000_000n,
  decimals: 2,
  assetName: 'Security Token',
  unitName: 'SEC',
  url: 'https://securities.example.com',
  manager: complianceOfficer.addr,
  freeze: complianceOfficer.addr,   // Can freeze non-compliant accounts
  clawback: complianceOfficer.addr, // Can recover from bad actors
  defaultFrozen: true,              // Require KYC before transfers
})
```

### Creating an NFT

```typescript
// NFT with total supply of 1 and no decimals
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1n,              // Only 1 unit exists
  decimals: 0,            // No fractional units
  assetName: 'Cool NFT #1',
  unitName: 'NFT1',
  url: 'ipfs://Qm...',    // IPFS URL
  metadataHash: metadataHash, // Hash of metadata
})
```

### Creating an Immutable Asset

```typescript
// Asset that cannot be modified after creation
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000n,
  decimals: 2,
  assetName: 'Immutable Coin',
  unitName: 'IMC',
  // Omit all role accounts - they default to undefined (immutable)
  // Once created, these settings can NEVER be changed
})
```

### Creating Asset with Updateable Manager Only

```typescript
// Asset where only the manager can be changed
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000n,
  decimals: 2,
  assetName: 'Managed Token',
  unitName: 'MGT',
  manager: managerAccount.addr,  // Can update role addresses
  // reserve, freeze, clawback are undefined (immutable)
})

// Later, manager can update role addresses or remove itself
```

## Important Considerations

### Total Supply and Decimals

```typescript
// Example: Creating 1,000,000 tokens with 2 decimals
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000n,  // This is 1,000,000 base units
  decimals: 2,        // 2 decimal places
})

// Actual number of whole tokens: 1,000,000 / (10 ** 2) = 10,000 tokens
// Each token can be divided into 0.01 units
```

**Important**: The `total` is always in the smallest unit. With 2 decimals:
- `total: 1_000_000n` = 10,000 whole tokens
- Smallest transferable amount: 1 base unit = 0.01 tokens

### Decimals Range

```typescript
// Valid decimals range: 0-19
decimals: 0   // No fractional units (like NFTs)
decimals: 6   // Common for utility tokens
decimals: 2   // Good for currencies
decimals: 19  // Maximum precision
```

### Role Account Immutability

```typescript
// Setting role accounts to undefined makes them IMMUTABLE
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000n,
  decimals: 2,
  manager: undefined,   // Cannot be changed EVER
  freeze: undefined,    // Asset can NEVER be frozen
  clawback: undefined,  // Assets can NEVER be clawed back
})

// This is PERMANENT - think carefully before creating immutable assets!
```

### Metadata Length Limits

```typescript
// Metadata field length limits (in bytes, not characters!)
assetName: string    // Max 32 bytes
unitName: string     // Max 8 bytes
url: string          // Max 96 bytes
metadataHash: Uint8Array // Exactly 32 bytes (or undefined)

// Example - this will FAIL:
await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1000n,
  decimals: 0,
  assetName: 'This is a very long asset name that exceeds thirty-two bytes',  // ERROR!
  unitName: 'TOOLONG', // ERROR! (8 bytes = 7 characters + null)
})
```

### Creator Always Holds Initial Supply

```typescript
// When you create an asset, ALL units go to the creator
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000n,
  decimals: 0,
})

// creator.addr now holds ALL 1,000,000 units
// To distribute, you must transfer from creator to other accounts
// Other accounts must opt-in before receiving
```

### Default Frozen State

```typescript
// defaultFrozen: true requires explicit unfreezing
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000n,
  decimals: 0,
  freeze: freezeAccount.addr,
  defaultFrozen: true,  // Accounts start frozen
})

// Now when accounts opt-in, they CANNOT receive transfers
// until freeze account unfreezes them:
await algorand.send.assetFreeze({
  sender: freezeAccount.addr,
  assetId: assetId,
  account: recipientAccount.addr,
  frozen: false,  // Unfreeze the account
})
```

### Reserve Address is Informational Only

```typescript
const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000n,
  decimals: 0,
  reserve: reserveAccount.addr,  // Informational only!
})

// Common misconception: Reserve account does NOT hold un-minted tokens
// The reserve address has NO special permissions
// It's just metadata - use it to indicate where non-circulating supply is held
```

### Metadata Hash Best Practices

```typescript
// In production, hash your metadata properly
import { createHash } from 'crypto'

const metadata = {
  name: 'MyToken',
  description: 'A great token',
  image: 'ipfs://Qm...',
  properties: { ... }
}

// Convert metadata to JSON and hash it
const metadataJson = JSON.stringify(metadata)
const metadataHash = createHash('sha256')
  .update(metadataJson)
  .digest()

const result = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 1_000_000n,
  decimals: 0,
  url: 'ipfs://Qm...',          // IPFS URL to full metadata JSON
  metadataHash: metadataHash,   // SHA-256 hash for verification
})
```

## Expected Output

```
Creator address: VL2HYOQ7GUJ5VLIYWY2EKBKMBCIXS325J4I2NVSIBRWO4POZKZGKLXNBSM

=== Creating Asset with Full Configuration ===

Role accounts:
  Manager:  ZJE44M5ESAVU4UZB6CUSCQ6QSUUGPREH72RDVVXVRPWFOWJAP4YOJT53O4
  Reserve:  QCOMMOCSQFIGIGVQJGWHAUBZMNWVAV6B727QAPQNJHYM5HNANK627LSHOA
  Freeze:   4PVFHZHWDVRA3KL5EXKXLH2ETMLIFRNTAIYFHXPBJNDWIJXIRMBEBJ4CYI
  Clawback: OPDPFPNBIB5GZXK4HSLRNZGSBVBL7RZSQODJDFFQ6FMKPVK2EU3XTOQEKY

Asset parameters:
  Total supply: 1,000,000 units
  Decimals: 2 (allows 0.01 units)
  Name: MyToken
  Unit Name: MTK
  URL: https://example.com/token
  Default Frozen: true (requires unfreezing before transfers)

✅ Asset created successfully!
Asset ID: 1627n
Transaction ID: QHMZEGNY2QMUFGABTPNQ4HPP3XR2F3PILKKB5FIUZQEEIPQRKQEQ

=== Asset Information ===

Basic Details:
  Asset ID: 1627
  Creator: VL2HYOQ7GUJ5VLIYWY2EKBKMBCIXS325J4I2NVSIBRWO4POZKZGKLXNBSM
  Total Supply: 1,000,000
  Decimals: 2
  Unit Name: MTK
  Asset Name: MyToken
  URL: https://example.com/token
  Metadata Hash: 0101010101010101010101010101010101010101010101010101010101010101

Role Accounts:
  Manager: ZJE44M5ESAVU4UZB6CUSCQ6QSUUGPREH72RDVVXVRPWFOWJAP4YOJT53O4
  Reserve: QCOMMOCSQFIGIGVQJGWHAUBZMNWVAV6B727QAPQNJHYM5HNANK627LSHOA
  Freeze: 4PVFHZHWDVRA3KL5EXKXLH2ETMLIFRNTAIYFHXPBJNDWIJXIRMBEBJ4CYI
  Clawback: OPDPFPNBIB5GZXK4HSLRNZGSBVBL7RZSQODJDFFQ6FMKPVK2EU3XTOQEKY

Asset Settings:
  Default Frozen: true

✅ Example completed successfully!

💡 Role Account Capabilities:
  • Manager: Can reconfigure manager, reserve, freeze, and clawback addresses
  • Reserve: Purely informational, no special permissions
  • Freeze: Can freeze/unfreeze asset holdings in specific accounts
  • Clawback: Can revoke assets from any account and send to another
  • Default Frozen: New opt-ins start frozen and must be explicitly unfrozen
```

## Running the Example

### Prerequisites

1. Start AlgoKit LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Execute

```bash
npm start
```

The example will:
1. Create and fund a creator account
2. Generate role accounts for asset management
3. Create a metadata hash
4. Create an asset with all configuration options
5. Retrieve and display the asset information
6. Show role account capabilities

## Asset Management Operations

### Updating Role Addresses (as Manager)

```typescript
// Only the manager account can update role addresses
await algorand.send.assetConfig({
  sender: managerAccount.addr,
  assetId: assetId,
  manager: newManagerAccount.addr,    // Update manager
  reserve: newReserveAccount.addr,    // Update reserve
  freeze: newFreezeAccount.addr,      // Update freeze
  clawback: newClawbackAccount.addr,  // Update clawback
})

// To make a role immutable, set it to undefined
await algorand.send.assetConfig({
  sender: managerAccount.addr,
  assetId: assetId,
  manager: managerAccount.addr,  // Keep manager
  freeze: undefined,             // Make freeze immutable (PERMANENT!)
})
```

### Freezing/Unfreezing Assets (as Freeze Account)

```typescript
// Freeze an account's holdings
await algorand.send.assetFreeze({
  sender: freezeAccount.addr,
  assetId: assetId,
  account: targetAccount.addr,
  frozen: true,  // Freeze
})

// Unfreeze an account's holdings
await algorand.send.assetFreeze({
  sender: freezeAccount.addr,
  assetId: assetId,
  account: targetAccount.addr,
  frozen: false,  // Unfreeze
})
```

### Clawback Assets (as Clawback Account)

```typescript
// Revoke assets from an account
await algorand.send.assetTransfer({
  sender: clawbackAccount.addr,
  assetId: assetId,
  amount: 100n,
  receiver: destinationAccount.addr,
  clawbackTarget: targetAccount.addr,  // Take from this account
})
```

### Destroying an Asset

```typescript
// Only creator can destroy, and must hold ALL units
// First, claw back all distributed units (if clawback is set)
// Then destroy the asset
await algorand.send.assetDestroy({
  sender: creator.addr,
  assetId: assetId,
})
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Assets (ASA)](https://developer.algorand.org/docs/get-details/asa/)
- [Asset Parameters](https://developer.algorand.org/docs/get-details/asa/#asset-parameters)
- [Asset Management](https://developer.algorand.org/docs/get-details/asa/#modifying-an-asset)
- [Asset Best Practices](https://developer.algorand.org/docs/get-started/tokenization/nft/#best-practices)
