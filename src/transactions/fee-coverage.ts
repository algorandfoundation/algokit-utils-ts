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
