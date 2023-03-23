import type algosdk from 'algosdk'

const LOGIC_ERROR = /TransactionPool.Remember: transaction ([A-Z0-9]+): logic eval error: (.*). Details: pc=([0-9]+), opcodes=.*/

export interface LogicErrorDetails {
  txId: string
  pc: number
  msg: string
}

export class LogicError extends Error {
  static parseLogicError(errMsg: string): LogicErrorDetails {
    const res = LOGIC_ERROR.exec(errMsg)
    if (res === null || res.length <= 3) return {} as LogicErrorDetails

    return {
      txId: res[1],
      msg: res[2],
      pc: parseInt(res[3] ? res[3] : '0'),
    } as LogicErrorDetails
  }

  led: LogicErrorDetails
  program: string[]
  lines = 5
  teal_line = 0
  override stack?: string

  constructor(led: LogicErrorDetails, program: string[], map: algosdk.SourceMap) {
    super()
    this.led = led
    this.program = program

    const line = map.getLineForPc(led.pc)
    this.teal_line = line === undefined ? 0 : line

    this.message = `${this.led.msg.slice(0, 20)}... at:${line}`

    if (this.teal_line > 0) {
      const start = this.teal_line > this.lines ? this.teal_line - this.lines : 0
      const stop = program.length > this.teal_line + this.lines ? this.teal_line + this.lines : program.length

      const stack_lines = program.slice(start, stop)

      stack_lines[stack_lines.length / 2] += ' <--- Error'

      this.stack = stack_lines.join('\n')
    }
  }
}
