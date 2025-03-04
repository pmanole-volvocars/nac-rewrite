import { Schema } from "effect"
import { NewsArticle } from "../schemas/NewsArticle"

const tag = "GetNewsByIdResponseV1"

export class GetNewsByIdResponseV1 extends Schema.Class<GetNewsByIdResponseV1>(tag)({
  entries: Schema.Array(NewsArticle),
}) {}
