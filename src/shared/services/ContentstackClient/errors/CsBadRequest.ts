import { Data } from "effect"

const tag = "CsBadRequest"

export class CsBadRequest extends Data.TaggedError(tag)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = tag
}
