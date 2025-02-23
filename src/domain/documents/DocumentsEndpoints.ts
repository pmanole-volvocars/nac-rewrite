import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"

export class DocumentsEndpoints extends HttpApiGroup.make("DocumentsEndpoints")
  .annotate(OpenApi.Title, "Documents API")
  .annotate(OpenApi.Description, "An API for working with documents")
  .add(
    HttpApiEndpoint.get("getDocumentsV1", "/v1/documents")
      .annotate(OpenApi.Summary, "Get documents (v1)")
      .annotate(OpenApi.Description, "Get documents")
      .addSuccess(Schema.String), // TODO: Add the actual endpoint
  ) {}

// .prefix("/v1") {} <- We could do this but first we'd need to create separate endpoint groups per
// version, versioning the group basically. While this could look nicer in the OpenAPI Schema and in
// Swagger UI, with separate documentation per version, versioning each endpoint instead is simpler
// and allows us to keep one single group for the same domain in a single file which also makes the
// declarations a bit easier to grok.
