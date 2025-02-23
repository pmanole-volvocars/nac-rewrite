import { Effect, Schema } from "effect"
import type { CsNewsEntry } from "src/shared/schemas/contentstack/CsNewsEntry"
import { MappingFailure } from "src/shared/schemas/errors/MappingFailure"
import { NewsAttachment } from "./NewsAttachment"
import { NewsCategory, NewsCategoryFromCsTaxonomy } from "./NewsCategory"
import { NewsId, NewsIdFromString } from "./NewsId"

const T = "NewsArticle"

export class NewsArticle extends Schema.Class<NewsArticle>(T)({
  attachments: Schema.optional(Schema.Array(NewsAttachment)),
  author: Schema.String,
  body: Schema.String,
  categories: Schema.Array(NewsCategory),
  description: Schema.String,
  /** The header image is optional because content publishers can choose to delete already published assets. */
  headerImage: Schema.optional(NewsAttachment),
  id: NewsId,
  locale: Schema.String,
  publishedAt: Schema.String,
  tags: Schema.Array(Schema.String),
  title: Schema.String,
}) {
  /** Tries to map from a Contentstack news entry. */
  static fromCsNewsEntry(entry: CsNewsEntry): Effect.Effect<NewsArticle, MappingFailure> {
    return Effect.gen(function* () {
      if (!entry.head.header_image) {
        // Content publisher possibly deleted the header image asset after it was linked and published:
        return yield* new MappingFailure({
          errorMessage: `Failed to map \`${T}\` from a Contentstack news entry: \`head.header_image\` was undefined.`,
        })
      }
      const headerImage = yield* NewsAttachment.fromBaseAsset(entry.head.header_image)

      const id = yield* NewsIdFromString(entry.uid)

      const categories: NewsCategory[] = []
      if (entry.taxonomies) {
        for (const taxonomy of entry.taxonomies)
          categories.push(yield* NewsCategoryFromCsTaxonomy(taxonomy))
      }

      try {
        const newsArticle = NewsArticle.make({
          attachments: entry.attachments?.map((asset) => ({
            contentType: asset.content_type,
            fileName: asset.filename,
            fileSize: asset.file_size,
            id: asset.uid,
            publishedAt: asset.publish_details?.time,
            title: asset.title,
            updatedAt: asset.updated_at,
            url: asset.url,
            version: asset._version,
          })),
          author: entry.head.author,
          body: entry.body.body_text,
          categories,
          description: entry.head.description,
          headerImage,
          id,
          locale: entry.locale,
          publishedAt: entry.head.release_date,
          tags: entry.tags,
          title: entry.title,
        })
        return yield* Effect.succeed(newsArticle)
      } catch (error) {
        return yield* Effect.fail(
          new MappingFailure({
            errorMessage: `Failed to map \`${T}\` from a Contentstack news entry.`,
            cause: error,
          }),
        )
      }
    }).pipe(Effect.annotateLogs({ entry }))
  }
}
