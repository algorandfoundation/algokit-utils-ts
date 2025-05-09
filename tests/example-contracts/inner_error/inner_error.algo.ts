import { Contract } from '@algorandfoundation/tealscript'

export class InnerApp extends Contract {
  throwError() {
    throw Error('custom error message')
  }
}

export class MiddleApp extends Contract {
  callInner(id: AppID) {
    sendMethodCall<typeof InnerApp.prototype.throwError>({
      applicationID: id,
      methodArgs: [],
    })
  }
}

export class OuterApp extends Contract {
  callMiddle(middleId: AppID, innerId: AppID) {
    sendMethodCall<typeof MiddleApp.prototype.callInner>({
      applicationID: middleId,
      methodArgs: [innerId],
    })
  }
}
