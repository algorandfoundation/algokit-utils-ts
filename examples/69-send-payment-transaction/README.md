# Send Payment Transaction

Demonstrates how to send a basic payment transaction on Algorand, including balance verification and fee calculation.

## What This Example Shows

1. **Account Creation** - Creating random accounts for testing
2. **Account Funding** - Funding accounts using the LocalNet dispenser
3. **Payment Transaction** - Sending ALGO from one account to another
4. **Balance Checking** - Retrieving account balances before and after
5. **Fee Calculation** - Understanding transaction fees (1000 microAlgo)
6. **Transaction Confirmation** - Verifying transaction was confirmed
7. **Balance Verification** - Confirming balances changed correctly

## Why This Matters

Payment transactions are essential for:
- **ALGO Transfers**: Moving funds between accounts
- **Account Funding**: Initializing new accounts
- **Fee Payments**: Understanding transaction costs
- **Balance Management**: Tracking account balances
- **Transaction Basics**: Foundation for all Algorand operations
- **Testing**: Creating test scenarios with funded accounts

## How It Works

### 1. Create Accounts

```typescript
const algorand = AlgorandClient.defaultLocalNet()

// Create two random accounts
const alice = await algorand.account.random()
const bob = await algorand.account.random()

console.log(`Alice's address: ${alice.addr.toString()}`)
console.log(`Bob's address: ${bob.addr.toString()}`)
```

**Why**: Random accounts are perfect for testing and examples.

### 2. Fund Accounts

```typescript
// Get the LocalNet dispenser
const dispenser = await algorand.account.localNetDispenser()

// Fund Alice with 10 ALGO
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: alice.addr,
  amount: algo(10),
})

// Fund Bob with 5 ALGO
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: bob.addr,
  amount: algo(5),
})
```

**Why**: New accounts need funds before they can send transactions.

### 3. Check Balances Before

```typescript
const alicePreInfo = await algorand.account.getInformation(alice.addr)
const bobPreInfo = await algorand.account.getInformation(bob.addr)
const alicePreBalance = alicePreInfo.balance // in microAlgo
const bobPreBalance = bobPreInfo.balance

console.log('Balances before payment:')
console.log(`  Alice: ${alicePreBalance.toLocaleString()} microAlgo`)
console.log(`  Bob:   ${bobPreBalance.toLocaleString()} microAlgo`)
```

**Why**: Recording balances before allows you to verify the transaction effect.

### 4. Send Payment

```typescript
const paymentResult = await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: microAlgo(1), // 1 microAlgo
})

console.log(`✓ Payment confirmed in round ${paymentResult.confirmation.confirmedRound}`)
console.log(`  Transaction ID: ${paymentResult.transaction.txID()}`)
```

**Key Points**:
- Sender pays the 1000 microAlgo transaction fee
- Receiver gets exactly the amount specified
- Transaction ID uniquely identifies the transaction

### 5. Verify Balances After

```typescript
const alicePostInfo = await algorand.account.getInformation(alice.addr)
const bobPostInfo = await algorand.account.getInformation(bob.addr)
const alicePostBalance = alicePostInfo.balance
const bobPostBalance = bobPostInfo.balance

// Verify expected changes
const expectedAliceBalance = Number(alicePreBalance) - 1 - 1000 // amount + fee
const expectedBobBalance = Number(bobPreBalance) + 1 // amount received

if (Number(alicePostBalance) === expectedAliceBalance &&
    Number(bobPostBalance) === expectedBobBalance) {
  console.log('✓ Payment successful! Balances updated correctly.')
}
```

**Why**: Verification ensures the transaction had the expected effect.

## Prerequisites

- AlgoKit installed
- Docker Desktop (for LocalNet)
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
=== Basic Payment Transaction Example ===

Alice's address: SKNIKNPABQ6J57WA57LODF7GFXVP56NXKUI32NKN2FOUHU5FXJYJLX2RXI
Bob's address: DEK4KUUFHF6CAEMLHXGZDUCSP5CQXTEUN5MSJKVA2HGJKGEYVIZT2GZLGI

Funding Alice with 10 ALGO...
Funding Bob with 5 ALGO...

Balances before payment:
  Alice: 10,000,000 microAlgo (10 ALGO)
  Bob:   5,000,000 microAlgo (5 ALGO)

Sending 1 microAlgo from Alice to Bob...
✓ Payment transaction confirmed in round 145
  Transaction ID: 6UIZZG6CPYFE73KCIRAKSRS2FOIF4YOVXY3E66SLJVEWAMH3TP3Q

Balances after payment:
  Alice: 9,998,999 microAlgo (9.998999 ALGO)
  Bob:   5,000,001 microAlgo (5.000001 ALGO)

Balance changes:
  Alice: -1001 microAlgo (sent 1 + paid 1000 fee = -1001 total)
  Bob:   +1 microAlgo (received)

✓ Payment successful! Balances updated correctly.
✓ Transaction fee of 1000 microAlgo (0.001 ALGO) was paid by sender.

✅ Example completed successfully
```

## Key Concepts

### Transaction Fees

Every transaction on Algorand requires a minimum fee:
- **Minimum Fee**: 1000 microAlgo (0.001 ALGO)
- **Paid by**: Sender
- **Deducted**: From sender's balance automatically
- **Not Received**: By receiver (only amount sent is received)

**Example**:
```
Alice sends 1 microAlgo to Bob
Alice's balance change: -1 (amount) - 1000 (fee) = -1001 microAlgo
Bob's balance change: +1 microAlgo
```

### Amount Units

Algorand uses microAlgo as the base unit:
- **1 ALGO** = 1,000,000 microAlgo
- **0.001 ALGO** = 1,000 microAlgo (typical transaction fee)
- **0.000001 ALGO** = 1 microAlgo (smallest unit)

**Helper functions**:
```typescript
algo(10)       // 10 ALGO = 10,000,000 microAlgo
microAlgo(1)   // 1 microAlgo
```

### Balance Checking

```typescript
const accountInfo = await algorand.account.getInformation(address)
const balance = accountInfo.balance // in microAlgo (bigint)

// Convert to ALGO
const algoBalance = Number(balance) / 1_000_000
```

### Transaction Result

```typescript
const result = await algorand.send.payment({...})

// Access confirmation
result.confirmation.confirmedRound // Block number

// Access transaction
result.transaction.txID() // Transaction ID (string)
```

## Common Patterns

### 1. Send Fixed Amount

```typescript
// Send 5 ALGO
await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(5),
})
```

### 2. Send All Funds (Less Fee)

```typescript
async function sendAllFunds(
  algorand: AlgorandClient,
  sender: Account,
  receiver: string
) {
  const accountInfo = await algorand.account.getInformation(sender.addr)
  const balance = Number(accountInfo.balance)
  const fee = 1000
  const amountToSend = balance - fee

  if (amountToSend <= 0) {
    throw new Error('Insufficient balance to cover fee')
  }

  await algorand.send.payment({
    sender: sender.addr,
    receiver,
    amount: microAlgo(amountToSend),
  })
}
```

### 3. Batch Payments

```typescript
async function sendToMultiple(
  algorand: AlgorandClient,
  sender: Account,
  recipients: Array<{ address: string; amount: number }>
) {
  for (const recipient of recipients) {
    await algorand.send.payment({
      sender: sender.addr,
      receiver: recipient.address,
      amount: algo(recipient.amount),
    })
    console.log(`✓ Sent ${recipient.amount} ALGO to ${recipient.address}`)
  }
}

await sendToMultiple(algorand, alice, [
  { address: bob.addr.toString(), amount: 1 },
  { address: charlie.addr.toString(), amount: 2 },
  { address: dave.addr.toString(), amount: 3 },
])
```

### 4. Check Balance Before Sending

```typescript
async function safePayment(
  algorand: AlgorandClient,
  sender: Account,
  receiver: string,
  amount: number // in microAlgo
) {
  const accountInfo = await algorand.account.getInformation(sender.addr)
  const balance = Number(accountInfo.balance)
  const fee = 1000
  const required = amount + fee

  if (balance < required) {
    throw new Error(
      `Insufficient balance: have ${balance}, need ${required} (amount + fee)`
    )
  }

  return await algorand.send.payment({
    sender: sender.addr,
    receiver,
    amount: microAlgo(amount),
  })
}
```

## Best Practices

### 1. Always Account for Fees

**Good**:
```typescript
const accountInfo = await algorand.account.getInformation(sender.addr)
const balance = Number(accountInfo.balance)
const fee = 1000
const maxSendable = balance - fee

if (amount <= maxSendable) {
  await algorand.send.payment({
    sender: sender.addr,
    receiver: receiver.addr,
    amount: microAlgo(amount),
  })
}
```

**Avoid**:
```typescript
// Trying to send entire balance
const accountInfo = await algorand.account.getInformation(sender.addr)
await algorand.send.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: microAlgo(Number(accountInfo.balance)),
})
// Will fail: no funds left for fee
```

### 2. Use Proper Amount Functions

**Good**:
```typescript
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'

// Clear and type-safe
await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(5), // 5 ALGO
})

await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: microAlgo(100), // 100 microAlgo
})
```

**Avoid**:
```typescript
// Unclear units
await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: 5000000, // What unit? ALGO? microAlgo?
})
```

### 3. Add toString() to Addresses in Console

**Good**:
```typescript
console.log(`Address: ${alice.addr.toString()}`)
console.log(`Receiver: ${bob.addr.toString()}`)
```

**Avoid**:
```typescript
console.log(`Address: ${alice.addr}`)
// Displays: Address: Address { publicKey: Uint8Array(...) }
```

### 4. Handle Transaction Errors

**Good**:
```typescript
try {
  const result = await algorand.send.payment({
    sender: alice.addr,
    receiver: bob.addr,
    amount: algo(5),
  })
  console.log(`✓ Transaction ${result.transaction.txID()} confirmed`)
} catch (error) {
  if (error.message.includes('overspend')) {
    console.error('Insufficient balance')
  } else if (error.message.includes('below min')) {
    console.error('Receiver account would fall below minimum balance')
  } else {
    throw error
  }
}
```

**Avoid**:
```typescript
// No error handling
const result = await algorand.send.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: algo(5),
})
```

## Key Takeaways

1. **Payment transactions** are the most basic operation on Algorand
2. **Sender always pays fee** of 1000 microAlgo (0.001 ALGO)
3. **Receiver gets exact amount** specified (not reduced by fee)
4. **Use `algo()` and `microAlgo()`** helpers for clarity
5. **Check balances** before and after to verify transactions
6. **Transaction ID** uniquely identifies each transaction
7. **Always account for fees** when calculating sendable amounts
8. **Use `.toString()` on addresses** for clean console output

