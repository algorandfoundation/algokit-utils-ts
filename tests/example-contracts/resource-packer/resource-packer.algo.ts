/* eslint-disable @typescript-eslint/no-empty-function */
import { Contract } from '@algorandfoundation/tealscript'

class ExternalApp extends Contract {
  localKey = LocalStateKey<bytes>()

  boxKey = BoxKey<bytes>()

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
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
class ResourcePackerv8 extends Contract {
  programVersion = 8

  externalAppID = GlobalStateKey<Application>()

  asa = GlobalStateKey<Asset>()

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
    log(itob(addr.hasBalance))
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
    assert(!addr.hasAsset(this.asa.value))
  }

  externalLocal(addr: Address): void {
    log(addr.state(this.externalAppID.value, 'localKey'))
  }
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
class ResourcePackerv9 extends Contract {
  programVersion = 9

  externalAppID = GlobalStateKey<Application>()

  asa = GlobalStateKey<Asset>()

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
    log(itob(addr.hasBalance))
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
    assert(!addr.hasAsset(this.asa.value))
  }

  externalLocal(addr: Address): void {
    log(addr.state(this.externalAppID.value, 'localKey'))
  }
}
