import type { BaseAsset } from "@contentstack/delivery-sdk"
import { Schema } from "effect"
import { CsPublishDetails } from "./CsPublishDetails"

/**
 * Contentstack SDK `BaseAsset` fields as Schemas, so that we can compose with these fields and
 * create an extended Schema from `BaseAsset`, corresponding to a custom Asset type defined in
 * Contentstack.
 *
 * @example
 * const T = "DocumentAsset"
 * export class DocumentAsset extends Schema.Class<DocumentAsset>(T)({
 *   ...baseAssetFields,
 *   // any additional fields:
 *   numberOfPages: Schema.Number,
 * }) {}
 */
export const baseAssetFields = {
  uid: Schema.String,
  created_at: Schema.String,
  updated_at: Schema.String,
  created_by: Schema.String,
  updated_by: Schema.String,
  content_type: Schema.String,
  file_size: Schema.String,
  tags: Schema.Array(Schema.String),
  filename: Schema.String,
  url: Schema.String,
  ACL: Schema.Unknown, // we don't case about this yet
  is_dir: Schema.Boolean,
  parent_uid: Schema.NullOr(Schema.String),
  _version: Schema.Number,
  title: Schema.String,
  publish_details: CsPublishDetails,
} as const satisfies { [K in keyof BaseAsset]: unknown }
