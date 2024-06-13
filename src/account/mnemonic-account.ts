import algosdk from 'algosdk'
import Account = algosdk.Account

/**
 * @deprecated Use `algorandClient.account.fromMnemonic(mnemonicSecret)` or `algosdk.mnemonicToSecretKey(mnemonicSecret)` instead.
 *
 * Returns an Algorand account with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.
 *
 * This is a wrapper around algosdk.mnemonicToSecretKey to provide a more friendly/obvious name.
 *
 * @param mnemonicSecret The mnemonic secret representing the private key of an account; **Note: Be careful how the mnemonic is handled**,
 *  never commit it into source control and ideally load it from the environment (ideally via a secret storage service) rather than the file system.
 */
export function mnemonicAccount(mnemonicSecret: string): Account {
  // This method is confusingly named, so this function provides a more dev friendly "wrapper" name
  return algosdk.mnemonicToSecretKey(mnemonicSecret)
}
