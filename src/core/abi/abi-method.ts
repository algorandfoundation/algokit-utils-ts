import { ABIType } from './abi-type'
import { ARC28Event } from './event'

export type ABITransactionType = 'txn' | 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl'
export type ABIReferenceType = 'account' | 'application' | 'asset'
export type ABIArgumentType = ABIType | ABITransactionType | ABIReferenceType
export type ABIReturnType = ABIType | 'void'

export type ABIMethod = {
  name: string
  description?: string
  args: Array<{
    type: ABIArgumentType
    name?: string
    description?: string
  }>
  returns: { type: ABIReturnType; description?: string }
  events?: ARC28Event[]
  readonly?: boolean
}
