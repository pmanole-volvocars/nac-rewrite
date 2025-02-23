import { Schema } from "effect"

// NOTE: Keep the max page size a multiple of 3. We have a 3-column layout on the News home page.

/** The page size, used in pagination. Minimum is 1, maximum is 54. */
export const PageSize = Schema.Int.pipe(
  // 54 means a max of 18 rows of 3 columns (3*18) of news article headlines
  Schema.between(1, 54, { default: 12 as number }),
).annotations({
  title: "PageSize",
  description: "Number of items per page, between 1 and 54",
})

/** Total number of available pages, used in pagination. */
export const TotalPages = Schema.compose(Schema.Int, Schema.Positive).annotations({
  title: "TotalPages",
  description: "Total number of available pages, >= 1",
})

/** Current page, used in pagination. Minimum and default is 1. */
export const Page = Schema.compose(Schema.Int, Schema.Positive).annotations({
  title: "Page",
  description: "Current page number, >= 1",
  default: 1 as number,
})

/**
 * Information about the pagination that is being applied to some results.
 * It contains the page size, current page number, and the total number of pages available.
 */
export class PaginationInfo extends Schema.Class<PaginationInfo>("PaginationInfo")(
  {
    page: Page,
    pageSize: PageSize,
    totalPages: TotalPages,
  },
  {
    title: "PaginationInfo",
    description: "Pagination applied to results",
  },
) {}
