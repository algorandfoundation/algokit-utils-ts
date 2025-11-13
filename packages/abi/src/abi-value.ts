export type ABIValue = boolean | number | bigint | string | Uint8Array | ABIValue[] | ABIStructValue | ABIAddressValue

export type ABIStructValue = {
  [key: string]: ABIValue
}

export type ABIReferenceValue = string | bigint

export interface ABIAddressValue {
  readonly publicKey: Uint8Array
}
