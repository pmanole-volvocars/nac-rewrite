/*
 * Config constants.
 */

/** The port the API server is listening on (no matter than environment). */
export const port = 3000

/** API/BFF application version. */
export const VERSION = "0.0.1"

/** `process.env.NODE_ENV` or `development` if not set. */
export const ENVIRONMENT = process.env.NODE_ENV ?? "development"
