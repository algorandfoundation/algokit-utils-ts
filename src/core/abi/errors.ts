export class ValidationError extends Error {
  constructor(message: string) {
    super(`Validation Error: ${message}`)
    this.name = 'ValidationError'
  }
}

export class EncodingError extends Error {
  constructor(message: string) {
    super(`Encoding Error: ${message}`)
    this.name = 'EncodingError'
  }
}

export class DecodingError extends Error {
  constructor(message: string) {
    super(`Decoding Error: ${message}`)
    this.name = 'DecodingError'
  }
}
