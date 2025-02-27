import { BunRuntime } from "@effect/platform-bun"
import { Layer, pipe } from "effect"
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

pipe(Layer.launch(ServerLive), BunRuntime.runMain())
