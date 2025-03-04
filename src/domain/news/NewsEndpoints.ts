import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { Locale } from "src/shared/schemas/Locale"
import { BadGateway } from "src/shared/schemas/errors/BadGateway"
import { InvalidLocale } from "src/shared/schemas/errors/InvalidLocale"
import { MappingFailure } from "src/shared/schemas/errors/MappingFailure"
import { NotFoundById } from "src/shared/schemas/errors/NotFoundById"
import { TooManyRequests } from "src/shared/schemas/errors/TooManyRequests"
import { GetNewsResponseV1 } from "./getNews/GetNewsReponseV1"
import { GetNewsResponseV2 } from "./getNews/GetNewsReponseV2"
import { GetNewsUrlParams } from "./getNews/GetNewsUrlParams"
import { GetNewsByIdResponseV1 } from "./getNewsById/GetNewsByIdResponseV1"
import { NewsId } from "./schemas/NewsId"

export class NewsEndpoints extends HttpApiGroup.make("NewsEndpoints")
  .annotate(OpenApi.Title, "News API")
  .annotate(OpenApi.Description, "An API for working with news")
  .add(
    HttpApiEndpoint.get("getNewsV1", "/v1/news")
      .annotate(OpenApi.Summary, "Get news (v1)")
      .annotate(
        OpenApi.Description,
        "Get news articles, ordered in descending order of publication date. Some filtering is supported.",
      )
      .setUrlParams(GetNewsUrlParams)
      .addSuccess(GetNewsResponseV1)
      .addError(InvalidLocale)
      .addError(MappingFailure),
  )
  .add(
    HttpApiEndpoint.get("getNewsV2", "/v2/news")
      .annotate(OpenApi.Summary, "Get news (v2)")
      .annotate(
        OpenApi.Description,
        "Get news articles, ordered in descending order of publication date. Some filtering is supported.",
      )
      .setUrlParams(GetNewsUrlParams)
      .addSuccess(GetNewsResponseV2)
      .addError(InvalidLocale)
      .addError(MappingFailure),
  )
  .add(
    HttpApiEndpoint.get("getNewsByIdV1", "/v1/news/:id")
      .annotate(OpenApi.Summary, "Get news by ID (v1)")
      .annotate(OpenApi.Description, "Get a news article by ID")
      .setUrlParams(Schema.Struct({ locale: Locale }))
      .setPath(Schema.Struct({ id: NewsId }))
      .addSuccess(GetNewsByIdResponseV1)
      .addError(BadGateway)
      .addError(InvalidLocale)
      .addError(MappingFailure)
      .addError(NotFoundById)
      .addError(TooManyRequests), // TODO: move common errors like TooManyRequests to top level (group or API) to get rid of code duplication
    // TODO: Add the spotlight news endpoint
  ) {}
