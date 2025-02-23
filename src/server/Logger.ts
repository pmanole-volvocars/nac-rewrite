import { Effect, FiberRef, HashSet, Layer, Logger } from "effect"
import { isDev } from "src/shared/utils/isDev"

/**
 * A Layer that clears all existing `Logger`s.
 *
 * @example
 * import { NodeRuntime } from "@effect/platform-node"
 * import { Effect, FiberRef, HashSet, Layer, Logger } from "effect"
 *
 * const MainLayer = Logger.json.pipe(Layer.provide(ClearAllLoggersLayer))
 * // const MainLayer = Layer.provide(ClearAllLoggersLayer)(Logger.json)
 *
 * const program = Effect.gen(function*() {
 *   yield* Effect.log("OK")
 * })
 *
 * NodeRuntime.runMain(
 *   program.pipe(Effect.provide(MainLayer))
 * )
 */
const ClearAllLoggers = Layer.scopedDiscard(
  Effect.locallyScoped(FiberRef.currentLoggers, HashSet.empty()),
)

const OurLogger = isDev() ? Logger.structured : Logger.json

/** Main logger Layer that will provide all logging output. */
export const MainLogger = Layer.provide(ClearAllLoggers)(OurLogger)
