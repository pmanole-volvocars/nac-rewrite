import { PlatformConfigProvider } from "@effect/platform"
import { BunFileSystem, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer, pipe } from "effect"
import { LoggingLayer } from "./server/Logging"
import { ServerLive } from "./server/ServerLive"

// Effect Dev Tools:
// View traces, metrics and inspect the context of an Effect app in VSCode.
//
// import { DevTools } from "@effect/experimental"
// const DevToolsLive = DevTools.layerWebSocket().pipe(
//   Layer.provide(NodeSocket.layerWebSocketConstructor)
// )
//
// Layer.launch(ServerLive).pipe(Effect.provide(DevToolsLive))

pipe(
  Effect.log("Starting BFF Server"),
  // Replace all loggers with
  Effect.provide(LoggingLayer),
  // Replace default config provider that loads process env vars, with one that loads .env file.
  // TODO: write custom provider that loads from process env but then applies .env file as well?
  // Or better yet, load process env in production and .env in development mode.
  // The below config provider is only suitable during development!
  Effect.provide(PlatformConfigProvider.layerDotEnv("./.env")),
  Effect.provide(BunFileSystem.layer),
  Effect.andThen(Layer.launch(ServerLive)),
  BunRuntime.runMain(),
)
