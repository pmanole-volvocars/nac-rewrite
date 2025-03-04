import { Schema } from "effect"
import { CsBaseAsset } from "./CsBaseAsset"
import { CsTaxonomy } from "./CsTaxonomy"
import { baseEntryFields } from "./baseEntryFields"

const tag = "CsNewsEntry"

export class CsNewsEntry extends Schema.Class<CsNewsEntry>(tag)({
  ...baseEntryFields,

  // Additional fields:

  /** News entry's heading. */
  head: Schema.Struct({
    author: Schema.String,
    description: Schema.String,
    release_date: Schema.String,
    header_image: Schema.optional(CsBaseAsset),
  }),

  /** Attachments present on this news entry. */
  attachments: Schema.optional(Schema.Array(CsBaseAsset)),

  /** List of taxonomies associated to this news entry, like e.g., the news category, etc. */
  taxonomies: Schema.optional(Schema.Array(CsTaxonomy)),

  /**
   * News entry's body.
   *
   * The `body_text` be simple text, but it's most likely a string of the JSON exported by the
   * Contentstack RTE (Rich Text Editor) component.
   */
  body: Schema.Struct({ body_text: Schema.String }),
}) {}
