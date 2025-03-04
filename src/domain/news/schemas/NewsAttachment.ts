import type { BaseAsset } from "@contentstack/delivery-sdk"
import { Effect, Schema } from "effect"
import type { CsBaseAsset } from "src/shared/schemas/contentstack/CsBaseAsset"
import { MappingFailure } from "src/shared/schemas/errors/MappingFailure"

const tag = "NewsAttachment"

export class NewsAttachment extends Schema.Class<NewsAttachment>(tag)({
  contentType: Schema.String,
  fileName: Schema.String,
  fileSize: Schema.String,
  id: Schema.String,
  publishedAt: Schema.optional(Schema.String),
  title: Schema.String,
  updatedAt: Schema.String,
  url: Schema.String,
  version: Schema.Number,
}) {
  /** Tries to map from a Contentstack base asset. */
  static fromBaseAsset(
    baseAsset: BaseAsset | CsBaseAsset,
  ): Effect.Effect<NewsAttachment, MappingFailure> {
    return Effect.gen(function* () {
      try {
        const asset = NewsAttachment.make({
          contentType: baseAsset.content_type,
          fileName: baseAsset.filename,
          fileSize: baseAsset.file_size,
          id: baseAsset.uid,
          publishedAt: baseAsset.publish_details?.time,
          title: baseAsset.title,
          updatedAt: baseAsset.updated_at,
          url: baseAsset.url,
          version: baseAsset._version,
        })
        return yield* Effect.succeed(asset)
      } catch (error) {
        return yield* new MappingFailure({
          errorMessage: `Failed to map \`${T}\` from a Contentstack base asset.`,
          cause: error,
        })
      }
    }).pipe(Effect.annotateLogs({ baseAsset }))
  }

  /** Tries to map from an unknown or arbitrary JSON object. */
  static fromUnknown(value: unknown): Effect.Effect<NewsAttachment, MappingFailure> {
    return Schema.decodeUnknown(NewsAttachment)(value, { errors: "all" }).pipe(
      Effect.mapError(
        (error) =>
          new MappingFailure({
            errorMessage: `Failed to map \`${T}\` from an unknown value.`,
            cause: error,
          }),
      ),
      Effect.annotateLogs({ value }),
    )
  }
}
