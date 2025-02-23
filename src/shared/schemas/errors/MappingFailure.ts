import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

const T = "MappingFailure"

/** An error to map from one type to another. */
export class MappingFailure extends Schema.TaggedError<MappingFailure>(T)(
  T,
  {
    errorMessage: Schema.String,
    cause: Schema.optional(Schema.Unknown),
  },
  HttpApiSchema.annotations({
    status: 500,
    description: "Some data could not be mapped to from another data",
  }),
) {
  static readonly Tag = T
}
