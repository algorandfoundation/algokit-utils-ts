/**
 * Application Call Example
 *
 * This example demonstrates how to deploy and interact with a smart contract
 * on Algorand using the transact package:
 * - Compile simple approval and clear TEAL programs using algod.tealCompile()
 * - Create an app with TransactionType.AppCall and OnApplicationComplete.NoOp
 * - Use AppCallTransactionFields with approvalProgram, clearStateProgram,
 *   globalStateSchema, and localStateSchema
 * - Retrieve the created app ID from pending transaction info
 * - Call the app with application arguments
 * - Demonstrate OnApplicationComplete.OptIn for local state
 * - Delete the app at the end
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import {
  assignFee,
  generateAddressWithSigners,
  OnApplicationComplete,
  Transaction,
  TransactionType,
  type AppCallTransactionFields,
} from '@algorandfoundation/algokit-utils/transact'
import nacl from 'tweetnacl'
import {
  createAlgodClient,
  formatAlgo,
  printHeader,
  printInfo,
  printStep,
  printSuccess,
  shortenAddress,
  waitForConfirmation,
} from './shared/utils.js'

/**
 * Generates a random ed25519 keypair and creates an AddressWithSigners
 */
function generateAccount() {
  const keypair = nacl.sign.keyPair()
  const addressWithSigners = generateAddressWithSigners({
    ed25519Pubkey: keypair.publicKey,
    rawEd25519Signer: async (bytesToSign: Uint8Array) => {
      return nacl.sign.detached(bytesToSign, keypair.secretKey)
    },
  })
  return { keypair, ...addressWithSigners }
}

/**
 * Gets a funded account from LocalNet's KMD wallet
 */
async function getLocalNetFundedAccount(algorand: AlgorandClient) {
  return await algorand.account.kmd.getLocalNetDispenserAccount()
}

async function main() {
  printHeader('Application Call Example')

  // Step 1: Initialize clients
  printStep(1, 'Initialize Algod Client')
  const algod = createAlgodClient()
  const algorand = AlgorandClient.defaultLocalNet()
  printInfo('Connected to LocalNet Algod')

  // Step 2: Get funded account
  printStep(2, 'Get Funded Account')
  const creator = await getLocalNetFundedAccount(algorand)
  printInfo(`Creator address: ${shortenAddress(creator.addr.toString())}`)

  // Step 3: Compile approval and clear TEAL programs
  printStep(3, 'Compile TEAL Programs')

  // Simple approval program that:
  // - Approves app creation (NoOp with appId == 0)
  // - Approves app calls (NoOp with appId != 0)
  // - Approves OptIn calls
  // - Approves DeleteApplication calls
  // - Stores a counter in global state on each call
  // - Stores user-specific counter in local state on OptIn and calls
  const approvalSource = `#pragma version 10
// Simple smart contract for demonstration

// Check if this is app creation
txn ApplicationID
int 0
==
bnz handle_creation

// Check OnComplete action
txn OnCompletion
int NoOp
==
bnz handle_noop

txn OnCompletion
int OptIn
==
bnz handle_optin

txn OnCompletion
int DeleteApplication
==
bnz handle_delete

// Reject other operations
int 0
return

handle_creation:
  // Initialize global counter to 0
  byte "counter"
  int 0
  app_global_put
  int 1
  return

handle_noop:
  // Increment global counter
  byte "counter"
  app_global_get
  int 1
  +
  byte "counter"
  swap
  app_global_put

  // If any app args provided, log the first one
  txn NumAppArgs
  int 0
  >
  bz noop_end
  txna ApplicationArgs 0
  log

  noop_end:
  int 1
  return

handle_optin:
  // Initialize local counter for this user
  txn Sender
  byte "user_counter"
  int 0
  app_local_put
  int 1
  return

handle_delete:
  // Allow deletion
  int 1
  return
`

  // Simple clear state program that always approves
  const clearSource = `#pragma version 10
int 1
return
`

  printInfo('Compiling approval program...')
  const approvalResult = await algod.tealCompile(approvalSource)
  const approvalProgram = new Uint8Array(Buffer.from(approvalResult.result, 'base64'))
  printInfo(`Approval program size: ${approvalProgram.length} bytes`)
  printInfo(`Approval program hash: ${approvalResult.hash}`)

  printInfo('')
  printInfo('Compiling clear state program...')
  const clearResult = await algod.tealCompile(clearSource)
  const clearStateProgram = new Uint8Array(Buffer.from(clearResult.result, 'base64'))
  printInfo(`Clear state program size: ${clearStateProgram.length} bytes`)
  printInfo(`Clear state program hash: ${clearResult.hash}`)

  // Step 4: Create app with TransactionType.AppCall and OnApplicationComplete.NoOp
  printStep(4, 'Create Application')

  const suggestedParams = await algod.suggestedParams()

  // Define state schemas
  const globalStateSchema = {
    numUints: 1,      // For the counter
    numByteSlices: 0, // No byte slices in global state
  }

  const localStateSchema = {
    numUints: 1,      // For user counter
    numByteSlices: 0, // No byte slices in local state
  }

  printInfo('App configuration:')
  printInfo(`  Global state: ${globalStateSchema.numUints} uints, ${globalStateSchema.numByteSlices} byte slices`)
  printInfo(`  Local state: ${localStateSchema.numUints} uints, ${localStateSchema.numByteSlices} byte slices`)
  printInfo('')

  const appCallFields: AppCallTransactionFields = {
    appId: 0n, // 0 means app creation
    onComplete: OnApplicationComplete.NoOp,
    approvalProgram,
    clearStateProgram,
    globalStateSchema,
    localStateSchema,
  }

  const createAppTx = new Transaction({
    type: TransactionType.AppCall,
    sender: creator.addr,
    firstValid: suggestedParams.firstValid,
    lastValid: suggestedParams.lastValid,
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisId,
    appCall: appCallFields,
  })

  const createAppTxWithFee = assignFee(createAppTx, {
    feePerByte: suggestedParams.fee,
    minFee: suggestedParams.minFee,
  })

  printInfo('Creating app transaction...')
  printInfo(`  Transaction type: ${createAppTxWithFee.type}`)
  printInfo(`  OnComplete: NoOp (for creation)`)
  printInfo(`  Fee: ${createAppTxWithFee.fee} microALGO`)

  const signedCreateTx = await creator.signer([createAppTxWithFee], [0])
  await algod.sendRawTransaction(signedCreateTx)

  // Step 5: Retrieve created app ID from pending transaction info
  printStep(5, 'Retrieve Created App ID')

  const createPendingInfo = await waitForConfirmation(algod, createAppTxWithFee.txId())
  const appId = createPendingInfo.appId as bigint

  printInfo(`Transaction confirmed in round: ${createPendingInfo.confirmedRound}`)
  printInfo(`Created app ID: ${appId}`)
  printSuccess('Application created successfully!')

  // Step 6: Call the app with application arguments
  printStep(6, 'Call the App with Arguments')

  const callParams = await algod.suggestedParams()

  // First call with an argument
  const arg1 = new TextEncoder().encode('Hello, Algorand!')
  const callAppFields1: AppCallTransactionFields = {
    appId,
    onComplete: OnApplicationComplete.NoOp,
    args: [arg1],
  }

  const callAppTx1 = new Transaction({
    type: TransactionType.AppCall,
    sender: creator.addr,
    firstValid: callParams.firstValid,
    lastValid: callParams.lastValid,
    genesisHash: callParams.genesisHash,
    genesisId: callParams.genesisId,
    appCall: callAppFields1,
  })

  const callAppTxWithFee1 = assignFee(callAppTx1, {
    feePerByte: callParams.fee,
    minFee: callParams.minFee,
  })

  printInfo(`Calling app ${appId} with argument: "Hello, Algorand!"`)

  const signedCallTx1 = await creator.signer([callAppTxWithFee1], [0])
  await algod.sendRawTransaction(signedCallTx1)

  const callPendingInfo1 = await waitForConfirmation(algod, callAppTxWithFee1.txId())
  printInfo(`Transaction confirmed in round: ${callPendingInfo1.confirmedRound}`)

  // Check logs (the app logs the first argument)
  if (callPendingInfo1.logs && (callPendingInfo1.logs as Uint8Array[]).length > 0) {
    const logBytes = (callPendingInfo1.logs as Uint8Array[])[0]
    const logMessage = new TextDecoder().decode(logBytes)
    printInfo(`App logged: "${logMessage}"`)
  }

  // Second call to increment counter
  const callParams2 = await algod.suggestedParams()
  const arg2 = new TextEncoder().encode('Second call!')

  const callAppTx2 = new Transaction({
    type: TransactionType.AppCall,
    sender: creator.addr,
    firstValid: callParams2.firstValid,
    lastValid: callParams2.lastValid,
    genesisHash: callParams2.genesisHash,
    genesisId: callParams2.genesisId,
    appCall: {
      appId,
      onComplete: OnApplicationComplete.NoOp,
      args: [arg2],
    },
  })

  const callAppTxWithFee2 = assignFee(callAppTx2, {
    feePerByte: callParams2.fee,
    minFee: callParams2.minFee,
  })

  printInfo(`Calling app again with argument: "Second call!"`)

  const signedCallTx2 = await creator.signer([callAppTxWithFee2], [0])
  await algod.sendRawTransaction(signedCallTx2)

  const callPendingInfo2 = await waitForConfirmation(algod, callAppTxWithFee2.txId())
  printInfo(`Transaction confirmed in round: ${callPendingInfo2.confirmedRound}`)

  if (callPendingInfo2.logs && (callPendingInfo2.logs as Uint8Array[]).length > 0) {
    const logBytes = (callPendingInfo2.logs as Uint8Array[])[0]
    const logMessage = new TextDecoder().decode(logBytes)
    printInfo(`App logged: "${logMessage}"`)
  }

  printSuccess('App calls completed successfully!')

  // Step 7: Demonstrate OnApplicationComplete.OptIn for local state
  printStep(7, 'Demonstrate OptIn for Local State')

  // Create a new account that will opt into the app
  const optInUser = generateAccount()
  printInfo(`OptIn user address: ${shortenAddress(optInUser.addr.toString())}`)

  // Fund the new account
  const fundParams = await algod.suggestedParams()
  const fundTx = new Transaction({
    type: TransactionType.Payment,
    sender: creator.addr,
    firstValid: fundParams.firstValid,
    lastValid: fundParams.lastValid,
    genesisHash: fundParams.genesisHash,
    genesisId: fundParams.genesisId,
    payment: {
      receiver: optInUser.addr,
      amount: 1_000_000n, // 1 ALGO
    },
  })

  const fundTxWithFee = assignFee(fundTx, {
    feePerByte: fundParams.fee,
    minFee: fundParams.minFee,
  })

  const signedFundTx = await creator.signer([fundTxWithFee], [0])
  await algod.sendRawTransaction(signedFundTx)
  await waitForConfirmation(algod, fundTxWithFee.txId())
  printInfo(`Funded OptIn user with ${formatAlgo(1_000_000n)}`)

  // OptIn to the app
  const optInParams = await algod.suggestedParams()

  const optInFields: AppCallTransactionFields = {
    appId,
    onComplete: OnApplicationComplete.OptIn,
  }

  const optInTx = new Transaction({
    type: TransactionType.AppCall,
    sender: optInUser.addr,
    firstValid: optInParams.firstValid,
    lastValid: optInParams.lastValid,
    genesisHash: optInParams.genesisHash,
    genesisId: optInParams.genesisId,
    appCall: optInFields,
  })

  const optInTxWithFee = assignFee(optInTx, {
    feePerByte: optInParams.fee,
    minFee: optInParams.minFee,
  })

  printInfo(`User opting into app ${appId}...`)
  printInfo(`  OnComplete: OptIn`)

  const signedOptInTx = await optInUser.signer([optInTxWithFee], [0])
  await algod.sendRawTransaction(signedOptInTx)

  const optInPendingInfo = await waitForConfirmation(algod, optInTxWithFee.txId())
  printInfo(`Transaction confirmed in round: ${optInPendingInfo.confirmedRound}`)
  printSuccess('User successfully opted into the app!')

  printInfo('')
  printInfo('OptIn explanation:')
  printInfo('  - OptIn allocates local storage for the user in this app')
  printInfo('  - The app can now read/write user-specific state')
  printInfo('  - The user pays for the minimum balance increase')
  printInfo('  - Our app initializes user_counter to 0 on OptIn')

  // Step 8: Delete the app
  printStep(8, 'Delete the Application')

  const deleteParams = await algod.suggestedParams()

  const deleteFields: AppCallTransactionFields = {
    appId,
    onComplete: OnApplicationComplete.DeleteApplication,
  }

  const deleteTx = new Transaction({
    type: TransactionType.AppCall,
    sender: creator.addr,
    firstValid: deleteParams.firstValid,
    lastValid: deleteParams.lastValid,
    genesisHash: deleteParams.genesisHash,
    genesisId: deleteParams.genesisId,
    appCall: deleteFields,
  })

  const deleteTxWithFee = assignFee(deleteTx, {
    feePerByte: deleteParams.fee,
    minFee: deleteParams.minFee,
  })

  printInfo(`Deleting app ${appId}...`)
  printInfo(`  OnComplete: DeleteApplication`)

  const signedDeleteTx = await creator.signer([deleteTxWithFee], [0])
  await algod.sendRawTransaction(signedDeleteTx)

  const deletePendingInfo = await waitForConfirmation(algod, deleteTxWithFee.txId())
  printInfo(`Transaction confirmed in round: ${deletePendingInfo.confirmedRound}`)
  printSuccess('Application deleted successfully!')

  // Summary
  printStep(9, 'Summary')
  printInfo('')
  printInfo('App lifecycle demonstrated:')
  printInfo('  1. Create - Deploy with approvalProgram, clearStateProgram, and schemas')
  printInfo('  2. Call - Invoke app logic with OnApplicationComplete.NoOp')
  printInfo('  3. OptIn - User opts in to allocate local state')
  printInfo('  4. Delete - Remove app from the blockchain')
  printInfo('')
  printInfo('OnApplicationComplete values:')
  printInfo('  - NoOp: Standard app call or creation')
  printInfo('  - OptIn: Allocate local storage for the sender')
  printInfo('  - CloseOut: Deallocate local storage (graceful exit)')
  printInfo('  - ClearState: Deallocate local storage (forced, always succeeds)')
  printInfo('  - UpdateApplication: Update the programs')
  printInfo('  - DeleteApplication: Remove the app')
  printInfo('')
  printInfo('Key fields for app creation:')
  printInfo('  - appId: 0n for creation, actual ID for existing apps')
  printInfo('  - approvalProgram: Logic for most operations')
  printInfo('  - clearStateProgram: Logic for ClearState (cannot reject)')
  printInfo('  - globalStateSchema: {numUints, numByteSlices} for global storage')
  printInfo('  - localStateSchema: {numUints, numByteSlices} for per-user storage')
  printInfo('')
  printInfo('Retrieving app ID after creation:')
  printInfo('  const pendingInfo = await waitForConfirmation(algod, txId)')
  printInfo('  const appId = pendingInfo.appId // bigint')

  printSuccess('Application call example completed!')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
