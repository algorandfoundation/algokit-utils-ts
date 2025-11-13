# Automated Account Funding Using Environment Dispenser

This example demonstrates how to use the environment-configured dispenser account to automatically fund accounts, which is extremely useful for testing, development workflows, and CI/CD pipelines.

## What This Example Shows

This example teaches you how to:
- Use `algorand.account.dispenserFromEnvironment()` to get the configured dispenser account
- Use `algorand.account.ensureFundedFromEnvironment()` to automatically fund accounts
- Configure minimum balance and funding increments
- Verify account balances after funding
- Understand the dispenser pattern for automated funding

## Why This Matters

The environment dispenser pattern is crucial for development and testing because:

1. **Automation**: No need to manually specify funding sources in your code
2. **Configuration**: Dispenser is configured through environment variables, making it flexible
3. **Testing**: Perfect for automated testing and CI/CD pipelines
4. **Convenience**: Simplifies account funding in development workflows
5. **Environment-Aware**: Works seamlessly across LocalNet, TestNet, and custom configurations

Common use cases:
- **Automated Testing**: Fund test accounts without hardcoding funding sources
- **CI/CD Pipelines**: Automatically fund accounts in test environments
- **Development**: Quickly fund accounts during development
- **Integration Tests**: Ensure accounts have sufficient balance for testing

Benefits over manual funding:
- No need to track dispenser account details in code
- Configuration through environment variables
- Consistent funding behavior across environments
- Easier to maintain and update funding sources

## How It Works

The example demonstrates the complete automated funding flow:

### 1. Get Dispenser from Environment
```typescript
const dispenser = await algorand.account.dispenserFromEnvironment()
console.log(`Dispenser address: ${dispenser.addr}`)
```

The dispenser account is automatically configured based on your environment (LocalNet, TestNet, etc.).

### 2. Create a New Account to Fund
```typescript
const newAccount = algorand.account.random()
console.log(`New account address: ${newAccount.addr}`)
```

### 3. Fund the Account Automatically
```typescript
const result = await algorand.account.ensureFundedFromEnvironment(
  newAccount.addr,
  microAlgos(1),  // Minimum balance required
  {
    minFundingIncrement: algos(1),  // Fund in 1 ALGO increments
  }
)
```

Key parameters:
- **Account address**: The account to fund
- **Minimum balance**: The minimum balance the account needs (1 microAlgo in this example)
- **minFundingIncrement**: The minimum amount to fund if balance is below minimum (1 ALGO in this example)

The method automatically:
- Checks if the account needs funding
- Uses the dispenser from environment
- Sends the funding transaction
- Returns the result with transaction details

### 4. Verify the Funding
```typescript
if (result) {
  console.log(`Transaction ID: ${result.txIds[0]}`)
  console.log(`Amount funded: ${result.amountFunded.algos} ALGO`)
}

const accountInfo = await algorand.account.getInformation(newAccount.addr)
console.log(`Final balance: ${accountInfo.balance.algos} ALGO`)
```

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
=== Automated Account Funding with Dispenser ====

1. Getting dispenser account from environment...
Dispenser address: VCMJKWOYF4HXDXDXJ4A2QHXQG25F3CSXHXW5YXPFWX5P5ZQXPFWX5P5ZQ

2. Creating a new random account...
New account address: ABC123...XYZ

3. Funding account using environment dispenser...
   Minimum balance: 1 microAlgo
   Minimum funding increment: 1 ALGO

✅ Funding successful!
   Transaction ID: ABC123...
   Amount funded: 1 ALGO

4. Verifying account balance...
   Final balance: 1 ALGO (1000000 microAlgos)

📝 Key Takeaways:
   • ensureFundedFromEnvironment automatically uses the configured dispenser
   • No need to manually manage funding source accounts
   • Perfect for automated testing and development workflows
   • Works seamlessly with LocalNet, TestNet, and custom configurations
```

## Key Takeaways

- `dispenserFromEnvironment()` gets the dispenser account configured in your environment
- `ensureFundedFromEnvironment()` automatically funds accounts using the environment dispenser
- No need to hardcode funding source accounts in your code
- The dispenser is configured through environment variables (automatically in LocalNet)
- Perfect for automated testing, CI/CD pipelines, and development workflows
- `minFundingIncrement` controls how much to fund when balance is below minimum
- The method returns transaction details including `txIds` and `amountFunded`
- Account balance can be checked using `algorand.account.getInformation()`
- Works seamlessly across LocalNet, TestNet, and custom configurations
- The dispenser pattern abstracts away funding source configuration
