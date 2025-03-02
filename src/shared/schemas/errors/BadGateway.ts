import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import type { MinimumErrorResponseStructure } from "src/shared/schemas/errors/MinimumErrorResponseStructure"

const T = "BadGateway"

export class BadGateway extends Schema.TaggedError<BadGateway>(T)(
  T,
  {
    /** Friendly error message to show to the user. */
    errorMessage: Schema.String,
  } satisfies MinimumErrorResponseStructure,
  HttpApiSchema.annotations({
    status: 502,
    description: "Bad gateway",
  }),
) {
  static readonly Tag = T
}
