import { Schema } from "effect"
import { Page, PageSize, TotalPages } from "src/shared/schemas/PaginationInfo"
import { NewsArticle } from "../schemas/NewsArticle"

const T = "GetNewsResponseV2"

export class GetNewsResponseV2 extends Schema.Class<GetNewsResponseV2>(T)({
  page: Page,
  pageSize: PageSize,
  totalPages: TotalPages,
  entries: Schema.Array(NewsArticle),
}) {}
