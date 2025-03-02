import { HttpApiBuilder } from "@effect/platform"
import { Api } from "src/domain/Api"
import { getNewsByIdV1 } from "./getNewsByIdV1"
import { getNewsV1 } from "./getNewsV1"
import { getNewsV2 } from "./getNewsV2"

export const NewsApiLive = HttpApiBuilder.group(Api, "NewsEndpoints", (handlers) =>
  handlers
    .handle("getNewsV1", getNewsV1)
    .handle("getNewsV2", getNewsV2)
    .handle("getNewsByIdV1", getNewsByIdV1),
)
