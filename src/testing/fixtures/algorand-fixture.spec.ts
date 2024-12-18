import { describe, expect, test } from 'vitest'
import { algorandFixture } from '.'

describe('Algorand Fixture', () => {
  test('should respect fixture scope for algorand client and transaction logger', async () => {
    const fixture = algorandFixture({ algorandScope: 'fixture' })
    await fixture.beforeEach()

    const { algorand: algorand1, transactionLogger: logger1 } = fixture.context

    await fixture.beforeEach()

    const { algorand: algorand2, transactionLogger: logger2 } = fixture.context

    expect(algorand1 === algorand2).toBe(true)
    expect(logger1 === logger2).toBe(true)
  })

  test('should respect test scope for algorand client and transaction logger', async () => {
    const fixture = algorandFixture({ algorandScope: 'test' })
    await fixture.beforeEach()

    const { algorand: algorand1, transactionLogger: logger1 } = fixture.context

    await fixture.beforeEach()

    const { algorand: algorand2, transactionLogger: logger2 } = fixture.context

    expect(algorand1 !== algorand2).toBe(true)
    expect(logger1 !== logger2).toBe(true)
  })
})
