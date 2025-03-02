import { Data } from "effect"

const T = "CsTooManyRequests"

export class CsTooManyRequests extends Data.TaggedError(T)<{
  message: string
  cause?: unknown | undefined
}> {
  static readonly Tag = T
}
