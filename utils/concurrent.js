/**
 * @params asyncFuncs {Array} - 要迭代的数组
 * @params limit {Number} - 并发数量控制数
 * @return {Promise} - 返回一个 Promise 值来确认所有数据是否迭代完成
 */
var concurrent = (asyncFuncs, limit) => {
  let active = 0
  let successCount = 0
  const res = []

  return new Promise((resolve) => {
    const _funcs = asyncFuncs.map((func, idx) => async function (cb) {
      active++
      const r = await func()
      res[idx] = r
      successCount++
      active--
      cb()
      if (asyncFuncs.length === successCount) {
        resolve(res)
      }
    })

    const queue = (funcs) => {
      if (funcs.length && active < limit) {
        funcs.shift()(() => void queue(funcs))
        queue(funcs)
      }
    }

    queue(_funcs)
  })
}

var sleep = (duration) => new Promise((resolve) => void setTimeout(resolve, duration))

const funcs = Array.from({ length: 20 }, (curr, idx) => async () => {
  console.log('start func: ', idx)
  await sleep(Math.random() * 5000)
  return idx
})

concurrent(funcs, 4).then((data) => {
  console.log('finished', data)
})
