// export type ABIValue = string | bigint | boolean | number | ABIValue[] | Uint8Array | ABIStructValue

// export type ABIStructValue = {
//   [key: string]: ABIValue
// }

export type ABIValue =
  | {
      type: 'String'
      data: string
    }
  | {
      type: 'Bigint'
      data: bigint
    }
  | {
      type: 'Boolean'
      data: boolean
    }
  | {
      type: 'Number'
      data: number
    }
  | {
      type: 'Array'
      data: ABIValue[]
    }
  | {
      type: 'Uint8Array'
      data: Uint8Array
    }
  | {
      type: 'Struct'
      data: ABIStructValue
    }

export type ABIStructValue = {
  [key: string]: ABIValue
}
