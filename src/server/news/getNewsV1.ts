import type { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import { Effect } from "effect"
import type { GetNewsResponseV1 } from "src/domain/news/getNews/GetNewsReponseV1"
import { InvalidLocale } from "src/shared/schemas/errors/InvalidLocale"
import { ContentstackClient } from "src/shared/services/ContentstackClient"

/** Get News v1 request handler. */
export function getNewsV1(args: {
  readonly urlParams: {
    readonly locale: "de-de" | "en-en"
    readonly pageSize?: number | undefined
    readonly page?: number | undefined
    readonly search?: string | undefined
    readonly from?: Date | undefined
    readonly categories?: readonly string[] | undefined
    readonly to?: Date | undefined
  }
}): Effect.Effect<GetNewsResponseV1, HttpApiDecodeError | InvalidLocale, ContentstackClient> {
  return Effect.gen(function* () {
    const client = yield* ContentstackClient

    if (client) yield* Effect.logInfo("Successfully acquired a Contentstack client")
    else Effect.logError("Failed to acquire a Contentstack client")

    return yield* Effect.fail(InvalidLocale.make({ errorMessage: "Invaid locale motherfraker!" }))
  })
}
