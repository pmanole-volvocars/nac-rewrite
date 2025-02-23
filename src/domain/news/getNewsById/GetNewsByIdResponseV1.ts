import { Schema } from "effect"
import { NewsArticle } from "../schemas/NewsArticle"

const T = "GetNewsByIdResponseV1"

export class GetNewsByIdResponseV1 extends Schema.Class<GetNewsByIdResponseV1>(T)({
  entries: Schema.Array(NewsArticle),
}) {}
