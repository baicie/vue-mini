import { isObject } from '@baicie/vue-shared'
import { mutableCollectionHandlers, mutableHandlers } from './base-handler'

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

export const reactiveMap = new WeakMap<Target, any>()

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
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
    
  )
}

export function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandler: ProxyHandler<any>,
  collectionHandler: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>,
) {
  // reactive只能代理对象类型
  if (!isObject(target)) {
    if (__DEV__)
      console.warn(`value cannot be made reactive: ${String(target)}`)

    return target
  }

  // 没太懂
  if(target[ReactiveFlags.RAW] && !(isReadonly && target[ReactiveFlags.IS_REACTIVE])){
    return target
  }

  // 已经是代理后的结果直接返回
  const existingProxy = proxyMap.get(target)
  if(existingProxy)
    return existingProxy

    
}
