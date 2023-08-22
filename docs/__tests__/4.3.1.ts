let activeEffect

// 注册副作用函数
function effect(fn) {
  activeEffect = fn
  fn()
}

const bucket = new Set()

const data = { text: 'hello world' }

const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect)
      bucket.add(activeEffect)

    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    bucket.forEach(fn => fn())
    return true
  },
})

effect(() => {
  // 匿名副作用函数
  console.log('effect run', obj.text)
})

setTimeout(() => {
  // 属性并不存在但是副作用函数执行
  obj.notExist = 'notExist'
}, 1000)
