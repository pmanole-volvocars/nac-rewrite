import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { Api } from "src/domain/Api"
import { getNewsByIdV1 } from "./getNewsByIdV1"
import { getNewsV1 } from "./getNewsV1"
import { getNewsV2 } from "./getNewsV2"

export const NewsApiLive = HttpApiBuilder.group(Api, "NewsEndpoints", (handlers) =>
  // biome-ignore lint/correctness/useYield: <explanation>
  Effect.gen(function* () {
    // const repo = yield* NewsRepository

    return handlers
      .handle("getNewsV1", getNewsV1)
      .handle("getNewsV2", getNewsV2)
      .handle("getNewsByIdV1", getNewsByIdV1)
  }),
)
