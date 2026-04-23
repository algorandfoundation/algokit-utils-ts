import { expect, test, describe, beforeAll } from 'vitest'
import { deriveHdAccountsFromMnemonic, balance } from './common'
import { Address, Addressable, AlgorandClient, algos, microAlgos } from '../../src'
import { base64ToBytes } from '@algorandfoundation/algokit-common'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export type PartKeyResponse = {
  address: string
  id: string
  key: {
    'selection-participation-key': string
    'state-proof-key': string
    'vote-first-valid': number
    'vote-key-dilution': number
    'vote-last-valid': number
    'vote-participation-key': string
  }
}

export type PartKey = {
  /** The root participation public key */
  voteKey: Uint8Array
  /** The VRF public key */
  selectionKey: Uint8Array
  /** The first round that the participation key is valid. Not to be confused with the `firstValid` round of the keyreg transaction */
  voteFirst: bigint
  /** The last round that the participation key is valid. Not to be confused with the `lastValid` round of the keyreg transaction */
  voteLast: bigint
  /** This is the dilution for the 2-level participation key. It determines the interval (number of rounds) for generating new ephemeral keys */
  voteKeyDilution: bigint
  /** The 64 byte state proof public key commitment */
  stateProofKey: Uint8Array
}

async function generateParticipationKey(algorand: AlgorandClient, address: Addressable): Promise<PartKey> {
  const { algod } = algorand.client
  const status = await algod.status()
  const currentRound = status.lastRound
  const range = { first: currentRound, last: currentRound + 10_000n }

  await algod.httpRequest.request({
    method: 'POST',
    url: '/v2/participation/generate/{address}',
    path: { address: address.addr.toString() },
    query: range,
    headers: { Accept: 'application/json' },
  })

  const maxIters = 10

  for (let i = 0; i < maxIters; i++) {
    const keys: PartKeyResponse[] = await algod.httpRequest.request({
      method: 'GET',
      url: '/v2/participation',
      headers: { Accept: 'application/json' },
    })

    const key = keys.find((k) => k.address == address.addr.toString() && BigInt(k.key['vote-first-valid']) === range.first)
    if (key)
      return {
        voteKey: base64ToBytes(key.key['vote-participation-key']),
        selectionKey: base64ToBytes(key.key['selection-participation-key']),
        voteFirst: BigInt(key.key['vote-first-valid']),
        voteLast: BigInt(key.key['vote-last-valid']),
        voteKeyDilution: BigInt(key.key['vote-key-dilution']),
        stateProofKey: base64ToBytes(key.key['state-proof-key']),
      }
    await delay(1000)
  }

  throw Error(`Unable to find part key after ${maxIters} seconds`)
}

async function goOnline(algorand: AlgorandClient, address: Addressable, makeEligible: boolean) {
  const key = await generateParticipationKey(algorand, address)

  await algorand.send.onlineKeyRegistration({ ...key, sender: address, staticFee: makeEligible ? algos(2) : microAlgos(1_000) })
  return key
}

describe('Epic AK-1003', () => {
  let algorand: AlgorandClient

  beforeAll(async () => {
    algorand = AlgorandClient.defaultLocalNet()
  })

  // Polytest Suite: Epic AK-1003

  describe.sequential('AK-1003 Stories', () => {
    // Polytest Group: AK-1003 Stories

    /*
      AK-1022: Stake funds. As a user I want to be able to stake my funds so that I can receive rewards

      Acceptance Criteria:
      Given I have setup my wallet

      And I have a balance over 30K Algo

      Then I can request a keyreg transaction from a node

      And I can sign the keyreg transaction



      exclusion: pooled staking
     */
    test('AK-1022', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 1 })
      const account = accounts[0]

      await algorand.account.ensureFundedFromEnvironment(account.addr, microAlgos(35_000_000_000n))
      expect(await balance(algorand, account)).toBeGreaterThanOrEqual(35_000_000_000n)

      const key = await goOnline(algorand, account, true)
      const info = await algorand.account.getInformation(account)

      expect(info.participation?.voteParticipationKey).toEqual(key.voteKey)
    })

    /*
      AK-1023: View rewards. As a user I want to view how much rewards I got and when so that I can accurately report my income

      Acceptance Criteria:
      Given I have staked my funds to a node

      Then I can see how much rewards I'm getting per address

      And which block I received those rewards

      return object:

      * when I won the block
      * When I got the payment block
      * reward amount
      * convert block to date:time UTC
      * fees paid
     */
    test('AK-1023', async () => {
      // This is just the first mainnet block I randomly came across with a proposer payout
      const address = 'NK2AQRDVHQKRFXD6FBQCPAWPZ433IJU4A3KF5FBY7PTVEVJDCRX2KU7R4Q'
      const round = 60449677n

      const mainnet = AlgorandClient.mainNet()
      const block = await mainnet.client.algod.block(round)

      expect(block.block.header.proposer?.toString()).toBe(address)
      expect(block.block.header.proposerPayout).toBe(8694453n)
      expect(block.block.header.timestamp).toBe(1776778156n)
    })

    /*
      AK-1024: View current amount staked. As a user I want to know how much funds I current have staked so I can calculate the amount of rewards I can expect.

      Acceptance Criteria:
      Given I have created a wallet

      And split my funds over addresses

      And staked my funds

      Then I can see which addresses are staked

      Do I have more than 30K algo
     */
    test('AK-1024', async () => {
      const accounts = await deriveHdAccountsFromMnemonic({ numAccounts: 5 })
      const [largeStakeEligible, largeStakeIneligible, smallStakeEligible, offline, noBalance] = accounts

      const regularFee = 0.001
      const goOnlineFee = 2

      await algorand.account.ensureFundedFromEnvironment(largeStakeEligible.addr, algos(50_000 + goOnlineFee))
      await algorand.account.ensureFundedFromEnvironment(largeStakeIneligible.addr, algos(50_000 + regularFee))
      await algorand.account.ensureFundedFromEnvironment(smallStakeEligible.addr, algos(10_000 + goOnlineFee))
      await algorand.account.ensureFundedFromEnvironment(offline.addr, algos(50_000))

      await goOnline(algorand, largeStakeEligible, true)
      await goOnline(algorand, smallStakeEligible, true)
      await goOnline(algorand, largeStakeIneligible, false)

      const stakingStatuses: {
        address: Address
        balance: bigint
        incentiveStatus: 'offline' | 'earning' | 'fee not paid' | 'not enough stake'
      }[] = await Promise.all(
        accounts.map(async (a) => {
          const info = await algorand.client.algod.accountInformation(a)
          const balance = info.amount
          const online = info.participation !== undefined
          const eligible = online ? (info.incentiveEligible ?? false) : false
          const enoughStake = online ? balance > BigInt(30_000e6) : false

          let incentiveStatus: 'offline' | 'earning' | 'fee not paid' | 'not enough stake' = 'offline'

          if (online && eligible && enoughStake) {
            incentiveStatus = 'earning'
          } else if (online && !eligible) {
            incentiveStatus = 'fee not paid'
          } else if (online && eligible && !enoughStake) {
            incentiveStatus = 'not enough stake'
          }

          return { balance, incentiveStatus, address: a.addr }
        }),
      )

      expect(stakingStatuses).toEqual([
        {
          balance: 50000100000n,
          incentiveStatus: 'earning',
          address: largeStakeEligible.addr,
        },
        {
          balance: 50000100000n,
          incentiveStatus: 'fee not paid',
          address: largeStakeIneligible.addr,
        },
        {
          balance: 10000100000n,
          incentiveStatus: 'not enough stake',
          address: smallStakeEligible.addr,
        },
        {
          balance: 50000100000n,
          incentiveStatus: 'offline',
          address: offline.addr,
        },
        {
          balance: 0n,
          incentiveStatus: 'offline',
          address: noBalance.addr,
        },
      ])
    }, 15_000)
  })
})
