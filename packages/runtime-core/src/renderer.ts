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
  // 旧节点
  n1:VNode|null,
  // 新节点
  n2:VNode,
  container:RendererElement,
  anchor:RendererNode|null,
  parentComponent:ComponentInternalInstance|null,
  parentSuspense: null,
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
  console.log('createRenderer')
  return baseCreateRenderer<HostNode,HostElement>(options)
}

function baseCreateRenderer<
HostNode = RendererNode,
HostElement = RendererElement
// 奇怪的问题 HostElement = RendererElement应该是一样的
>( options:RendererOptions<HostNode, HostElement>):Renderer<RendererElement>{
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
    slotScopeIds = null,
    optimized = false
  ) =>{
    // 引用相同
    if(n1 === n2){
      return
    }
  }

  const render:RootRenderFunction = (vnode,container) => {
    if(vnode === null){
      if(container._vnode){
        // 以前有值  现在没有值卸载
        // unmount(container._vnode,null,null,true)
      }
    }else{
      // 计算虚拟dom
      patch(container._vnode||null,vnode,container,null,null,null)
    }

    // 执行调度队列中所有的pre类型 前置
    flushPreFlushCbs()
    // 执行所有后置cb
    flushPostFlushCbs()

    container._vnode = vnode
  }

  return {
    render,
    createApp:createAppAPI(render) 
  }
}