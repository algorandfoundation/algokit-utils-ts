export class ApiError<T = unknown> extends Error {
  public readonly url: string
  public readonly status: number
  public readonly body: T | undefined

  constructor(url: string, status: number, body?: T) {
    let message = `Request to ${url} failed with status ${status}`
    if (body && typeof body === 'object' && 'message' in body && body.message) {
      message += `: ${body.message}`
    }

    super(message)
    this.url = url
    this.status = status
    this.body = body
  }
}
