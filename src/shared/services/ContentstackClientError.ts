import { Data } from "effect"

const T = "ContentstackClientError"

/**
 * A tagged error to use to wrap all exceptions that the Contentstack client throws.
 * A static constructor {@link fromError} is provided to make this convenient.
 */
export class ContentstackClientError extends Data.TaggedError(T)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = T

  /*
   * Convenient constructor to wrap any error with this tagged error, but it is meant to be used
   * when catching errors that the Contentstack client would throw, nothing else.
   *
   * The error itself will be stored as the `cause` of this error, which is useful for debugging and
   * logging the full error details.
   *
   * This instance's error message will be taken from the passed error, if it is a string or an
   * instance of {@link Error}.
   */
  static fromError(error: unknown): ContentstackClientError {
    let message = "An error was thrown by the Contentstack client"
    if (typeof error === "string") message = error
    if (error instanceof Error) message = error.message
    return new ContentstackClientError({ message, cause: error })
  }
}
