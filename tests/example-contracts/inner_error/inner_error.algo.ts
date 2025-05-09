import { Contract } from '@algorandfoundation/tealscript'

export class InnerApp extends Contract {
  throwError() {
    throw Error('custom error message')
  }
}

export class OuterApp extends Contract {
  callInner(id: AppID) {
    sendMethodCall<typeof InnerApp.prototype.throwError>({
      applicationID: id,
      methodArgs: [],
    })
  }
}
