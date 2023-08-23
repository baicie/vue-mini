
declare const RefSymbol: unique symbol

export interface Ref<T = any>{
  value:T
  [RefSymbol]:true
}

export function isRef<T>(r:any):r is Ref {
  return !!(r && r.__v_isRef === true)
}