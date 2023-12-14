interface Options {
  createElement: (tag: string) => any
  setElementText: (el: Element, text: string) => void
  insert: (child: Element, parent: Element, anchor?: Element | null) => void
}

export function createRenderer(options: Options) {
  const { createElement, setElementText, insert } = options

  function render(vnode, container) {
    if (vnode) {
      // 新node存在 将其与旧的vnode传递给patch函数
      patch(container._vnode, vnode, container)
    } else {
      if (container._vnode) {
        // 新node不存在 旧node存在 将其从DOM中移除
        // unmount(container._vnode)
        container.innerHTML = ''
      }
    }

    container._vnode = vnode
  }

  function shouldSetAsProps(el, key, value) {
    if()
  }

  function mountElement(vnode, container) {
    const el = createElement(vnode.type)
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }

    if (vnode.props) {
      for (const key of Object.keys(vnode.props)) {
        // el[key] = vnode.props[key]
        if (key in el) {
          const type = typeof el[key]
          const value = vnode.props[key]

          if (type === 'boolean' && value === '') {
            el[key] = true
          } else {
            el[key] = value
          }
        } else {
          el.setAttribute(key, vnode.props[key])
        }
      }
    }

    insert(el, container)
  }

  function patch(n1, n2, container) {
    if (!n1) {
      mountElement(n2, container)
    } else {
      //
    }
  }

  return {
    render
  }
}
