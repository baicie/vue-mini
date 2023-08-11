import { isObject } from '@baicie/vue-shared'

export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadOnly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.IS_SHALLOW]?: boolean
  [ReactiveFlags.RAW]?: any
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

export function reactive(target: Object) {
  // if
  if (isReadonly(target))
    return target
  return createReactiveObject(
    target,
    false,

  )
}

export function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandler: Function,
  collectionHandler: Function,
  proxyMap: WeakMap<Target, any>,
) {
  if (!isObject(target)) {
    if (__DEV__)
      console.warn(`value cannot be made reactive: ${String(target)}`)

    return target
  }
}
