import { Data } from "effect"

const tag = "BuildContentstackClientError"

export class BuildContentstackClientError extends Data.TaggedError(tag)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = tag

  /**
   * Wraps the actual error as a `cause`, so it can be logged and returns a new instance of this
   * tagged error type with the same error message as the wrapped error, if it actually is an
   * {@link Error} or if it's a string.
   *
   * Tip: use `Effect.try` to build the client and pass {@link BuildContentstackClientError.fromError} to the `catch` handler.
   */
  static fromError(error: unknown): BuildContentstackClientError {
    let message = "Error building Contentstack client"
    if (typeof error === "string") message = error
    if (error instanceof Error) message = error.message
    return new BuildContentstackClientError({ message, cause: error })
  }
}
