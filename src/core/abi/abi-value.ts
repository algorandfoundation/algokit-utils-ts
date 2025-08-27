export type ABIValue =
  | { kind: 'uint'; value: bigint }
  | { kind: 'string'; value: string }
  | { kind: 'bool'; value: boolean }
  | { kind: 'byte'; value: number }
  | { kind: 'address'; value: string }
  | { kind: 'array'; value: ABIValue[] }
  | string
  | bigint
  | boolean
  | number
