# Fund an Application Account

This example demonstrates how to fund an application account and verify the funding transaction details. Applications need ALGO to cover minimum balance requirements for their operations.

## What This Example Shows

This example teaches you how to:
- Fund an application account using `fundAppAccount()`
- Verify transaction details (type, sender, receiver, amount)
- Check application balances before and after funding
- Understand minimum balance requirements for applications
- Validate that funding transactions are payment type

## Why This Matters

Funding application accounts is essential for smart contract operations:

1. **Minimum Balance**: Apps need 100,000 microAlgos base balance
2. **Box Storage**: Each box costs 2,500 + 400 per byte microAlgos
3. **Asset Creation**: Each asset requires 100,000 microAlgos
4. **Inner Transactions**: Apps need funds for transaction fees
5. **Application Logic**: Some apps hold algos for their operations
6. **Transaction Verification**: Ensuring funds reach the correct destination

Key concepts:
- **Application Address**: Deterministic address based on app ID
- **Payment Transaction**: Funding is done via payment to app address
- **Transaction Verification**: Confirm sender, receiver, and amount
- **Balance Tracking**: Monitor before/after balances
- **Minimum Requirements**: Different operations need different amounts

Common use cases:
- **Post-Deployment Funding**: Fund immediately after creating app
- **Pre-Operation Funding**: Ensure balance before box creation
- **Inner Transaction Preparation**: Fund apps that make inner txns
- **Balance Monitoring**: Track and maintain app account balances
- **Transaction Auditing**: Verify funding transactions completed correctly

## How It Works

### 1. Deploy an Application

Create and deploy an application:

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
- Generates deterministic address
- Starts with 0 ALGO balance
- Ready to receive funding

### 2. Check Initial Balance

Verify starting balance is zero:

```typescript
const accountInfoBefore = await algorand.account.getInformation(appClient.appAddress)
console.log(`Balance: ${accountInfoBefore.balance.algo} ALGO`)
// Output: "Balance: 0 ALGO"
```

Initial state:
- New applications have 0 balance
- Cannot perform funded operations yet
- Need funding before box creation
- Insufficient for inner transactions

### 3. Fund the Application

Send ALGO to the application account:

```typescript
import { algo } from '@algorandfoundation/algokit-utils'

const fundAmount = algo(0.2) // 200,000 microAlgos

const result = await appClient.fundAppAccount({
  amount: fundAmount,
})

console.log(`Transaction ID: ${result.txIds[0]}`)
console.log(`Confirmed in round: ${result.confirmation?.confirmedRound}`)
```

Funding transaction:
- `fundAppAccount()` sends payment to app address
- Returns transaction result with confirmation
- Sender is account specified in app client
- Amount specified in ALGO or microAlgos

### 4. Verify Transaction Details

Confirm transaction properties:

```typescript
import { TransactionType } from 'algosdk'

console.log(`Transaction type: ${result.transaction.type}`)

if (result.transaction.type === TransactionType.pay) {
  console.log('✓ Transaction type is payment')
}

const receiver = result.transaction.payment?.receiver?.toString()
if (receiver === appClient.appAddress.toString()) {
  console.log('✓ Receiver is the application address')
}

const sender = result.transaction.sender.toString()
if (sender === testAccount.addr.toString()) {
  console.log('✓ Sender is the test account')
}
```

Verification checks:
- Transaction type must be payment
- Receiver must be app address
- Sender must be funding account
- Amount matches requested funding

### 5. Check Updated Balance

Verify the funding succeeded:

```typescript
const accountInfoAfter = await algorand.account.getInformation(appClient.appAddress)
console.log(`Balance: ${accountInfoAfter.balance.algo} ALGO`)

const increase = Number(accountInfoAfter.balance.microAlgo - accountInfoBefore.balance.microAlgo)
console.log(`Balance increased by: ${increase} microAlgos`)
```

Balance verification:
- Confirms funds received
- Shows exact increase amount
- Application ready for operations
- Can now create boxes or assets

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
=== Fund an Application Account ===

1. Initializing AlgorandClient...
   Using account: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

2. Deploying application...
App created by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA with ID 1084 via transaction 3QHOYBMEQ2KUZJMEO2FQ4Q4DKIHYEW3BRACXSTUGELD22IQWCLZQ
   Application deployed with ID: 1084
   Application address: XN4EIR7FKI7Y7KJF6WQYHION6UKMJQZOKYG66NOWGGDG7OUL6X6I2GQREE

3. Checking app account balance before funding...
   Balance: 0 ALGO (0 microAlgos)

4. Funding app account...
   Funding amount: 0.2 ALGO (200000 microAlgos)
Sending 200000 µALGO from YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA to XN4EIR7FKI7Y7KJF6WQYHION6UKMJQZOKYG66NOWGGDG7OUL6X6I2GQREE via transaction YCBOFZ7X73YD5WCST2M4ODES4FK3YHBPKI2WX43QK3A7TGHS3HNA
   Transaction ID: YCBOFZ7X73YD5WCST2M4ODES4FK3YHBPKI2WX43QK3A7TGHS3HNA
   Confirmed in round: 85

5. Verifying transaction details...
   Transaction type: pay
   ✓ Transaction type is payment
   ✓ Receiver is the application address
   ✓ Sender is the test account

6. Checking app account balance after funding...
   Balance: 0.2 ALGO (200000 microAlgos)
   Balance increased by: 200000 microAlgos (0.2 ALGO)

✅ App account funded successfully!

📝 Use cases for funding app accounts:
   • Minimum balance: 100,000 microAlgos for app existence
   • Box storage: 2,500 + 400 per byte microAlgos
   • Asset creation: 100,000 microAlgos per asset
   • Inner transactions: Need sufficient balance for fees
   • Application logic: Holding algos for various operations
```

## Common Patterns

### Basic Funding with Verification

```typescript
// Fund and verify
const result = await appClient.fundAppAccount({ amount: algo(0.5) })

// Verify transaction type
if (result.transaction.type === TransactionType.pay) {
  console.log('Payment transaction confirmed')
}
```

### Check and Fund if Needed

```typescript
async function ensureFunded(appClient: AppClient, minBalance: AlgoAmount) {
  const info = await algorand.account.getInformation(appClient.appAddress)

  if (info.balance.microAlgo < minBalance.microAlgo) {
    const needed = minBalance.microAlgo - info.balance.microAlgo
    await appClient.fundAppAccount({ amount: AlgoAmount.MicroAlgo(needed) })
    return true
  }

  return false
}

const wasFunded = await ensureFunded(appClient, algo(1))
if (wasFunded) {
  console.log('Application funded')
}
```

### Fund with Transaction Verification

```typescript
const fundAmount = algo(0.2)
const result = await appClient.fundAppAccount({ amount: fundAmount })

// Verify all transaction properties
console.log('Transaction Verification:')
console.log(`  ID: ${result.txIds[0]}`)
console.log(`  Type: ${result.transaction.type}`)
console.log(`  Sender: ${result.transaction.sender.toString()}`)
console.log(`  Receiver: ${result.transaction.payment?.receiver?.toString()}`)
console.log(`  Amount: ${result.transaction.payment?.amount}`)
console.log(`  Round: ${result.confirmation?.confirmedRound}`)
```

### Track Balance Changes

```typescript
const before = await algorand.account.getInformation(appClient.appAddress)

await appClient.fundAppAccount({ amount: algo(1) })

const after = await algorand.account.getInformation(appClient.appAddress)
const increase = Number(after.balance.microAlgo - before.balance.microAlgo)

console.log(`Balance increased by ${increase / 1_000_000} ALGO`)
```

### Fund for Specific Operations

```typescript
// Calculate required funding for boxes
function calculateBoxFunding(numBoxes: number, boxSize: number): AlgoAmount {
  const costPerBox = 2500 + (boxSize * 400)
  return AlgoAmount.MicroAlgo(numBoxes * costPerBox)
}

const boxFunding = calculateBoxFunding(10, 64)
await appClient.fundAppAccount({ amount: boxFunding })
```

### Verify Receiver Address

```typescript
const result = await appClient.fundAppAccount({ amount: algo(0.2) })

const receiver = result.transaction.payment?.receiver?.toString()
const expected = appClient.appAddress.toString()

if (receiver !== expected) {
  throw new Error(`Unexpected receiver: ${receiver}, expected: ${expected}`)
}

console.log('✓ Funds sent to correct application address')
```

### Fund Multiple Applications

```typescript
const apps = [appClient1, appClient2, appClient3]
const fundAmount = algo(0.5)

for (const app of apps) {
  const result = await app.fundAppAccount({ amount: fundAmount })
  console.log(`Funded app ${app.appId}: ${result.txIds[0]}`)
}
```

## Best Practices

1. **Verify Transaction Details**
   ```typescript
   // Good: Verify all transaction properties
   const result = await appClient.fundAppAccount({ amount: algo(1) })

   if (result.transaction.type !== TransactionType.pay) {
     throw new Error('Expected payment transaction')
   }

   if (result.transaction.payment?.receiver?.toString() !== appClient.appAddress.toString()) {
     throw new Error('Incorrect receiver address')
   }

   // Avoid: Assuming transaction is correct
   await appClient.fundAppAccount({ amount: algo(1) })
   // No verification - could miss errors
   ```

2. **Track Balance Changes**
   ```typescript
   // Good: Verify balance increased by expected amount
   const before = await algorand.account.getInformation(appClient.appAddress)
   await appClient.fundAppAccount({ amount: algo(1) })
   const after = await algorand.account.getInformation(appClient.appAddress)

   const increase = Number(after.balance.microAlgo - before.balance.microAlgo)
   if (increase !== 1_000_000) {
     console.warn(`Unexpected balance change: ${increase}`)
   }

   // Avoid: Not verifying balance changed
   await appClient.fundAppAccount({ amount: algo(1) })
   // No verification that funds were received
   ```

3. **Use Appropriate Amounts**
   ```typescript
   // Good: Calculate exact need
   const boxCost = 2500 + (64 * 400) // 2,500 + 400 per byte
   const numBoxes = 10
   const required = AlgoAmount.MicroAlgo(boxCost * numBoxes)
   await appClient.fundAppAccount({ amount: required })

   // Avoid: Arbitrary amounts
   await appClient.fundAppAccount({ amount: algo(10) })
   // May be too much or too little
   ```

4. **Handle Funding Errors**
   ```typescript
   // Good: Handle errors gracefully
   try {
     await appClient.fundAppAccount({ amount: algo(1) })
     console.log('Funding successful')
   } catch (error) {
     if (error.message.includes('insufficient balance')) {
       console.error('Sender has insufficient funds')
     } else {
       throw error
     }
   }

   // Useful: Log transaction ID for tracking
   const result = await appClient.fundAppAccount({ amount: algo(1) })
   console.log(`Funding transaction: ${result.txIds[0]}`)
   ```

5. **Verify Before Operations**
   ```typescript
   // Good: Ensure funding before operations
   const minRequired = algo(0.5)
   const info = await algorand.account.getInformation(appClient.appAddress)

   if (info.balance.algo < minRequired.algo) {
     await appClient.fundAppAccount({ amount: minRequired })
   }

   // Now safe to perform operations
   await appClient.send.call({ method: 'createBox' })

   // Avoid: Assuming app has funds
   await appClient.send.call({ method: 'createBox' })
   // May fail if app is unfunded
   ```

## Key Takeaways

- Use `fundAppAccount()` to send ALGO to application addresses
- Applications start with 0 ALGO balance after deployment
- Minimum balance: 100,000 microAlgos for app existence
- Box storage: 2,500 + 400 per byte microAlgos per box
- Asset creation: 100,000 microAlgos per asset
- Always verify transaction details (type, sender, receiver, amount)
- Check balances before and after funding
- Transaction type should be `TransactionType.pay`
- Receiver should match application address
- Sender should match funding account
- Fund before operations that require balance

This example demonstrates essential application funding with comprehensive transaction verification for safe and reliable smart contract operations.
