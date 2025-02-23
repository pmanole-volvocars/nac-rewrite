import { Schema } from "effect"
import { Page, PageSize, TotalPages } from "src/shared/schemas/PaginationInfo"

const T = "GetNewsResponseV1"

export class GetNewsResponseV1 extends Schema.Class<GetNewsResponseV1>(T)({
  page: Page,
  pageSize: PageSize,
  totalPages: TotalPages,
  entries: Schema.Array(Schema.Number), // FIXME: Model GetNewsResponseV1Entry
}) {}
