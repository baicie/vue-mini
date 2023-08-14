export type CollectionTypes = IterableCollections | WeakCollections

type IterableCollections = Map<any, any> | Set<any>
type WeakCollections = WeakMap<any, any> | WeakSet<any>
type MapTypes = Map<any, any> | WeakMap<any, any>
type SetTypes = Set<any> | WeakSet<any>


export const mutableHandlers:ProxyHandler<object> = {

}

export const mutableCollectionHandlers:ProxyHandler<CollectionTypes> ={

}