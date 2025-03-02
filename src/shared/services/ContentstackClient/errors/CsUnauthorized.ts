import { Data } from "effect"

const T = "CsUnauthorized"

export class CsUnauthorized extends Data.TaggedError(T)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = T
}
