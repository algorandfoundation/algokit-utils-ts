# Create and Retrieve Accounts from Environment

This example demonstrates how to create and manage Algorand accounts using the `fromEnvironment()` method, which provides automatic account creation, funding, and idempotent retrieval.

## What This Example Shows

This example teaches you how to:
- Create accounts dynamically using `fromEnvironment()` with unique identifiers
- Automatically fund newly created accounts on LocalNet
- Retrieve account information including balance
- Understand idempotent account retrieval (same identifier returns same account)
- Compare account instances and their properties
- Work with accounts stored in KMD (Key Management Daemon)

## Why This Matters

Understanding account management with `fromEnvironment()` is essential for application development:

1. **Dynamic Account Creation**: Create accounts on-demand without manual setup
2. **Automatic Funding**: Accounts are automatically funded on LocalNet and TestNet (with dispenser)
3. **Idempotent Operations**: Same identifier always returns the same account keys
4. **Secure Key Management**: Keys stored in KMD on LocalNet, not exposed in memory
5. **Development Workflow**: Simplifies testing with multiple accounts

Key concepts:
- **fromEnvironment()**: Creates or retrieves accounts based on environment variables or identifiers
- **Idempotent Retrieval**: Multiple calls with same identifier return same account keys
- **KMD Storage**: Keys stored securely in Key Management Daemon on LocalNet
- **Automatic Funding**: New accounts receive initial funding on LocalNet/TestNet
- **Account Balance**: Access both microAlgos and Algos representations
- **Object Instances**: Each retrieval returns new object instance with same underlying keys

Common use cases:
- **Testing**: Create multiple test accounts dynamically
- **Multi-Account Applications**: Manage different accounts for different purposes
- **Development Setup**: Avoid manual account creation and funding
- **CI/CD Pipelines**: Deterministic account creation for automated tests
- **Account Persistence**: Same identifier retrieves same account across sessions

## How It Works

### 1. Initialize AlgorandClient

Set up the client for LocalNet:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { randomUUID } from 'crypto'

const algorand = AlgorandClient.defaultLocalNet()
```

Client initialization:
- Connects to LocalNet algod, indexer, and KMD
- Enables automatic account creation and funding
- Provides access to account management methods
- Supports environment variable configuration

### 2. Create Account with Unique Identifier

Create an account using a unique identifier:

```typescript
const accountName = randomUUID()
console.log('Creating account with identifier:', accountName)

const account = await algorand.account.fromEnvironment(accountName)
console.log('Account created with address:', account.addr.toString())
```

Account creation:
- `accountName` can be any string (UUID, user ID, session ID, etc.)
- If environment variable doesn't exist, creates new account
- Account is stored in KMD on LocalNet
- Account is automatically funded with initial balance
- Returns account object with address and signing capabilities

### 3. Verify Account Information

Check the account balance to verify funding:

```typescript
const accountInfo = await algorand.account.getInformation(account.addr)

console.log('Account balance:', accountInfo.balance.microAlgos.toString(), 'microAlgos')
console.log('Account balance:', accountInfo.balance.algos.toString(), 'Algos')

if (accountInfo.balance.microAlgos > 0n) {
  console.log('✓ Account is successfully funded!')
}
```

Account information:
- `balance.microAlgos`: Balance in microAlgos (BigInt, 1 Algo = 1,000,000 microAlgos)
- `balance.algos`: Balance in Algos (BigInt)
- Use `.toString()` to display BigInt values
- Compare with `0n` for BigInt comparisons
- Default funding on LocalNet is 1000 Algos

### 4. Idempotent Account Retrieval

Retrieve the same account multiple times:

```typescript
const secondAccountName = randomUUID()

// First retrieval - creates account
const firstRetrieval = await algorand.account.fromEnvironment(secondAccountName)
console.log('First retrieval - Address:', firstRetrieval.addr.toString())

// Second retrieval - returns same account
const secondRetrieval = await algorand.account.fromEnvironment(secondAccountName)
console.log('Second retrieval - Address:', secondRetrieval.addr.toString())
```

Idempotent behavior:
- First call creates account if it doesn't exist
- Subsequent calls retrieve the same account
- Same identifier always returns same account keys
- Each call returns a new object instance
- Underlying cryptographic keys are identical

### 5. Compare Account Instances

Verify the idempotent behavior:

```typescript
console.log('Are they the same object instance?',
  firstRetrieval === secondRetrieval)  // false

console.log('Do they have the same address?',
  firstRetrieval.addr.toString() === secondRetrieval.addr.toString())  // true

if (firstRetrieval.sk && secondRetrieval.sk) {
  console.log('Do they have the same secret key?',
    Buffer.from(firstRetrieval.sk).equals(Buffer.from(secondRetrieval.sk)))
} else {
  console.log('Secret keys stored securely in KMD (not exposed in memory)')
}
```

Comparison results:
- **Object instances**: Different (not cached in memory)
- **Addresses**: Identical (same account)
- **Secret keys**: Stored in KMD, not exposed when using LocalNet
- **Signing capability**: Both can sign transactions for same address

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
=== Example 1: Create and Fund a New Account ===

Creating account with identifier: 0ff8c27c-ad12-4661-8f39-80c578153dcb
LocalNet account '0ff8c27c-ad12-4661-8f39-80c578153dcb' doesn't yet exist; created account LSSPKXT4DDQHYXSEIC74YQ5KAXQNGZCBESB2XQLH3MIGDNZ35LXDUCP2EU with keys stored in KMD and funding with 1000 ALGO
Account created with address: LSSPKXT4DDQHYXSEIC74YQ5KAXQNGZCBESB2XQLH3MIGDNZ35LXDUCP2EU
Account balance: 1000000000 microAlgos
Account balance: 1000 Algos
✓ Account is successfully funded!

=== Example 2: Idempotent Account Retrieval ===

Creating account with identifier: 4de3b2c7-1344-44fd-bb7b-a840aad6ff55
LocalNet account '4de3b2c7-1344-44fd-bb7b-a840-aad6ff55' doesn't yet exist; created account R25HDZSV3JA7GB5OJTPC4NI3F3V6ZNNAMS46LEOQZ7YA5HMUA3PRD6MJSM with keys stored in KMD and funding with 1000 ALGO
First retrieval - Address: R25HDZSV3JA7GB5OJTPC4NI3F3V6ZNNAMS46LEOQZ7YA5HMUA3PRD6MJSM
Second retrieval - Address: R25HDZSV3JA7GB5OJTPC4NI3F3V6ZNNAMS46LEOQZ7YA5HMUA3PRD6MJSM

Comparison:
Are they the same object instance? false
Do they have the same address? true
Secret keys stored securely in KMD (not exposed in memory)

✓ Idempotent retrieval confirmed!
  - Different object instances (not cached)
  - Same cryptographic keys (deterministic generation)

=== Key Takeaways ===
1. fromEnvironment creates and funds accounts automatically on LocalNet
2. Using the same identifier retrieves the same account keys
3. Each call returns a new object instance with the same underlying keys
4. This is useful for managing multiple accounts in your application
5. In production, set environment variables to use existing accounts

✅ Example completed successfully!
```

## Common Patterns

### Create Multiple Test Accounts

```typescript
const algorand = AlgorandClient.defaultLocalNet()

// Create accounts with descriptive names
const alice = await algorand.account.fromEnvironment('ALICE')
const bob = await algorand.account.fromEnvironment('BOB')
const charlie = await algorand.account.fromEnvironment('CHARLIE')

console.log('Alice:', alice.addr.toString())
console.log('Bob:', bob.addr.toString())
console.log('Charlie:', charlie.addr.toString())
```

### Use Environment Variables in Production

```typescript
// In production, set environment variable:
// DEPLOYER_MNEMONIC="your mnemonic phrase here"

const deployer = await algorand.account.fromEnvironment('DEPLOYER')
console.log('Deployer address:', deployer.addr.toString())

// If env var exists, uses that account
// If env var doesn't exist on LocalNet, creates and funds new account
// If env var doesn't exist on TestNet/MainNet, throws error
```

### Check Account Funding Before Operations

```typescript
const account = await algorand.account.fromEnvironment('MY_ACCOUNT')
const accountInfo = await algorand.account.getInformation(account.addr)

const minBalance = 100000n  // 0.1 Algo in microAlgos

if (accountInfo.balance.microAlgos < minBalance) {
  console.warn('Account balance too low!')
  // Fund account or handle error
} else {
  console.log('Account has sufficient balance')
  // Proceed with operations
}
```

### Retrieve Account Across Sessions

```typescript
// Session 1: Create account
const accountId = 'my-persistent-account'
const account1 = await algorand.account.fromEnvironment(accountId)
console.log('Session 1 - Address:', account1.addr.toString())

// Session 2 (later): Retrieve same account
const account2 = await algorand.account.fromEnvironment(accountId)
console.log('Session 2 - Address:', account2.addr.toString())

// Addresses are identical across sessions
console.log('Same account?', account1.addr.toString() === account2.addr.toString())  // true
```

### Create Accounts with Dynamic Identifiers

```typescript
import { randomUUID } from 'crypto'

// Create unique accounts for each user
async function createUserAccount(userId: string) {
  const account = await algorand.account.fromEnvironment(`USER_${userId}`)
  console.log(`Account for user ${userId}:`, account.addr.toString())
  return account
}

// Create accounts for multiple users
const user1Account = await createUserAccount('user-123')
const user2Account = await createUserAccount('user-456')

// Each user has their own account
console.log('Different accounts?',
  user1Account.addr.toString() !== user2Account.addr.toString())  // true
```

### Handle Different Networks

```typescript
// LocalNet: Creates and funds automatically
const localAccount = await AlgorandClient.defaultLocalNet()
  .account.fromEnvironment('TEST_ACCOUNT')

// TestNet: Requires dispenser or manual funding
const testAccount = await AlgorandClient.testNet()
  .account.fromEnvironment('TEST_ACCOUNT')

// MainNet: Must set environment variable (won't auto-create)
// Set MAINNET_ACCOUNT_MNEMONIC environment variable
const mainAccount = await AlgorandClient.mainNet()
  .account.fromEnvironment('MAINNET_ACCOUNT')
```

### Batch Account Creation

```typescript
// Create multiple accounts in parallel
const accountPromises = Array.from({ length: 5 }, (_, i) =>
  algorand.account.fromEnvironment(`BATCH_ACCOUNT_${i}`)
)

const accounts = await Promise.all(accountPromises)

console.log('Created accounts:')
accounts.forEach((account, index) => {
  console.log(`  Account ${index}:`, account.addr.toString())
})
```

## Best Practices

1. **Use Descriptive Identifiers**
   ```typescript
   // Good: Descriptive names
   const deployer = await algorand.account.fromEnvironment('DEPLOYER')
   const alice = await algorand.account.fromEnvironment('ALICE')
   const faucet = await algorand.account.fromEnvironment('FAUCET')

   // Avoid: Generic or unclear names
   const acc1 = await algorand.account.fromEnvironment('ACCOUNT1')
   const x = await algorand.account.fromEnvironment('X')
   ```

2. **Set Environment Variables for Production**
   ```typescript
   // LocalNet: Auto-creates accounts
   // TestNet/MainNet: Must set environment variables

   // .env file:
   // DEPLOYER_MNEMONIC="word1 word2 word3 ..."
   // ADMIN_MNEMONIC="word1 word2 word3 ..."

   const deployer = await algorand.account.fromEnvironment('DEPLOYER')
   const admin = await algorand.account.fromEnvironment('ADMIN')
   ```

3. **Check Balance Before Operations**
   ```typescript
   // Good: Verify sufficient balance
   const account = await algorand.account.fromEnvironment('MY_ACCOUNT')
   const accountInfo = await algorand.account.getInformation(account.addr)

   if (accountInfo.balance.microAlgos >= requiredAmount) {
     // Proceed with transaction
   } else {
     throw new Error('Insufficient balance')
   }
   ```

4. **Use BigInt for Balance Comparisons**
   ```typescript
   // Good: Use BigInt literals
   if (accountInfo.balance.microAlgos > 0n) {
     console.log('Account has balance')
   }

   if (accountInfo.balance.algos >= 10n) {
     console.log('Account has at least 10 Algos')
   }

   // Avoid: Number comparison with BigInt
   if (accountInfo.balance.microAlgos > 0) {  // Error!
     // ...
   }
   ```

5. **Handle Address Display Properly**
   ```typescript
   // Good: Convert to string for display/comparison
   const account = await algorand.account.fromEnvironment('ACCOUNT')
   console.log('Address:', account.addr.toString())

   if (account.addr.toString() === expectedAddress) {
     // Comparison works
   }

   // Avoid: Using Address object directly in string context
   console.log('Address:', account.addr)  // May not display correctly
   ```

6. **Understand KMD Storage**
   ```typescript
   // On LocalNet, accounts are stored in KMD
   // Secret keys are not exposed in memory
   const account = await algorand.account.fromEnvironment('MY_ACCOUNT')

   // account.sk may be undefined (keys in KMD)
   // But account can still sign transactions
   const result = await algorand.send.payment({
     sender: account.addr,
     receiver: someAddress,
     amount: microAlgos(100000),
   })
   // Signing happens via KMD transparently
   ```

7. **Use Consistent Naming Conventions**
   ```typescript
   // Good: Consistent naming across your application
   const contracts = {
     deployer: await algorand.account.fromEnvironment('DEPLOYER'),
     admin: await algorand.account.fromEnvironment('ADMIN'),
     feeCollector: await algorand.account.fromEnvironment('FEE_COLLECTOR'),
   }

   // Maintain same identifiers across test runs for consistency
   ```

## Network Behavior Differences

### LocalNet
- Automatically creates accounts if they don't exist
- Funds new accounts with 1000 Algos
- Stores keys in KMD
- Secret keys not exposed in account object
- Ideal for development and testing

### TestNet
- Can use dispenser API to fund new accounts
- Requires dispenser configuration for automatic funding
- Can set environment variables for existing accounts
- Use for integration testing

### MainNet
- Never auto-creates accounts
- Must set environment variables with existing account mnemonics
- Throws error if environment variable not found
- Production use only

## Key Takeaways

- `fromEnvironment()` creates or retrieves accounts based on identifiers
- Accounts are automatically funded on LocalNet (1000 Algos)
- Same identifier always returns the same account keys (idempotent)
- Each retrieval returns a new object instance, not a cached reference
- Secret keys stored in KMD on LocalNet, not exposed in memory
- Account balance available in both microAlgos and Algos (both BigInt)
- Use `.toString()` to display addresses and BigInt values
- Use BigInt literals (`0n`, `1000n`) for balance comparisons
- Environment variables enable production account configuration
- Descriptive identifiers make code more maintainable
- Check account balance before performing operations
- Perfect for development, testing, and multi-account applications
- Accounts persist across sessions when using same identifier
- Different networks have different creation and funding behavior

This example demonstrates the foundation for dynamic account management in Algorand applications, essential for testing and development workflows.
