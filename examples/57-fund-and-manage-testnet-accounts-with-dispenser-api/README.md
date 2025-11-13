# Fund and Manage TestNet Accounts with Dispenser API

This example demonstrates how to use the TestNet Dispenser API client to check funding limits, fund accounts directly, and register refunds for unused TestNet ALGO.

## What This Example Shows

This example teaches you how to:
- Create and configure a TestNet dispenser API client
- Check your current funding limit before requesting funds
- Fund TestNet accounts directly using the dispenser API
- Understand how to register refunds for unused funds
- Handle authentication and rate limiting properly
- Work with dispenser API responses

## Why This Matters

The TestNet dispenser API provides advanced control for TestNet development:

1. **Direct Funding Control**: Fund specific amounts to specific addresses
2. **Limit Management**: Check and monitor your funding allowance
3. **Refund System**: Return unused funds to extend your limits
4. **Rate Limiting**: Understand and work within dispenser constraints
5. **CI/CD Integration**: Programmatic funding for automated workflows
6. **Community Resources**: Share dispenser capacity through refunds

Key concepts:
- **Access Token Authentication**: Secure API access with ALGOKIT_DISPENSER_ACCESS_TOKEN
- **Funding Limits**: Each token has rate limits on how much can be dispensed
- **Direct Funding**: `fund(address, amount)` sends specific amounts
- **Limit Checking**: `getLimit()` returns current available balance
- **Refund Registration**: `refund(txId)` credits back unused funds
- **Error Handling**: Graceful handling of rate limits and failures

Common use cases:
- **Precise Funding**: Fund exact amounts for specific tests
- **Multi-Account Setup**: Fund multiple test accounts programmatically
- **Limit Monitoring**: Track dispenser usage in automated systems
- **Refund Workflows**: Return funds after testing completes
- **Advanced CI/CD**: Complex funding strategies in pipelines
- **Rate Limit Management**: Stay within limits using refunds

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
- Token provides authentication and tracks rate limits
- Each token has usage limits that reset periodically

### 2. Create Dispenser Client

Initialize the dispenser API client:

```typescript
const algorand = AlgorandClient.testNet()
const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
```

Dispenser client features:
- Created via `algorand.client.getTestNetDispenserFromEnvironment()`
- Automatically loads `ALGOKIT_DISPENSER_ACCESS_TOKEN`
- Handles API authentication
- Manages rate limiting
- Provides error responses
- Works only with TestNet

### 3. Check Funding Limit

Query your current funding allowance:

```typescript
const limitResponse = await dispenserClient.getLimit()
console.log(`Current available limit: ${limitResponse.amount} microAlgos`)
console.log(`That's ${limitResponse.amount / 1_000_000} Algos`)
```

Limit checking:
- Shows how much you can currently dispense
- Helps avoid rate limit errors
- Updated after each fund operation
- Increases when refunds are registered
- Best practice to check before funding

### 4. Fund an Account

Send ALGO directly to a TestNet address:

```typescript
const recipientAddress = 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
const amountToFund = 5_000_000 // 5 Algos in microAlgos

const fundResponse = await dispenserClient.fund(recipientAddress, amountToFund)
console.log(`Transaction ID: ${fundResponse.txId}`)
console.log(`Amount sent: ${fundResponse.amount} microAlgos`)
```

Funding behavior:
- Directly funds the specified address
- Amount specified in microAlgos
- Returns transaction ID and confirmed amount
- Decreases your available limit
- May fail if exceeding rate limits

### 5. Register Refunds

Return unused funds to extend your limits:

```typescript
// Step 1: Send payment back to dispenser (outside this API)
// Step 2: Get the transaction ID of that payment
// Step 3: Register the refund

const refundTxId = 'YOUR_REFUND_TRANSACTION_ID'
await dispenserClient.refund(refundTxId)
console.log(`Refund registered: ${refundTxId}`)
```

Refund workflow:
1. Send payment from funded account back to dispenser address
2. Get transaction ID of that payment transaction
3. Call `refund()` with the transaction ID
4. Your available limit increases
5. Funds become available for community

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
=== Fund and Manage TestNet Accounts with Dispenser API ===

❌ Error: ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable not set

To get an access token:
1. Visit the AlgoKit dispenser service
2. Register and obtain your access token
3. Set it as an environment variable: export ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token
```

### With Valid Access Token

```
=== Fund and Manage TestNet Accounts with Dispenser API ===

✅ Access token found

1. Initializing TestNet dispenser API client...
   Dispenser API client ready

2. Checking current funding limit...
   Current available limit: 100000000 microAlgos
   That's 100 Algos

3. Funding an account...
   Recipient address: GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A
   Amount to fund: 5 Algos (5000000 microAlgos)
   ✅ Successfully funded account!
   Transaction ID: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   Amount sent: 5000000 microAlgos

4. About refund registration...
   Refunds help you stay within rate limits by returning unused funds.

   To register a refund:
   1. Send payment from your funded account back to the dispenser address
   2. Get the transaction ID of that payment
   3. Call dispenserClient.refund(transactionId)

   Example (commented out - requires actual refund transaction):
   /*
   const refundTxId = "YOUR_REFUND_TRANSACTION_ID"
   await dispenserClient.refund(refundTxId)
   console.log(`Refund registered: ${refundTxId}`)
   */

✅ Example complete!

📝 Key Takeaways:
   • algorand.client.getTestNetDispenserFromEnvironment() creates authenticated dispenser client
   • getLimit() checks your current funding allowance
   • fund(address, amount) directly funds TestNet accounts
   • refund(txId) registers refunds to return unused funds
   • Always check limits before funding to avoid rate limit errors
   • Register refunds when done testing to help the community
```

### If Rate Limit Exceeded

```
3. Funding an account...
   Recipient address: GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A
   Amount to fund: 5 Algos (5000000 microAlgos)
   Error funding account: [Error details]

📝 Note: Funding may fail if:
   • You have exceeded your rate limit
   • The recipient address is invalid
   • The dispenser service is temporarily unavailable
```

## Common Patterns

### Check Limit Before Funding

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

// Check available limit
const limitResponse = await dispenserClient.getLimit()
console.log(`Available: ${limitResponse.amount / 1_000_000} ALGO`)

// Only fund if limit is sufficient
const amountNeeded = 10_000_000 // 10 ALGO
if (limitResponse.amount >= amountNeeded) {
  await dispenserClient.fund(recipientAddress, amountNeeded)
} else {
  console.log('Insufficient limit - consider refunding unused funds')
}
```

### Fund Multiple Accounts

```typescript
const recipients = [
  { address: 'ADDRESS1...', amount: 5_000_000 },
  { address: 'ADDRESS2...', amount: 10_000_000 },
  { address: 'ADDRESS3...', amount: 3_000_000 },
]

for (const recipient of recipients) {
  try {
    const result = await dispenserClient.fund(recipient.address, recipient.amount)
    console.log(`Funded ${recipient.address}: ${result.txId}`)
  } catch (error) {
    console.error(`Failed to fund ${recipient.address}:`, error)
  }
}
```

### Complete Refund Workflow

```typescript
import { AlgorandClient, getTestNetDispenserApiClient } from '@algorandfoundation/algokit-utils'
import { algo } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.testNet()
const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

// 1. Fund an account for testing
const testAccount = algorand.account.random()
const fundResult = await dispenserClient.fund(testAccount.addr, 10_000_000)
console.log(`Funded test account: ${fundResult.txId}`)

// 2. Use the account for testing...
// (your test logic here)

// 3. When done, send funds back to dispenser
const dispenserAddress = 'DISPENSER_ADDRESS_HERE' // Get from dispenser service
const refundResult = await algorand.send.payment({
  sender: testAccount,
  receiver: dispenserAddress,
  amount: algo(9.9), // Keep some for fees
})

// 4. Register the refund
await dispenserClient.refund(refundResult.txIds[0])
console.log(`Refund registered: ${refundResult.txIds[0]}`)

// 5. Check updated limit
const newLimit = await dispenserClient.getLimit()
console.log(`New limit: ${newLimit.amount / 1_000_000} ALGO`)
```

### Error Handling with Retry

```typescript
async function fundWithRetry(
  dispenserClient: any,
  address: string,
  amount: number,
  maxRetries: number = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await dispenserClient.fund(address, amount)
      console.log(`✅ Funded on attempt ${attempt}`)
      return result
    } catch (error) {
      console.log(`❌ Attempt ${attempt} failed:`, error.message)

      if (attempt < maxRetries) {
        const delay = attempt * 2000 // Exponential backoff
        console.log(`   Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw new Error(`Failed after ${maxRetries} attempts`)
      }
    }
  }
}
```

### Monitor Limit Usage

```typescript
const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

// Check initial limit
const initialLimit = await dispenserClient.getLimit()
console.log(`Starting limit: ${initialLimit.amount / 1_000_000} ALGO`)

// Fund account
const fundAmount = 5_000_000
await dispenserClient.fund(recipientAddress, fundAmount)

// Check remaining limit
const remainingLimit = await dispenserClient.getLimit()
console.log(`Remaining limit: ${remainingLimit.amount / 1_000_000} ALGO`)
console.log(`Used: ${(initialLimit.amount - remainingLimit.amount) / 1_000_000} ALGO`)
```

### Fund with Validation

```typescript
import algosdk from 'algosdk'

async function fundValidated(
  dispenserClient: any,
  address: string,
  amount: number
) {
  // Validate address format
  if (!algosdk.isValidAddress(address)) {
    throw new Error(`Invalid Algorand address: ${address}`)
  }

  // Check limit is sufficient
  const limit = await dispenserClient.getLimit()
  if (limit.amount < amount) {
    throw new Error(`Insufficient limit. Available: ${limit.amount}, Requested: ${amount}`)
  }

  // Fund the account
  const result = await dispenserClient.fund(address, amount)

  // Verify funding succeeded
  if (!result.txId) {
    throw new Error('Funding succeeded but no transaction ID returned')
  }

  return result
}
```

### Batch Funding with Limit Awareness

```typescript
async function batchFundWithLimitCheck(
  dispenserClient: any,
  recipients: Array<{ address: string; amount: number }>
) {
  // Calculate total needed
  const totalNeeded = recipients.reduce((sum, r) => sum + r.amount, 0)

  // Check if limit is sufficient
  const limit = await dispenserClient.getLimit()
  if (limit.amount < totalNeeded) {
    throw new Error(
      `Insufficient limit for batch funding. ` +
      `Need ${totalNeeded / 1_000_000} ALGO, have ${limit.amount / 1_000_000} ALGO`
    )
  }

  // Fund all recipients
  const results = []
  for (const recipient of recipients) {
    const result = await dispenserClient.fund(recipient.address, recipient.amount)
    results.push(result)
    console.log(`Funded ${recipient.address}: ${result.txId}`)
  }

  return results
}
```

## Best Practices

1. **Always Check Limits First**
   ```typescript
   // Good: Check before funding
   const limit = await dispenserClient.getLimit()
   if (limit.amount >= amountNeeded) {
     await dispenserClient.fund(address, amountNeeded)
   }

   // Avoid: Fund without checking
   await dispenserClient.fund(address, amountNeeded) // May hit rate limit
   ```

2. **Handle Errors Gracefully**
   ```typescript
   // Good: Comprehensive error handling
   try {
     await dispenserClient.fund(address, amount)
   } catch (error) {
     if (error.message.includes('rate limit')) {
       console.log('Rate limit exceeded - waiting before retry')
       await sleep(60000)
       // Implement retry logic
     } else if (error.message.includes('invalid address')) {
       console.error('Invalid address format')
     } else {
       throw error
     }
   }

   // Avoid: No error handling
   await dispenserClient.fund(address, amount)
   ```

3. **Register Refunds When Done**
   ```typescript
   // Good: Return unused funds
   async function testWithCleanup() {
     const fundResult = await dispenserClient.fund(address, amount)

     try {
       // Run tests...
     } finally {
       // Always refund unused funds
       const refundTx = await sendRefundPayment()
       await dispenserClient.refund(refundTx.txId)
     }
   }

   // Avoid: Not refunding unused funds
   await dispenserClient.fund(address, amount)
   // Run tests and forget about refunds
   ```

4. **Validate Addresses**
   ```typescript
   // Good: Validate before funding
   import algosdk from 'algosdk'

   if (!algosdk.isValidAddress(recipientAddress)) {
     throw new Error('Invalid address')
   }
   await dispenserClient.fund(recipientAddress, amount)

   // Avoid: Fund without validation
   await dispenserClient.fund(recipientAddress, amount) // May fail with cryptic error
   ```

5. **Monitor Usage in Automated Systems**
   ```typescript
   // Good: Track dispenser usage
   const metrics = {
     funded: 0,
     refunded: 0,
     currentLimit: 0,
   }

   async function fundWithMetrics(address: string, amount: number) {
     const result = await dispenserClient.fund(address, amount)
     metrics.funded += amount

     const limit = await dispenserClient.getLimit()
     metrics.currentLimit = limit.amount

     console.log(`Metrics: Funded ${metrics.funded / 1_000_000} ALGO, Limit: ${metrics.currentLimit / 1_000_000} ALGO`)
     return result
   }
   ```

## Comparison with ensureFundedFromTestNetDispenserApi

This example uses the direct dispenser API methods, while example 54 uses the convenience method:

### Direct API (This Example)
```typescript
// More control, requires checking limits manually
const limit = await dispenserClient.getLimit()
if (limit.amount >= amount) {
  await dispenserClient.fund(address, amount)
}
```

**Use when:**
- You need precise control over amounts
- Checking limits is important for your workflow
- Registering refunds is part of your process
- Working with existing funded accounts

### Convenience Method (Example 54)
```typescript
// Automatic limit checking and idempotent funding
await algorand.account.ensureFundedFromTestNetDispenserApi(
  address,
  dispenserClient,
  minBalance
)
```

**Use when:**
- You want idempotent funding (only funds if needed)
- You want automatic balance checking
- You don't need to track limits explicitly
- Simple funding is sufficient

## Key Takeaways

- Create TestNet client with `AlgorandClient.testNet()`
- Use `algorand.client.getTestNetDispenserFromEnvironment()` to create authenticated dispenser client
- Client automatically loads `ALGOKIT_DISPENSER_ACCESS_TOKEN` from environment
- `getLimit()` returns your current funding allowance in microAlgos
- `fund(address, amount)` directly funds TestNet accounts
- `refund(txId)` registers refunds to increase your available limit
- Always check limits before funding to avoid rate limit errors
- Handle errors appropriately (rate limits, invalid addresses, etc.)
- Register refunds when done testing to help the community
- Direct API provides more control than convenience methods
- Best for advanced CI/CD workflows and precise funding strategies
- Works only with TestNet (validated by the API)

This example demonstrates advanced TestNet dispenser API usage for developers who need precise control over funding, limits, and refunds in their testing workflows.
