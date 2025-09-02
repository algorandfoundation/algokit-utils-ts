import {
  ABIAddressValue,
  ABIBoolValue,
  ABIByteValue,
  ABIDynamicArrayValue,
  ABIStaticArrayValue,
  ABIStringValue,
  ABIStructValue,
  ABITupleValue,
  ABIUfixedValue,
  ABIUintValue,
} from './types'

export type ABIValue =
  | ABIStringValue
  | ABIUintValue
  | ABIUfixedValue
  | ABIBoolValue
  | ABIByteValue
  | ABIAddressValue
  | ABIDynamicArrayValue
  | ABIStaticArrayValue
  | ABIStructValue
  | ABITupleValue
