import { version } from ".";
import { Component, ConcreteComponent } from "./component";
import { ObjectEmitsOptions } from "./component-emits";
import { ComponentOptions, MergedComponentOptions } from "./component-options";
import { NormalizedPropsOptions } from "./component-props";
import { Directive } from "./directives";
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
  directives: Record<string, Directive>
  provides:Record<string | symbol, any>
  optionsCache:WeakMap<ComponentOptions, MergedComponentOptions>
  propsCache:WeakMap<ConcreteComponent,NormalizedPropsOptions>
  emitsCache:WeakMap<ConcreteComponent,ObjectEmitsOptions>
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

let uid = 0


// 最终的createApp函数
export function createAppAPI<HostElement>(
  render:RootRenderFunction<HostElement>,
):CreateAppFunction<HostElement>{
  return function createApp(rootComponent,rootProps = null){

    const context = createAppContext()
    const app:App  = (context.app = {
        version,
    })
    console.log(app)
    return app
  }
}
