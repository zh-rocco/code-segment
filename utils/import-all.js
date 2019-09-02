import { isFunction } from 'lodash';

/**
 * 导入一个模块上下文
 *
 * @export
 * @param {*} context 模块上下文，require.context 的返回值
 * @param {object} [options={}]
 * @returns
 */
export default function importAll(context, options = {}) {
  const { useDefault = true, keyTransformFunc, filterFunc } = options;
  let keys = context.keys();

  if (isFunction(filterFunc)) {
    keys = keys.filter(filterFunc);
  }

  return keys.reduce((acc, curr) => {
    const key = isFunction(curr) ? keyTransformFunc(curr) : curr;
    acc[key] = useDefault ? context(curr).default : context(curr);
    return acc;
  }, {});
}
