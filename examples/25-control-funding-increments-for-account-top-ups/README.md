# Control Funding Increments for Account Top-ups

This example demonstrates how to use the `minFundingIncrement` option when funding accounts to optimize for transaction fees and efficiency. This feature helps avoid many small funding transactions by ensuring meaningful amounts are added each time.

## What This Example Shows

This example teaches you how to:
- Use `minFundingIncrement` option with `ensureFunded()`
- Control the minimum amount added when topping up accounts
- Optimize funding operations to reduce transaction count
- Check account balances before and after funding
- Understand the difference between minimum balance and funding increment

## Why This Matters

Controlling funding increments is crucial for efficient account management:

1. **Reduced Transaction Fees**: Fewer transactions mean lower overall fees
2. **Better Resource Management**: Avoid many small funding operations
3. **Automation Optimization**: Essential for automated funding systems
4. **Cost Efficiency**: Minimize fees in production environments
5. **Network Efficiency**: Reduce blockchain congestion

Key concepts:
- **minSpendingBalance**: The minimum balance the account must have
- **minFundingIncrement**: The minimum amount to add when funding is needed
- **ensureFunded()**: Automatically tops up accounts when below threshold
- **Transaction Optimization**: Balancing frequency vs. amount

Common use cases:
- **Automated Systems**: Keep service accounts funded efficiently
- **Multi-Account Management**: Fund many accounts with optimal amounts
- **Production Applications**: Minimize operational costs
- **Smart Contract Operations**: Ensure contract accounts stay funded
- **Developer Tools**: Optimize test account funding

## How It Works

The example demonstrates funding an account with minimum increment control:

### 1. Initialize and Create Accounts

Set up the Algorand client and create accounts:

```typescript
const algorand = AlgorandClient.defaultLocalNet()

const fundingAccount = await algorand.account.fromEnvironment('DISPENSER')
const targetAccount = await algorand.account.random()
```

### 2. Give Initial Funding

Start with a small balance (0.1 ALGO):

```typescript
await algorand.send.payment({
  sender: fundingAccount.addr,
  receiver: targetAccount.addr,
  amount: microAlgo(100_000)  // 0.1 ALGO
})

const accountInfo = await algorand.account.getInformation(targetAccount.addr)
console.log(`Initial balance: ${accountInfo.balance.microAlgos} microAlgos`)
// Output: Initial balance: 100000 microAlgos (0.1 ALGO)
```

### 3. Use ensureFunded with minFundingIncrement

Ensure the account has funds with a minimum increment:

```typescript
const result = await algorand.account.ensureFunded(
  targetAccount.addr,        // Account to fund
  fundingAccount.addr,       // Funding source
  microAlgo(1),             // Minimum spending balance (very low)
  {
    minFundingIncrement: algo(1),  // Add at least 1 ALGO when funding
  }
)
```

**What happens:**
- Account has 100,000 microAlgos (0.1 ALGO)
- We want at least 1 microAlgo minimum (already satisfied)
- But wait - the account needs more than 100,000 to maintain operations
- When funding is triggered, it adds **at least 1 ALGO** (not just 1 microAlgo)
- This prevents many small top-ups in the future

### 4. Check Funding Result

Inspect what was added:

```typescript
if (result) {
  console.log(`Amount added: ${result.amountFunded.algos} ALGO`)
  console.log(`Transaction ID: ${result.transaction.txID()}`)
}

const newInfo = await algorand.account.getInformation(targetAccount.addr)
console.log(`Final balance: ${newInfo.balance.algos} ALGO`)
// Output: Final balance: 1.1 ALGO (initial 0.1 + added 1.0)
```

## Understanding minFundingIncrement

The `minFundingIncrement` option controls funding behavior:

### Without minFundingIncrement

```typescript
// Account needs 1000 more microAlgos
await algorand.account.ensureFunded(
  targetAddr,
  funderAddr,
  microAlgo(100_000)
)

// Result: Adds exactly 1000 microAlgos (the minimum needed)
// Problem: May need to fund again very soon
```

### With minFundingIncrement

```typescript
// Account needs 1000 more microAlgos
await algorand.account.ensureFunded(
  targetAddr,
  funderAddr,
  microAlgo(100_000),
  { minFundingIncrement: algo(1) }  // At least 1 ALGO
)

// Result: Adds 1 ALGO (1,000,000 microAlgos) even though only 1000 needed
// Benefit: Account now has buffer for many future operations
```

### The Math

```
minSpendingBalance = 150,000 microAlgos
Current balance = 100,000 microAlgos
Amount needed = 50,000 microAlgos

Without minFundingIncrement:
  → Funds exactly 50,000 microAlgos

With minFundingIncrement = 1 ALGO (1,000,000 microAlgos):
  → Funds 1,000,000 microAlgos (much more than the 50,000 needed)
  → Next top-up won't be needed for a while
```

## Use Cases

### Automated Service Accounts

```typescript
// Keep a service account funded with meaningful increments
setInterval(async () => {
  await algorand.account.ensureFunded(
    serviceAccount.addr,
    dispenserAccount.addr,
    algo(10),  // Need at least 10 ALGO for operations
    {
      minFundingIncrement: algo(100)  // But add 100 ALGO when needed
    }
  )
}, 60000)  // Check every minute
```

**Why this helps:**
- Service accounts process many transactions
- Without increment: May need funding multiple times per day
- With increment: Fund once, runs for days/weeks

### Multi-Account Management

```typescript
// Fund many accounts efficiently
for (const account of accounts) {
  await algorand.account.ensureFunded(
    account.addr,
    treasuryAccount.addr,
    algo(1),   // Minimum 1 ALGO
    {
      minFundingIncrement: algo(10)  // Add 10 ALGO at a time
    }
  )
}
```

**Benefit:** Each account gets a meaningful buffer, reducing overall transaction count.

### Smart Contract Accounts

```typescript
// Keep a smart contract account funded
await algorand.account.ensureFunded(
  appAccountAddress,
  fundingAccount.addr,
  algo(5),  // Contract needs 5 ALGO minimum
  {
    minFundingIncrement: algo(50)  // Add 50 ALGO buffer
  }
)
```

**Why:** Smart contracts often need funds for inner transactions. A good buffer prevents failures.

## Prerequisites

- Node.js and npm installed
- AlgoKit installed (`pip install algokit` or `pipx install algokit`)
- Docker installed and running
- LocalNet running (`algokit localnet start`)

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
Creating test accounts...

Funding target account with initial amount (0.1 ALGO)...
Initial balance: 100000 microAlgos (0.1 ALGO)

Ensuring account has at least 1 microAlgo with 1 ALGO minimum increment...

✅ Account funded!
Amount added: 1 ALGO (1000000 microAlgos)
Transaction ID: XPJKKMHI6QVZNACJPP3OSKZZDYNLD73VSOVNZAFOCJ56YAQLFUMA

Final balance: 1100000 microAlgos (1.1 ALGO)

📝 Key Takeaway:
Using minFundingIncrement helps optimize funding by ensuring meaningful amounts
are added each time, reducing the total number of funding transactions needed.
```

## Common Patterns

### Optimal Increment for Service Accounts

```typescript
// Calculate based on transaction rate
const transactionsPerDay = 1000
const feePerTransaction = 0.001  // ALGO
const daysOfBuffer = 7

const optimalIncrement = transactionsPerDay * feePerTransaction * daysOfBuffer

await algorand.account.ensureFunded(
  serviceAccount.addr,
  fundingAccount.addr,
  algo(1),
  {
    minFundingIncrement: algo(optimalIncrement)  // Fund for 7 days
  }
)
```

### Different Increments for Different Environments

```typescript
const isProduction = process.env.NODE_ENV === 'production'

await algorand.account.ensureFunded(
  account.addr,
  funder.addr,
  algo(1),
  {
    minFundingIncrement: isProduction
      ? algo(100)   // Larger increment in production
      : algo(10)    // Smaller increment for testing
  }
)
```

### Conditional Funding with Monitoring

```typescript
const result = await algorand.account.ensureFunded(
  targetAccount.addr,
  fundingAccount.addr,
  algo(5),
  {
    minFundingIncrement: algo(50)
  }
)

if (result) {
  // Log funding event for monitoring
  console.log(`Funded ${targetAccount.addr}`)
  console.log(`Added: ${result.amountFunded.algos} ALGO`)

  // Alert if funding is happening too frequently
  await notifyFundingEvent(targetAccount.addr, result.amountFunded)
}
```

## Optimization Strategies

### Calculate Optimal Increment

Consider these factors when choosing increment size:

1. **Transaction Volume**: Higher volume = larger increment
2. **Transaction Fees**: Account for typical fee costs
3. **Buffer Period**: How long between funding checks?
4. **Funding Cost**: Balance between efficiency and capital lock-up

**Example calculation:**
```typescript
// Service account processes 100 txns/day @ 0.001 ALGO each
const dailyCost = 100 * 0.001  // 0.1 ALGO per day
const bufferDays = 30           // Want 30-day buffer
const optimalIncrement = dailyCost * bufferDays  // 3 ALGO

await algorand.account.ensureFunded(
  serviceAccount.addr,
  fundingAccount.addr,
  algo(1),
  {
    minFundingIncrement: algo(optimalIncrement)
  }
)
```

### Monitoring and Alerting

```typescript
async function fundWithMonitoring(accountAddr: string) {
  const result = await algorand.account.ensureFunded(
    accountAddr,
    fundingAccount.addr,
    algo(5),
    {
      minFundingIncrement: algo(50)
    }
  )

  if (result) {
    // Track funding frequency
    const lastFunded = getFundingTimestamp(accountAddr)
    const hoursSinceLastFunding = (Date.now() - lastFunded) / (1000 * 60 * 60)

    if (hoursSinceLastFunding < 24) {
      console.warn(`Account ${accountAddr} funded twice in 24h - consider increasing increment`)
    }

    saveFundingTimestamp(accountAddr, Date.now())
  }
}
```

## Error Handling

**Insufficient Funds in Funding Account**
```typescript
try {
  await algorand.account.ensureFunded(
    targetAccount.addr,
    fundingAccount.addr,
    algo(1),
    { minFundingIncrement: algo(100) }
  )
} catch (error) {
  console.error('Funding failed - check funding account balance')
  // Funding account needs at least 100 ALGO + fees
}
```

**Account Already Funded**
```typescript
const result = await algorand.account.ensureFunded(
  targetAccount.addr,
  fundingAccount.addr,
  algo(1),
  { minFundingIncrement: algo(50) }
)

if (!result) {
  console.log('Account already has sufficient funds')
  // No transaction was sent
}
```

## Key Takeaways

- Use `minFundingIncrement` to control the minimum amount added when funding accounts
- This option helps optimize funding by reducing the number of small transactions
- Essential for automated systems that frequently check and fund accounts
- Calculate increment based on transaction volume and desired buffer period
- Larger increments mean fewer funding transactions but more capital locked up
- The option only applies when funding is actually needed
- Without this option, `ensureFunded()` adds only the minimum amount needed
- Particularly useful for service accounts, smart contracts, and multi-account systems
- Monitor funding frequency to optimize increment size over time
- Balance between operational efficiency and capital efficiency
- Production systems should use larger increments than test environments
- Consider transaction fees and volume when choosing increment size

