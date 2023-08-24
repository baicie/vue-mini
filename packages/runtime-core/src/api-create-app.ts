import { RootRenderFunction } from "./renderer";

export interface App<HostElement = any>{
  version: string
}

export interface AppConfig {

}

export interface AppContext {
  app: App
  config:AppConfig
  components:Record<string,Component>
  
}

export type CreateAppFunction<HostElement> = (
  // TODO
  rootComponent:unknown,
  rootProps?: null
) => App<HostElement>

export function createAppContext():AppContext{
  return {
    app: null as any,
    config:{},
    components:{},
    directives:{},
    provides:Object.create(null),
    optionsCache:new WeakMap(),
    propsCache:new WeakMap(),
    emitsCache:new WeakMap(),
  }
}

// 最终的createApp函数
export function createAppApi<HostElement>(
  render:RootRenderFunction<HostElement>,
):CreateAppFunction<HostElement>{
  return function createApp(rootComponent,rootProps = null){


    const app:App  = (

    )

    return app
  }
}
