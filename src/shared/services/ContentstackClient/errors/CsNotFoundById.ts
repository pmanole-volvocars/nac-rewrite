import { Data } from "effect"

const T = "CsEntryNotFoundById"

export class CsNotFoundById extends Data.TaggedError(T)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = T
}
