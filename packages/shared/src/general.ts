export function isObject(val: unknown): boolean {
  return val !== null && typeof val === 'object'
}
