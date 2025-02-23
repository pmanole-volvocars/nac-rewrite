import { BunRuntime } from "@effect/platform-bun"
import { Effect, Layer, pipe } from "effect"
import { MainLogger } from "./server/Logger"
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
  Effect.provide(MainLogger),
  Effect.andThen(Layer.launch(ServerLive)),
  BunRuntime.runMain(),
)
