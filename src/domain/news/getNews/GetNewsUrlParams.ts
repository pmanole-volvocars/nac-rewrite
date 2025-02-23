import { Schema } from "effect"
import { Locale } from "src/shared/schemas/Locale"
import { Page, PageSize } from "src/shared/schemas/PaginationInfo"
import { TrimmedStringsArrayFromCommaSeparatedValues } from "src/shared/schemas/TrimmedStringsArrayFromCommaSeparatedValues"

/** URL params Schema for get-news (v1, v2,...). */
export const GetNewsUrlParams = Schema.Struct({
  locale: Locale,
  pageSize: Schema.NumberFromString.pipe(Schema.compose(PageSize), Schema.optional),
  page: Schema.NumberFromString.pipe(Schema.compose(Page), Schema.optional),
  search: Schema.NonEmptyTrimmedString.pipe(Schema.optional),
  /** Comma-separated list of news category Taxonomy Term UIDs. */
  categories: TrimmedStringsArrayFromCommaSeparatedValues.pipe(Schema.optional),
  from: Schema.Date.pipe(Schema.optional),
  to: Schema.Date.pipe(Schema.optional),
}).pipe(
  Schema.filter(
    ({ from, to }) => {
      if (from && to && from > to)
        return {
          path: ["from"],
          message: `cannot be greater than the 'to' value '${to.toISOString()}'`,
        }
    },
    {
      // the filter section doesn't have an OAS schema per se, but we need this here so the OAS
      // generator won't throw because of a missing JSON Schema:
      jsonSchema: {},
    },
  ),
)
