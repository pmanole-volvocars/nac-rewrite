import { CsNotFoundById } from "src/shared/services/ContentstackClient/errors/CsNotFoundById"
import { CsUnknownError } from "src/shared/services/ContentstackClient/errors/CsUnknownError"

/**
 * The client provided by the Contentstack SDK has a very "peculiar" way of reporting errors and
 * returning error responses (e.g., entry not found by ID) when calling its main query functions
 * (i.e., those for getting entries, assets, etc.)
 *
 * Basically it will always throw an {@link Error} class instance with the actual error type
 * serialized as a JSON string in the Error's `message` property.
 *
 * This means we have to parse that JSON string into an object and then parse that object to
 * proper tagged error types, so we can handle each error individually.
 *
 * This is what this function does.
 */
export function parseContentstackClientErrors(error: unknown): CsUnknownError | CsNotFoundById {
  const unknownContentstackClientError = "Unknown Contentstack client error"

  if (!error) {
    return new CsUnknownError({ message: unknownContentstackClientError })
  }

  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message)

      if ("status" in parsed && "error_code" in parsed) {
        // When an entry or asset was not found by ID:
        if (parsed.status === 422 && parsed.error_code === 141) {
          return new CsNotFoundById({
            message: "The requested entry does not exist",
            cause: error,
          })
        }
        // TODO: INCOMPLETE IMPLEMENTATION: handle the other combinations, including where status and/or error_code are missing
      }
    } catch (syntaxError) {}
  }

  return new CsUnknownError({
    message:
      typeof error === "string"
        ? `${unknownContentstackClientError}: ${error}`
        : unknownContentstackClientError,
    cause: error,
  })
}
