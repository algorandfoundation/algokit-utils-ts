import { Contract } from '@algorandfoundation/tealscript'

type ByteArraysInStruct = {
  arr1: bytes
  arr2: bytes<4>
  nestedStruct: {
    arr3: bytes
    nonBytes: uint64
  }
}
export class ByteArrays extends Contract {
  dynamicByteArrayGlobal = GlobalStateKey<bytes>()
  staticByteArrayGlobal = GlobalStateKey<bytes<4>>()
  nestedByteArraysGlobal = GlobalStateKey<[bytes, bytes<4>]>()
  byteArraysInStructGlobal = GlobalStateKey<ByteArraysInStruct>()

  dynamicByteArrayLocal = LocalStateKey<bytes>()
  staticByteArrayLocal = LocalStateKey<bytes<4>>()
  nestedByteArraysLocal = LocalStateKey<[bytes, bytes<4>]>()
  byteArraysInStructLocal = LocalStateKey<ByteArraysInStruct>()

  dynamicByteArrayBox = BoxKey<bytes>()
  staticByteArrayBox = BoxKey<bytes<4>>()
  nestedByteArraysBox = BoxKey<[bytes, bytes<4>]>()
  byteArraysInStructBox = BoxKey<ByteArraysInStruct>()

  dynamicByteArrayGlobalMap = GlobalStateMap<uint64, bytes>({ maxKeys: 1, prefix: 'D' })
  staticByteArrayGlobalMap = GlobalStateMap<uint64, bytes<4>>({ maxKeys: 1, prefix: 'S' })
  nestedByteArraysGlobalMap = GlobalStateMap<uint64, [bytes, bytes<4>]>({ maxKeys: 1, prefix: 'N' })
  byteArraysInStructGlobalMap = GlobalStateMap<uint64, ByteArraysInStruct>({ maxKeys: 1, prefix: 'B' })

  dynamicByteArrayLocalMap = LocalStateMap<uint64, bytes>({ maxKeys: 1, prefix: 'D' })
  staticByteArrayLocalMap = LocalStateMap<uint64, bytes<4>>({ maxKeys: 1, prefix: 'S' })
  nestedByteArraysLocalMap = LocalStateMap<uint64, [bytes, bytes<4>]>({ maxKeys: 1, prefix: 'N' })
  byteArraysInStructLocalMap = LocalStateMap<uint64, ByteArraysInStruct>({ maxKeys: 1, prefix: 'M' })

  dynamicByteArrayBoxMap = BoxMap<uint64, bytes>({ prefix: 'D' })
  staticByteArrayBoxMap = BoxMap<uint64, bytes<4>>({ prefix: 'S' })
  nestedByteArraysBoxMap = BoxMap<uint64, [bytes, bytes<4>]>({ prefix: 'N' })
  byteArraysInStructBoxMap = BoxMap<uint64, ByteArraysInStruct>({ prefix: 'M' })

  dynamicByteArrayGlobalMapKey = GlobalStateMap<bytes, uint64>({ maxKeys: 1, prefix: 'KD' })
  staticByteArrayGlobalMapKey = GlobalStateMap<bytes<4>, uint64>({ maxKeys: 1, prefix: 'KS' })
  nestedByteArraysGlobalMapKey = GlobalStateMap<[bytes, bytes<4>], uint64>({ maxKeys: 1, prefix: 'KN' })
  byteArraysInStructGlobalMapKey = GlobalStateMap<ByteArraysInStruct, uint64>({ maxKeys: 1, prefix: 'KB' })

  dynamicByteArrayLocalMapKey = LocalStateMap<bytes, uint64>({ maxKeys: 1, prefix: 'KD' })
  staticByteArrayLocalMapKey = LocalStateMap<bytes<4>, uint64>({ maxKeys: 1, prefix: 'KS' })
  nestedByteArraysLocalMapKey = LocalStateMap<[bytes, bytes<4>], uint64>({ maxKeys: 1, prefix: 'KN' })
  byteArraysInStructLocalMapKey = LocalStateMap<ByteArraysInStruct, uint64>({ maxKeys: 1, prefix: 'KB' })

  dynamicByteArrayBoxMapKey = BoxMap<bytes, uint64>({ prefix: 'KD' })
  staticByteArrayBoxMapKey = BoxMap<bytes<4>, uint64>({ prefix: 'KS' })
  nestedByteArraysBoxMapKey = BoxMap<[bytes, bytes<4>], uint64>({ prefix: 'KN' })
  byteArraysInStructBoxMapKey = BoxMap<ByteArraysInStruct, uint64>({ prefix: 'KB' })

  @allow.create('OptIn')
  createApplication() {
    increaseOpcodeBudget()
    this.dynamicByteArrayGlobal.value = this.dynamicByteArray()
    this.staticByteArrayGlobal.value = this.staticByteArray()
    this.nestedByteArraysGlobal.value = this.nestedByteArrays()
    this.byteArraysInStructGlobal.value = this.byteArraysInStruct()

    this.dynamicByteArrayLocal(this.txn.sender).value = this.dynamicByteArray()
    this.staticByteArrayLocal(this.txn.sender).value = this.staticByteArray()
    this.nestedByteArraysLocal(this.txn.sender).value = this.nestedByteArrays()
    this.byteArraysInStructLocal(this.txn.sender).value = this.byteArraysInStruct()

    this.dynamicByteArrayGlobalMap(0).value = this.dynamicByteArray()
    this.staticByteArrayGlobalMap(0).value = this.staticByteArray()
    this.nestedByteArraysGlobalMap(0).value = this.nestedByteArrays()
    this.byteArraysInStructGlobalMap(0).value = this.byteArraysInStruct()

    this.dynamicByteArrayLocalMap(this.txn.sender, 0).value = this.dynamicByteArray()
    this.staticByteArrayLocalMap(this.txn.sender, 0).value = this.staticByteArray()
    this.nestedByteArraysLocalMap(this.txn.sender, 0).value = this.nestedByteArrays()
    this.byteArraysInStructLocalMap(this.txn.sender, 0).value = this.byteArraysInStruct()

    this.dynamicByteArrayGlobalMapKey(this.dynamicByteArray()).value = 0
    this.staticByteArrayGlobalMapKey(this.staticByteArray()).value = 0
    this.nestedByteArraysGlobalMapKey(this.nestedByteArrays()).value = 0
    this.byteArraysInStructGlobalMapKey(this.byteArraysInStruct()).value = 0

    this.dynamicByteArrayLocalMapKey(this.txn.sender, this.dynamicByteArray()).value = 0
    this.staticByteArrayLocalMapKey(this.txn.sender, this.staticByteArray()).value = 0
    this.nestedByteArraysLocalMapKey(this.txn.sender, this.nestedByteArrays()).value = 0
    this.byteArraysInStructLocalMapKey(this.txn.sender, this.byteArraysInStruct()).value = 0
  }

  setBoxValues() {
    this.dynamicByteArrayBox.value = this.dynamicByteArray()
    this.staticByteArrayBox.value = this.staticByteArray()
    this.nestedByteArraysBox.value = this.nestedByteArrays()
    this.byteArraysInStructBox.value = this.byteArraysInStruct()

    this.dynamicByteArrayBoxMap(0).value = this.dynamicByteArray()
    this.staticByteArrayBoxMap(0).value = this.staticByteArray()
    this.nestedByteArraysBoxMap(0).value = this.nestedByteArrays()
    this.byteArraysInStructBoxMap(0).value = this.byteArraysInStruct()

    this.dynamicByteArrayBoxMapKey(this.dynamicByteArray()).value = 0
    this.staticByteArrayBoxMapKey(this.staticByteArray()).value = 0
    this.nestedByteArraysBoxMapKey(this.nestedByteArrays()).value = 0
    this.byteArraysInStructBoxMapKey(this.byteArraysInStruct()).value = 0
  }

  dynamicByteArray(): bytes {
    return hex('0xdeadbeef')
  }

  staticByteArray(): bytes<4> {
    return hex('0xdeadbeef') as bytes<4>
  }

  nestedByteArrays(): [bytes, bytes<4>] {
    return [hex('0xdeadbeef'), hex('0xcafebabe') as bytes<4>]
  }

  byteArraysInStruct(): ByteArraysInStruct {
    return {
      arr1: hex('0xdeadbeef'),
      arr2: hex('0xcafebabe') as bytes<4>,
      nestedStruct: {
        arr3: hex('0xdeadc0de'),
        nonBytes: 4,
      },
    }
  }
}
