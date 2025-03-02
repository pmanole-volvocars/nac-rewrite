import { CsNotFound } from "src/shared/services/ContentstackClient/errors/CsNotFound"
import { CsUnknownError } from "src/shared/services/ContentstackClient/errors/CsUnknownError"
import { CsBadRequest } from "../services/ContentstackClient/errors/CsBadRequest"
import { CsTooManyRequests } from "../services/ContentstackClient/errors/CsTooManyRequests"
import { CsUnauthorized } from "../services/ContentstackClient/errors/CsUnauthorized"
import { CsLanguageNotFound } from "../services/ContentstackClient/errors/CsLanguageNotFound"

/**
 * The client provided by the Contentstack SDK has a very "peculiar" way of
 * 1. reporting errors and
 * 2. returning error responses (e.g., entry not found by ID)
 * when calling its main query functions (i.e., those for getting entries, assets, etc.)
 *
 * The client throws an {@link Error} instance with the **actual** error serialized as a JSON string
 * in the Error's `message` property.
 *
 * This means we have to parse that JSON string into an object and then parse that object to proper
 * tagged error types, so we can handle each error individually.
 */
export function parseContentstackClientError(
  error: unknown,
):
  | CsUnknownError
  | CsBadRequest
  | CsNotFound
  | CsLanguageNotFound
  | CsUnauthorized
  | CsTooManyRequests {
  if (!(error instanceof Error)) {
    return new CsUnknownError({
      message:
        typeof error === "string"
          ? `Unknown Contentstack client error: ${error}`
          : "Unknown Contentstack client error",
      cause: error,
    })
  }

  let parsedError: unknown | undefined = undefined

  try {
    parsedError = JSON.parse(error.message)
  } catch (jsonParseError) {
    return new CsUnknownError({
      message: "Unknown Contentstack client error",
      cause: [error, jsonParseError],
    })
  }

  if (!(parsedError instanceof Object)) {
    return new CsUnknownError({ message: "Unknown Contentstack client error", cause: error })
  }

  if (!("status" in parsedError && typeof parsedError.status === "number")) {
    return new CsUnknownError({ message: "Unknown Contentstack client error", cause: error })
  }

  const parsedErrorMessage: string | undefined =
    "error_message" in parsedError && typeof parsedError.error_message === "string"
      ? parsedError.error_message
      : undefined

  switch (parsedError.status) {
    case 400:
      return new CsBadRequest({
        message: `Contentstack 400: ${parsedErrorMessage}`,
        cause: parsedError,
      })

    case 404:
      return new CsNotFound({
        message: `Contentstack 404: ${parsedErrorMessage}`,
        cause: parsedError,
      })

    case 422: {
      // FIX: We're missing the exact case of locale not found! We have an InvalidLocale api
      // response but it needs to be mapped from the error parsed here:
      const errorCode =
        "error_code" in parsedError && typeof parsedError.error_code === "number"
          ? parsedError.error_code
          : undefined

      switch (errorCode) {
        case 141: {
          if (parsedErrorMessage === "Language was not found. Please try again.") {
            return new CsLanguageNotFound({
              message: `Contentstack 422: ${parsedErrorMessage}`,
              cause: parsedError,
            })
          }
          return new CsNotFound({
            message: `Contentstack 422: ${parsedErrorMessage}`,
            cause: parsedError,
          })
        }
        case 901:
          return new CsUnauthorized({
            message: `Contentstack 422: ${parsedErrorMessage}`,
            cause: parsedError,
          })
        default:
          return new CsUnknownError({
            message: `Contentstack 422: ${parsedErrorMessage}`,
            cause: parsedError,
          })
      }
    }

    case 429:
      return new CsTooManyRequests({
        message: `Contentstack 429: ${parsedErrorMessage}`,
        cause: parsedError,
      })
  }

  return new CsUnknownError({
    message: `Unknown Contentstack client error: ${parsedErrorMessage}`,
    cause: parsedError,
  })
}
