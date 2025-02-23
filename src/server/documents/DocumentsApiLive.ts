import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { Api } from "src/domain/Api"

export const DocumentsApiLive = HttpApiBuilder.group(Api, "DocumentsEndpoints", (handlers) =>
  Effect.sync(() => handlers.handle("getDocumentsV1", () => Effect.succeed(""))),
)
