import {Renderer, RootRenderFunction, createRenderer} from '@vuemini/runtime-core';
import {extend} from '@vuemini/shared';
import { patchProp } from './patch-prop';
import { nodeOps } from './node-ops';

let renderer:Renderer<Element| ShadowRoot>
const rendererOptions = extend({ patchProp }, nodeOps)

function ensureRenderer(){
  return renderer || (
    renderer = createRenderer<Node, Element | ShadowRoot>(rendererOptions)
  )
}


export const createApp = ((...args) => {
  const app = ensureRenderer().render(...args)
  console.log(app)
  return app
}) as RootRenderFunction<Element | ShadowRoot>



export * from '@vuemini/runtime-core'