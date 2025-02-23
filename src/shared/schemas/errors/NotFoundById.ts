import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import type { MinimumErrorResponseStructure } from "src/shared/schemas/errors/MinimumErrorResponseStructure"

const T = "NotFoundById"

export class NotFoundById extends Schema.TaggedError<NotFoundById>(T)(
  T,
  {
    /** The ID of the entity that was not found. */
    id: Schema.String,
    /** Friendly error message to show to the user. */
    errorMessage: Schema.String,
  } satisfies MinimumErrorResponseStructure,
  HttpApiSchema.annotations({
    status: 404,
    description: "The requested resource was not found by ID",
  }),
) {
  static readonly Tag = T
}
