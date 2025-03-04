import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import type { MinimumErrorResponseStructure } from "src/shared/schemas/errors/MinimumErrorResponseStructure"

const tag = "TooManyRequests"

export class TooManyRequests extends Schema.TaggedError<TooManyRequests>(tag)(
  tag,
  {
    errorMessage: Schema.String,
  } satisfies MinimumErrorResponseStructure,
  HttpApiSchema.annotations({
    status: 502,
    description: "Bad gateway",
  }),
) {
  static readonly Tag = tag
}
