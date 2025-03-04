import { Schema } from "effect"

const tag = "CsTaxonomy"

export class CsTaxonomy extends Schema.Class<CsTaxonomy>(tag)({
  taxonomy_uid: Schema.String,
  term_uid: Schema.String,
}) {}
