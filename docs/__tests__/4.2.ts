const bucket = new Set()

const data = { text: 'hello world' }

function effect() {
  console.log('effect', obj.text)
}

const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect)
    console.log(bucket)
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    bucket.forEach(fn => fn())
    return true
  },
})

effect()

setTimeout(() => {
  obj.text = 'hello world2'
}, 1000)
