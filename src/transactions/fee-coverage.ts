import { PendingTransactionResponse } from '@algorandfoundation/algokit-algod-client'

export enum FeeDeltaType {
  Deficit,
  Surplus,
}

export type DeficitFeeDelta = {
  type: FeeDeltaType.Deficit
  data: bigint
}

export type SurplusFeeDelta = {
  type: FeeDeltaType.Surplus
  data: bigint
}

export type FeeDelta = DeficitFeeDelta | SurplusFeeDelta
export const FeeDelta = {
  fromBigInt(value: bigint): FeeDelta | undefined {
    if (value > 0n) {
      return { type: FeeDeltaType.Deficit, data: value }
    } else if (value < 0n) {
      return { type: FeeDeltaType.Surplus, data: -value }
    }
    return undefined
  },
  toBigInt(delta: FeeDelta): bigint {
    return delta.type === FeeDeltaType.Deficit ? delta.data : -delta.data
  },
  isDeficit(delta: FeeDelta): boolean {
    return delta.type === FeeDeltaType.Deficit
  },
  isSurplus(delta: FeeDelta): boolean {
    return delta.type === FeeDeltaType.Surplus
  },
  amount(delta: FeeDelta): bigint {
    return delta.data
  },
  add(lhs: FeeDelta, rhs: FeeDelta): FeeDelta | undefined {
    return FeeDelta.fromBigInt(FeeDelta.toBigInt(lhs) + FeeDelta.toBigInt(rhs))
  },
}

class CoveredPriority {
  getPriorityType(): number {
    return 0
  }

  getDeficitAmount(): bigint {
    return 0n
  }

  compare(other: FeePriority): number {
    const typeDiff = this.getPriorityType() - other.getPriorityType()
    if (typeDiff !== 0) {
      return typeDiff
    }
    // For same type (which can only be Covered), they're equal
    return 0
  }

  equals(other: FeePriority): boolean {
    return other instanceof CoveredPriority
  }
}

class ModifiableDeficitPriority {
  constructor(public readonly deficit: bigint) {}

  getPriorityType(): number {
    return 1
  }

  getDeficitAmount(): bigint {
    return this.deficit
  }

  compare(other: FeePriority): number {
    const typeDiff = this.getPriorityType() - other.getPriorityType()
    if (typeDiff !== 0) {
      return typeDiff
    }
    // For same type, compare deficit amounts (larger deficit = higher priority)
    if (other instanceof ModifiableDeficitPriority) {
      return Number(this.deficit - other.deficit)
    }
    return 0
  }

  equals(other: FeePriority): boolean {
    return other instanceof ModifiableDeficitPriority && this.deficit === other.deficit
  }
}

class ImmutableDeficitPriority {
  constructor(public readonly deficit: bigint) {}

  getPriorityType(): number {
    return 2
  }

  getDeficitAmount(): bigint {
    return this.deficit
  }

  compare(other: FeePriority): number {
    const typeDiff = this.getPriorityType() - other.getPriorityType()
    if (typeDiff !== 0) {
      return typeDiff
    }
    // For same type, compare deficit amounts (larger deficit = higher priority)
    if (other instanceof ImmutableDeficitPriority) {
      return Number(this.deficit - other.deficit)
    }
    return 0
  }

  equals(other: FeePriority): boolean {
    return other instanceof ImmutableDeficitPriority && this.deficit === other.deficit
  }
}

// Priority levels for fee coverage with deficit amounts
// ImmutableDeficit > ModifiableDeficit > Covered
// Within same priority type, larger deficits have higher priority
export type FeePriority = CoveredPriority | ModifiableDeficitPriority | ImmutableDeficitPriority
export const FeePriority = {
  Covered: new CoveredPriority(),
  ModifiableDeficit(deficit: bigint): ModifiableDeficitPriority {
    return new ModifiableDeficitPriority(deficit)
  },
  ImmutableDeficit(deficit: bigint): ImmutableDeficitPriority {
    return new ImmutableDeficitPriority(deficit)
  },
} as const

export function calculateInnerFeeDelta(
  innerTransactions?: PendingTransactionResponse[],
  minTransactionFee: bigint = 1000n,
  acc?: FeeDelta,
): FeeDelta | undefined {
  if (!innerTransactions) {
    return acc
  }

  // Surplus inner transaction fees do not pool up to the parent transaction.
  // Additionally surplus inner transaction fees only pool from sibling transactions
  // that are sent prior to a given inner transaction, hence why we iterate in reverse order.
  return innerTransactions.reduceRight((acc, innerTxn) => {
    const recursiveDelta = calculateInnerFeeDelta(innerTxn.innerTxns, minTransactionFee, acc)

    // Inner transactions don't require per byte fees
    const txnFeeDelta = FeeDelta.fromBigInt(minTransactionFee - (innerTxn.txn.txn.fee ?? 0n))

    const currentFeeDelta = FeeDelta.fromBigInt(
      (recursiveDelta ? FeeDelta.toBigInt(recursiveDelta) : 0n) + (txnFeeDelta ? FeeDelta.toBigInt(txnFeeDelta) : 0n),
    )

    // If after the recursive inner fee calculations we have a surplus,
    // return undefined to avoid pooling up surplus fees, which is not allowed.
    if (currentFeeDelta && FeeDelta.isSurplus(currentFeeDelta)) {
      return undefined
    }

    return currentFeeDelta
  }, acc)
}
