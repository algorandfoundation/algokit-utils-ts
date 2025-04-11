import { Contract } from '@algorandfoundation/tealscript'

export class BoxMapTest extends Contract {
  bMap = BoxMap<uint64, string>({ prefix: 'b' })

  setValue(key: uint64, value: string): void {
    this.bMap(key).value = value
  }
}
