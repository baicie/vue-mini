import { ReactiveFlags } from '@vuemini/reactivity'
import { Component } from './component'

export const Text = Symbol.for('v-txt')
export const Comment = Symbol.for('v-cmt')
export const Static = Symbol.for('v-stc')

export type VNodeTypes =
  | string
  | VNode
  | Component
  | typeof Text
  | typeof Comment
  // | typeof Fragment
  | typeof Static

export type VNodeProps = {}

export type VNodeNormalizedRef = {}

export interface VNode {
  __v_isVNode: true
  [ReactiveFlags.SKIP]: true
  type: VNodeTypes

  props: VNodeProps | null
  key: string | number | null | symbol
  ref: VNodeNormalizedRef | null

  patchFlag: number
}

export function isSameVNodeType(n1: VNode, n2: VNode) {
  // return n1.type === n2.type && n1.key === n2.key
  return n1.type === n2.type
}
