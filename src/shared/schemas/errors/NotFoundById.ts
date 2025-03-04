import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import type { MinimumErrorResponseStructure } from "src/shared/schemas/errors/MinimumErrorResponseStructure"

const tag = "NotFoundById"

export class NotFoundById extends Schema.TaggedError<NotFoundById>(tag)(
  tag,
  {
    /** The ID of the entity that was not found. */
    id: Schema.String,
    errorMessage: Schema.String,
  } satisfies MinimumErrorResponseStructure,
  HttpApiSchema.annotations({
    status: 404,
    description: "The requested resource was not found by ID",
  }),
) {
  static readonly Tag = tag
}
