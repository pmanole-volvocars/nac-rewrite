import { HttpApiBuilder, HttpApiSwagger, HttpMiddleware } from "@effect/platform"
import { BunHttpServer } from "@effect/platform-bun"
import { Layer } from "effect"
import { ApiLive } from "./ApiLive"

const BunsOwnHttpServer = BunHttpServer.layer({
  maxRequestBodySize: 1024 * 1024 * 10, // 10MB
  port: 3000,
})

/** The Live implementation of the HTTP Server serving {@link ApiLive}. */
export const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(ApiLive),
  // Layer.provide(NewsRepository.Live) etc
  Layer.provide(BunsOwnHttpServer),
)
