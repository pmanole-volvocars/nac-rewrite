import { HttpApi, OpenApi } from "@effect/platform"
import { DocumentsEndpoints } from "./documents/DocumentsEndpoints"
import { NewsEndpoints } from "./news/NewsEndpoints"

/** The News & Comms HTTP API definition. */
export const Api = HttpApi.make("NewsAndCommsBff")
  .annotate(OpenApi.Title, "news-and-communications-bff")
  .annotate(OpenApi.Summary, "HTTP Web API")
  .annotate(
    OpenApi.Description,
    "<p>This is a Backend-For-Frontend HTTP Web API for the &ldquo;Connect News & Comms&rdquo; Micro-Frontend.</p>" +
      '<p>See <a href="https://github.com/volvo-cars/news-and-communications-bff">https://github.com/volvo-cars/news-and-communications-bff</a> for more information.</p>',
  )
  .add(DocumentsEndpoints)
  .add(NewsEndpoints)
