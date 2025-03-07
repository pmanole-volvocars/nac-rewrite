import { Effect, Schema, pipe } from "effect"
import type { CsNewsEntry } from "src/shared/schemas/contentstack/CsNewsEntry"
import { MappingFailure } from "src/shared/schemas/errors/MappingFailure"
import { NewsAttachment } from "./NewsAttachment"
import { NewsCategory } from "./NewsCategory"
import { NewsId, NewsIdFromString } from "./NewsId"

const tag = "NewsArticle"

export class NewsArticle extends Schema.Class<NewsArticle>(tag)({
  attachments: Schema.optional(Schema.Array(NewsAttachment)),
  author: Schema.String,
  body: Schema.String,
  categories: Schema.Array(NewsCategory.NewsCategory),
  description: Schema.String,
  /** The header image is optional because content publishers can choose to delete already published assets. */
  headerImage: Schema.optional(NewsAttachment),
  id: NewsId,
  locale: Schema.String,
  /** Maps from `entry.head.release_date`, not from `entry.publish_details.time`. */
  publishedAt: Schema.optional(Schema.String),
  tags: Schema.Array(Schema.String),
  title: Schema.String,
}) {
  /** Tries to map from a Contentstack news entry. */
  static fromCsNewsEntry(entry: CsNewsEntry): Effect.Effect<NewsArticle, MappingFailure> {
    return Effect.gen(function* () {
      const id = yield* NewsIdFromString(entry.uid)

      const headerImage = entry.head.header_image
        ? yield* NewsAttachment.fromBaseAsset(entry.head.header_image)
        : undefined

      const categories = entry.taxonomies
        ? yield* pipe(entry.taxonomies, Effect.forEach(NewsCategory.fromCsTaxonomy))
        : []

      const attachments = entry.attachments
        ? yield* pipe(entry.attachments, Effect.forEach(NewsAttachment.fromBaseAsset))
        : []

      try {
        const newsArticle = NewsArticle.make({
          attachments,
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
            errorMessage: `Failed to map \`${tag}\` from a Contentstack news entry.`,
            cause: error,
          }),
        )
      }
    }).pipe(Effect.annotateLogs({ entry }))
  }
}
