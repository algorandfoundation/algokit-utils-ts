import { Contract } from '@algorandfoundation/tealscript'

export class DeployError extends Contract {
  createApplication() {
    throw new Error('custom error message')
  }
}
