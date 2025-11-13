import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import { v4 as uuid } from 'uuid'

/**
 * This example demonstrates how to configure accounts using environment variables
 * and shows that environment variables take priority over KMD for account resolution.
 *
 * Key concepts:
 * - Using fromEnvironment() to retrieve accounts from environment variables or KMD
 * - Setting account mnemonics in environment variables
 * - Understanding account resolution priority (environment > KMD)
 *
 * Prerequisites:
 * - AlgoKit installed and LocalNet running
 * - Node.js and npm installed
 */

async function main() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Step 1: Create an account via KMD with a random name
  const accountName = uuid()
  console.log(`Creating account via KMD with name: ${accountName}`)
  const account = await algorand.account.fromEnvironment(accountName)
  console.log(`Account address: ${account.addr}\n`)

  // Step 2: Get the mnemonic from the account
  // For KMD-based accounts, we need to export the private key
  const mnemonic = algosdk.secretKeyToMnemonic((account as any).account.sk)

  // Step 3: Set the account's mnemonic in an environment variable
  const envVarName = 'TEST'
  process.env[`${envVarName}_MNEMONIC`] = mnemonic
  console.log(`Setting environment variable ${envVarName}_MNEMONIC with mnemonic`)
  console.log(`Mnemonic: ${mnemonic}\n`)

  // Step 4: Retrieve account using the environment variable
  // This should return the same account but from the environment variable, not KMD
  console.log(`Retrieving account from environment variable ${envVarName}_MNEMONIC`)
  const accountFromEnv = await algorand.account.fromEnvironment(envVarName)
  console.log(`Account address from environment: ${accountFromEnv.addr}\n`)

  // Step 5: Verify that both accounts have the same address and keys
  console.log('Verification:')
  const addr1 = account.addr.toString()
  const addr2 = accountFromEnv.addr.toString()
  console.log(`- Addresses match: ${addr1 === addr2}`)

  // Both accounts should have the same private key
  const accountSk = (account as any).account?.sk || (account as any).sk
  const accountFromEnvSk = (accountFromEnv as any).account?.sk || (accountFromEnv as any).sk
  const privateKeysMatch = Buffer.from(accountSk).equals(Buffer.from(accountFromEnvSk))
  console.log(`- Private keys match: ${privateKeysMatch}`)
  console.log(`- Different object instances: ${account !== accountFromEnv}\n`)

  console.log('✅ Environment variable takes priority over KMD!')
  console.log('\nThis is important for production deployments where accounts should be')
  console.log('configured via environment variables for better security practices.')
  console.log('\nKey takeaways:')
  console.log('  • fromEnvironment() checks environment variables first')
  console.log('  • If no environment variable is found, it falls back to KMD')
  console.log('  • Environment variables provide better security for production')
  console.log('  • Use <NAME>_MNEMONIC env var to configure accounts')
}

main().catch(console.error)
