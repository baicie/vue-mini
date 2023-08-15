import { ReactiveFlags, Target } from "./reactive"

export type CollectionTypes = IterableCollections | WeakCollections

type IterableCollections = Map<any, any> | Set<any>
type WeakCollections = WeakMap<any, any> | WeakSet<any>
type MapTypes = Map<any, any> | WeakMap<any, any>
type SetTypes = Set<any> | WeakSet<any>

const get = createGetter()


function createGetter(isReadonly = false,shallow = false){
  return function get(target: Target,key: string|symbol,receiver:object){
    if(key === ReactiveFlags.IS_REACTIVE){
      return !isReadonly
    }
  }
}

export const mutableHandlers:ProxyHandler<object> = {
  get,
}

export const mutableCollectionHandlers:ProxyHandler<CollectionTypes> ={

}