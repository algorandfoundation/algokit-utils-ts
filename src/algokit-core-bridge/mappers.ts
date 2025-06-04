import { addressFromString } from '@algorandfoundation/algokit-transact'
import algosdk from 'algosdk'

export const mapFromAlgosdkAddressToAlgoKitCoreAddress = (address: string | algosdk.Address) => {
  return addressFromString(typeof address === 'string' ? address : address.toString())
}
