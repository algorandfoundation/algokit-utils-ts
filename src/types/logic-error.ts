import type algosdk from 'algosdk'

const LOGIC_ERROR = /transaction ([A-Z0-9]+): logic eval error: (.*). Details: .*pc=([0-9]+).*/

/**
 * Details about a smart contract logic error
 */
export interface LogicErrorDetails {
  /** The ID of the transaction with the logic error */
  txId: string
  /** The program counter where the error was */
  pc: number
  /** The error message */
  msg: string
  /** The full error description */
  desc: string
  /** Any trace information included in the error */
  traces: Record<string, unknown>[]
}

/** Wraps key functionality around processing logic errors */
export class LogicError extends Error {
  /** Takes an error message and parses out the details of any logic errors in there.
   * @param error The error message to parse
   * @returns The logic error details if any, or undefined
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static parseLogicError(error: any): LogicErrorDetails | undefined {
    const errorMessage = error.message
    const res = LOGIC_ERROR.exec(errorMessage)
    if (res === null || res.length <= 3) return undefined

    return {
      txId: res[1],
      msg: res[2],
      desc: errorMessage,
      pc: parseInt(res[3] ? res[3] : '0'),
      traces: error.traces,
    } as LogicErrorDetails
  }

  public led: LogicErrorDetails
  public program: string[]
  public lines = 5
  public teal_line = 0
  override stack?: string

  /**
   * Create a new logic error object.
   * @param errorDetails The details of the logic error
   * @param program The TEAL source code, split by line
   * @param map The source map of the TEAL source code
   */
  constructor(errorDetails: LogicErrorDetails, program: string[], map: algosdk.SourceMap) {
    super()
    this.led = errorDetails
    this.program = program

    const line = map.getLineForPc(errorDetails.pc)
    this.teal_line = line === undefined ? 0 : line

    this.message = `${this.led.msg}. at:${line}. ${this.led.desc}`

    if (this.teal_line > 0) {
      const start = this.teal_line > this.lines ? this.teal_line - this.lines : 0
      const stop = program.length > this.teal_line + this.lines ? this.teal_line + this.lines : program.length

      const stack_lines = program.slice(start, stop)

      stack_lines[stack_lines.length / 2] += ' <--- Error'

      this.stack = stack_lines.join('\n')
    }
  }
}
