# Domain

This folder contains the core domain logic and types of the BFF.

The code is mainly organized into different API subdomains that each group together various HTTP
endpoint definitions.

Each sub-folder is a separate API subdomain (or feature folder).

## Overview

The `HttpApi*` modules from `Effect/Platform` are used to define the News & Comms HTTP API in a
flexible and declarative way.

To define an API, we create a set of `HttpEndpoint`s grouped together into a collection by an
`HttpGroup`.

An API is then defined by merging multiple groups into a complete `HttpApi`.

```sh
HttpApi ("News & Comms BFF")
├── HttpGroup ("News API")
│   ├── HttpEndpoint ("getNews")
│   ├── HttpEndpoint ("getNewsById")
│   └── HttpEndpoint ("getSpotlightNews")
└── HttpGroup ("Documents API")
    └── HttpEndpoint ("getDocuments")
```

Once the API is defined, we can use the definitions to:

- **Start a Server** by implementing and serving the endpoints.
- **Generate Documentation** by creating a Swagger page to document (and test) the API.
- **Deriving a Client** by generating a fully-typed client for the API.

Benefits of a Single API Definition:

- **Consistency**: A single definition ensures the server, documentation, and client remain aligned.
- **Reduced Maintenance**: Changes to the API are reflected across all related components.
- **Simplified Workflow**: Avoids duplication by consolidating API details in one place.
