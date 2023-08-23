import { CreateAppFunction } from "./api-create-app"
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

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement
>{

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

}