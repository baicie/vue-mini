import { createRenderer } from './index'
import { JSDOM } from 'jsdom'
const {
  window: { document }
} = new JSDOM(`<!DOCTYPE html><div id="app">Hello world</div>`)
const renderer = createRenderer({
  createElement(tag) {
    return { tag }
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor) {
    parent.children = el
  }
})

const container = {
  type: 'root'
}

const vnode = {
  type: 'div',
  children: 'hello world'
}

renderer.render(vnode, container)
console.log(container)
