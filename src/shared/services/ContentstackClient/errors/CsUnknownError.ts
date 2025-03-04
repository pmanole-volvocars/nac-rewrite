import { Data } from "effect"

const tag = "CsUnknownError"

/**
 * We couldn't determine the particular error type that the Contentstack client threw.
 *
 * We wrap that error and store it in this error's `cause` property, for logging purposes.
 *
 * If any instances of this error occur and are logged, it means we have an additional error case
 * that we need to handle when working with Contentstack.
 */
export class CsUnknownError extends Data.TaggedError(tag)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = tag
}
