import { Data } from "effect"

const tag = "CsLanguageNotFound"

export class CsLanguageNotFound extends Data.TaggedError(tag)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = tag
}
