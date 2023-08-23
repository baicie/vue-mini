import { ReactiveFlags, Target, isReadonly, isShallow, reactive, reactiveMap, readonly, readonlyMap, shallowReactiveMap, shallowReadonlyMap, toRaw } from "./reactive"
import { isObject, isArray, hasOwn, isSymbol, makeMap, isIntegerKey, hasChanged } from "@vuemini/shared";
import { isRef } from "./ref";

export type CollectionTypes = IterableCollections | WeakCollections

type IterableCollections = Map<any, any> | Set<any>
type WeakCollections = WeakMap<any, any> | WeakSet<any>
type MapTypes = Map<any, any> | WeakMap<any, any>
type SetTypes = Set<any> | WeakSet<any>

const builtInSymbols = new Set()
// 制作一个map key 为 __proto__,__v_isRef,__isVue
// isNonTrackableKeys为检查是否在上述map中
const isNonTrackableKeys = makeMap(`__proto__,__v_isRef,__isVue`)

const get = createGetter()

// 对数组的方法进行修改 以达到处理包含响应式数据的数组
const arrayInstrumentations = createArrayInstrumentations()

function createArrayInstrumentations(){
  const instrumentations:Record<string,Function>  = {}

  // 断言数组类型为'includes', 'indexOf', 'lastIndexOf'
  // ;(['includes', 'indexOf', 'lastIndexOf'] as const).forEach(key=>{
  //   instrumentations[key] = function(this:unknown[],...args:unknown[]){
  //       const arr = toRaw(this) as any
  //       for(let i =0,l = this.length; i<l; i++){
  //         // 收集依赖
  //       }

  //       const res = arr[key](...args)
  //       if(res === -1 || res === false){
  //         return arr[key](...args.map(toRaw))
  //       }else{
  //         return true
  //       }
  //   }
  // })

  return instrumentations
}

// 如果key是hasOwnProperty 
function hasOwnProperty(this:object,key:string){
  const obj = toRaw(this)
  // 收集依赖 TODO
  return obj.hasOwnProperty(key)
}

function createGetter(isReadonly = false,shallow = false){
  return function get(
    target: Target,
    key: string|symbol,
    receiver:object
    ){
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

    // 如果不是只读的
    if(!isReadonly){
      if(targetIsArray && hasOwn(arrayInstrumentations,key)){
        // arrayInstrumentations数组代理待做 TODO
        return Reflect.get(arrayInstrumentations,key,receiver)
      }
      if(key === 'hasOwnProperty'){
        // 看看是不是该对象原始对象上的属性
        return hasOwnProperty
      }
    }

    const res = Reflect.get(target,key,receiver)

    if(isSymbol(res) ? builtInSymbols.has(key):isNonTrackableKeys(key)){
      return res
    }

    if(!isReadonly){
      // 收集依赖
    }

    if(shallow){
      // 如果是shallow 代理一层就可以返回
      return res
    }

    // 
    if(isRef(res)){
      return targetIsArray && isIntegerKey(res) ?res:res.value
    }

    if(isObject(res)){
      // 如果是对象 循环代理
      return isReadonly?readonly(res) :reactive(res)
    }

    return res
  }
}

const set = createSetter()

function createSetter(shallow=false){
  return function set(
    target:object,
    key:string|symbol,
    value:unknown,
    receiver:object
    // 返回true为赋值fslse则不赋值
  ):boolean{
    //  从对象中获取旧值
    let oldValue = (target as any)[key]
    // 如果是只读的 如果原值是ref新值也是ref则不进行设置
    if(isReadonly(oldValue) && isRef(oldValue) && !isRef(value)){
      return false
    }

    
    if(!shallow){
      // 当新值不是shallow 且不是只读时
      if(!isShallow(value) && !isReadonly(value)){
        oldValue = toRaw(value)
        value = toRaw(value)
      }
      if(!isArray(target) && isRef(target) && !isRef(value)){
        oldValue.value = value
        return true
      }
    }

    const hasKey = 
      isArray(target) && isIntegerKey(key)
        ?Number(key)<target.length
        :hasOwn(target,key)
    const result = Reflect.set(target,key,value,receiver)

    // 触发收集的依赖
    if(target === toRaw(receiver)){
      if(!hasKey){
        // Add
      }else if(hasChanged(value,oldValue)){
        // set
      }
    }

    return result
  }
}


export const mutableHandlers:ProxyHandler<object> = {
  get,
  set
}

export const mutableCollectionHandlers:ProxyHandler<CollectionTypes> ={

}