import fs from 'node:fs'
import { parse, transform } from '../src/parse'
import { log } from 'node:console'

const content = fs.readFileSync('./test.tsx', 'utf-8')

// parse(content).then(res => {
//   console.log('content', res)
// })

transform(content).then(res => {
  console.log(res.code)
})
