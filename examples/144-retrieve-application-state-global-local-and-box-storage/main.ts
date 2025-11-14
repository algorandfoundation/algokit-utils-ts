import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils'
import algosdk, { ABIUintType } from 'algosdk'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface AppSpec {
  name: string
  methods: Array<{
    name: string
    args: Array<{ type: string; name: string }>
    returns: { type: string }
  }>
  state: {
    global: {
      num_byte_slices: number
      num_uints: number
    }
    local: {
      num_byte_slices: number
      num_uints: number
    }
  }
}

async function main() {
  console.log('=== Retrieve Application State (Global, Local, and Box Storage) ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // ========================================
  // STEP 1: Load Contract and Deploy App
  // ========================================
  console.log('=== STEP 1: Loading Contract and Deploying App ===\n')

  const appSpecFile = await readFile(path.join(__dirname, 'contract.json'), 'utf-8')
  const appSpec: AppSpec = JSON.parse(appSpecFile)

  // Compile TEAL programs
  const approvalTeal = await readFile(path.join(__dirname, 'approval.teal'), 'utf-8')
  const clearTeal = await readFile(path.join(__dirname, 'clear.teal'), 'utf-8')

  const approvalCompiled = await algorand.app.compileTeal(approvalTeal)
  const clearCompiled = await algorand.app.compileTeal(clearTeal)

  console.log('Deploying app with state schema...')
  const createResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: approvalCompiled.compiledBase64ToBytes,
    clearStateProgram: clearCompiled.compiledBase64ToBytes,
    schema: {
      globalInts: appSpec.state.global.num_uints,
      globalByteSlices: appSpec.state.global.num_byte_slices,
      localInts: appSpec.state.local.num_uints,
      localByteSlices: appSpec.state.local.num_byte_slices,
    },
  })

  const appId = createResult.appId
  console.log('✅ App deployed with ID:', appId)
  console.log()

  // ========================================
  // STEP 2: Working with Global State
  // ========================================
  console.log('=== STEP 2: Working with Global State ===\n')

  // Create ABI method for set_global
  const setGlobalMethod = new algosdk.ABIMethod(appSpec.methods.find((m) => m.name === 'set_global')!)

  console.log('Setting global state values...')
  console.log('  int1: 42')
  console.log('  int2: 100')
  console.log('  bytes1: "hello"')
  console.log('  bytes2: [1, 2, 3, 4]')

  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setGlobalMethod,
    args: [42, 100, 'hello', new Uint8Array([1, 2, 3, 4])],
  })

  console.log('\nRetrieving global state...')
  const appInfo = await algorand.app.getById(appId)
  const globalState = (appInfo as any).params?.globalState || []

  console.log('\nGlobal State Retrieved:')
  if (globalState.length === 0) {
    console.log('  (No global state found)')
  } else {
    for (const kv of globalState) {
      const key = Buffer.from(kv.key).toString()
      const value = kv.value
      if (value.uint !== undefined && value.uint !== 0n) {
        // uint
        console.log(`  ${key}: ${value.uint}`)
      } else if (value.bytes && value.bytes.length > 0) {
        // bytes
        const valueBytes = Buffer.from(value.bytes)
        const valueStr = valueBytes.toString('utf8')
        console.log(`  ${key}: "${valueStr}" (raw: [${Array.from(valueBytes).join(', ')}])`)
      } else if (value.uint !== undefined) {
        // uint with value 0
        console.log(`  ${key}: ${value.uint}`)
      }
    }
  }
  console.log()

  // ========================================
  // STEP 3: Working with Local State
  // ========================================
  console.log('=== STEP 3: Working with Local State ===\n')

  console.log('Opting in to the application...')
  await algorand.newGroup().addAppCall({
    sender: deployer.addr,
    appId,
    onComplete: algosdk.OnApplicationComplete.OptInOC,
  }).send()
  console.log('✅ Opted in successfully')

  // Create ABI method for set_local
  const setLocalMethod = new algosdk.ABIMethod(appSpec.methods.find((m) => m.name === 'set_local')!)

  console.log('\nSetting local state values...')
  console.log('  local_int1: 11')
  console.log('  local_int2: 22')
  console.log('  local_bytes1: "world"')
  console.log('  local_bytes2: [5, 6, 7, 8]')

  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setLocalMethod,
    args: [11, 22, 'world', new Uint8Array([5, 6, 7, 8])],
  })

  console.log('\nRetrieving local state for account:', deployer.addr.toString())
  const accountInfo = await algorand.account.getInformation(deployer.addr)
  const appsLocalState = (accountInfo as any).appsLocalState || []
  const appLocalState = appsLocalState.find((app: any) => Number(app.id) === Number(appId))
  const localStateKvs = appLocalState?.keyValue || []

  console.log('\nLocal State Retrieved:')
  if (localStateKvs.length === 0) {
    console.log('  (No local state found)')
  } else {
    for (const kv of localStateKvs) {
      const key = Buffer.from(kv.key).toString()
      const value = kv.value
      if (value.uint !== undefined && value.uint !== 0n) {
        // uint
        console.log(`  ${key}: ${value.uint}`)
      } else if (value.bytes && value.bytes.length > 0) {
        // bytes
        const valueBytes = Buffer.from(value.bytes)
        const valueStr = valueBytes.toString('utf8')
        console.log(`  ${key}: "${valueStr}" (raw: [${Array.from(valueBytes).join(', ')}])`)
      } else if (value.uint !== undefined) {
        // uint with value 0
        console.log(`  ${key}: ${value.uint}`)
      }
    }
  }
  console.log()

  // ========================================
  // STEP 4: Working with Box Storage
  // ========================================
  console.log('=== STEP 4: Working with Box Storage ===\n')

  // Define box names
  const boxName1 = new Uint8Array([0, 0, 0, 1])
  const boxName1Base64 = Buffer.from(boxName1).toString('base64')
  const boxName2 = new Uint8Array([0, 0, 0, 2])
  const boxName2Base64 = Buffer.from(boxName2).toString('base64')

  // Fund the app account to cover box storage minimum balance
  console.log('Funding app account for box storage...')
  const appAddress = algosdk.getApplicationAddress(appId)
  await algorand.send.payment({
    sender: deployer.addr,
    receiver: appAddress,
    amount: microAlgos(200_000), // 0.2 ALGO for box storage
  })
  console.log('✅ App account funded')

  // Create ABI method for set_box
  const setBoxMethod = new algosdk.ABIMethod(appSpec.methods.find((m) => m.name === 'set_box')!)

  console.log('\nCreating boxes with string values...')
  console.log(`  Box ${boxName1Base64}: "value1"`)
  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setBoxMethod,
    args: [boxName1, Buffer.from('value1')],
    boxReferences: [{ appId: 0n, name: boxName1 }],
  })

  console.log(`  Box ${boxName2Base64}: "value2"`)
  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setBoxMethod,
    args: [boxName2, Buffer.from('value2')],
    boxReferences: [{ appId: 0n, name: boxName2 }],
  })

  console.log('\nRetrieving all boxes...')
  const boxes = await algorand.app.getBoxNames(appId)
  console.log(`✅ Total boxes found: ${boxes.length}`)

  console.log('\nBox values:')
  for (const box of boxes) {
    const boxValue = await algorand.app.getBoxValue(appId, box.nameRaw)
    const boxValueStr = Buffer.from(boxValue).toString('utf8')
    console.log(`  ${box.nameBase64}: "${boxValueStr}"`)
  }
  console.log()

  // ========================================
  // STEP 5: Working with ABI-Encoded Box Values
  // ========================================
  console.log('=== STEP 5: Working with ABI-Encoded Box Values ===\n')

  const expectedValue = 1234567890
  console.log(`Setting box with ABI-encoded uint32 value: ${expectedValue}`)

  // Encode the value as ABI uint32
  const abiType = new ABIUintType(32)
  const encodedValue = abiType.encode(expectedValue)

  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setBoxMethod,
    args: [boxName1, encodedValue],
    boxReferences: [{ appId: 0n, name: boxName1 }],
  })

  console.log('\nRetrieving and decoding ABI box value...')
  const box1Value = await algorand.app.getBoxValue(appId, boxName1)
  const decodedValue = abiType.decode(box1Value)

  console.log(`✅ ABI-Decoded box value: ${Number(decodedValue)}`)
  console.log(`   Original value: ${expectedValue}`)
  console.log(`   Values match: ${Number(decodedValue) === expectedValue}`)
  console.log()

  // ========================================
  // Summary
  // ========================================
  console.log('=== Summary ===\n')

  console.log('Key Concepts Demonstrated:')
  console.log('  ✅ Deploying app with global and local state schema')
  console.log('  ✅ Setting and retrieving global state (integers and byte arrays)')
  console.log('  ✅ Opting in to enable local state')
  console.log('  ✅ Setting and retrieving local state per account')
  console.log('  ✅ Funding app account for box storage')
  console.log('  ✅ Creating and retrieving box storage')
  console.log('  ✅ Working with ABI-encoded box values')
  console.log()

  console.log('State Management Patterns:')
  console.log('  • Global State: Shared across all users (limited to schema size)')
  console.log('  • Local State: Per-account storage (requires opt-in)')
  console.log('  • Box Storage: Flexible key-value storage (requires funding)')
  console.log('  • ABI Encoding: Type-safe encoding/decoding of complex values')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
