let activeEffect

function  effect(fn) {
    const effectFn = ()=>{
      console.log('1')
      cleanup(effectFn)
      // 函数effectFn执行时会将其设置为activeEffect
      activeEffect = effectFn
      // 闭包保存传入时的fn
      fn()
    }
    console.log('2')
    // activeEffect.deps用来存储所有与该副作用函数相关联的依赖集合
    activeEffect.deps = []

    effectFn()
}

function track(target, key) {
  if (!activeEffect)
    return target[key]

  // 根据target从桶中获取depsMap 是Map类型 key->effects
  let depsMap = bucket.get(target)

  if (!depsMap)
    bucket.set(target, (depsMap = new Map()))

  // 根据key获取与当前字段相关联的effects函数 为Set类型
  let deps = depsMap.get(key) // key-> effects

  if (!deps)
    depsMap.set(key, (deps = new Set()))
  // 添加到桶中
  deps.add(activeEffect)
  // deps是一个与当前副作用函数存在联系的依赖集合
  activeEffect.deps.push(deps)
}

// 在每次副作用函数执行时 根据deps获取说有相关联的依赖结合，进而将副作用函数从依赖集合中移除
function cleanup(effectFn){
  for(const deps of effectFn.deps){
    // deps key -> effects Set()从依赖集合中删除该副作用函数
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0;
}

function trigger(target, key) {
  const depsMap = bucket.get(target)

  if (!depsMap)
    return
  const effects = depsMap.get(key)

  const effectsToRun  = new Set(effects)
  effectsToRun.forEach(effectsFn => effectsFn())
  // effects && effects.forEach(fn => fn())
}

const data = {}

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    trigger(target, key)
  },
})

effect(()=>{
  console.log('hello world')
})