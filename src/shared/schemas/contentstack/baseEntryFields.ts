import type { BaseEntry } from "@contentstack/delivery-sdk"
import { Schema } from "effect"
import { CsPublishDetails } from "./CsPublishDetails"

/**
 * Contentstack SDK `BaseEntry` fields as Schemas, so that we can compose with these fields and
 * create an extended Schema from `BaseEntry`, corresponding to a custom Entry type defined in
 * Contentstack.
 *
 * @example
 * const tag = "DocumentEntry"
 * export class DocumentEntry extends Schema.Class<DocumentEntry>(tag)({
 *   ...baseEntryFields,
 *   // any additional fields:
 *   body: Schema.String,
 * }) {}
 */
export const baseEntryFields = {
  _version: Schema.Number,
  locale: Schema.String,
  uid: Schema.String,
  ACL: Schema.Unknown, // we don't case about this yet
  _in_progress: Schema.Boolean,
  created_at: Schema.String,
  created_by: Schema.String,
  tags: Schema.Array(Schema.String),
  title: Schema.String,
  updated_at: Schema.String,
  updated_by: Schema.String,
  publish_details: CsPublishDetails,
} as const satisfies { [K in keyof BaseEntry]: unknown }
