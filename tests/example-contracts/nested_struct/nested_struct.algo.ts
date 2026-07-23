import { Contract } from '@algorandfoundation/tealscript'

type Struct1 = { a: string }
type Struct2 = { x: Struct1 }

export class NestedStruct extends Contract {
  createApplication() {}

  state = GlobalStateMap<uint64, Struct2>({ prefix: '', maxKeys: 10 })

  setValue(key: uint64, value: string): void {
    this.state(key).value = { x: { a: value } }
  }

  getValue(key: uint64): Struct2 {
    return this.state(key).value
  }
}
