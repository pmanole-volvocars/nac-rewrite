import { Effect } from "effect"
import { GetNewsByIdResponseV1 } from "src/domain/news/getNewsById/GetNewsByIdResponseV1"
import { NewsArticle } from "src/domain/news/schemas/NewsArticle"
import type { NewsId } from "src/domain/news/schemas/NewsId"
import type { CsNewsEntry } from "src/shared/schemas/contentstack/CsNewsEntry"
import { BadGateway } from "src/shared/schemas/errors/BadGateway"
import { InvalidLocale } from "src/shared/schemas/errors/InvalidLocale"
import { NotFoundById } from "src/shared/schemas/errors/NotFoundById"
import { TooManyRequests } from "src/shared/schemas/errors/TooManyRequests"
import { ContentstackClient } from "src/shared/services/ContentstackClient/ContentstackClient"
import { parseContentstackClientError } from "src/shared/utils/parseContentstackClientError"

// Test ID for QA: blt0da5a2d4812d7fd2

/** Get News By ID v1 request handler. */
export const getNewsByIdV1 = (args: {
  readonly path: { readonly id: NewsId }
  readonly urlParams: { readonly locale: "de-de" | "en-en" }
}) =>
  Effect.gen(function* () {
    const client = yield* ContentstackClient

    const getContentstackNewsEntry = Effect.tryPromise({
      try: () =>
        client
          .contentType("news")
          .entry(args.path.id)
          .locale(args.urlParams.locale)
          .fetch<CsNewsEntry>(),
      catch: parseContentstackClientError,
    }).pipe(
      Effect.tapError((contentstackError) => Effect.logError(contentstackError)),
      Effect.catchTags({
        // TODO: check if MFE actually touches or reads any errorMessage fields, and if not,
        // refactor to message, the default for Error class, which is what taggedError inherits.
        CsBadRequest: (error) => BadGateway.make({ errorMessage: error.message }),
        CsLanguageNotFound: (error) => InvalidLocale.make({ errorMessage: error.message }),
        CsNotFound: (error) => NotFoundById.make({ errorMessage: error.message, id: args.path.id }),
        CsTooManyRequests: (error) => TooManyRequests.make({ errorMessage: error.message }),
        CsUnauthorized: (error) => BadGateway.make({ errorMessage: error.message }),
        CsUnknownError: (error) => BadGateway.make({ errorMessage: error.message }),
      }),
    )

    const csNewsEntry = yield* getContentstackNewsEntry
    const newsArticle = yield* NewsArticle.fromCsNewsEntry(csNewsEntry)

    return GetNewsByIdResponseV1.make({ entries: [newsArticle] })
  })
