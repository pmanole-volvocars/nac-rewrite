import { Schema } from "effect"
import { baseAssetFields } from "./baseAssetFields"

const tag = "CsBaseAsset"

export class CsBaseAsset extends Schema.Class<CsBaseAsset>(tag)({
  ...baseAssetFields,
}) {}
