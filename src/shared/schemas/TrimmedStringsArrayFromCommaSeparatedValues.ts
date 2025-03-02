import { Schema } from "effect"

/**
 * A schema that takes a non-empty string and splits it at "," separators, transforming the string
 * into an array of strings, which are individually trimmed of leading and trailing spaces.
 *
 * For example, the string `"cat1 , cat2,cat3"` gets transformed into `["cat1", "cat2", "cat3"]`.
 */
export const TrimmedStringsArrayFromCommaSeparatedValues = Schema.transform(
  Schema.NonEmptyString,
  Schema.Array(Schema.Trim),
  {
    strict: true,
    decode: (inputStr) => inputStr.split(","),
    encode: (strArray) => strArray.join(","),
  },
)
