/* eslint-disable @typescript-eslint/no-empty-function */
import { Contract } from '@algorandfoundation/tealscript'

class ExternalApp extends Contract {
  localKey = LocalStateKey<bytes>()

  boxKey = BoxKey<bytes>()

  asa = GlobalStateKey<AssetID>()

  optInToApplication(): void {
    this.localKey(this.txn.sender).value = 'foo'
  }

  dummy(): void {}

  error(): void {
    throw Error()
  }

  boxWithPayment(_payment: PayTxn): void {
    this.boxKey.value = 'foo'
  }

  createAsset(): void {
    this.asa.value = sendAssetCreation({
      configAssetTotal: 1,
    })
  }

  senderAssetBalance(): void {
    assert(!this.txn.sender.isOptedInToAsset(this.asa.value))
  }
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
class ResourcePackerv8 extends Contract {
  programVersion = 8

  externalAppID = GlobalStateKey<AppID>()

  asa = GlobalStateKey<AssetID>()

  smallBoxKey = BoxKey<bytes>({ key: 's' })

  mediumBoxKey = BoxKey<bytes>({ key: 'm' })

  bootstrap(): void {
    sendMethodCall<[], void>({
      name: 'createApplication',
      approvalProgram: ExternalApp.approvalProgram(),
      clearStateProgram: ExternalApp.clearProgram(),
      localNumByteSlice: ExternalApp.schema.local.numByteSlice,
      globalNumByteSlice: ExternalApp.schema.global.numByteSlice,
      globalNumUint: ExternalApp.schema.global.numUint,
      localNumUint: ExternalApp.schema.local.numUint,
    })

    this.externalAppID.value = this.itxn.createdApplicationID

    this.asa.value = sendAssetCreation({
      configAssetTotal: 1,
    })
  }

  addressBalance(addr: Address): void {
    log(rawBytes(addr.isInLedger))
  }

  smallBox(): void {
    this.smallBoxKey.value = ''
  }

  mediumBox(): void {
    this.mediumBoxKey.create(5_000)
  }

  externalAppCall(): void {
    sendMethodCall<[], void>({
      applicationID: this.externalAppID.value,
      name: 'dummy',
    })
  }

  assetTotal(): void {
    assert(this.asa.value.total)
  }

  hasAsset(addr: Address): void {
    assert(!addr.isOptedInToAsset(this.asa.value))
  }

  externalLocal(addr: Address): void {
    log(this.externalAppID.value.localState(addr, 'localKey') as bytes)
  }
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
class ResourcePackerv9 extends Contract {
  programVersion = 9

  externalAppID = GlobalStateKey<AppID>()

  asa = GlobalStateKey<AssetID>()

  smallBoxKey = BoxKey<bytes>({ key: 's' })

  mediumBoxKey = BoxKey<bytes>({ key: 'm' })

  bootstrap(): void {
    sendMethodCall<[], void>({
      name: 'createApplication',
      approvalProgram: ExternalApp.approvalProgram(),
      clearStateProgram: ExternalApp.clearProgram(),
      localNumByteSlice: ExternalApp.schema.local.numByteSlice,
      globalNumByteSlice: ExternalApp.schema.global.numByteSlice,
      globalNumUint: ExternalApp.schema.global.numUint,
      localNumUint: ExternalApp.schema.local.numUint,
    })

    this.externalAppID.value = this.itxn.createdApplicationID

    this.asa.value = sendAssetCreation({
      configAssetTotal: 1,
    })
  }

  addressBalance(addr: Address): void {
    log(rawBytes(addr.isInLedger))
  }

  smallBox(): void {
    this.smallBoxKey.value = ''
  }

  mediumBox(): void {
    this.mediumBoxKey.create(5_000)
  }

  externalAppCall(): void {
    sendMethodCall<[], void>({
      applicationID: this.externalAppID.value,
      name: 'dummy',
    })
  }

  assetTotal(): void {
    assert(this.asa.value.total)
  }

  hasAsset(addr: Address): void {
    assert(!addr.isOptedInToAsset(this.asa.value))
  }

  externalLocal(addr: Address): void {
    log(this.externalAppID.value.localState(addr, 'localKey') as bytes)
  }
}
