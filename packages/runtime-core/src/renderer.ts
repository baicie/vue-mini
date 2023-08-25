import { CreateAppFunction, createAppAPI, createAppApi } from "./api-create-app"
import { ComponentInternalInstance } from "./component"
import { flushPostFlushCbs, flushPreFlushCbs } from "./scheduler"
import { VNode } from "./vnode"

export interface Renderer<HostElement = RendererElement> {
  render:RootRenderFunction<HostElement>
  createApp:CreateAppFunction<HostElement>
}

export type RootRenderFunction<HostElement = RendererElement> = (
  vnode:VNode|null,
  container:HostElement,
  // 不做svg？
) => void

export interface RendererNode {
  [key:string]:any
}

export interface RendererElement extends RendererNode {}

type PatchFn = (
  n1:VNode|null,
  n2:VNode,
  container:RendererElement,
  anchor:RendererNode|null,
  parentComponent:ComponentInternalInstance|null,
  parentSuspense: null,
  isSVG:boolean,
  slotScopeIds?:string[]|null,
  optimized?:boolean
) => void

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement
>{
  patchProp():void
}

export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options:RendererOptions<HostNode,HostElement>){
  return baseCreateRenderer<HostNode,HostElement>(options)
}

function baseCreateRenderer<
HostNode = RendererNode,
HostElement = RendererElement
>( options:RendererOptions):Renderer<HostElement>{
  const target = globalThis as any
  
  target.__VUE__ = true

  const {} = options

  const patch:PatchFn = (
    n1,
    n2,
    container,
    anchor = null,
    parentComponent = null,
    parentSuspense = null,
    isSVG = false,
    slotScopeIds = null,
    optimized = false
  ) =>{
    // if(n1 === n2)
  }

  const render:RootRenderFunction = (vnode,container) => {
    if(vnode === null){
      if(container._vnode){
        // unmount(container._vnode,null,null,true)
      }else{
        // 
      }

      // 执行调度队列中所有的pre类型 前置
      flushPreFlushCbs()
      // 执行所有后置cb
      flushPostFlushCbs()

      container._vnode = vnode
    }
  }

  return {
    render,
    createApp:createAppAPI(render) 
  }
}