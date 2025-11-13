# Handle TestNet Dispenser API Errors

This example demonstrates how to handle errors when the TestNet dispenser API fails to fund an account. This is essential for building robust applications that gracefully handle external API failures.

## What This Example Shows

This example teaches you how to:
- Handle errors when using the TestNet dispenser API
- Identify different types of dispenser errors
- Implement proper error categorization
- Build robust error handling strategies
- Gracefully degrade when external services fail
- Provide clear user feedback on failures

## Why This Matters

Proper error handling is crucial for production applications:

1. **Resilience**: External APIs can fail for various reasons
2. **User Experience**: Clear error messages help users understand what went wrong
3. **Debugging**: Categorized errors make troubleshooting easier
4. **Recovery**: Proper handling enables retry logic and fallbacks
5. **Monitoring**: Well-structured errors facilitate alerting and logging
6. **Reliability**: Graceful degradation prevents complete application failure

Key concepts:
- **Error Categorization**: Identifying error types (auth, rate limit, network, service)
- **Try-Catch Blocks**: Proper exception handling in async code
- **Error Messages**: Extracting and analyzing error information
- **Retry Strategies**: When and how to retry failed operations
- **Fallback Mechanisms**: Alternative approaches when primary method fails
- **User Feedback**: Providing actionable information to users

Common error scenarios:
- **Missing Access Token**: Environment variable not set
- **Authentication Errors**: Invalid or expired access token
- **Rate Limiting**: Too many requests to dispenser API
- **Network Errors**: Connection failures, timeouts
- **Service Unavailable**: Dispenser service temporarily down
- **Invalid Parameters**: Incorrect amount or address format

## How It Works

### 1. Set Up the Environment

First, check if the access token is available:

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

const accessToken = process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN
if (!accessToken) {
  console.log('⚠️  Note: ALGOKIT_DISPENSER_ACCESS_TOKEN not set')
  console.log('   This example will demonstrate error handling without a valid token.')
}
```

Environment setup:
- Check for required environment variables
- Provide helpful messages if configuration is missing
- Continue execution to demonstrate error handling
- In production, might exit early or use fallback

### 2. Connect to TestNet

Create an AlgorandClient connected to TestNet:

```typescript
console.log('1. Connecting to TestNet...')
const algorand = AlgorandClient.testNet()
console.log('   Connected to TestNet')
```

Connection setup:
- Use `.testNet()` for TestNet configuration
- No manual configuration needed
- Handles all network settings automatically
- Ready for dispenser API calls

### 3. Attempt to Fund Account with Error Handling

Wrap the funding operation in try-catch for error handling:

```typescript
// Create a random account that we want to fund
const accountToFund = algorand.account.random()

console.log('2. Attempting to fund account...')
console.log(`   Account address: ${accountToFund.addr}`)
console.log('   Requested amount: 100 ALGO')
console.log('   Minimum funding increment: 1 ALGO')

try {
  // Create a dispenser client for funding accounts on TestNet
  // This will throw an error if ALGOKIT_DISPENSER_ACCESS_TOKEN is not set
  const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

  // Attempt to fund the account using the dispenser API
  const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
    accountToFund.addr,
    dispenserClient,
    algo(100),
    {
      minFundingIncrement: algo(1),
    }
  )

  if (result) {
    console.log('✅ Account funded successfully!')
    console.log(`   Transaction ID: ${result.transactionId}`)
    console.log(`   Amount funded: ${result.amountFunded.algo} ALGO`)
  } else {
    console.log('✅ Account already has sufficient funds')
  }
} catch (error) {
  // Handle errors (see next section)
}
```

Funding operation:
- Create dispenser client (may throw if token missing)
- Request 100 ALGO with 1 ALGO minimum increment
- Check if funding was successful or already sufficient
- Catch any errors that occur during the process

### 4. Categorize and Handle Errors

Identify the error type and provide appropriate feedback:

```typescript
catch (error) {
  console.log('❌ Failed to fund account from TestNet dispenser')

  const errorMessage = (error as Error).message

  // Identify common error types and provide appropriate feedback
  if (errorMessage.includes('ALGOKIT_DISPENSER_ACCESS_TOKEN') || errorMessage.includes('authToken')) {
    console.log('Error Type: Missing Access Token')
    console.log('Cause: ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable not set')
    console.log('Solution: Set a valid access token from the AlgoKit dispenser service')
  } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('authentication')) {
    console.log('Error Type: Authentication Error')
    console.log('Cause: Invalid or missing ALGOKIT_DISPENSER_ACCESS_TOKEN')
    console.log('Solution: Set a valid access token from the AlgoKit dispenser service')
  } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
    console.log('Error Type: Rate Limit Exceeded')
    console.log('Cause: Too many requests to the dispenser API')
    console.log('Solution: Wait before retrying, or register refunds to increase your limit')
  } else if (errorMessage.includes('network') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ETIMEDOUT')) {
    console.log('Error Type: Network Error')
    console.log('Cause: Cannot connect to the dispenser API')
    console.log('Solution: Check internet connection and TestNet availability')
  } else if (errorMessage.includes('503') || errorMessage.includes('unavailable')) {
    console.log('Error Type: Service Unavailable')
    console.log('Cause: Dispenser service is temporarily down')
    console.log('Solution: Retry later or use an alternative funding method')
  } else {
    console.log('Error Type: Unknown Error')
    console.log('Cause: Unexpected error occurred')
  }

  console.log()
  console.log('Error Details:')
  console.log(`  ${errorMessage}`)
}
```

Error categorization:
- **Missing Access Token**: Token not set in environment
- **Authentication Error**: Invalid or expired token
- **Rate Limit**: Too many requests
- **Network Error**: Connection issues
- **Service Unavailable**: Dispenser is down
- **Unknown Error**: Unexpected failures

### 5. Implement Error Handling Strategies

Provide recommendations for handling errors in production:

```typescript
console.log('📝 Recommended Error Handling Strategies:')
console.log('   1. Retry with exponential backoff for transient errors')
console.log('   2. Fall back to manual funding instructions for the user')
console.log('   3. Check if account already has sufficient funds before failing')
console.log('   4. Log errors to monitoring service for alerting')
console.log('   5. Implement circuit breaker pattern for repeated failures')
console.log('   6. Provide clear user feedback about what went wrong')
```

Recommended strategies:
- Retry logic for transient errors
- Fallback to alternative funding methods
- Pre-check account balances
- Log errors for monitoring
- Circuit breaker for repeated failures
- Clear user communication

## Prerequisites

- Node.js and npm installed
- TestNet dispenser access token (optional for this example, but demonstrates error handling)
- Internet connection to TestNet

To get an access token:
1. Visit the AlgoKit dispenser service
2. Register and obtain your access token
3. Set it as environment variable: `export ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token`

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Set your access token:
   ```bash
   export ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token_here
   ```

3. Run the example:
   ```bash
   npm start
   ```

## Expected Output

### Without Access Token (Demonstrates Error Handling)

```
=== Handle TestNet Dispenser API Errors ===

⚠️  Note: ALGOKIT_DISPENSER_ACCESS_TOKEN not set
   This example will demonstrate error handling without a valid token.

1. Connecting to TestNet...
   Connected to TestNet

2. Attempting to fund account...
   Account address: D55WRJFF5MSZOUETLYBO4OZDUDO4SHJPP3QDARUMSZE6ECRW2DOKA5TFRQ
   Requested amount: 100 ALGO
   Minimum funding increment: 1 ALGO

❌ Failed to fund account from TestNet dispenser

Error Type: Missing Access Token
Cause: ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable not set
Solution: Set a valid access token from the AlgoKit dispenser service

Error Details:
  Can't init AlgoKit TestNet Dispenser API client because neither environment variable ALGOKIT_DISPENSER_ACCESS_TOKEN or the authToken were provided.

📝 Recommended Error Handling Strategies:
   1. Retry with exponential backoff for transient errors
   2. Fall back to manual funding instructions for the user
   3. Check if account already has sufficient funds before failing
   4. Log errors to monitoring service for alerting
   5. Implement circuit breaker pattern for repeated failures
   6. Provide clear user feedback about what went wrong
```

### With Valid Access Token

```
=== Handle TestNet Dispenser API Errors ===

✅ Access token found

1. Connecting to TestNet...
   Connected to TestNet

2. Attempting to fund account...
   Account address: ABC123...XYZ
   Requested amount: 100 ALGO
   Minimum funding increment: 1 ALGO

✅ Account funded successfully!
   Transaction ID: TXID123...
   Amount funded: 100 ALGO
```

## Common Patterns

### Basic Error Handling

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

try {
  const algorand = AlgorandClient.testNet()
  const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
  const account = algorand.account.random()

  const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
    account.addr,
    dispenserClient,
    algo(100),
    { minFundingIncrement: algo(1) }
  )

  console.log('Funded:', result.transactionId)
} catch (error) {
  console.error('Funding failed:', error.message)
}
```

### Error Categorization

```typescript
try {
  // Attempt funding
  const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
    account.addr,
    dispenserClient,
    algo(100)
  )
} catch (error) {
  const message = (error as Error).message

  if (message.includes('ALGOKIT_DISPENSER_ACCESS_TOKEN')) {
    // Handle missing token
    console.error('Access token not configured')
    throw new Error('Please set ALGOKIT_DISPENSER_ACCESS_TOKEN')
  } else if (message.includes('429')) {
    // Handle rate limiting
    console.warn('Rate limit exceeded, waiting...')
    await sleep(60000) // Wait 1 minute
    // Retry logic here
  } else if (message.includes('network')) {
    // Handle network errors
    console.error('Network error, check connectivity')
  } else {
    // Unknown error
    console.error('Unexpected error:', message)
    throw error
  }
}
```

### Retry with Exponential Backoff

```typescript
async function fundWithRetry(
  algorand: AlgorandClient,
  address: string,
  amount: AlgoAmount,
  maxRetries = 3
) {
  const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
        address,
        dispenserClient,
        amount
      )
      return result
    } catch (error) {
      const message = (error as Error).message

      // Don't retry on auth errors
      if (message.includes('401') || message.includes('ALGOKIT_DISPENSER_ACCESS_TOKEN')) {
        throw error
      }

      if (attempt === maxRetries) {
        throw error
      }

      // Exponential backoff: 2^attempt seconds
      const delayMs = Math.pow(2, attempt) * 1000
      console.log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`)
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}

// Usage
const result = await fundWithRetry(algorand, account.addr, algo(100))
```

### Fallback to Manual Funding

```typescript
async function ensureFunded(
  algorand: AlgorandClient,
  address: string,
  amount: AlgoAmount
) {
  try {
    // Try automatic funding with dispenser
    const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
    const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
      address,
      dispenserClient,
      amount
    )
    console.log('Automatically funded:', result.transactionId)
    return result
  } catch (error) {
    // Fall back to manual funding instructions
    console.error('Automatic funding failed:', (error as Error).message)
    console.log()
    console.log('Please fund your account manually:')
    console.log(`1. Visit: https://dispenser.testnet.aws.algodev.network/`)
    console.log(`2. Enter address: ${address}`)
    console.log(`3. Request ${amount.algo} ALGO`)

    // Wait for user to fund manually
    throw new Error('Manual funding required')
  }
}
```

### Check Balance Before Funding

```typescript
async function fundIfNeeded(
  algorand: AlgorandClient,
  address: string,
  requiredAmount: AlgoAmount
) {
  try {
    // Check current balance
    const accountInfo = await algorand.client.algod
      .accountInformation(address)
      .do()

    const currentBalance = algo(accountInfo.amount)

    if (currentBalance.microAlgos >= requiredAmount.microAlgos) {
      console.log(`Account already has ${currentBalance.algo} ALGO`)
      return null
    }

    // Fund the difference
    const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
    const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
      address,
      dispenserClient,
      requiredAmount
    )

    return result
  } catch (error) {
    console.error('Error checking/funding account:', (error as Error).message)
    throw error
  }
}

// Usage
await fundIfNeeded(algorand, account.addr, algo(100))
```

### Circuit Breaker Pattern

```typescript
class DispenserCircuitBreaker {
  private failureCount = 0
  private lastFailureTime?: number
  private readonly threshold = 3
  private readonly resetTimeout = 60000 // 1 minute

  async fund(
    algorand: AlgorandClient,
    address: string,
    amount: AlgoAmount
  ) {
    // Check if circuit is open
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open. Dispenser service may be down.')
    }

    try {
      const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
      const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
        address,
        dispenserClient,
        amount
      )

      // Success - reset failure count
      this.failureCount = 0
      return result
    } catch (error) {
      // Record failure
      this.failureCount++
      this.lastFailureTime = Date.now()
      throw error
    }
  }

  private isOpen(): boolean {
    if (this.failureCount >= this.threshold) {
      // Check if timeout has passed
      if (this.lastFailureTime &&
          Date.now() - this.lastFailureTime > this.resetTimeout) {
        // Reset circuit
        this.failureCount = 0
        return false
      }
      return true
    }
    return false
  }
}

// Usage
const breaker = new DispenserCircuitBreaker()

try {
  const result = await breaker.fund(algorand, account.addr, algo(100))
  console.log('Funded:', result.transactionId)
} catch (error) {
  console.error('Funding failed:', (error as Error).message)
}
```

### Comprehensive Error Handling

```typescript
async function robustFunding(
  algorand: AlgorandClient,
  address: string,
  amount: AlgoAmount
): Promise<{ success: boolean; txId?: string; error?: string }> {
  let lastError: Error | null = null

  // Strategy 1: Try with dispenser API
  try {
    const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
    const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
      address,
      dispenserClient,
      amount,
      { minFundingIncrement: algo(1) }
    )

    if (result) {
      return {
        success: true,
        txId: result.transactionId
      }
    }
  } catch (error) {
    lastError = error as Error
    console.warn('Dispenser API failed:', lastError.message)
  }

  // Strategy 2: Check if already funded
  try {
    const accountInfo = await algorand.client.algod
      .accountInformation(address)
      .do()

    if (accountInfo.amount >= amount.microAlgos) {
      return {
        success: true,
        txId: undefined // Already funded
      }
    }
  } catch (error) {
    console.warn('Could not check account balance:', (error as Error).message)
  }

  // Strategy 3: All strategies failed
  return {
    success: false,
    error: lastError?.message || 'Unknown error'
  }
}

// Usage
const result = await robustFunding(algorand, account.addr, algo(100))

if (result.success) {
  console.log('Funding successful!', result.txId)
} else {
  console.error('All funding strategies failed:', result.error)
  // Provide manual funding instructions
}
```

## Best Practices

1. **Always Use Try-Catch for External APIs**
   ```typescript
   // Good: Handle errors explicitly
   try {
     const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
     const result = await algorand.account.ensureFundedFromTestNetDispenserApi(...)
   } catch (error) {
     console.error('Funding failed:', error.message)
   }

   // Avoid: Letting errors propagate uncaught
   const result = await algorand.account.ensureFundedFromTestNetDispenserApi(...)
   // If this fails, entire application may crash
   ```

2. **Categorize Errors for Better Handling**
   ```typescript
   // Good: Different handling for different errors
   catch (error) {
     const message = error.message
     if (message.includes('401')) {
       // Fix auth
     } else if (message.includes('429')) {
       // Handle rate limit
     } else if (message.includes('network')) {
       // Retry
     }
   }

   // Avoid: Treating all errors the same
   catch (error) {
     console.error('Error:', error)
     // What should we do now?
   }
   ```

3. **Implement Retry Logic for Transient Errors**
   ```typescript
   // Good: Retry with backoff
   for (let i = 0; i < 3; i++) {
     try {
       return await fundAccount()
     } catch (error) {
       if (isTransientError(error) && i < 2) {
         await sleep(Math.pow(2, i) * 1000)
         continue
       }
       throw error
     }
   }

   // Avoid: No retry, single attempt
   const result = await fundAccount()
   // One network blip = total failure
   ```

4. **Provide Clear Error Messages to Users**
   ```typescript
   // Good: Actionable error messages
   catch (error) {
     console.error('Failed to fund account')
     console.log('Cause: Rate limit exceeded')
     console.log('Solution: Wait 60 seconds or register refunds')
   }

   // Avoid: Technical error dumps
   catch (error) {
     console.error(error.stack)
     // User has no idea what to do
   }
   ```

5. **Log Errors for Monitoring**
   ```typescript
   // Good: Structured logging
   catch (error) {
     logger.error('dispenser_funding_failed', {
       address,
       amount: amount.algo,
       error: error.message,
       errorType: categorizeError(error),
       timestamp: Date.now()
     })
   }

   // Avoid: Console only
   catch (error) {
     console.error(error)
     // Lost forever, no monitoring
   }
   ```

6. **Have Fallback Strategies**
   ```typescript
   // Good: Multiple strategies
   try {
     return await fundWithDispenser()
   } catch (error) {
     try {
       return await fundWithAlternative()
     } catch (error2) {
       return showManualInstructions()
     }
   }

   // Avoid: Single point of failure
   return await fundWithDispenser()
   // If dispenser down, nothing works
   ```

7. **Check Prerequisites Before Operations**
   ```typescript
   // Good: Validate environment first
   const token = process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN
   if (!token) {
     throw new Error('ALGOKIT_DISPENSER_ACCESS_TOKEN not set')
   }

   const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()

   // Avoid: Let it fail during operation
   const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
   // Fails later with cryptic error
   ```

8. **Don't Retry on Authentication Errors**
   ```typescript
   // Good: Only retry transient errors
   catch (error) {
     if (error.message.includes('401') || error.message.includes('403')) {
       throw error // Don't retry auth failures
     }
     // Retry other errors
   }

   // Avoid: Retrying auth failures
   catch (error) {
     await sleep(1000)
     return await retry() // Will fail again
   }
   ```

## Error Reference

### Missing Access Token Error
```
Error: Can't init AlgoKit TestNet Dispenser API client because neither environment variable ALGOKIT_DISPENSER_ACCESS_TOKEN or the authToken were provided.
```

**Cause**: The `ALGOKIT_DISPENSER_ACCESS_TOKEN` environment variable is not set.

**Solution**:
1. Obtain access token from AlgoKit dispenser service
2. Set environment variable: `export ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token`
3. Restart your application

### Authentication Error (401)
```
Error: Unauthorized - Invalid authentication credentials
```

**Cause**: The access token is invalid or expired.

**Solution**:
1. Verify your access token is correct
2. Check if token has expired
3. Generate new token from dispenser service
4. Update environment variable

### Rate Limit Error (429)
```
Error: Rate limit exceeded - Too many requests
```

**Cause**: You've made too many funding requests in a short time period.

**Solution**:
1. Wait before making more requests (typically 1-5 minutes)
2. Implement request throttling
3. Register refunds to increase your limit
4. Consider caching funded accounts

### Network Error (ECONNREFUSED, ETIMEDOUT)
```
Error: connect ECONNREFUSED
Error: Request timeout
```

**Cause**: Cannot connect to dispenser API service.

**Solution**:
1. Check internet connectivity
2. Verify TestNet is operational
3. Check firewall settings
4. Retry with exponential backoff

### Service Unavailable (503)
```
Error: Service temporarily unavailable
```

**Cause**: Dispenser service is down for maintenance or experiencing issues.

**Solution**:
1. Wait and retry later
2. Check AlgoKit status page
3. Use alternative funding method
4. Implement fallback mechanism

## Key Takeaways

- Always wrap dispenser API calls in try-catch blocks
- Categorize errors for appropriate handling (auth, rate limit, network, service)
- Missing access token is caught at client creation time
- Implement retry logic with exponential backoff for transient errors
- Provide clear, actionable error messages to users
- Have fallback strategies for when dispenser is unavailable
- Don't retry authentication errors - they won't succeed
- Log errors to monitoring systems for production alerting
- Check account balance before attempting to fund
- Use circuit breaker pattern for repeated failures
- Validate environment configuration before operations
- Test error handling paths just like success paths

This example demonstrates robust error handling for external API calls, which is essential for building reliable Algorand applications that gracefully handle failures and provide excellent user experiences even when things go wrong.
