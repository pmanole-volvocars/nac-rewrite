import { Data } from "effect"

const T = "CsLanguageNotFound"

export class CsLanguageNotFound extends Data.TaggedError(T)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = T
}
