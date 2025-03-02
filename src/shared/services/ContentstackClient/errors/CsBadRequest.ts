import { Data } from "effect"

const T = "CsBadRequest"

export class CsBadRequest extends Data.TaggedError(T)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = T
}
