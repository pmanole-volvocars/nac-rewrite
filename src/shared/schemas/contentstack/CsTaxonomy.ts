import { Schema } from "effect"

const T = "CsTaxonomy"

export class CsTaxonomy extends Schema.Class<CsTaxonomy>(T)({
  taxonomy_uid: Schema.String,
  term_uid: Schema.String,
}) {}
