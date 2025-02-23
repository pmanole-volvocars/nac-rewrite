import { Effect, Schema } from "effect"
import type { CsTaxonomy } from "src/shared/schemas/contentstack/CsTaxonomy"
import { Taxonomies } from "src/shared/schemas/contentstack/Taxonomies"
import { MappingFailure } from "src/shared/schemas/errors/MappingFailure"

const T = "NewsCategory"

export const NewsCategory = Schema.compose(Schema.Trim, Schema.NonEmptyString).pipe(Schema.brand(T))
export type NewsCategory = typeof NewsCategory.Type

const decodeString = Schema.decode(NewsCategory)

/**
 * Tries to map from an arbitrary input string, trimming it and ensuring it is a valid news category
 * name. The resulting value is then returned in an Effect.
 */
export const NewsCategoryFromString = (str: string) =>
  decodeString(str).pipe(
    Effect.mapError(
      (error) =>
        new MappingFailure({
          errorMessage: `Failed to map \`${T}\` from the string value \`${str}\`.`,
          cause: error,
        }),
    ),
  )

/**
 * Tries to map a {@link NewsCategory} from a {@link CsTaxonomy}.
 *
 * The taxonomy must be of type {@link Taxonomies.NewsCategories} and the term must be a non-empty
 * string after trimming.
 */
export const NewsCategoryFromCsTaxonomy = (
  taxonomy: CsTaxonomy,
): Effect.Effect<NewsCategory, MappingFailure> => {
  const inputTaxonomyId = taxonomy.taxonomy_uid
  const expectedTaxonomyId = Taxonomies.NewsCategories

  if (inputTaxonomyId === expectedTaxonomyId) {
    return NewsCategoryFromString(taxonomy.term_uid)
  }

  return Effect.fail(
    new MappingFailure({
      errorMessage: `Failed to map \`${T}\` from Contentstack taxonomy. Expected a \`${expectedTaxonomyId}\` taxonomy, but found a \`${inputTaxonomyId}\` taxonomy instead.`,
    }),
  )
}
