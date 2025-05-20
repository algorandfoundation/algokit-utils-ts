import { Contract } from '@algorandfoundation/tealscript'

export class DeployError extends Contract {
  createApplication() {
    throw Error('custom error message')
  }
}
