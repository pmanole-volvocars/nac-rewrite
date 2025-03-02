import { ecsFormat } from "@elastic/ecs-pino-format"
import {
  Array as Arr,
  Cause,
  Effect,
  FiberId,
  FiberRef,
  HashMap,
  HashSet,
  Inspectable,
  Layer,
  List,
  LogLevel,
  Logger,
} from "effect"
import pino from "pino"
import { isDev } from "src/shared/utils/isDev"

const log = pino(ecsFormat({ apmIntegration: false }))

const structuredMessage = (u: unknown): unknown => {
  switch (typeof u) {
    case "bigint":
    case "function":
    case "symbol": {
      return String(u)
    }
    default: {
      return Inspectable.toJSON(u)
    }
  }
}

const logger = Logger.make((options) => {
  const { date, cause, spans, fiberId, message, logLevel, annotations } = options
  const now = date.getTime()
  const annotationsObj: Record<string, unknown> = {}
  const spansObj: Record<string, number> = {}

  if (HashMap.size(annotations) > 0) {
    for (const [k, v] of annotations) {
      annotationsObj[k] = structuredMessage(v)
    }
  }

  if (List.isCons(spans)) {
    for (const span of spans) {
      spansObj[span.label] = now - span.startTime
    }
  }

  const messageArr = Arr.ensure(message)
  const messageStructured =
    messageArr.length === 1 ? structuredMessage(messageArr[0]) : messageArr.map(structuredMessage)

  const payload = {
    message: messageStructured,
    cause: Cause.isEmpty(cause) ? undefined : Cause.pretty(cause, { renderErrorCause: true }),
    spans: spansObj,
    fiberId: FiberId.threadName(fiberId),
    ...annotationsObj,
  }

  switch (logLevel) {
    case LogLevel.Trace:
      log.trace(payload)
      break
    case LogLevel.Debug:
      log.debug(payload)
      break
    case LogLevel.Info:
      log.info(payload)
      break
    case LogLevel.Warning:
      log.warn(payload)
      break
    case LogLevel.Error:
      log.error(payload)
      break
    case LogLevel.Fatal:
      log.fatal(payload)
      break
    case LogLevel.None:
      // No logging for None level
      break
  }
})

const discardCurrentLoggers = Layer.scopedDiscard(
  Effect.locallyScoped(FiberRef.currentLoggers, HashSet.empty()),
)

/**
 * Main logging Layer.
 *
 * Note: This layer discards all current loggers before adding itself.
 *
 * - Writes logs to standard output.
 * - Uses the ECS (Elastic Common Schema) when running in production mode.
 * - Uses a more human-readable structured format when running in development mode.
 */
export const LoggingLayer = Layer.provide(discardCurrentLoggers)(
  isDev() ? Logger.structured : Logger.replace(Logger.defaultLogger, logger),
)
