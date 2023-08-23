import { isObject, toRawType } from "@vuemini/shared";
import { mutableCollectionHandlers, mutableHandlers } from "./base-handler";

export const enum ReactiveFlags {
  SKIP = "__v_skip",
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadOnly",
  IS_SHALLOW = "__v_isShallow",
  RAW = "__v_raw",
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean;
  [ReactiveFlags.IS_REACTIVE]?: boolean;
  [ReactiveFlags.IS_READONLY]?: boolean;
  [ReactiveFlags.IS_SHALLOW]?: boolean;
  [ReactiveFlags.RAW]?: any;
}

export const reactiveMap = new WeakMap<Target, any>();
export const shallowReactiveMap = new WeakMap<Target, any>();
export const readonlyMap = new WeakMap<Target, any>();
export const shallowReadonlyMap = new WeakMap<Target, any>();

const enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2,
}

function targetTypeMap(rawType: string) {
  switch (rawType) {
    case "Object":
    case "Array":
      return TargetType.COMMON;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return TargetType.COLLECTION;
    default:
      return TargetType.INVALID;
  }
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY]);
}

export function isShallow(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_SHALLOW])
}

export function reactive(target: Object) {
  // if
  if (isReadonly(target)) return target;
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}

export function shallowReactive<T extends object>(target: T) {
  return createReactiveObject(
    target,
    false,
    {},
    {},
    shallowReactiveMap
  )
}

export function readonly<T extends object>(target: T) {
  return createReactiveObject(
    target,
    true,
    {},
    {},
    readonlyMap
  )
}

export function shallowReadonly<T extends object>(target: T) {
  return createReactiveObject(
    target,
    true,
    {},
    {},
    shallowReadonlyMap
  )
}

export function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandler: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  // reactive只能代理对象类型
  if (!isObject(target)) {
    if (__DEV__)
      console.warn(`value cannot be made reactive: ${String(target)}`);

    return target;
  }

  // 如果该对象有值 除了只读与响应式数据返回数据本身
  // 当target是响应式直接返回 除非在响应式对象上调用readonly
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target;
  }

  // 已经是代理后的结果直接返回
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  // 不合法的对象直接返回无法代理
  const targetType = getTargetType(target);
  if (targetType === TargetType.INVALID) {
    return target;
  }

  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandler
  );

  proxyMap.set(target, proxy);
  return proxy;
}

function getTargetType(value: Target) {
  // skip 或者当对象不可扩展时 直接返回不合法
  //  否则获取对象类型进行判断
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID
    : targetTypeMap(toRawType(value));
}


export function toRaw<T>(observed:T):T{
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) :observed
}