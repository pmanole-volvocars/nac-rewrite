import { HttpApiBuilder } from "@effect/platform"
import { Layer } from "effect"
import { Api } from "src/domain/Api"
import { DocumentsApiLive } from "./documents/DocumentsApiLive"
import { NewsApiLive } from "./news/NewsApiLive"

/** The Live implementation Layer for {@link Api}. */
export const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(DocumentsApiLive),
  Layer.provide(NewsApiLive),
)
