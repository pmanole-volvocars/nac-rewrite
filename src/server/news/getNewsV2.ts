import { QueryOperation } from "@contentstack/delivery-sdk"
import { Effect, Number as Num, Order, pipe } from "effect"
import type { Query } from "node_modules/@contentstack/delivery-sdk/dist/modern/lib/query"
import { GetNewsResponseV2 } from "src/domain/news/getNews/GetNewsReponseV2"
import { NewsArticle } from "src/domain/news/schemas/NewsArticle"
import type { CsNewsEntry } from "src/shared/schemas/contentstack/CsNewsEntry"
import { BadGateway } from "src/shared/schemas/errors/BadGateway"
import { InvalidLocale } from "src/shared/schemas/errors/InvalidLocale"
import type { MappingFailure } from "src/shared/schemas/errors/MappingFailure"
import { TooManyRequests } from "src/shared/schemas/errors/TooManyRequests"
import { ContentstackClient } from "src/shared/services/ContentstackClient/ContentstackClient"
import type { CsNotFound } from "src/shared/services/ContentstackClient/errors/CsNotFound"
import { parseContentstackClientError } from "src/shared/utils/parseContentstackClientError"
import { CsContentTypeUids } from "../constants"

const clampMinimumTo1 = Order.clamp(Num.Order)({ minimum: 1, maximum: Number.MAX_VALUE })
const stripSpecialCharacters = (i: string) => i.replace(/[^\w\s]/g, "")

/** Get News v2 request handler. */
export const getNewsV2 = (args: {
  readonly urlParams: {
    readonly locale: "de-de" | "en-en"
    readonly pageSize?: number | undefined
    readonly page?: number | undefined
    readonly search?: string | undefined
    readonly from?: Date | undefined
    readonly categories?: readonly string[] | undefined
    readonly to?: Date | undefined
  }
}): Effect.Effect<
  GetNewsResponseV2,
  CsNotFound | BadGateway | InvalidLocale | TooManyRequests | MappingFailure,
  ContentstackClient
> => {
  return Effect.gen(function* () {
    const client = yield* ContentstackClient

    const defaultPageSize = 12
    const pageSize = args.urlParams.pageSize ?? defaultPageSize
    const page = args.urlParams.page ?? 1
    const skip = (page - 1) * pageSize
    const categories = args.urlParams.categories?.map((c) => encodeURIComponent(c))
    const search = args.urlParams.search && stripSpecialCharacters(args.urlParams.search)

    const getNewsEntries = () =>
      client.contentType(CsContentTypeUids.News).entry().locale(args.urlParams.locale)

    const getContentstackNewsEntries = Effect.tryPromise({
      try: () => {
        const categoriesQuery: Query | undefined =
          categories &&
          getNewsEntries()
            .query()
            .or(
              ...categories.map((c) =>
                getNewsEntries()
                  .query()
                  .where("taxonomies.content_categories", QueryOperation.INCLUDES, c),
              ),
            )

        const caseInsensitive = { $options: "i" }

        const searchQuery: Query | undefined = search
          ? (() => {
              const titleQuery: Query | undefined = getNewsEntries()
                .query()
                .where("title", QueryOperation.MATCHES, search, caseInsensitive)
              const descriptionQuery: Query | undefined = getNewsEntries()
                .query()
                .where("head.description", QueryOperation.MATCHES, search, caseInsensitive)
              const newsIdQuery = getNewsEntries()
                .query()
                .where("uid", QueryOperation.MATCHES, search, caseInsensitive)
              return getNewsEntries()
                .query()
                .or(...[titleQuery, descriptionQuery, newsIdQuery].filter((q) => q !== undefined))
            })()
          : undefined

        const queries: Query[] = [searchQuery, categoriesQuery].filter((q) => q !== undefined)

        return getNewsEntries()
          .query()
          .and(...queries) // match all queries together (a && b && c &&...)
          .orderByDescending("head.release_date")
          .paginate({ limit: pageSize, skip })
          .includeCount()
          .find<CsNewsEntry>()
      },
      catch: parseContentstackClientError,
    }).pipe(
      Effect.tapError((contentstackError) => Effect.logError(contentstackError)),
      Effect.catchTags({
        // TODO: check if MFE actually touches or reads any errorMessage fields, and if not,
        // refactor to message, the default for Error class, which is what taggedError inherits.
        CsBadRequest: (error) => BadGateway.make({ errorMessage: error.message }),
        CsLanguageNotFound: (error) => InvalidLocale.make({ errorMessage: error.message }),
        CsTooManyRequests: (error) => TooManyRequests.make({ errorMessage: error.message }),
        CsUnauthorized: (error) => BadGateway.make({ errorMessage: error.message }),
        CsUnknownError: (error) => BadGateway.make({ errorMessage: error.message }),
      }),
    )

    const response = yield* getContentstackNewsEntries

    const entries = response.entries ?? []
    const totalAvailableEntriesCount = response.count ?? entries.length
    const totalPages = clampMinimumTo1(Math.ceil(totalAvailableEntriesCount / pageSize))

    const newsArticles = yield* pipe(entries, Effect.forEach(NewsArticle.fromCsNewsEntry))

    // FIXME: these make constructors throw if schema decoding fails!
    // TODO: Write a .tryMake ctor that has schema parse errors (MappingError) as values.
    return GetNewsResponseV2.make({ entries: newsArticles, page, pageSize, totalPages })
  })
}
