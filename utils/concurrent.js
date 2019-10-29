/**
 * @params asyncFuncs {Array} - 要迭代的函数数组
 * @params limit {Number} - 并发数量控制数
 * @return {Promise} - 返回一个 Promise 值来确认所有数据是否迭代完成
 */
var concurrent = (asyncFuncs, limit) => {
  let active = 0
  const res = []

  return new Promise((resolve) => {
    const _funcs = asyncFuncs.map((func) => {
      return async function (cb) {
        console.log('当前并发:', active + 1)
        active++
        const r = await func()
        active--
        res.push(r)
        console.log('end func:', r)
        cb()

        if (res.length === asyncFuncs.length) {
          resolve(res)
        }
      }
    })

    const recursion = (funcs) => {
      if (funcs.length && active < limit) {
        funcs.shift()(() => {
          console.log('---')
          recursion(funcs)
        })
        recursion(funcs)
      }
    }

    recursion(_funcs)
  })
}

var sleep = (duration) => new Promise((resolve) => void setTimeout(resolve, duration))

const funcs = Array.from({ length: 20 }, (curr, idx) => async () => {
  console.log('start func: ', idx)
  await sleep(300)
  return idx
})

concurrent(funcs, 4).then((data) => {
  console.log('finished', data)
})
