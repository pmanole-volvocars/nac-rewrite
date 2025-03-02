import type { Schema } from "effect"

/**
 * A type that provides and easy way to defined Schemas that satisfy a minimum structure for error
 * responses, while also not preventing any extra fields on that Schema.
 *
 * This allows us to define Tagged Error Schemas that can both be used to recover or handle errors,
 * and be mapped to a standard error response structure. For example, by defining a mandatory
 * `errorMessage` field that all errors must provide. The schemas can still have additional fields
 * and additional information, which can optionally also be serialized in the response, but a
 * minimum contract can be enforced so that for example the clients always get back a user-readable
 * error message with each error response.
 *
 * Here is an example Tagged Error Schema that satisfies the {@link MinimumErrorResponseStructure},
 * which also adds one additional field, `cause`. This Schema can be mapped to a shared
 * `ErrorResponse` type that satisfies the {@link MinimumErrorResponseStructure} (i.e., has the same
 * fields) or can be directly serialized as the error response itself, because it already satisfies
 * the contract set by {@link MinimumErrorResponseStructure} and the clients can always ignore the
 * other fields if they want to.
 *
 * @example
 * export class InvalidLocale extends Schema.TaggedError<InvalidLocale>(T)(T, {
 *   errorMessage: Schema.String, // <- enforced by MinimumErrorResponseStructure
 *   cause: Schema.optional(Schema.Unknown), // <- additional field that this Schema can still add
 * } satisfies MinimumErrorResponseStructure) // <- note the use of `satisfies`
 * {}
 */
export interface MinimumErrorResponseStructure {
  /** Friendly error message to show to the user. */
  errorMessage: Schema.String
  [K: string]: unknown
}
