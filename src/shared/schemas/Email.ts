import { Schema } from "effect"

/** An email address schema. */
export const Email = Schema.NonEmptyTrimmedString.pipe(
  Schema.compose(Schema.Lowercase),
  Schema.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/),
  Schema.annotations({
    title: "Email",
    description: "Email address",
  }),
  Schema.brand("Email"),
)

/** An email address. */
export type Email = typeof Email.Type
