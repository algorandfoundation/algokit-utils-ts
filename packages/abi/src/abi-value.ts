import type { Address } from '@algorandfoundation/algokit-common'

export type ABIValue = boolean | Address | number | bigint | string | Uint8Array | ABIValue[] | ABIStructValue

export type ABIStructValue = {
  [key: string]: ABIValue
}

export type ABIReferenceValue = string | bigint
