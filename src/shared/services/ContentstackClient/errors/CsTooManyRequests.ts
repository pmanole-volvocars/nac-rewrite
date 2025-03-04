import { Data } from "effect"

const tag = "CsTooManyRequests"

export class CsTooManyRequests extends Data.TaggedError(tag)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = tag
}
