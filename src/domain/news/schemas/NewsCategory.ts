import { Effect, Schema, pipe } from "effect"
import type { CsTaxonomy } from "src/shared/schemas/contentstack/CsTaxonomy"
import { Taxonomies } from "src/shared/schemas/contentstack/Taxonomies"
import { MappingFailure } from "src/shared/schemas/errors/MappingFailure"

export namespace NewsCategory {
  const tag = "NewsCategory"

  /** News category schema. */
  export const NewsCategory = Schema.compose(Schema.Trim, Schema.NonEmptyString).pipe(
    Schema.brand(tag),
  )

  /** News category type. */
  export type NewsCategory = typeof NewsCategory.Type

  const decode = Schema.decode(NewsCategory)

  /**
   * Tries to map from an arbitrary input string, trimming it and ensuring it is a valid news category
   * name.
   *
   * This can be used to decode a news category from a taxonomy term.
   */
  export function fromString(str: string) {
    return pipe(
      str,
      decode,
      Effect.mapError(
        (error) =>
          new MappingFailure({
            errorMessage: `Failed to map \`${tag}\` from the string value \`${str}\`.`,
            cause: error,
          }),
      ),
    )
  }

  /**
   * Tries to map a {@link NewsCategory} from a {@link CsTaxonomy}.
   *
   * The taxonomy must be of type {@link Taxonomies.NewsCategories} and the term must be a non-empty
   * string after trimming.
   */
  export function fromCsTaxonomy(
    taxonomy: CsTaxonomy,
  ): Effect.Effect<NewsCategory, MappingFailure> {
    const inputTaxonomyId = taxonomy.taxonomy_uid
    const expectedTaxonomyId = Taxonomies.NewsCategories

    if (inputTaxonomyId === expectedTaxonomyId) {
      return fromString(taxonomy.term_uid)
    }

    return Effect.fail(
      new MappingFailure({
        errorMessage: `Failed to map \`${tag}\` from Contentstack taxonomy. Expected a \`${expectedTaxonomyId}\` taxonomy, but found a \`${inputTaxonomyId}\` taxonomy instead.`,
      }),
    )
  }
}
