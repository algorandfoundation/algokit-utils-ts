# Fund Accounts on TestNet Using Dispenser API

This example demonstrates how to automatically fund TestNet accounts using the AlgoKit TestNet dispenser API with access token authentication.

## What This Example Shows

This example teaches you how to:
- Configure and use the TestNet dispenser API client
- Authenticate using an access token from environment variables
- Automatically fund accounts on TestNet to a minimum balance
- Control funding increments to optimize dispenser usage
- Handle access token validation and error cases
- Verify account balances after funding

## Why This Matters

The TestNet dispenser API provides crucial automation for TestNet development:

1. **Automated Funding**: No manual faucet requests needed
2. **CI/CD Integration**: Automatically fund accounts in pipelines
3. **Rate Limiting**: Access tokens provide fair, controlled access
4. **Efficiency**: Only requests the exact amount needed
5. **Development Velocity**: Instant TestNet funding without delays
6. **Production-Like Testing**: Test real-world funding scenarios

Key concepts:
- **Access Token Authentication**: Secure, rate-limited API access
- **Minimum Balance**: Ensure accounts have enough funds for operations
- **Funding Increments**: Control how much to request per transaction
- **Idempotent Funding**: Only funds if balance is insufficient
- **TestNet Only**: API restricted to TestNet for security

Common use cases:
- **CI/CD Pipelines**: Automatically fund test accounts
- **Integration Tests**: Ensure test accounts are funded
- **Development**: Quick account setup for testing
- **Prototyping**: Rapid TestNet account preparation
- **Learning**: Get TestNet funds without manual steps

## How It Works

### 1. Configure Access Token

Set the access token as an environment variable:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

// Check for access token
const accessToken = process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN
if (!accessToken) {
  console.error('❌ Error: ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable not set')
  process.exit(1)
}
```

Access token requirements:
- Set `ALGOKIT_DISPENSER_ACCESS_TOKEN` environment variable
- Obtain token from AlgoKit dispenser service
- Token provides authentication and rate limiting
- Keeps your usage tracked and controlled

### 2. Initialize TestNet Client

Connect to TestNet network:

```typescript
const algorand = AlgorandClient.testNet()
```

TestNet client:
- Connects to public TestNet network
- Required for dispenser API (MainNet not allowed)
- Uses Algonode as default provider
- No local setup needed

### 3. Create Dispenser API Client

Initialize the dispenser client:

```typescript
const algorand = AlgorandClient.testNet()
const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
```

Dispenser client features:
- Created via `algorand.client.getTestNetDispenserFromEnvironment()`
- Automatically loads `ALGOKIT_DISPENSER_ACCESS_TOKEN`
- Handles authentication with API
- Manages rate limiting
- Provides error handling
- Validates TestNet usage only

### 4. Create Account to Fund

Generate a new account:

```typescript
const accountToFund = algorand.account.random()
console.log(`Account address: ${accountToFund.addr}`)
```

Account creation:
- Generates new random account
- Account starts with zero balance
- Can fund any valid Algorand address
- Not limited to newly created accounts

### 5. Fund Account from Dispenser API

Request funds using the dispenser:

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
  accountToFund.addr,
  dispenserClient,
  algo(100), // Minimum balance: 100 ALGO
  {
    minFundingIncrement: algo(0.1), // Minimum 0.1 ALGO per transaction
  }
)

if (result) {
  console.log(`Transaction ID: ${result.transactionId}`)
  console.log(`Amount funded: ${result.amountFunded.algo} ALGO`)
} else {
  console.log('Account already has sufficient funds')
}
```

Funding behavior:
- Only funds if balance below minimum
- Respects `minFundingIncrement` parameter
- Returns `undefined` if no funding needed
- Returns result with transaction details if funded
- Ensures optimal use of dispenser resources

### 6. Verify Account Balance

Check the final balance:

```typescript
const accountInfo = await algorand.account.getInformation(accountToFund.addr)
console.log(`Balance: ${accountInfo.balance.algo} ALGO`)
```

Balance verification:
- Confirms funding succeeded
- Shows current ALGO balance
- Useful for debugging funding issues
- Demonstrates account is ready for use

## Prerequisites

- Node.js and npm installed
- `ALGOKIT_DISPENSER_ACCESS_TOKEN` environment variable set
- Internet connection for TestNet access
- Access token from AlgoKit dispenser service

### Getting an Access Token

1. Visit the AlgoKit dispenser service
2. Register and create an account
3. Generate your access token
4. Set it as an environment variable:
   ```bash
   export ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token_here
   ```

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your access token:
   ```bash
   export ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token
   ```

3. Run the example:
   ```bash
   npm start
   ```

## Expected Output

### Without Access Token

```
=== TestNet Dispenser API Funding ====
❌ Error: ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable not set

To get an access token:
1. Visit the AlgoKit dispenser service
2. Register and obtain your access token
3. Set it as an environment variable: export ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token
```

### With Valid Access Token

```
=== TestNet Dispenser API Funding ====
✅ Access token found

1. Connecting to TestNet...
   Connected to TestNet

2. Initializing TestNet dispenser API client...
   Dispenser API client ready

3. Creating a new account to fund...
   Account address: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

4. Requesting funds from TestNet dispenser API...
   Requested minimum: 100 ALGO
   Minimum funding increment: 0.1 ALGO

✅ Funding successful!
   Transaction ID: YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
   Amount funded: 100 ALGO (100000000 microAlgos)

5. Verifying account balance on TestNet...
   Balance: 100 ALGO

📝 Key Takeaways:
   • TestNet dispenser API provides automated funding for TestNet development
   • Access token authentication ensures secure and rate-limited access
   • No need to manually request TestNet ALGO from faucets
   • Perfect for CI/CD pipelines and automated testing on TestNet
   • Respects minFundingIncrement to optimize funding amounts
```

### If Account Already Funded

```
✅ Account already has sufficient funds

5. Verifying account balance on TestNet...
   Balance: 150 ALGO
```

## Common Patterns

### Basic Funding

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.testNet()
const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

const account = algorand.account.random()

await algorand.account.ensureFundedFromTestNetDispenserApi(
  account.addr,
  dispenserClient,
  algo(10) // Ensure account has at least 10 ALGO
)
```

### Custom Funding Increment

```typescript
// Only request funds in 5 ALGO increments
await algorand.account.ensureFundedFromTestNetDispenserApi(
  account.addr,
  dispenserClient,
  algo(100),
  {
    minFundingIncrement: algo(5),
  }
)
```

### Fund Multiple Accounts

```typescript
const accounts = [
  algorand.account.random(),
  algorand.account.random(),
  algorand.account.random(),
]

for (const account of accounts) {
  await algorand.account.ensureFundedFromTestNetDispenserApi(
    account.addr,
    dispenserClient,
    algo(50)
  )
  console.log(`Funded ${account.addr}`)
}
```

### CI/CD Pipeline Usage

```typescript
async function setupTestEnvironment() {
  const algorand = AlgorandClient.testNet()
  const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

  // Fund deployer account
  const deployer = await algorand.account.fromEnvironment('DEPLOYER')
  await algorand.account.ensureFundedFromTestNetDispenserApi(
    deployer.addr,
    dispenserClient,
    algo(100)
  )

  // Fund test users
  const user1 = algorand.account.random()
  const user2 = algorand.account.random()

  await Promise.all([
    algorand.account.ensureFundedFromTestNetDispenserApi(
      user1.addr,
      dispenserClient,
      algo(50)
    ),
    algorand.account.ensureFundedFromTestNetDispenserApi(
      user2.addr,
      dispenserClient,
      algo(50)
    ),
  ])

  return { deployer, user1, user2 }
}
```

### Conditional Funding with Logging

```typescript
const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
  account.addr,
  dispenserClient,
  algo(100),
  { minFundingIncrement: algo(1) }
)

if (result) {
  console.log('Funded account:')
  console.log(`  Transaction: ${result.transactionId}`)
  console.log(`  Amount: ${result.amountFunded.algo} ALGO`)
} else {
  console.log('Account already sufficiently funded')
}
```

### Error Handling

```typescript
try {
  await algorand.account.ensureFundedFromTestNetDispenserApi(
    account.addr,
    dispenserClient,
    algo(100)
  )
  console.log('✅ Funding successful')
} catch (error) {
  console.error('❌ Funding failed:', error)

  // Common error causes:
  // - Invalid access token
  // - Rate limit exceeded
  // - Network connectivity issues
  // - Dispenser API temporarily unavailable
  // - Attempting to use on MainNet
}
```

### Check Balance Before and After

```typescript
const beforeInfo = await algorand.account.getInformation(account.addr)
console.log(`Balance before: ${beforeInfo.balance.algo} ALGO`)

const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
  account.addr,
  dispenserClient,
  algo(100)
)

if (result) {
  const afterInfo = await algorand.account.getInformation(account.addr)
  console.log(`Balance after: ${afterInfo.balance.algo} ALGO`)
  console.log(`Increase: ${result.amountFunded.algo} ALGO`)
}
```

### Validate TestNet Connection

```typescript
const algorand = AlgorandClient.testNet()

// Verify we're on TestNet before using dispenser
const isTestNet = await algorand.client.isTestNet()
if (!isTestNet) {
  throw new Error('Dispenser API only works on TestNet!')
}

const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
// Safe to use dispenser now...
```

## Best Practices

1. **Always Check Access Token**
   ```typescript
   // Good: Validate access token before using
   if (!process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN) {
     throw new Error('Access token required')
   }
   const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

   // Avoid: Assuming token is set
   const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment() // May fail silently
   ```

2. **Use Appropriate Funding Increments**
   ```typescript
   // Good: Reasonable increment to avoid waste
   await algorand.account.ensureFundedFromTestNetDispenserApi(
     account.addr,
     dispenserClient,
     algo(100),
     { minFundingIncrement: algo(0.1) }
   )

   // Avoid: Too large increment wastes resources
   await algorand.account.ensureFundedFromTestNetDispenserApi(
     account.addr,
     dispenserClient,
     algo(10),
     { minFundingIncrement: algo(100) } // Will always request 100 ALGO
   )
   ```

3. **Handle Funding Results Properly**
   ```typescript
   // Good: Check if funding was needed
   const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
     account.addr,
     dispenserClient,
     algo(100)
   )

   if (result) {
     console.log(`Funded ${result.amountFunded.algo} ALGO`)
   } else {
     console.log('Already funded')
   }

   // Avoid: Assuming funding always occurs
   const result = await algorand.account.ensureFundedFromTestNetDispenserApi(...)
   console.log(result.transactionId) // May be undefined!
   ```

4. **Use in CI/CD Pipelines**
   ```typescript
   // Good: Automated funding for test environments
   async function beforeTests() {
     const algorand = AlgorandClient.testNet()
     const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

     const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')
     await algorand.account.ensureFundedFromTestNetDispenserApi(
       testAccount.addr,
       dispenserClient,
       algo(100)
     )
   }
   ```

5. **Add Error Handling**
   ```typescript
   // Good: Handle dispenser errors gracefully
   try {
     await algorand.account.ensureFundedFromTestNetDispenserApi(
       account.addr,
       dispenserClient,
       algo(100)
     )
   } catch (error) {
     if (error.message.includes('rate limit')) {
       console.log('Rate limited - waiting before retry')
       await sleep(60000)
       // Retry logic...
     } else {
       throw error
     }
   }
   ```

## Error Handling

Common errors and solutions:

### Missing Access Token
```
Error: ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable not set
```
**Solution**: Set the environment variable with your access token

### Invalid Access Token
```
Error: Unauthorized - invalid access token
```
**Solution**: Verify your access token is correct and not expired

### Rate Limit Exceeded
```
Error: Rate limit exceeded
```
**Solution**: Wait before making more requests, or request higher limits

### MainNet Usage Attempt
```
Error: Attempt to fund using TestNet dispenser API on non TestNet network
```
**Solution**: Ensure you're using `AlgorandClient.testNet()`, not `.mainNet()`

### Network Connectivity
```
Error: Failed to connect to dispenser API
```
**Solution**: Check internet connection and TestNet availability

## Key Takeaways

- Create TestNet client with `AlgorandClient.testNet()`
- Use `algorand.client.getTestNetDispenserFromEnvironment()` to create dispenser client
- Client automatically loads `ALGOKIT_DISPENSER_ACCESS_TOKEN`
- `ensureFundedFromTestNetDispenserApi()` funds accounts idempotently
- Only funds if balance below minimum spending balance
- `minFundingIncrement` controls funding amount granularity
- Returns `undefined` if no funding needed
- Returns result with `transactionId` and `amountFunded` if funded
- Perfect for CI/CD pipelines and automated testing
- Access token provides secure, rate-limited API access
- TestNet only - automatically validates network type
- Eliminates manual faucet requests for TestNet development

This example demonstrates essential TestNet funding patterns for automated development workflows and continuous integration pipelines.
