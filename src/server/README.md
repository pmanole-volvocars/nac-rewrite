# Server

This folder contains the Live implementation of the API and HTTP Server, and implementations of
other abstractions defined in the domain.

The code is organized in a similar structure as the domain, with each subfolder in this folder
representing a subdomain (feature) of the domain.

[`ApiLive.ts`](./ApiLive.ts) is where the Live implementation of the BFF's HTTP API is defined.

[`ServerLive.ts`](./ServerLive.ts) is where the Live implementation of the HTTP Server resides,
which serves the `ApiLive` instance.
