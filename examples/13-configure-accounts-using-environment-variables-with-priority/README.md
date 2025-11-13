# Configure Accounts Using Environment Variables with Priority

This example demonstrates how to configure accounts using environment variables with mnemonics and shows that environment variables take priority over KMD for account resolution. This is crucial for production deployments where accounts need to be configured securely.

## What This Example Shows

This example teaches you how to:
- Use `fromEnvironment()` to retrieve accounts from environment variables or KMD
- Set account mnemonics in environment variables
- Understand the account resolution priority (environment > KMD)
- Convert between mnemonics and private keys
- Verify that accounts from different sources are identical

## Why This Matters

Understanding account configuration priority is important for several reasons:

1. **Production Security**: Environment variables provide better security than KMD for production
2. **Configuration Management**: Clear understanding of where accounts come from
3. **Deployment Flexibility**: Different account sources for different environments
4. **Best Practices**: Following recommended patterns for account management

Key concepts:
- **fromEnvironment()**: Retrieves accounts from environment variables or KMD
- **Priority Order**: Environment variables are checked first, then KMD
- **Mnemonic Format**: Accounts configured via `<NAME>_MNEMONIC` environment variables
- **KMD Fallback**: If no environment variable exists, KMD is used as fallback

Common use cases:
- **Production Deployments**: Configure accounts securely via environment variables
- **Development**: Use KMD for local development convenience
- **CI/CD Pipelines**: Inject account mnemonics as environment variables
- **Multi-Environment Setup**: Different accounts for dev, test, and production

## How It Works

The example demonstrates the complete account configuration priority workflow:

### 1. Create an Account via KMD

First, create an account using KMD with a random name:

```typescript
const algorand = AlgorandClient.defaultLocalNet()

const accountName = uuid()
console.log(`Creating account via KMD with name: ${accountName}`)
const account = await algorand.account.fromEnvironment(accountName)
console.log(`Account address: ${account.addr}`)
```

Since no environment variable exists for this name, `fromEnvironment()` falls back to KMD and creates a new account.

### 2. Extract the Mnemonic

Get the mnemonic from the KMD account:

```typescript
const mnemonic = algosdk.secretKeyToMnemonic((account as any).account.sk)
```

This extracts the private key and converts it to a 25-word mnemonic phrase.

### 3. Set Environment Variable

Configure the account via environment variable:

```typescript
const envVarName = 'TEST'
process.env[`${envVarName}_MNEMONIC`] = mnemonic
console.log(`Setting environment variable ${envVarName}_MNEMONIC with mnemonic`)
```

The environment variable follows the pattern `<NAME>_MNEMONIC`.

### 4. Retrieve from Environment

Retrieve the account using the same name:

```typescript
const accountFromEnv = await algorand.account.fromEnvironment(envVarName)
console.log(`Account address from environment: ${accountFromEnv.addr}`)
```

Now `fromEnvironment()` finds the environment variable first and uses it instead of KMD.

### 5. Verify Priority

Verify that both accounts are identical:

```typescript
const addr1 = account.addr.toString()
const addr2 = accountFromEnv.addr.toString()
console.log(`- Addresses match: ${addr1 === addr2}`)

const accountSk = (account as any).account?.sk || (account as any).sk
const accountFromEnvSk = (accountFromEnv as any).account?.sk || (accountFromEnv as any).sk
const privateKeysMatch = Buffer.from(accountSk).equals(Buffer.from(accountFromEnvSk))
console.log(`- Private keys match: ${privateKeysMatch}`)
```

Both addresses and private keys match, proving the environment variable took priority.

## How Priority Works

The `fromEnvironment()` method follows this priority order:

1. **Environment Variable**: Check for `<NAME>_MNEMONIC` environment variable
   - If found, create account from mnemonic
   - Return immediately

2. **KMD Fallback**: If no environment variable exists
   - Check KMD for account with given name
   - If not in KMD, create new account
   - Store in KMD and return

This ensures environment variables always take priority when configured.

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
Creating account via KMD with name: 5a91ff5c-5ffb-442e-83d8-c46997118846
Account address: OV7A7OLR5JS4MPXNLKW3SHAHR6HZUNZZSYBBJ27R5HN25OTZY7JPJQPKXM

Setting environment variable TEST_MNEMONIC with mnemonic
Mnemonic: casual control powder chest cube monkey tell off rookie human address van rain...

Retrieving account from environment variable TEST_MNEMONIC
Account address from environment: OV7A7OLR5JS4MPXNLKW3SHAHR6HZUNZZSYBBJ27R5HN25OTZY7JPJQPKXM

Verification:
- Addresses match: true
- Private keys match: true
- Different object instances: true

✅ Environment variable takes priority over KMD!

This is important for production deployments where accounts should be
configured via environment variables for better security practices.

Key takeaways:
  • fromEnvironment() checks environment variables first
  • If no environment variable is found, it falls back to KMD
  • Environment variables provide better security for production
  • Use <NAME>_MNEMONIC env var to configure accounts
```

## Key Takeaways

- `fromEnvironment()` checks environment variables before KMD
- Environment variable format: `<NAME>_MNEMONIC`
- Mnemonic is a 25-word phrase representing the private key
- Environment variables take absolute priority over KMD
- This pattern is recommended for production deployments
- KMD is convenient for local development but not suitable for production
- Use `secretKeyToMnemonic()` to convert private keys to mnemonics
- Both sources produce identical accounts with same addresses and keys
- Environment variables provide better security and configuration management
- This priority system allows different configurations per environment
