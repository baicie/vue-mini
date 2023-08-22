import { ReactiveFlags, Target, reactiveMap, readonlyMap, shallowReactiveMap, shallowReadonlyMap } from "./reactive"
import { isObject, isArray } from "@vuemini/shared";

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
    }else if(key === ReactiveFlags.IS_READONLY){
      return isReadonly
    }else if(key === ReactiveFlags.IS_SHALLOW){
      return shallow
    } else if(key === ReactiveFlags.RAW && receiver === (
      isReadonly
        ?shallow?shallowReadonlyMap:readonlyMap
        :shallow?shallowReactiveMap:reactiveMap
    ).get(target)
    ){
      return target
    }

    // 
    const targetIsArray = isArray(target)

    if(!isReadonly){
      
    }
  }
}

export const mutableHandlers:ProxyHandler<object> = {
  get,
}

export const mutableCollectionHandlers:ProxyHandler<CollectionTypes> ={

}