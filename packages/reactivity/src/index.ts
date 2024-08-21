const bucket = new Set<Function>()
const data: Record<string | symbol, any> = { text: 'hello' }

const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    bucket.forEach(fn => fn())
    return true
  }
})

function effect() {
  console.log('effect')
}

effect()

setTimeout(() => {
  obj.text = 'world'
}, 1000)
