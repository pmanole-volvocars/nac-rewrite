import { Data } from "effect"

const tag = "CsNotFound"

export class CsNotFound extends Data.TaggedError(tag)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = tag
}
