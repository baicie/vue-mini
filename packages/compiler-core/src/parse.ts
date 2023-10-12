import { parse as swcParse, transform as swcTransform } from '@swc/core'

export function parse(content: string) {
  return swcParse(content, {
    target: 'es2018',
    syntax: 'typescript',
    tsx: true
  })
}

export function transform(content: string) {
  return swcTransform(content, {
    sourceMaps: true,
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true
      }
    }
  })
}
