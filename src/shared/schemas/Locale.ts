import { Schema } from "effect"

/** Entry locale Schema. All localizable entries have a locale. */
export const Locale = Schema.Union(Schema.Literal("de-de"), Schema.Literal("en-en")).annotations({
  title: "Locale",
  description: "Content localization",
})

/** Entry locale type. All localizable entries have a locale.  */
export type Locale = typeof Locale.Type
