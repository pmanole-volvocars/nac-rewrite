/**
 * Returns true if `process.env.NODE_ENV` is not defined or if it doesn't start with "prod".
 * Otherwise it returs false.
 */
export function isDev(): boolean {
  return !process.env.NODE_ENV?.trim().toLowerCase().startsWith("prod")
}
