import { Data } from "effect"

const tag = "CsUnauthorized"

export class CsUnauthorized extends Data.TaggedError(tag)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = tag
}
