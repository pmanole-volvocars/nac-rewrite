import { HttpApiBuilder, HttpApiSwagger, HttpMiddleware } from "@effect/platform"
import { BunHttpServer } from "@effect/platform-bun"
import { Effect, Layer } from "effect"
import { ContentstackClient } from "src/shared/services/ContentstackClient"
import { ApiLive } from "./ApiLive"
import { LoggingLayer } from "./Logging"

const port = 3000
const HttpServer = BunHttpServer.layer({
  maxRequestBodySize: 1024 * 1024 * 10, // 10MB
  port,
}).pipe(Layer.tap(() => Effect.logInfo(`Server listening on port ${port}`)))

/** Live HTTP Server serving {@link ApiLive} and a Swagger UI. */
export const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  // Swagger endpoint served at /docs path by default:
  Layer.provide(HttpApiSwagger.layer()),
  // The BFF main API layer:
  Layer.provide(ApiLive),

  // Provide HTTP server to above APIs so they can be served:
  Layer.provide(HttpServer),

  // Dependencies of ApiLive:
  Layer.provide(ContentstackClient.Default),
  // Other examples:
  // Layer.provide(NewsRepository.Live)
  // Layer.provide(SomeEffectService.Default)

  // Depending on logging schema, this might be needed, but should probably look at a custom logger first:
  Layer.annotateLogs("service", "news-and-communications-bff"),

  // Keep logging layer last so it's applied to all above layers, ensuring the correct logging
  // format. This is important because it clears the loggers collection of all loggers that other
  // layers/effects might have added, before adding our preferred standard logger:
  Layer.provide(LoggingLayer),
)
