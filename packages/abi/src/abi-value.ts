import { Address } from '@algorandfoundation/algokit-common'

export type ABIValue = boolean | number | bigint | string | Uint8Array | ABIValue[] | ABIStructValue | Address

export type ABIStructValue = {
  [key: string]: ABIValue
}

export type ABIReferenceValue = string | bigint
