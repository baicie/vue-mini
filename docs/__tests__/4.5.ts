let activeEffect

const effectStack = []

function effect(fn){
  const effectFn = () =>{
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()

    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }

  effectFn.deps = []

  effectFn()
}


function cleanup(effectFn){
  for(const deps of effectFn.deps){
    // deps key -> effects Set()从依赖集合中删除该副作用函数
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0;
}