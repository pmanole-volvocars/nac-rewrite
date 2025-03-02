import { HttpApi, OpenApi } from "@effect/platform"
import { port } from "src/config/constants"
import { DocumentsEndpoints } from "./documents/DocumentsEndpoints"
import { NewsEndpoints } from "./news/NewsEndpoints"

/** The News & Comms HTTP API definition. */
export const Api = HttpApi.make("NewsAndCommsBff")
  .annotate(OpenApi.Title, "news-and-communications-bff")
  .annotate(OpenApi.Version, "0.0.1")
  .annotate(OpenApi.Summary, "Connect News and Communications BFF")
  .annotate(
    OpenApi.Description,
    'This is the Backend-For-Frontend HTTP Web API for the Connect News & Comms Micro-Frontend. Its code is available <a href="https://github.com/volvo-cars/news-and-communications-bff">here</a>.',
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
