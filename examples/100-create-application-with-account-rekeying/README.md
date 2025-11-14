# Create Application with Account Rekeying

This example demonstrates account rekeying during application creation. It shows how to delegate signing authority from one account to another while creating an app, and how to use the rekeyed account for subsequent transactions.

## Key Concepts

- **Account Rekeying**: Changing which private key can authorize transactions for an account
- **Signing Authority**: The account that signs transactions (can differ from sender)
- **Sender Address**: The account address that transactions come from (remains constant)
- **rekeyTo Parameter**: Transaction parameter that triggers a rekey operation
- **Rekeyed Account Object**: Wrapper that properly signs transactions for rekeyed accounts

## What This Example Shows

1. Creating and funding an account that will be rekeyed
2. Creating a new account that will become the signing authority
3. Creating an application with the `rekeyTo` parameter
4. Creating a rekeyed account object for subsequent transactions
5. Sending a transaction from the rekeyed account
6. Understanding the separation of sender address and signing authority

## Code Walkthrough

### Initialize and Create Accounts

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

// Create and fund the account that will be rekeyed
const originalAccount = algorand.account.random()
await algorand.account.ensureFunded(originalAccount, dispenser, (5).algos())

// Create the new signing authority
const newAuthority = algorand.account.random()
```

Set up the accounts. The `originalAccount` will be rekeyed to `newAuthority`.

### Create App with Rekey

```typescript
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: originalAccount.addr,
})

const { appClient, result } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
  rekeyTo: newAuthority.addr, // This triggers the rekey
})
```

**Key point**: The `rekeyTo` parameter on the app creation transaction performs the rekey atomically with app creation.

### Create Rekeyed Account Object

```typescript
const rekeyedAccount = algorand.account.rekeyed(originalAccount.addr, newAuthority)
```

**Important**: After rekeying, you must use a rekeyed account object that:
- Uses `originalAccount.addr` as the sender
- Uses `newAuthority` as the signer

### Use the Rekeyed Account

```typescript
const payment = await algorand.send.payment({
  amount: (0.1).algos(),
  sender: rekeyedAccount.addr,
  receiver: dispenser.addr,
})
```

Transactions are sent FROM the original address but SIGNED BY the new authority.

## API Patterns (AlgoKit Utils v9.1.2)

### Rekey During Transaction

Any transaction can include a rekey:

```typescript
// During app creation
await appFactory.send.create.bare({
  deployTimeParams: { ... },
  rekeyTo: newAuthority.addr,
})

// During payment
await algorand.send.payment({
  amount: (1).algos(),
  sender: account.addr,
  receiver: recipient.addr,
  rekeyTo: newAuthority.addr,
})

// During any transaction
await algorand.send.assetTransfer({
  assetId: assetId,
  amount: 100n,
  sender: account.addr,
  receiver: recipient.addr,
  rekeyTo: newAuthority.addr,
})
```

### Create Rekeyed Account Object

```typescript
// Method 1: Using account manager
const rekeyedAccount = algorand.account.rekeyed(
  senderAddress,      // The account address (string)
  signingAccount      // The account that signs (TransactionSignerAccount)
)

// Method 2: Using SigningAccount directly
import { SigningAccount } from '@algorandfoundation/algokit-utils'

const rekeyedAccount = new SigningAccount(
  { addr: senderAddress, signer: signingAccount.signer },
  senderAddress
)
```

### Rekeyed Account Structure

```typescript
interface RekeyedAccount {
  addr: string              // The original account address (sender)
  signer: TransactionSigner // The new authority's signer
}

// Usage:
await algorand.send.payment({
  sender: rekeyedAccount.addr,  // Uses addr as sender
  // SDK automatically uses rekeyedAccount.signer for signing
})
```

## Common Use Cases

### Key Rotation for Security

Rotate signing keys without changing account addresses:

```typescript
// Original key compromised, rotate to new key
const newKey = algorand.account.random()

await algorand.send.payment({
  amount: (0).algos(),
  sender: compromisedAccount.addr,
  receiver: compromisedAccount.addr,
  rekeyTo: newKey.addr,
})

// Now use new key for all future transactions
const rotatedAccount = algorand.account.rekeyed(compromisedAccount.addr, newKey)
```

### Multisig Control

Delegate account control to a multisig:

```typescript
// Create multisig account
const multisigAccount = algorand.account.multisig({
  version: 1,
  threshold: 2,
  addrs: [account1.addr, account2.addr, account3.addr],
})

// Rekey single account to multisig
await algorand.send.payment({
  amount: (0).algos(),
  sender: singleAccount.addr,
  receiver: singleAccount.addr,
  rekeyTo: multisigAccount.addr,
})

// Now requires 2 of 3 signatures
const rekeyedToMultisig = algorand.account.rekeyed(singleAccount.addr, multisigAccount)
```

### Smart Contract Control

Allow a smart contract to control an account:

```typescript
const appAddress = getApplicationAddress(appId)

// Rekey user account to app
await algorand.send.payment({
  amount: (0).algos(),
  sender: userAccount.addr,
  receiver: userAccount.addr,
  rekeyTo: appAddress,
})

// Now only the smart contract can authorize transactions from userAccount
// The contract logic determines when transactions are allowed
```

### Temporary Delegation

Temporarily delegate control and revoke later:

```typescript
// Delegate to service account
await algorand.send.payment({
  amount: (0).algos(),
  sender: myAccount.addr,
  receiver: myAccount.addr,
  rekeyTo: serviceAccount.addr,
})

// Service does its work using rekeyed account
const delegated = algorand.account.rekeyed(myAccount.addr, serviceAccount)
await algorand.send.payment({
  amount: (1).algos(),
  sender: delegated.addr,
  receiver: recipient.addr,
})

// Revoke delegation by rekeying back to original
await algorand.send.payment({
  amount: (0).algos(),
  sender: delegated.addr,
  receiver: myAccount.addr,
  rekeyTo: myAccount.addr, // Rekey back to self
})
```

## Important Considerations

### Irreversible Without New Key

```typescript
// After rekeying to newAuthority...
await algorand.send.payment({
  sender: originalAccount.addr,
  rekeyTo: newAuthority.addr,
})

// The original key CANNOT authorize transactions anymore
// You MUST have access to newAuthority to use the account
```

**Critical**: If you lose access to the new authority account, you permanently lose control of the rekeyed account.

### Rekey Back to Original

```typescript
// You can rekey back to the original account
const rekeyedAccount = algorand.account.rekeyed(originalAddr, newAuthority)

await algorand.send.payment({
  amount: (0).algos(),
  sender: rekeyedAccount.addr,
  receiver: originalAddr,
  rekeyTo: originalAddr, // Rekey back to original
})

// Now originalAccount can sign again
```

### Account Address Never Changes

```typescript
// Before rekey:
// Address: ABC123...
// Signer: ABC123...

// After rekey to XYZ789...:
// Address: ABC123... (SAME)
// Signer: XYZ789... (CHANGED)

// All funds stay at ABC123...
// Transaction history stays with ABC123...
// Only the signing authority changed
```

### Zero-Amount Rekey Transaction

```typescript
// A rekey doesn't need to transfer funds
await algorand.send.payment({
  amount: (0).algos(),     // Zero amount
  sender: account.addr,
  receiver: account.addr,  // Send to self
  rekeyTo: newAuthority.addr,
})

// Only costs the transaction fee (~0.001 ALGO)
```

### Cannot Rekey During Account Creation

```typescript
// INCORRECT: Cannot rekey during funding/creation
const newAccount = algorand.account.random()
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: newAccount.addr,
  amount: (1).algos(),
  rekeyTo: otherAccount.addr, // This rekeys dispenser, not newAccount!
})

// CORRECT: Rekey in a separate transaction
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: newAccount.addr,
  amount: (1).algos(),
})

await algorand.send.payment({
  sender: newAccount.addr,
  receiver: newAccount.addr,
  amount: (0).algos(),
  rekeyTo: otherAccount.addr, // Now rekeys newAccount
})
```

### Checking if Account is Rekeyed

```typescript
const accountInfo = await algorand.account.getInformation(accountAddr)

if (accountInfo.authAddr) {
  console.log('Account is rekeyed to:', accountInfo.authAddr)
  console.log('Must sign with:', accountInfo.authAddr)
} else {
  console.log('Account is not rekeyed')
  console.log('Signs with own key')
}
```

### Error Handling

```typescript
try {
  // Try to send from rekeyed account with wrong signer
  await algorand.send.payment({
    sender: originalAccount.addr, // Rekeyed account
    receiver: recipient.addr,
    amount: (1).algos(),
  })
} catch (error) {
  console.error('Transaction failed - account may be rekeyed')

  // Check if rekeyed
  const info = await algorand.account.getInformation(originalAccount.addr)
  if (info.authAddr) {
    console.log('Account is rekeyed to:', info.authAddr)
    console.log('Use: algorand.account.rekeyed(addr, newAuthority)')
  }
}
```

## Expected Output

```
Original account address: 6HNNOCSHPHZLHZCIUA3NNOLCXVPAT7KVPCKV5ITKP5ECO7LVVR4Y4CC7EY
Original account has funds and signing authority

New authority address: Q7VP3EOLZPKVPMVBRUBIFFXASS5PCOBSDC6LFVCSHEUHBVD4KDQB3XTZQM
This account will become the signing authority after rekey

ℹ️  After rekeying:
  - Transactions FROM 6HNNOCSH...
  - Must be SIGNED BY Q7VP3EOL...

Creating application and rekeying account...

✅ Application created and account rekeyed!
App ID: 1617n
App Address: EXWZXOVVB4LXDZ7FJJTHOSU7E2VMFBF5TC55ZTZSI5L7VL7SEZWTQH7DJI
Transaction ID: ZGMIXAPPLFEQEUW6LTGVN2CPG4ICC2XT27K5BFVE6YEFBXHM3MXQ

=== Testing Rekeyed Account ===

Created rekeyed account object:
  - Address (sender): 6HNNOCSHPHZLHZCIUA3NNOLCXVPAT7KVPCKV5ITKP5ECO7LVVR4Y4CC7EY
  - Signing authority: Q7VP3EOLZPKVPMVBRUBIFFXASS5PCOBSDC6LFVCSHEUHBVD4KDQB3XTZQM

Sending payment from rekeyed account...

✅ Payment transaction successful!
Transaction ID: TPYIW2WS2BDIZM6SDNKBFZ3WASMKHI5TAKNPTT2OBQI62EWJVZTQ

✓ This proves the rekey worked:
  - Transaction was FROM: 6HNNOCSH...
  - But SIGNED BY: Q7VP3EOL...

⚠️  Important Security Note:
  - All future transactions from 6HNNOCSH...
  - Must be signed using Q7VP3EOL...
  - The original signing key can NO LONGER authorize transactions
  - The account address remains the same, only the signing authority changed

✅ Example completed successfully!
```

## Running the Example

### Prerequisites

1. Start AlgoKit LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Execute

```bash
npm start
```

The example will:
1. Create and fund an account to be rekeyed
2. Create a new account to be the signing authority
3. Create an app with the `rekeyTo` parameter
4. Create a rekeyed account object
5. Send a payment using the rekeyed account
6. Demonstrate the rekey worked

## Security Best Practices

### Before Rekeying

1. **Backup**: Ensure you have secure backups of the new authority's keys
2. **Test**: Test the new authority can sign transactions first
3. **Verify**: Double-check the `rekeyTo` address is correct
4. **Understand**: Make sure you understand the implications of rekeying

### After Rekeying

1. **Store safely**: Securely store the new authority's private key
2. **Update records**: Update your records with the new signing authority
3. **Test immediately**: Verify you can transact with the rekeyed account
4. **Monitor**: Watch for any unexpected transaction failures

### Recovery Planning

```typescript
// Plan for rekey scenarios
const rekeyPlan = {
  originalAccount: 'ABC123...',
  currentAuthority: 'XYZ789...',
  backupAuthority: 'DEF456...',
  rekeyHistory: [
    { date: '2024-01-01', from: 'ABC123...', to: 'XYZ789...' },
  ],
}

// Document how to rekey back in emergency
async function emergencyRekeyBack() {
  const rekeyedAccount = algorand.account.rekeyed(
    rekeyPlan.originalAccount,
    currentAuthority
  )

  await algorand.send.payment({
    amount: (0).algos(),
    sender: rekeyedAccount.addr,
    receiver: rekeyPlan.originalAccount,
    rekeyTo: rekeyPlan.backupAuthority,
  })
}
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Rekeying](https://developer.algorand.org/docs/get-details/accounts/rekey/)
- [Account Authorization](https://developer.algorand.org/docs/get-details/accounts/#account-address-and-authorization)
- [Transaction Parameters](https://developer.algorand.org/docs/get-details/transactions/#common-fields-header-and-type)
- [Security Best Practices](https://developer.algorand.org/docs/get-started/basics/security/)
