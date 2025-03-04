import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import type { MinimumErrorResponseStructure } from "src/shared/schemas/errors/MinimumErrorResponseStructure"

const tag = "BadGateway"

export class BadGateway extends Schema.TaggedError<BadGateway>(tag)(
  tag,
  {
    errorMessage: Schema.String,
  } satisfies MinimumErrorResponseStructure,
  HttpApiSchema.annotations({
    status: 502,
    description: "Bad gateway (An error occurred in a downstream service)",
  }),
) {
  static readonly Tag = tag
}
