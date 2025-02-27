import { Config, type ConfigError, Effect, type Redacted } from "effect"

export interface ContentstackConfig {
  /** API Key for the current Stack. */
  ApiKey: Redacted.Redacted<string>
  /** Content branch (e.g., main, prod, qa, etc.) */
  Branch: string
  /** Content Delivery Token. Unique per Environment. */
  DeliveryToken: Redacted.Redacted<string>
  /** Content hosting environment, e.g. a delivery channel (e.g. live, production, mobileapp, social_media_platform, etc.) */
  Environment: string
  /** Content Preview Token. Unique per Environment. */
  PreviewToken: Redacted.Redacted<string>
  /** Content hosting region (us, eu, azure_na, azure_eu, gcp_na). */
  Region: string
}

// TODO: maybe can be replaced with Effect.Service instead of cached effect?
/**
 * An effect that returns the Contentstack configuration.
 *
 * This effect can be run multiple times, but the values are read only once and cached for the
 * duration of the program.
 */
export const ContentstackConfig: Effect.Effect<ContentstackConfig, ConfigError.ConfigError, never> =
  Effect.cached(
    Effect.gen(function* () {
      yield* Effect.logInfo("Loading Contentstack configuration")

      return {
        ApiKey: yield* Config.nonEmptyString("CS_NEWSANDCOMMS_STACK_API_KEY").pipe(
          Config.redacted<string>,
        ),
        Branch: yield* Config.nonEmptyString("CS_NEWSANDCOMMS_BRANCH"),
        DeliveryToken: yield* Config.nonEmptyString("CS_NEWSANDCOMMS_DELIVERY_TOKEN").pipe(
          Config.redacted<string>,
        ),
        Environment: yield* Config.nonEmptyString("CS_NEWSANDCOMMS_ENVIRONMENT"),
        PreviewToken: yield* Config.nonEmptyString("CS_NEWSANDCOMMS_PREVIEW_TOKEN").pipe(
          Config.redacted<string>,
        ),
        Region: yield* Config.nonEmptyString("CS_NEWSANDCOMMS_REGION").pipe(
          Config.map((value) => value.toLowerCase()),
          Config.validate({
            message: "Expected one of 'us', 'eu', 'azure_na', 'azure_eu', 'gcp_na'",
            validation: (region) =>
              region === "us" ||
              region === "eu" ||
              region === "azure_na" ||
              region === "azure_eu" ||
              region === "gcp_na",
          }),
        ),
      }
    }),
  ).pipe(Effect.flatten, Effect.withLogSpan("ContentstackConfig"))
