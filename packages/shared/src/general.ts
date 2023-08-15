export function isObject(val: unknown): boolean {
  return val !== null && typeof val === "object";
}

export const objectToString = Object.prototype.toString;
export function toTypeString(value: unknown): string {
  return objectToString.call(value);
}

export function toRawType(value: unknown): string {
  return toTypeString(value);
}


export const extend = Object.assign