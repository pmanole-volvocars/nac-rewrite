import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

const tag = "MappingFailure"

/**
 * Error mapping from one type to another.
 *
 * For example, if persistence models (e.g., Contentstack entry models) have changed, but the
 * mapping code or constructors have not been updated.
 */
export class MappingFailure extends Schema.TaggedError<MappingFailure>(tag)(
  tag,
  {
    errorMessage: Schema.String,
    cause: Schema.optional(Schema.Unknown),
  },
  HttpApiSchema.annotations({
    status: 500,
    description: "Failed to map data from one type to another",
  }),
) {
  static readonly Tag = tag
}
