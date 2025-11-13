# Automatically Fund New Accounts

This example demonstrates how to automatically fund a new account with the proper minimum balance, which is essential for application onboarding and account management.

## What This Example Shows

This example teaches you how to:
- Use `algorand.account.ensureFunded()` to automatically fund accounts
- Understand Algorand's minimum balance requirement (100,000 microAlgos)
- Verify account information after funding
- Handle idempotent funding (only funding when needed)
- Fund accounts with different amounts

## Why This Matters

Automatic account funding is crucial for application development because:

1. **User Onboarding**: New users need funded accounts to interact with the blockchain
2. **Minimum Balance**: All accounts must maintain at least 100,000 microAlgos
3. **Intelligent Funding**: `ensureFunded` only sends funds when needed
4. **Development Efficiency**: Simplifies account setup in tests and development

Key concepts:
- **Minimum Balance**: Every Algorand account requires at least 100,000 microAlgos (0.1 ALGO) to exist on-chain
- **Idempotent Funding**: `ensureFunded` checks if funding is needed before sending
- **Account Creation**: Accounts are "created" on-chain when they receive their first transaction
- **Balance Management**: Additional funding can be added as needed

Common use cases:
- **Application Onboarding**: Fund new user accounts automatically
- **Testing**: Create and fund test accounts quickly
- **Account Initialization**: Ensure accounts have sufficient balance for operations
- **Development**: Streamline account management workflows

## How It Works

The example demonstrates the complete automatic funding flow:

### 1. Get Dispenser Account
```typescript
const dispenser = await algorand.account.dispenserFromEnvironment()
console.log('Funding source (dispenser) ready')
```

The dispenser provides the funds for new accounts.

### 2. Create a New Random Account
```typescript
const newAccount = algorand.account.random()
console.log(`New account created: ${newAccount.addr}`)
```

At this point, the account exists locally but not yet on the blockchain.

### 3. Fund the Account Automatically
```typescript
const fundingResult = await algorand.account.ensureFunded(
  newAccount,       // Account to fund
  dispenser,        // Funding source
  microAlgos(1)     // Requested amount: 1 microAlgo
)
```

The `ensureFunded` method:
- Checks if the account exists on-chain
- Calculates total funding needed (requested amount + minimum balance)
- Sends the funding transaction
- Returns transaction details

In this example, even though we request only 1 microAlgo, the account receives 100,001 microAlgos:
- 1 microAlgo (requested)
- 100,000 microAlgos (minimum balance requirement)

### 4. Display Funding Details
```typescript
if (fundingResult) {
  console.log(`Transaction ID: ${fundingResult.txIds[0]}`)
  console.log(`Amount funded: ${fundingResult.amountFunded.microAlgos} microAlgos`)
}
```

### 5. Verify Account Information
```typescript
const accountInfo = await algorand.account.getInformation(newAccount.addr)
console.log(`Balance: ${accountInfo.balance.microAlgos} microAlgos`)
console.log(`Balance: ${accountInfo.balance.algos} ALGO`)
console.log(`Minimum balance: ${accountInfo.minBalance.microAlgos} microAlgos`)
```

### 6. Idempotent Funding
```typescript
const secondFundingResult = await algorand.account.ensureFunded(
  newAccount,
  dispenser,
  microAlgos(1)
)

if (!secondFundingResult) {
  console.log('No additional funding needed - account already has sufficient balance')
}
```

The second call returns `undefined` because the account already has sufficient funds.

### 7. Fund with Additional Amount
```typescript
const additionalFunding = await algorand.account.ensureFunded(
  newAccount,
  dispenser,
  algos(1.1) // Request 1.1 ALGO total
)
```

Requesting 1.1 ALGO when the account has 0.100001 ALGO will trigger additional funding.

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
Funding source (dispenser) ready

New account created: ABC123...XYZ
Account does not yet exist on the blockchain

Funding new account...

Funding completed!
Transaction ID: DEF456...
Amount funded: 100001 microAlgos

Note: Amount funded includes minimum balance requirement (100,000 microAlgos)

Account information:
  Address: ABC123...XYZ
  Balance: 100001 microAlgos
  Balance: 0.100001 ALGO
  Minimum balance: 100000 microAlgos
  Amount: 100001 microAlgos (raw)

✅ Account funded successfully!
   - Requested: 1 microAlgo
   - Minimum balance: 100,000 microAlgos
   - Total funded: 100001 microAlgos

Attempting to fund again with same amount...
✅ No additional funding needed - account already has sufficient balance

Funding account with additional 1 ALGO...
Additional funding sent: 0.999999 ALGO
New balance: 1.1 ALGO
```

## Key Takeaways

- `algorand.account.ensureFunded()` intelligently funds accounts only when needed
- All Algorand accounts require a minimum balance of 100,000 microAlgos (0.1 ALGO)
- The method automatically adds the minimum balance to the requested amount for new accounts
- `ensureFunded` returns `undefined` if the account already has sufficient funds (idempotent)
- The funding result includes `txIds` array and `amountFunded` details
- Account information can be retrieved using `algorand.account.getInformation(address)`
- The method takes three parameters: account to fund, funding source, and minimum required amount
- Accounts are created on-chain when they receive their first transaction
- You can request funding in microAlgos or ALGOs using `microAlgos()` or `algos()` helpers
- The dispenser account is typically configured through environment variables
