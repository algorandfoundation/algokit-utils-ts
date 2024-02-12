import { AccountConfig } from '../types/account'

/**  @deprecated Use algokit.mnemonicAccountFromEnvironment, which doesn't need this function
 * Returns the Account configuration from environment variables
 *
 * @param accountName account name
 *
 * @example environment variables
 * {accountName}_MNEMONIC
 * {accountName}_SENDER
 *
 */
export function getAccountConfigFromEnvironment(accountName: string): AccountConfig {
  if (!process || !process.env) {
    throw new Error('Attempt to get account with private key from a non Node.js context; not supported!')
  }

  return {
    accountMnemonic: process.env[`${accountName.toUpperCase()}_MNEMONIC`] || '',
    senderAddress: process.env[`${accountName.toUpperCase()}_SENDER`],
    accountName,
  }
}
