import { describe, expect, it } from 'vitest'
import { FeeDelta, FeeDeltaType, FeePriority } from './fee-coverage'

describe('FeeDelta', () => {
  describe('fromBigInt', () => {
    it('should create deficit for positive values', () => {
      const delta = FeeDelta.fromBigInt(100n)
      expect(delta).toEqual({ type: FeeDeltaType.Deficit, data: 100n })
      expect(FeeDelta.isDeficit(delta!)).toBe(true)
      expect(FeeDelta.isSurplus(delta!)).toBe(false)
    })

    it('should create surplus for negative values', () => {
      const delta = FeeDelta.fromBigInt(-50n)
      expect(delta).toEqual({ type: FeeDeltaType.Surplus, data: 50n })
      expect(FeeDelta.isSurplus(delta!)).toBe(true)
      expect(FeeDelta.isDeficit(delta!)).toBe(false)
    })

    it('should return undefined for zero values', () => {
      const delta = FeeDelta.fromBigInt(0n)
      expect(delta).toBeUndefined()
    })
  })

  describe('toBigInt', () => {
    it('should convert deficit to positive bigint', () => {
      const delta: FeeDelta = { type: FeeDeltaType.Deficit, data: 100n }
      const result = FeeDelta.toBigInt(delta)
      expect(result).toBe(100n)
    })

    it('should convert surplus to negative bigint', () => {
      const delta: FeeDelta = { type: FeeDeltaType.Surplus, data: 50n }
      const result = FeeDelta.toBigInt(delta)
      expect(result).toBe(-50n)
    })
  })

  describe('amount', () => {
    it('should return the amount for deficit', () => {
      const delta: FeeDelta = { type: FeeDeltaType.Deficit, data: 100n }
      expect(FeeDelta.amount(delta)).toBe(100n)
    })

    it('should return the amount for surplus', () => {
      const delta: FeeDelta = { type: FeeDeltaType.Surplus, data: 50n }
      expect(FeeDelta.amount(delta)).toBe(50n)
    })
  })

  describe('add', () => {
    it('should add two deficits correctly', () => {
      const delta1: FeeDelta = { type: FeeDeltaType.Deficit, data: 100n }
      const delta2: FeeDelta = { type: FeeDeltaType.Deficit, data: 50n }
      const result = FeeDelta.add(delta1, delta2)
      expect(result).toEqual({ type: FeeDeltaType.Deficit, data: 150n })
    })

    it('should add two surpluses correctly', () => {
      const delta1: FeeDelta = { type: FeeDeltaType.Surplus, data: 100n }
      const delta2: FeeDelta = { type: FeeDeltaType.Surplus, data: 50n }
      const result = FeeDelta.add(delta1, delta2)
      expect(result).toEqual({ type: FeeDeltaType.Surplus, data: 150n })
    })

    it('should add deficit and surplus with deficit result', () => {
      const deficit: FeeDelta = { type: FeeDeltaType.Deficit, data: 100n }
      const surplus: FeeDelta = { type: FeeDeltaType.Surplus, data: 30n }
      const result = FeeDelta.add(deficit, surplus)
      expect(result).toEqual({ type: FeeDeltaType.Deficit, data: 70n })
    })

    it('should add deficit and surplus with surplus result', () => {
      const deficit: FeeDelta = { type: FeeDeltaType.Deficit, data: 30n }
      const surplus: FeeDelta = { type: FeeDeltaType.Surplus, data: 100n }
      const result = FeeDelta.add(deficit, surplus)
      expect(result).toEqual({ type: FeeDeltaType.Surplus, data: 70n })
    })

    it('should return undefined when deltas cancel out', () => {
      const deficit: FeeDelta = { type: FeeDeltaType.Deficit, data: 50n }
      const surplus: FeeDelta = { type: FeeDeltaType.Surplus, data: 50n }
      const result = FeeDelta.add(deficit, surplus)
      expect(result).toBeUndefined()
    })
  })
})

describe('FeePriority', () => {
  describe('fee priority ordering', () => {
    it('should order priorities correctly based on type and deficit amounts', () => {
      const covered = FeePriority.Covered
      const modifiableSmall = FeePriority.ModifiableDeficit(100n)
      const modifiableLarge = FeePriority.ModifiableDeficit(1000n)
      const immutableSmall = FeePriority.ImmutableDeficit(100n)
      const immutableLarge = FeePriority.ImmutableDeficit(1000n)

      // Basic ordering, ImmutableDeficit > ModifiableDeficit > Covered
      expect(immutableSmall.compare(modifiableLarge)).toBeGreaterThan(0)
      expect(modifiableSmall.compare(covered)).toBeGreaterThan(0)
      expect(immutableLarge.compare(modifiableLarge)).toBeGreaterThan(0)

      // Within same priority class, larger deficits have higher priority
      expect(immutableLarge.compare(immutableSmall)).toBeGreaterThan(0)
      expect(modifiableLarge.compare(modifiableSmall)).toBeGreaterThan(0)
    })

    it('should sort priorities in descending order correctly', () => {
      const covered = FeePriority.Covered
      const modifiableSmall = FeePriority.ModifiableDeficit(100n)
      const modifiableLarge = FeePriority.ModifiableDeficit(1000n)
      const immutableSmall = FeePriority.ImmutableDeficit(100n)
      const immutableLarge = FeePriority.ImmutableDeficit(1000n)

      // Create a sorted array to verify the ordering behavior
      const priorities = [covered, modifiableSmall, immutableSmall, modifiableLarge, immutableLarge]

      // Sort in descending order (highest priority first)
      priorities.sort((a, b) => b.compare(a))

      expect(priorities[0]).toEqual(FeePriority.ImmutableDeficit(1000n))
      expect(priorities[1]).toEqual(FeePriority.ImmutableDeficit(100n))
      expect(priorities[2]).toEqual(FeePriority.ModifiableDeficit(1000n))
      expect(priorities[3]).toEqual(FeePriority.ModifiableDeficit(100n))
      expect(priorities[4]).toEqual(FeePriority.Covered)
    })

    it('should handle equality correctly', () => {
      const covered1 = FeePriority.Covered
      const covered2 = FeePriority.Covered
      const modifiable1 = FeePriority.ModifiableDeficit(100n)
      const modifiable2 = FeePriority.ModifiableDeficit(100n)
      const immutable1 = FeePriority.ImmutableDeficit(500n)
      const immutable2 = FeePriority.ImmutableDeficit(500n)

      expect(covered1.equals(covered2)).toBe(true)
      expect(modifiable1.equals(modifiable2)).toBe(true)
      expect(immutable1.equals(immutable2)).toBe(true)

      expect(covered1.compare(covered2)).toBe(0)
      expect(modifiable1.compare(modifiable2)).toBe(0)
      expect(immutable1.compare(immutable2)).toBe(0)
    })

    it('should get priority type correctly', () => {
      const covered = FeePriority.Covered
      const modifiableDeficit = FeePriority.ModifiableDeficit(100n)
      const immutableDeficit = FeePriority.ImmutableDeficit(100n)

      expect(covered.getPriorityType()).toBe(0)
      expect(modifiableDeficit.getPriorityType()).toBe(1)
      expect(immutableDeficit.getPriorityType()).toBe(2)
    })

    it('should get deficit amount correctly', () => {
      const covered = FeePriority.Covered
      const modifiableDeficit = FeePriority.ModifiableDeficit(250n)
      const immutableDeficit = FeePriority.ImmutableDeficit(750n)

      expect(covered.getDeficitAmount()).toBe(0n)
      expect(modifiableDeficit.getDeficitAmount()).toBe(250n)
      expect(immutableDeficit.getDeficitAmount()).toBe(750n)
    })
  })
})
