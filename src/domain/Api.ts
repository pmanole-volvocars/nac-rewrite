import { HttpApi, OpenApi } from "@effect/platform"
import { VERSION, port } from "src/config/constants"
import { DocumentsEndpoints } from "./documents/DocumentsEndpoints"
import { NewsEndpoints } from "./news/NewsEndpoints"

/** The News & Comms HTTP API definition. */
export const Api = HttpApi.make("NewsAndCommsBff")
  .annotate(OpenApi.Title, "news-and-communications-bff")
  .annotate(OpenApi.Version, VERSION)
  .annotate(OpenApi.Summary, `Connect News & Communications BFF v${VERSION}`)
  .annotate(
    OpenApi.Description,
    'Welcome to the <a href="https://github.com/volvo-cars/news-and-communications-bff">Connect News & Communications BFF</a> Web API. This API serves the <a href="https://github.com/volvo-cars/connect/tree/main/apps/news-and-communications">Connect News & Communications MFE</a>.',
  )
  .annotate(OpenApi.License, {
    name: `Copyright ©${new Date().getFullYear()} Volvo Car Corporation. All rights reserved.`, // Yes, it's Car, not Cars.
    url: "https://www.volvocars.com/",
  })
  .annotate(OpenApi.Servers, [
    {
      description: "Localhost",
      url: `http://localhost:${port}`,
    },
    {
      description: "Connect Dev",
      url: "http://dev-connect.volvocars.biz/api/news-and-communications",
    },
    {
      description: "Connect QA",
      url: "http://qa-connect.volvocars.biz/api/news-and-communications",
    },
  ])
  .annotate(OpenApi.ExternalDocs, {
    description: "API Documentation",
    url: "https://github.com/volvo-cars/news-and-communications-bff/blob/main/README.md",
  })
  .add(DocumentsEndpoints)
  .add(NewsEndpoints)
