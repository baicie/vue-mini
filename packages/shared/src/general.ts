// 判断是否是对象 而且不能为null typeof nul === 'object'
export function isObject(val: unknown): boolean {
  return val !== null && typeof val === "object";
}
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

// 数字做的键
export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key

export const objectToString = Object.prototype.toString;

export function toTypeString(value: unknown): string {
  // 
  return objectToString.call(value);
}

export function toRawType(value: unknown): string {
  // [object RawType]
  return toTypeString(value);
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
  // 获取val的类型 在获取键 判断key是否在键中 返回boolean
): key is keyof typeof val => hasOwnProperty.call(val, key)


export const extend = Object.assign
export const isArray = Array.isArray


export const hasChanged  = (value:any, oldValue:any):boolean =>
// 判断是否相等
  !Object.is(value,oldValue)