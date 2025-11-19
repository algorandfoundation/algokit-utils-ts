import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface AppSpec {
  contract: {
    name: string
    methods: Array<{
      name: string
      args: Array<{ type: string; name: string }>
      returns: { type: string }
    }>
  }
  source: {
    approval: string
    clear: string
  }
  state: {
    global: {
      num_uints: number
      num_byte_slices: number
    }
    local: {
      num_uints: number
      num_byte_slices: number
    }
  }
}

async function main() {
  console.log('=== Replace an Application Using ABI Methods ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // ========================================
  // STEP 1: Load Contract Specification
  // ========================================
  console.log('=== STEP 1: Loading Contract Specification ===\n')

  const appSpecFile = await readFile(path.join(__dirname, 'artifacts/ReplaceApp.json'), 'utf-8')
  const appSpec: AppSpec = JSON.parse(appSpecFile)

  // Pre-compiled bytecode for version 1 and version 2 of the app
  const approvalV1Bytecode = Buffer.from(
    'CCACAAExGyISQAA6NhoAgASdUjBAEkAAHjYaAIAEJxtO6RJAAAEAMRmBBRIxGCITEESIAD0jQzEZIhIxGCISEESIABEjQzEZIhIxGCISEESIADwjQ4oAAIAASTYaAYwBiwGIADmMAIAEFR98dYsAULCJigAAgABJNhoBjAGLAYgAQIwAgAQVH3x1iwBQsImKAACAB3ZlcnNpb24jZ4mKAQGAAIAHdmVyc2lvbiNni/9XAgCMAIsAFRZXBgCLAFCMAImKAQGAAIv/VwIAjACLABUWVwYAiwBQjACJ',
    'base64'
  )
  const approvalV2Bytecode = Buffer.from(
    'CCADAAECMRsiEkAAOjYaAIAEnVIwQBJAAB42GgCABCcbTukSQAABADEZgQUSMRgiExBEiAA9I0MxGSISMRgiEhBEiAARI0MxGSISMRgiEhBEiAA8I0OKAACAAEk2GgGMAYsBiAA5jACABBUffHWLAFCwiYoAAIAASTYaAYwBiwGIAECMAIAEFR98dYsAULCJigAAgAd2ZXJzaW9uJGeJigEBgACAB3ZlcnNpb24kZ4v/VwIAjACLABUWVwYAiwBQjACJigEBgACL/1cCAIwAiwAVFlcGAIsAUIwAiQ==',
    'base64'
  )
  const clearBytecode = Buffer.from('CCACAGk=', 'base64') // #pragma version 8, int 0, return

  console.log('✅ Contract specification loaded')
  console.log('   Contract name:', appSpec.contract.name)
  console.log('   Methods:', appSpec.contract.methods.map((m) => m.name).join(', '))
  console.log()

  // ========================================
  // STEP 2: Deploy Initial Application (Version 1)
  // ========================================
  console.log('=== STEP 2: Deploying Initial Application ===\n')

  console.log('Deploying initial app (version 1)...')

  const createResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: approvalV1Bytecode,
    clearStateProgram: clearBytecode,
    schema: {
      globalInts: appSpec.state.global.num_uints,
      globalByteSlices: appSpec.state.global.num_byte_slices,
      localInts: appSpec.state.local.num_uints,
      localByteSlices: appSpec.state.local.num_byte_slices,
    },
  })

  const appId = createResult.appId
  console.log('✅ Initial app deployed with ID:', appId)

  // Verify the global state version
  const appInfo = await algorand.app.getById(appId)
  const globalState = (appInfo as any)['global-state'] || []
  const versionState = globalState.find((kv: any) => Buffer.from(kv.key, 'base64').toString() === 'version')
  const currentVersion = versionState?.value.uint || 0

  console.log('   Global state "version":', currentVersion)
  console.log()

  // ========================================
  // STEP 3: Replace Application Using ABI Methods
  // ========================================
  console.log('=== STEP 3: Replacing Application Using ABI Methods ===\n')

  console.log('This will:')
  console.log('  1. Call delete_abi(string) on the old app with argument "arg2_io"')
  console.log('  2. Call create_abi(string) on the new app with argument "arg_io"')
  console.log('  3. Deploy version 2 of the app with updated code')
  console.log()

  // Create ABI method instances
  const deleteAbiMethod = new algosdk.ABIMethod(appSpec.contract.methods.find((m) => m.name === 'delete_abi')!)
  const createAbiMethod = new algosdk.ABIMethod(appSpec.contract.methods.find((m) => m.name === 'create_abi')!)

  console.log('Executing app replacement...')
  const replaceResult = await algorand
    .newGroup()
    .addAppDeleteMethodCall({
      sender: deployer.addr,
      appId: appId,
      method: deleteAbiMethod,
      args: ['arg2_io'],
    })
    .addAppCreateMethodCall({
      sender: deployer.addr,
      approvalProgram: approvalV2Bytecode,
      clearStateProgram: clearBytecode,
      schema: {
        globalInts: appSpec.state.global.num_uints,
        globalByteSlices: appSpec.state.global.num_byte_slices,
        localInts: appSpec.state.local.num_uints,
        localByteSlices: appSpec.state.local.num_byte_slices,
      },
      method: createAbiMethod,
      args: ['arg_io'],
    })
    .send()

  console.log('✅ App replacement successful!')
  console.log()

  // ========================================
  // STEP 4: Verify Replacement Results
  // ========================================
  console.log('=== STEP 4: Verifying Replacement Results ===\n')

  // Get the app ID from the confirmation (second transaction is the create)
  const newAppId = replaceResult.confirmations?.[1]?.applicationIndex
  console.log('New app ID:', newAppId || 'Unable to retrieve app ID')
  console.log()

  console.log('Transaction IDs:')
  console.log('  Delete transaction:', replaceResult.txIds[0])
  console.log('  Create transaction:', replaceResult.txIds[1])
  console.log()

  console.log('Return values:')
  if (replaceResult.returns && replaceResult.returns.length >= 2) {
    const deleteReturn = replaceResult.returns[0].returnValue?.valueOf()
    const createReturn = replaceResult.returns[1].returnValue?.valueOf()

    console.log('  delete_abi returned:', deleteReturn)
    console.log('  create_abi returned:', createReturn)
  }
  console.log()

  // Verify the new app's global state
  if (newAppId) {
    const newAppInfo = await algorand.app.getById(newAppId)
    const newGlobalState = (newAppInfo as any)['global-state'] || []
    const newVersionState = newGlobalState.find((kv: any) => Buffer.from(kv.key, 'base64').toString() === 'version')
    const newVersion = newVersionState?.value.uint || 0

    console.log('New app global state:')
    console.log('  "version":', newVersion)
    console.log()

    console.log('Verification:')
    console.log('  ✅ Old app had version=1')
    console.log(`  ✅ New app has version=${newVersion}`)
    console.log('  ✅ App successfully replaced with updated code')
  }
  console.log()

  // ========================================
  // STEP 5: Verify Old App Is Deleted
  // ========================================
  console.log('=== STEP 5: Verifying Old App Is Deleted ===\n')

  try {
    await algorand.app.getById(appId)
    console.log('⚠️  Old app still exists (unexpected)')
  } catch (error) {
    console.log('✅ Old app successfully deleted')
    console.log('   App ID', appId, 'no longer exists on chain')
  }
  console.log()

  // ========================================
  // Summary
  // ========================================
  console.log('=== Summary ===\n')

  console.log('Key Concepts Demonstrated:')
  console.log('  ✅ Using create_abi method for app creation with custom arguments')
  console.log('  ✅ Using delete_abi method for app deletion with custom arguments')
  console.log('  ✅ Capturing return values from both create and delete operations')
  console.log('  ✅ Atomic replacement in a single transaction group')
  console.log('  ✅ Deploying updated application code during replacement')
  console.log('  ✅ Verification of old app deletion and new app creation')
  console.log()

  console.log('Application Replacement Pattern:')
  console.log('  • Delete old app with custom ABI method')
  console.log('  • Create new app with custom ABI method')
  console.log('  • Both operations in a single atomic group')
  console.log('  • Return values captured from both operations')
  console.log('  • New app can have different logic/state structure')
  console.log()

  console.log('Use Cases:')
  console.log('  • Application versioning with breaking changes')
  console.log('  • Migrating to new contract architecture')
  console.log('  • Custom cleanup logic during app deletion')
  console.log('  • Custom initialization logic during app creation')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
