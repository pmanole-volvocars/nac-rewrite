import { Effect } from "effect"
import { GetNewsByIdResponseV1 } from "src/domain/news/getNewsById/GetNewsByIdResponseV1"
import { NewsArticle } from "src/domain/news/schemas/NewsArticle"
import type { NewsId } from "src/domain/news/schemas/NewsId"
import type { CsNewsEntry } from "src/shared/schemas/contentstack/CsNewsEntry"
import { InvalidLocale } from "src/shared/schemas/errors/InvalidLocale"
import { NotFoundById } from "src/shared/schemas/errors/NotFoundById"
import { ContentstackClient } from "src/shared/services/ContentstackClient/ContentstackClient"
import { parseContentstackClientErrors } from "src/shared/utils/parseContentstackClientErrors"

// Test ID for QA: blt0da5a2d4812d7fd2

/** Get News By ID v1 request handler. */
export const getNewsByIdV1 = (args: {
  readonly path: { readonly id: NewsId }
  readonly urlParams: { readonly locale: "de-de" | "en-en" }
}) =>
  Effect.gen(function* () {
    const client = yield* ContentstackClient
    const getCsNewsEntry = Effect.tryPromise({
      try: async () => {
        const entry = client.contentType("news").entry(args.path.id).locale(args.urlParams.locale)
        const promise: Promise<CsNewsEntry> = entry.fetch<CsNewsEntry>()
        return promise // TODO: What if it's not found? will it throw or return undefined?
      },
      catch: parseContentstackClientErrors,
    }).pipe(
      Effect.catchTag("CsEntryNotFoundById", (error) =>
        NotFoundById.make({
          // TODO: check if MFE actually touches or reads any errorMessage fields, and if not, refactor to message, the default for Error which is what taggedError inherits
          errorMessage: error.message,
          id: args.path.id,
        }),
      ),
      // TODO: could write a custom constructor on the new error type, e.g., DownstreamServerError.fromCsUnknownError(error)
      Effect.catchTag("CsUnknownError", (error) =>
        // FIX: temporary use of invalid locale, need an explict internal server error, or maybe to be more informative, a 502 downstream service error
        InvalidLocale.make({ errorMessage: error.message }),
      ),
    )

    const csNewsEntry = yield* getCsNewsEntry
    const newsArticle = yield* NewsArticle.fromCsNewsEntry(csNewsEntry)

    return GetNewsByIdResponseV1.make({ entries: [newsArticle] })
  })
