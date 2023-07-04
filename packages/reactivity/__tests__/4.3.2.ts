// es6 引入的数据结构 主要区别在于key为引用类型
const bucket = new WeakMap()

let activeEffect
const data = {}

const obj = new Proxy(data, {
  get(target, key) {
    if (!activeEffect)
      return target[key]

    // 根据target从桶中获取depsMap 是Map类型 key->effects
    let depsMap = bucket.get(target)

    if (!depsMap)
      bucket.set(target, (depsMap = new Map()))

    // 根据key获取与当前字段相关联的effects函数 为Set类型
    let deps = depsMap.get(key)

    if (!deps)
      depsMap.set(key, (deps = new Set()))
    // 添加到桶中
    deps.add(activeEffect)
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    const depsMap = bucket.get(target)

    if (!depsMap)
      return
    const effects = depsMap.get(key)

    effects && effects.forEach(fn => fn())
  },
})
