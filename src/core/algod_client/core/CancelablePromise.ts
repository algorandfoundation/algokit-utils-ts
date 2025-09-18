export type OnCancel = (cancelHandler: () => void) => void;

export class CancelError extends Error {
  constructor() {
    super("Request aborted");
    this.name = "CancelError";
  }
}

export class CancelablePromise<T> implements Promise<T> {
  [Symbol.toStringTag] = "CancelablePromise";

  private _isCancelled = false;
  private _cancelHandlers: Array<() => void> = [];

  constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void, onCancel: OnCancel) => void) {
    const onCancel: OnCancel = (handler) => {
      if (this._isCancelled) {
        handler();
      } else {
        this._cancelHandlers.push(handler);
      }
    };

    this._promise = new Promise<T>((resolve, reject) => executor(resolve, reject, onCancel));
  }

  private _promise: Promise<T>;

  public cancel(): void {
    if (!this._isCancelled) {
      this._isCancelled = true;
      for (const fn of this._cancelHandlers) fn();
      this._cancelHandlers.length = 0;
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    return this._promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
    return this._promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this._promise.finally(onfinally);
  }
}
