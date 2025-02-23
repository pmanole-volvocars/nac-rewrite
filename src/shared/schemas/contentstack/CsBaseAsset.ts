import { Schema } from "effect"
import { baseAssetFields } from "./baseAssetFields"

const T = "CsBaseAsset"

export class CsBaseAsset extends Schema.Class<CsBaseAsset>(T)({
  ...baseAssetFields,
}) {}
