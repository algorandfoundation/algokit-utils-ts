# ASA Clawback and Asset Revocation

This example demonstrates how to use the **clawback feature** to revoke assets from one account and transfer them to another. Clawback is essential for regulated assets, compliance requirements, and error recovery scenarios.

## Overview

**Clawback** is a powerful ASA (Algorand Standard Asset) feature that allows a designated address to revoke assets from any account that holds the asset and transfer them to a different account. This is different from a regular transfer, which only the asset holder can initiate.

### When to Use Clawback

- **Regulated Assets**: Securities tokens requiring compliance with regulations
- **Compliance Requirements**: AML/KYC enforcement, sanctions compliance
- **Asset Recovery**: Recovering assets sent to wrong addresses
- **Error Correction**: Fixing erroneous or unauthorized transfers
- **Legal Requirements**: Court orders, freezing assets, etc.

### How Clawback Works

1. **Asset Creation**: Clawback must be enabled when creating the asset by specifying a `clawback` address
2. **Only Clawback Address**: Only the designated clawback address can execute clawback operations
3. **Forced Transfer**: Assets are transferred from the target account without their approval
4. **Opt-In Required**: The receiving account must still be opted into the asset

## Code Walkthrough

### Step 1: Initialize and Fund Accounts

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

// Create three accounts
const creatorAccount = algorand.account.random()
const clawbackFromAccount = algorand.account.random()
const receiverAccount = algorand.account.random()

// Fund all accounts
await algorand.account.ensureFunded(creatorAccount, dispenser, (10).algos())
await algorand.account.ensureFunded(clawbackFromAccount, dispenser, (1).algos())
await algorand.account.ensureFunded(receiverAccount, dispenser, (1).algos())
```

**Key Points**:
- Creator account will be both the asset creator and the clawback address
- All accounts need ALGO for transaction fees
- Use `.algos()` extension for AlgoAmount

### Step 2: Create Asset with Clawback Capability

```typescript
const assetCreate = await algorand.send.assetCreate({
  sender: creatorAccount.addr,
  total: 100n,
  decimals: 0,
  assetName: 'Regulated Asset',
  unitName: 'REG',
  clawback: creatorAccount.addr, // Enable clawback
})

const assetId = BigInt(assetCreate.confirmation.assetIndex!)
console.log(`Asset created with ID: ${assetId}`)
console.log(`Clawback address: ${creatorAccount.addr}`)
```

**Important**:
- The `clawback` parameter designates the clawback address
- This address can be different from the creator
- Clawback address cannot be changed after creation (unless the asset has a manager address that can update it)
- Convert `assetIndex` to `BigInt` for type safety

### Step 3: Opt-In to Asset

```typescript
// Both accounts must opt-in to receive the asset
await algorand.send.assetOptIn({
  sender: clawbackFromAccount.addr,
  assetId
})

await algorand.send.assetOptIn({
  sender: receiverAccount.addr,
  assetId
})
```

**Why Opt-In**:
- Algorand requires explicit consent to receive any asset
- Prevents spam assets from cluttering accounts
- Applies to both regular transfers and clawback operations

### Step 4: Initial Asset Distribution

```typescript
// Transfer 5 units to the clawbackFrom account
await algorand.send.assetTransfer({
  sender: creatorAccount.addr,
  receiver: clawbackFromAccount.addr,
  assetId,
  amount: 5n,
})

const info = await algorand.asset.getAccountInformation(
  clawbackFromAccount.addr,
  assetId
)
console.log(`ClawbackFrom account balance: ${info.balance} units`)
```

**Regular Transfer**:
- Creator sends 5 units to the clawbackFrom account
- This is a normal asset transfer
- Use `algorand.asset.getAccountInformation()` to verify the balance

### Step 5: Execute Clawback Operation

```typescript
// Revoke assets from clawbackFromAccount and send to receiverAccount
await algorand.send.assetTransfer({
  sender: creatorAccount.addr,        // Must be the clawback address
  receiver: receiverAccount.addr,     // Destination for clawed back assets
  assetId,
  amount: 5n,
  clawbackTarget: clawbackFromAccount.addr, // Account to clawback from
})
```

**Critical Parameters**:
- `sender`: Must be the designated clawback address
- `receiver`: Where the assets will be transferred to
- `clawbackTarget`: The account to revoke assets from
- `amount`: How many units to clawback

**What Happens**:
1. AlgoKit Utils detects `clawbackTarget` is provided
2. Creates an asset transfer transaction with the clawback field set
3. Assets are forcibly removed from `clawbackTarget` account
4. Assets are transferred to `receiver` account
5. Transaction must be signed by the `sender` (clawback address)

### Step 6: Verify Final Balances

```typescript
const receiverInfo = await algorand.asset.getAccountInformation(
  receiverAccount.addr,
  assetId
)
const clawbackFromInfo = await algorand.asset.getAccountInformation(
  clawbackFromAccount.addr,
  assetId
)
const creatorInfo = await algorand.asset.getAccountInformation(
  creatorAccount.addr,
  assetId
)

console.log(`Receiver balance: ${receiverInfo.balance} units`)
console.log(`ClawbackFrom balance: ${clawbackFromInfo.balance} units`)
console.log(`Creator balance: ${creatorInfo.balance} units`)

// Verify: receiver has 5, clawbackFrom has 0, creator has 95
if (receiverInfo.balance === 5n &&
    clawbackFromInfo.balance === 0n &&
    creatorInfo.balance === 95n) {
  console.log('✅ Clawback successful!')
}
```

**Expected Balances**:
- Receiver: 5 units (from clawback)
- ClawbackFrom: 0 units (all assets revoked)
- Creator: 95 units (remaining from initial 100)

## API Patterns (AlgoKit Utils v9.1.2)

### Creating Asset with Clawback

```typescript
await algorand.send.assetCreate({
  sender: string,
  total: bigint,
  decimals: number,
  assetName?: string,
  unitName?: string,
  clawback?: string,  // Enable clawback with this address
  manager?: string,   // Optional: can update asset config
  reserve?: string,   // Optional: reserve address
  freeze?: string,    // Optional: can freeze asset in accounts
})
```

### Asset Opt-In

```typescript
await algorand.send.assetOptIn({
  sender: string,
  assetId: bigint,
})
```

### Regular Asset Transfer

```typescript
await algorand.send.assetTransfer({
  sender: string,
  receiver: string,
  assetId: bigint,
  amount: bigint,
})
```

### Clawback Asset Transfer

```typescript
await algorand.send.assetTransfer({
  sender: string,              // Must be clawback address
  receiver: string,            // Destination
  assetId: bigint,
  amount: bigint,
  clawbackTarget: string,      // Account to revoke from
})
```

### Get Asset Balance

```typescript
const info = await algorand.asset.getAccountInformation(
  accountAddress: string,
  assetId: bigint
)
console.log(info.balance) // bigint
```

## Key Differences: Regular Transfer vs. Clawback

| Aspect | Regular Transfer | Clawback Transfer |
|--------|-----------------|-------------------|
| **Who initiates** | Asset holder | Clawback address |
| **Requires sender approval** | Yes | No (forced) |
| **clawbackTarget parameter** | Not used | Required |
| **Sender field** | Asset holder | Clawback address |
| **Use case** | Normal asset movement | Compliance, recovery |

## Security Considerations

1. **Clawback Address Control**: Whoever controls the clawback address has significant power over the asset
2. **Immutability**: If no manager is set, the clawback address cannot be changed
3. **Trust Implications**: Users must trust the clawback address won't abuse this power
4. **Transparency**: All clawback operations are visible on-chain
5. **Best Practices**:
   - Use multi-sig for clawback address in production
   - Document clawback policy clearly
   - Consider time-locks or governance for clawback operations
   - Only enable clawback when truly necessary

## Running This Example

```bash
# Install dependencies
npm install

# Ensure AlgoKit LocalNet is running
algokit localnet start

# Run the example
npm start
```

**Expected Output**:
```
Funding accounts...

Creating asset with clawback capability...
Asset created with ID: 1262
Clawback address: GF7BU6TYHSI3YTSZ2BWHNA35HXQMR7VJHFFLP54NURFW2AIXUCFH5MA2YM

Opting in accounts to asset...
Both accounts opted in

Transferring 5 units to clawbackFrom account...
ClawbackFrom account balance: 5 units

Executing clawback: revoking 5 units from clawbackFrom account...
Clawback executed

Verifying final balances...
Receiver balance: 5 units
ClawbackFrom balance: 0 units
Creator balance: 95 units

✅ Clawback successful!
   - 5 units revoked from clawbackFrom account
   - 5 units transferred to receiver account
   - Creator retains 95 units
```

## Real-World Use Cases

### 1. Securities Token Compliance

```typescript
// Compliance officer can revoke tokens from non-compliant accounts
await algorand.send.assetTransfer({
  sender: complianceOfficer.addr,
  receiver: treasuryAccount.addr,
  assetId: securityTokenId,
  amount: nonCompliantBalance,
  clawbackTarget: nonCompliantAccount.addr,
})
```

### 2. Error Recovery

```typescript
// User sent tokens to wrong address, support can recover
await algorand.send.assetTransfer({
  sender: supportAddress.addr,
  receiver: correctAddress.addr,
  assetId: tokenId,
  amount: mistakenlySentAmount,
  clawbackTarget: wrongAddress.addr,
})
```

### 3. Escrow Release

```typescript
// Release escrowed tokens after conditions are met
await algorand.send.assetTransfer({
  sender: escrowManagerAddress.addr,
  receiver: beneficiaryAddress.addr,
  assetId: escrowedTokenId,
  amount: escrowedAmount,
  clawbackTarget: escrowAccount.addr,
})
```

## Key Takeaways

1. **Clawback Must Be Enabled**: Set during asset creation via `clawback` parameter
2. **Only Clawback Address**: Only the designated address can execute clawback operations
3. **Use clawbackTarget**: This parameter distinguishes clawback from regular transfers
4. **Opt-In Still Required**: Receiving account must be opted into the asset
5. **Forced Transfer**: Does not require approval from the account being clawed back
6. **BigInt for Asset IDs**: Convert asset IDs to `BigInt` for type safety
7. **Visible On-Chain**: All clawback operations are transparent and auditable

## Learn More

- [Algorand ASA Documentation](https://developer.algorand.org/docs/get-details/asa/)
- [Asset Parameters Guide](https://developer.algorand.org/docs/get-details/asa/#asset-parameters)
- [AlgoKit Utils TypeScript Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Compliance in Blockchain](https://developer.algorand.org/solutions/compliance/)
