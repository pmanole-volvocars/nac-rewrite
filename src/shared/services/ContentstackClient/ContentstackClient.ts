import cs from "@contentstack/delivery-sdk"
import { Effect, Redacted, pipe } from "effect"
import { ContentstackConfig } from "src/config/ContentstackConfig"
import { BuildContentstackClientError } from "./errors/BuildContentstackClientError"

/**
 * Contentstack Content Delivery API Client `Effect.Service` Singleton.
 *
 * @example
 * // Use the client to fetch German news entries:
 * const getGermanNewsEntries: Effect.Effect<
 *   FindResponse<{ uid: string, title: string }>,
 *   ContentstackClientError,
 *   ContentstackClient
 * > = Effect.gen(function* () {
 *   // get the client instance:
 *   const client = yield* ContentstackClient
 *   // use it to fetch news entries:
 *   return yield* Effect.tryPromise({
 *     try: () => {
 *       const germanNewsEntries = client.contentType("news").entry().locale("de-de")
 *       return germanNewsEntries.query().find<{ uid: string, title: string }>()
 *     },
 *     catch: BuildContentstackClientError.fromError,
 *   })
 * })
 */
export class ContentstackClient extends Effect.Service<ContentstackClient>()("ContentstackClient", {
  accessors: true,
  effect: pipe(
    ContentstackConfig,
    Effect.andThen((config: ContentstackConfig) =>
      Effect.try({
        try: () =>
          cs.stack({
            branch: config.Branch,
            region: config.Region,
            apiKey: Redacted.value(config.ApiKey),
            deliveryToken: Redacted.value(config.DeliveryToken),
            environment: config.Environment,
            live_preview: {
              enable: false, // not implemented yet
              preview_token: Redacted.value(config.PreviewToken),
            },
          }),
        catch: BuildContentstackClientError.fromError,
      }),
    ),
    Effect.tap(Effect.logInfo("Client created")),
    Effect.withLogSpan("ContentstackClient"),
  ),
}) {}
