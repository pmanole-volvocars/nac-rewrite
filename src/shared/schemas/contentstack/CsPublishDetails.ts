import type { PublishDetails } from "@contentstack/delivery-sdk"
import { Schema } from "effect"

/**
 * Each Contentstack entry type and asset contains a `publish_details` field.
 * This is the Schema for that field.
 *
 * This particular Schema is not optional because we're currently only using the Content Delivery
 * API, which means all entries and assets are already published, otherwise they wouldn't be
 * deliverable through this API.
 *
 * If we start using the Content Management API, it might be best if we wrap this with
 * `Schema.optional` and use the new Schema instead:
 *
 * @example
 * export const CmPublishDetails = Schema.optional(CsPublishDetails)
 */
export const CsPublishDetails = Schema.Struct({
  environment: Schema.String,
  locale: Schema.String,
  time: Schema.String,
  user: Schema.String,
} satisfies { [K in keyof PublishDetails]: unknown })
