import { Effect, Schema } from "effect"
import { MappingFailure } from "src/shared/schemas/errors/MappingFailure"

const T = "NewsId"

export const NewsId = Schema.compose(Schema.Trim, Schema.NonEmptyString)
  .pipe(Schema.brand(T))
  .annotations({
    title: "NewsId",
    description: "News Article ID",
  })
export type NewsId = typeof NewsId.Type

const decodeString = Schema.decode(NewsId)

export const NewsIdFromString = (str: string) =>
  decodeString(str).pipe(
    Effect.mapError(
      (error) =>
        new MappingFailure({
          errorMessage: `Failed to map \`${T}\` from a string value \`${str}\`.`,
          cause: error,
        }),
    ),
  )
