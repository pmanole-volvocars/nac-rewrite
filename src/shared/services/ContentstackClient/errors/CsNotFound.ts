import { Data } from "effect"

const T = "CsNotFound"

export class CsNotFound extends Data.TaggedError(T)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = T
}
