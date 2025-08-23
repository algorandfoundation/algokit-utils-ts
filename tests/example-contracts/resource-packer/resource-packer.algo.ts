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
    throw Error('Some error')
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

  createBoxInNewApp(mbrPayment: PayTxn): void {
    verifyPayTxn(mbrPayment, {
      receiver: this.app.address,
    })

    sendMethodCall<[], void>({
      name: 'createApplication',
      approvalProgram: InnerBoxApp.approvalProgram(),
      clearStateProgram: InnerBoxApp.clearProgram(),
    })

    const appId = this.itxn.createdApplicationID
    const appAddr = appId.address

    sendPayment({ receiver: appAddr, amount: mbrPayment.amount })

    sendMethodCall<typeof InnerBoxApp.prototype.createEmptyBox>({
      applicationID: appId,
    })
  }
}

class InnerBoxApp extends Contract {
  emptyBox = BoxKey<StaticBytes<0>>()

  createEmptyBox(): void {
    this.emptyBox.create()
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
