import { ComponentInternalInstance } from "./component"

// 调度器要搞明白作用
export interface SchedulerJob extends Function{
  id?:number
  pre?:boolean
  active?:boolean
  computed?:boolean
  allowRecurse?:boolean
  ownerInstance?:ComponentInternalInstance  
}


type CountMap = Map<SchedulerJob,number>

const queue: SchedulerJob[] = []
let flushIndex = 0

// 等待执行的后置cb
const pendingPostFlushCbs: SchedulerJob[] = []
// 正在执行的后置cb
let activePostFlushCbs: SchedulerJob[] | null = null
let postFlushIndex = 0

export function flushPreFlushCbs(
  seen?:CountMap,
  i = 0
){
  for(;i<queue.length;i++){
    // 从队列中取出一个cb
    const cb = queue[i]
    if(cb && cb.pre){
      // 将队列头部的cb从队列移除
      queue.splice(i,1)
      // 然后下标-1 （之后下标+1指到队头）
      i--
      // 执行cb
      cb()
    }
  }
}

export function flushPostFlushCbs(
  seen?:CountMap
){
  
}