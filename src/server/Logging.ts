import { ecsFormat } from "@elastic/ecs-pino-format"
import { Effect, FiberRef, HashMap, HashSet, Layer, List, LogLevel, Logger } from "effect"
import pino from "pino"
import { isDev } from "src/shared/utils/isDev"

const log = pino(ecsFormat({ apmIntegration: false }))

const CustomLogger = Logger.replace(
  Logger.defaultLogger,
  Logger.make((options) => {
    const { date, cause, spans, context, fiberId, message, logLevel, annotations } = options

    const messageStr = message && typeof message === "string" ? message : undefined
    const messageObj = message && message instanceof Object ? message : undefined

    const annotationsObject = HashMap.reduce(
      annotations,
      {} as { [key: string]: unknown },
      (accumulator, value, key) => {
        accumulator[key] = value
        return accumulator
      },
    )

    const spansObject = List.reduce(
      spans,
      {} as { [key: string]: number },
      (accumulator, logSpan) => {
        accumulator[logSpan.label] = date.valueOf() - logSpan.startTime
        return accumulator
      },
    )

    const payload = {
      ...annotationsObject,
      fiberId,
      context,
      spans: spansObject,
      cause,
    }
    if (messageObj) Object.assign(payload, messageObj)

    switch (logLevel) {
      case LogLevel.Trace:
        log.trace(payload, messageStr)
        break
      case LogLevel.Debug:
        log.debug(payload, messageStr)
        break
      case LogLevel.Info:
        log.info(payload, messageStr)
        break
      case LogLevel.Warning:
        log.warn(payload, messageStr)
        break
      case LogLevel.Error:
        log.error(payload, messageStr)
        break
      case LogLevel.Fatal:
        log.fatal(payload, messageStr)
        break
      case LogLevel.None:
        // No logging for None level
        break
    }
  }),
)

const DiscardAllLoggers = Layer.scopedDiscard(
  Effect.locallyScoped(FiberRef.currentLoggers, HashSet.empty()),
)

/**
 * Main logging Layer. Discards all registered loggers before applying itself.
 *
 * - Writes logs to standard output.
 * - Uses the ECS (Elastic Common Schema) when running in production mode.
 * - Uses a more human-readable structured format when running in development mode.
 */
export const LoggingLayer = Layer.provide(DiscardAllLoggers)(
  isDev() ? Logger.structured : CustomLogger,
)
