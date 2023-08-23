import {Renderer} from '@vuemini/runtime-core';
let renderer:Renderer<Element| ShadowRoot>

function ensureRenderer(){
  return renderer || (
    renderer = createRenderer()
  )
}


export const createApp = ((...args) => {
  const app = ensureRenderer()
})



export * from '@vuemini/runtime-core'