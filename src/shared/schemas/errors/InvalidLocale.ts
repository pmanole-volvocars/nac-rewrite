import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import type { MinimumErrorResponseStructure } from "./MinimumErrorResponseStructure"

const tag = "InvalidLocale"

/** An error caused by an invalid or unsupported locale. */
export class InvalidLocale extends Schema.TaggedError<InvalidLocale>(tag)(
  tag,
  {
    errorMessage: Schema.String,
  } satisfies MinimumErrorResponseStructure,
  HttpApiSchema.annotations({
    status: 400,
    description: "The requested locale did not match the expected schema",
  }),
) {
  static readonly Tag = tag
}
