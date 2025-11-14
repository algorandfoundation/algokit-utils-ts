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
  console.log('=== Retrieve and Decode Application State ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // Load and deploy contract
  const appSpecFile = await readFile(path.join(__dirname, 'contract.json'), 'utf-8')
  const appSpec: AppSpec = JSON.parse(appSpecFile)

  const approvalTeal = await readFile(path.join(__dirname, 'approval.teal'), 'utf-8')
  const clearTeal = await readFile(path.join(__dirname, 'clear.teal'), 'utf-8')

  const approvalCompiled = await algorand.app.compileTeal(approvalTeal)
  const clearCompiled = await algorand.app.compileTeal(clearTeal)

  console.log('Deploying app...')
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

  // Set up state for demonstration
  const setGlobalMethod = new algosdk.ABIMethod(appSpec.methods.find((m) => m.name === 'set_global')!)
  const setLocalMethod = new algosdk.ABIMethod(appSpec.methods.find((m) => m.name === 'set_local')!)
  const setBoxMethod = new algosdk.ABIMethod(appSpec.methods.find((m) => m.name === 'set_box')!)

  console.log('Setting up test data...')
  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setGlobalMethod,
    args: [42, 100, 'hello', new Uint8Array([1, 2, 3, 4])],
  })

  await algorand.newGroup().addAppCall({
    sender: deployer.addr,
    appId,
    onComplete: algosdk.OnApplicationComplete.OptInOC,
  }).send()

  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setLocalMethod,
    args: [11, 22, 'world', new Uint8Array([5, 6, 7, 8])],
  })

  const appAddress = algosdk.getApplicationAddress(appId)
  await algorand.send.payment({
    sender: deployer.addr,
    receiver: appAddress,
    amount: microAlgos(200_000),
  })

  const boxName1 = new Uint8Array([0, 0, 0, 1])
  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setBoxMethod,
    args: [boxName1, Buffer.from('test-value')],
    boxReferences: [{ appId: 0n, name: boxName1 }],
  })

  console.log('✅ Test data created')
  console.log()

  // ========================================
  // DEMONSTRATION: Decode Global State
  // ========================================
  console.log('=== Decoding Global State ===\n')

  const appInfo = await algorand.app.getById(appId)
  const globalState = (appInfo as any).params?.globalState || []

  console.log('Decoding global state values...')
  for (const kv of globalState) {
    const key = Buffer.from(kv.key).toString()
    const value = kv.value

    if (value.uint !== undefined) {
      console.log(`  ${key}: ${value.uint} (type: uint64)`)
    } else if (value.bytes) {
      const bytes = Buffer.from(value.bytes)
      const asString = bytes.toString('utf8')
      const asHex = bytes.toString('hex')
      console.log(`  ${key}: "${asString}" (hex: ${asHex}, type: bytes)`)
    }
  }
  console.log()

  // ========================================
  // DEMONSTRATION: Decode Local State
  // ========================================
  console.log('=== Decoding Local State ===\n')

  const accountInfo = await algorand.account.getInformation(deployer.addr)
  const appsLocalState = (accountInfo as any).appsLocalState || []
  const appLocalState = appsLocalState.find((app: any) => Number(app.id) === Number(appId))
  const localStateKvs = appLocalState?.keyValue || []

  console.log('Decoding local state values...')
  for (const kv of localStateKvs) {
    const key = Buffer.from(kv.key).toString()
    const value = kv.value

    if (value.uint !== undefined) {
      console.log(`  ${key}: ${value.uint} (type: uint64)`)
    } else if (value.bytes) {
      const bytes = Buffer.from(value.bytes)
      const asString = bytes.toString('utf8')
      const asHex = bytes.toString('hex')
      console.log(`  ${key}: "${asString}" (hex: ${asHex}, type: bytes)`)
    }
  }
  console.log()

  // ========================================
  // DEMONSTRATION: Decode Box Storage
  // ========================================
  console.log('=== Decoding Box Storage ===\n')

  const boxes = await algorand.app.getBoxNames(appId)
  console.log(`Found ${boxes.length} box(es)`)
  console.log()

  for (const box of boxes) {
    const boxValue = await algorand.app.getBoxValue(appId, box.nameRaw)

    console.log(`Box: ${box.nameBase64}`)
    console.log(`  Name (hex): ${Buffer.from(box.nameRaw).toString('hex')}`)
    console.log(`  Value (string): "${Buffer.from(boxValue).toString('utf8')}"`)
    console.log(`  Value (hex): ${Buffer.from(boxValue).toString('hex')}`)
    console.log(`  Value (base64): ${Buffer.from(boxValue).toString('base64')}`)
    console.log(`  Size: ${boxValue.length} bytes`)
    console.log()
  }

  // ========================================
  // DEMONSTRATION: Decode ABI-Encoded Values
  // ========================================
  console.log('=== Decoding ABI-Encoded Box Values ===\n')

  // Store ABI-encoded values
  const abiUint32 = new ABIUintType(32)
  const abiUint64 = new ABIUintType(64)

  const boxName2 = new Uint8Array([0, 0, 0, 2])
  const boxName3 = new Uint8Array([0, 0, 0, 3])

  console.log('Storing ABI-encoded values...')
  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setBoxMethod,
    args: [boxName2, abiUint32.encode(1234567890)],
    boxReferences: [{ appId: 0n, name: boxName2 }],
  })

  await algorand.send.appCallMethodCall({
    sender: deployer.addr,
    appId,
    method: setBoxMethod,
    args: [boxName3, abiUint64.encode(9876543210123456789n)],
    boxReferences: [{ appId: 0n, name: boxName3 }],
  })

  console.log('✅ ABI values stored')
  console.log()

  console.log('Decoding ABI-encoded boxes...')

  const box2Value = await algorand.app.getBoxValue(appId, boxName2)
  const box2Decoded = abiUint32.decode(box2Value)
  console.log(`Box ${Buffer.from(boxName2).toString('base64')} (uint32):`)
  console.log(`  Raw bytes (hex): ${Buffer.from(box2Value).toString('hex')}`)
  console.log(`  Decoded value: ${Number(box2Decoded)}`)
  console.log()

  const box3Value = await algorand.app.getBoxValue(appId, boxName3)
  const box3Decoded = abiUint64.decode(box3Value)
  console.log(`Box ${Buffer.from(boxName3).toString('base64')} (uint64):`)
  console.log(`  Raw bytes (hex): ${Buffer.from(box3Value).toString('hex')}`)
  console.log(`  Decoded value: ${box3Decoded}`)
  console.log()

  // ========================================
  // Summary
  // ========================================
  console.log('=== Summary ===\n')

  console.log('State Retrieval Methods Demonstrated:')
  console.log('  ✅ algorand.app.getById() - Retrieve app info with global state')
  console.log('  ✅ algorand.account.getInformation() - Retrieve account info with local state')
  console.log('  ✅ algorand.app.getBoxNames() - List all boxes for an app')
  console.log('  ✅ algorand.app.getBoxValue() - Retrieve individual box values')
  console.log()

  console.log('Decoding Techniques Demonstrated:')
  console.log('  ✅ Buffer.from(bytes).toString() - Decode bytes to string')
  console.log('  ✅ Buffer.from(bytes).toString("hex") - Decode bytes to hex')
  console.log('  ✅ Buffer.from(bytes).toString("base64") - Decode bytes to base64')
  console.log('  ✅ ABIType.decode() - Decode ABI-encoded values')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
