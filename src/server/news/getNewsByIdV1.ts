import type { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import { Effect } from "effect"
import type { GetNewsByIdResponseV1 } from "src/domain/news/getNewsById/GetNewsByIdResponseV1"
import type { NewsId } from "src/domain/news/schemas/NewsId"
import { InvalidLocale } from "src/shared/schemas/errors/InvalidLocale"
import type { NotFoundById } from "src/shared/schemas/errors/NotFoundById"

/** Get News By ID v1 request handler. */
export function getNewsByIdV1(args: {
  readonly path: { readonly id: NewsId }
}): Effect.Effect<GetNewsByIdResponseV1, HttpApiDecodeError | InvalidLocale | NotFoundById, never> {
  return Effect.fail(InvalidLocale.make({ errorMessage: "Invaid locale motherfraker!" }))
}
