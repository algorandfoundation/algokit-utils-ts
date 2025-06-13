import { addressFromString } from '@algorandfoundation/algokit-transact'
import algosdk from 'algosdk'

export const mapAlgosdkAddressToAlgoKitCoreAddress = (address: string | algosdk.Address) => {
  return addressFromString(typeof address === 'string' ? address : address.toString())
}
