# Fund Application Account

This example demonstrates how to fund an application's account with ALGO to cover minimum balance requirements for state storage.

## What This Example Shows

This example teaches you how to:
- Fund an application account to meet minimum balance requirements
- Use the `fundAppAccount()` convenience method
- Check application account balances before and after funding
- Understand why applications need ALGO funding
- Work with application addresses

## Why This Matters

Application accounts need ALGO to function properly:

1. **Minimum Balance Requirements**: Apps need ALGO for state storage
2. **Box Storage Costs**: Each box requires additional minimum balance
3. **Inner Transactions**: Apps making transactions need funds for fees
4. **Global/Local State**: State variables increase minimum balance
5. **Transaction Fees**: Apps executing complex logic need fee reserves
6. **Application Lifecycle**: Funding enables full application functionality

Key concepts:
- **Application Address**: Every app has a deterministic account address
- **Minimum Balance**: Apps need 0.1 ALGO base + additional for storage
- **Box Storage**: Each box adds 0.0025 ALGO + 0.0004 ALGO per byte
- **State Storage**: Global/local state increases requirements
- **fundAppAccount()**: Convenient method to send payment to app address

Common use cases:
- **Initial Funding**: Fund app immediately after deployment
- **Box Creation**: Ensure sufficient balance before creating boxes
- **Inner Transactions**: Fund apps that make inner transactions
- **State Expansion**: Add funds when increasing storage
- **Maintenance**: Top up app balances as needed

## How It Works

### 1. Deploy an Application

First, deploy an application to get its address:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { readFileSync } from 'fs'

const algorand = AlgorandClient.defaultLocalNet()
const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

const appSpec = JSON.parse(readFileSync('artifacts/application.json', 'utf-8'))

const appFactory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: testAccount.addr,
})

const { appClient } = await appFactory.send.bare.create()
console.log(`Application ID: ${appClient.appId}`)
console.log(`Application address: ${appClient.appAddress}`)
```

Application deployment:
- Creates new application instance
- Assigns deterministic address
- Initial balance is 0 ALGO
- Needs funding for operations

### 2. Check Initial Balance

Verify the application starts with zero balance:

```typescript
const initialInfo = await algorand.account.getInformation(appClient.appAddress)
console.log(`Initial balance: ${initialInfo.balance.algo} ALGO`)
// Output: "Initial balance: 0 ALGO"
```

Initial state:
- New apps have 0 ALGO balance
- Cannot create boxes without funding
- Cannot make inner transactions without fees
- Need funding before operations

### 3. Fund the Application Account

Use `fundAppAccount()` to send ALGO:

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

const fundAmount = algo(2) // Fund with 2 ALGO

const result = await appClient.fundAppAccount({
  amount: fundAmount,
})

console.log(`Transaction ID: ${result.txIds[0]}`)
console.log(`Confirmed in round: ${result.confirmation?.confirmedRound}`)
```

Funding details:
- `fundAppAccount()` is convenience method
- Sends payment transaction to app address
- Sender is the account specified in app client
- Returns transaction result with confirmation

### 4. Verify Updated Balance

Confirm the funding succeeded:

```typescript
const updatedInfo = await algorand.account.getInformation(appClient.appAddress)
console.log(`New balance: ${updatedInfo.balance.algo} ALGO`)

const increase = Number(updatedInfo.balance.microAlgo - initialInfo.balance.microAlgo) / 1_000_000
console.log(`Increase: ${increase} ALGO`)
```

Balance verification:
- Check updated application balance
- Calculate exact increase
- Confirm funds received
- Application ready for operations

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed
- Docker Desktop running
- LocalNet running (`algokit localnet start`)
- Test account with funds

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
=== Fund Application Account Example ===

1. Initializing AlgorandClient and account...
   Using account: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

2. Deploying application...
App created by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA with ID 1080 via transaction J2YAYIN5TFGCEXVV5WBVWATO4U7YNSFGTUIXIWC7XOR5EF7B62XQ
   Application deployed with ID: 1080
   Application address: H4AXV7RJSWX7RSBFZU7MLPJ7LOJXMXMZM4GF65A6FT23VFWH7FGJGGNC2A

3. Checking initial application account balance...
   Initial balance: 0 ALGO

4. Funding application account...
   Funding amount: 2 ALGO (2000000 microAlgos)
Sending 2000000 µALGO from YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA to H4AXV7RJSWX7RSBFZU7MLPJ7LOJXMXMZM4GF65A6FT23VFWH7FGJGGNC2A via transaction KZJBNRUEYIP7IIJH7FPKVF5KGTU4DZMFR5B5PEMYHNCJK2ZIEJRQ
   Transaction ID: KZJBNRUEYIP7IIJH7FPKVF5KGTU4DZMFR5B5PEMYHNCJK2ZIEJRQ
   Confirmed in round: 81

5. Verifying updated application account balance...
   New balance: 2 ALGO
   Increase: 2 ALGO

✅ Successfully funded application account!

📝 Key Takeaways:
   • Applications have their own account address
   • Application accounts need ALGO for minimum balance requirements
   • fundAppAccount() sends a payment to the application address
   • Useful for covering costs of box storage, inner transactions, etc.
```

## Common Patterns

### Basic Funding After Deployment

```typescript
// Deploy app
const { appClient } = await appFactory.send.bare.create()

// Fund immediately
await appClient.fundAppAccount({ amount: algo(1) })
```

### Fund Before Box Creation

```typescript
// Calculate required balance for boxes
const boxCount = 10
const boxSize = 100
const boxCost = 0.0025 + (boxSize * 0.0004)
const totalCost = boxCount * boxCost

// Fund app with enough for all boxes
await appClient.fundAppAccount({ amount: algo(totalCost) })

// Now safe to create boxes
```

### Check Balance Before Operations

```typescript
async function ensureAppFunded(appClient: AppClient, minBalance: AlgoAmount) {
  const info = await algorand.account.getInformation(appClient.appAddress)

  if (info.balance.microAlgo < minBalance.microAlgo) {
    const needed = minBalance.microAlgo - info.balance.microAlgo
    await appClient.fundAppAccount({ amount: AlgoAmount.MicroAlgo(needed) })
    console.log(`Funded app with ${needed} microAlgos`)
  }
}
```

### Fund for Inner Transactions

```typescript
// App makes inner transactions, needs fee reserves
const innerTxCount = 5
const feeReserve = algo(0.001 * innerTxCount)

await appClient.fundAppAccount({ amount: feeReserve })
```

### Fund with Custom Sender

```typescript
const appClient = algorand.client.getAppClientById({
  appId: 123,
  appSpec,
  sender: customSender,
})

// Funds come from customSender
await appClient.fundAppAccount({ amount: algo(1) })
```

### Batch Fund Multiple Apps

```typescript
const apps = [appClient1, appClient2, appClient3]

for (const app of apps) {
  await app.fundAppAccount({ amount: algo(0.5) })
  console.log(`Funded app ${app.appId}`)
}
```

### Fund with Transaction Note

```typescript
await appClient.fundAppAccount({
  amount: algo(1),
  note: 'Initial funding for box storage',
})
```

### Calculate Minimum Required

```typescript
function calculateMinBalance(globalState: number, localState: number, boxes: number, boxSize: number): AlgoAmount {
  const baseBalance = 0.1 // Base 100,000 microAlgos
  const globalStateCost = globalState * 0.00035
  const localStateCost = localState * 0.00028
  const boxCost = boxes * (0.0025 + boxSize * 0.0004)

  const total = baseBalance + globalStateCost + localStateCost + boxCost
  return algo(total)
}

const required = calculateMinBalance(10, 5, 20, 64)
await appClient.fundAppAccount({ amount: required })
```

### Manual Payment (Alternative)

```typescript
// Equivalent to fundAppAccount(), but manual
const payment = await algorand.createTransaction.payment({
  sender: testAccount,
  receiver: appClient.appAddress,
  amount: algo(1),
})

await algorand.send.payment({
  sender: testAccount,
  receiver: appClient.appAddress,
  amount: algo(1),
})
```

## Best Practices

1. **Fund Immediately After Deployment**
   ```typescript
   // Good: Fund right after creating app
   const { appClient } = await appFactory.send.bare.create()
   await appClient.fundAppAccount({ amount: algo(1) })

   // Avoid: Leaving app unfunded
   const { appClient } = await appFactory.send.bare.create()
   // App can't perform operations without funding
   ```

2. **Calculate Required Minimum**
   ```typescript
   // Good: Calculate actual need
   const boxStorageCost = 0.0025 + (boxSize * 0.0004)
   const requiredBalance = algo(boxStorageCost * boxCount)
   await appClient.fundAppAccount({ amount: requiredBalance })

   // Avoid: Arbitrary amounts
   await appClient.fundAppAccount({ amount: algo(10) }) // May be too much or too little
   ```

3. **Check Balance Before Operations**
   ```typescript
   // Good: Verify sufficient balance
   const info = await algorand.account.getInformation(appClient.appAddress)
   if (info.balance.algo < 1) {
     await appClient.fundAppAccount({ amount: algo(1) })
   }

   // Avoid: Assuming app has funds
   await appClient.send.call({ method: 'createBox' }) // May fail if underfunded
   ```

4. **Add Notes for Tracking**
   ```typescript
   // Good: Document funding purpose
   await appClient.fundAppAccount({
     amount: algo(2),
     note: 'Funding for 50 user boxes',
   })

   // Useful: Track funding in logs
   console.log(`Funded ${appClient.appId} with ${amount.algo} ALGO for ${purpose}`)
   ```

5. **Handle Funding Errors**
   ```typescript
   // Good: Handle potential errors
   try {
     await appClient.fundAppAccount({ amount: algo(1) })
   } catch (error) {
     if (error.message.includes('balance')) {
       console.error('Sender has insufficient balance')
     } else {
       throw error
     }
   }
   ```

## Understanding Minimum Balance

### Base Requirements

- **New App**: 0.1 ALGO (100,000 microAlgos)
- **Per Global State Variable**: ~0.00035 ALGO (350 microAlgos)
- **Per Local State Variable**: ~0.00028 ALGO (280 microAlgos)
- **Per Box**: 0.0025 ALGO + (0.0004 ALGO × box size in bytes)

### Example Calculations

```typescript
// App with:
// - 10 global state variables
// - 5 local state variables
// - 20 boxes of 64 bytes each

const baseBalance = 0.1
const globalState = 10 * 0.00035
const localState = 5 * 0.00028
const boxes = 20 * (0.0025 + (64 * 0.0004))

const total = baseBalance + globalState + localState + boxes
// Total: ~0.657 ALGO minimum
```

## Key Takeaways

- Use `fundAppAccount()` to send ALGO to application addresses
- Applications start with 0 ALGO balance after deployment
- Minimum balance depends on state storage and box usage
- Box storage requires: 0.0025 + (0.0004 × box size) ALGO per box
- Fund apps before they need to create storage or make inner transactions
- Check application balance with `account.getInformation(appAddress)`
- Application address is deterministic based on app ID
- `fundAppAccount()` is equivalent to sending payment to app address
- Fund generously to avoid operation failures
- Track funding with transaction notes for clarity

This example demonstrates essential application funding patterns for enabling full smart contract functionality on Algorand.
