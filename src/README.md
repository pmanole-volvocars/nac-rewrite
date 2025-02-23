# src

The `src` folder is where all the source code lives.

The code is split into 3 main areas:

- **domain**: contains all the domain logic, and types and uses inversion-of-control to depend on
  abstractions of clearly defined interfaces.
- **server**: contains all implementation code for the abstractions defined in the domain (e.g.
  repositories, APIs) as well as the HTTP server that starts the BFF.
- **shared**: contains shared models and other shared code.

The application's main entry point, where the HTTP server is started, is in the
[`index.ts`](./index.ts) file.
