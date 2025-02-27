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

/**
 * Main logging Layer.
 *
 * Writes logs to standard output. Uses JSON format in production and a more human-readable
 * structured format when running in development mode.
 */
export const LoggingLayer = Layer.provide(ClearAllLoggers)(OurLogger)
