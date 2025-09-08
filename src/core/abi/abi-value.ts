export type ABIValue = boolean | number | bigint | string | Uint8Array | ABIValue[] | ABIStructValue

export type ABIStructValue = {
  [key: string]: ABIValue
}

export type ABIReferenceValue = string | bigint
