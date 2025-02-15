export function deepFreeze(obj) {
  // 取回定义在obj上的属性名
  var propNames = Object.getOwnPropertyNames(obj);

  // 在冻结自身之前冻结属性
  propNames.forEach(function(name) {
    const prop = obj[name];

    // 如果prop是个对象，冻结它
    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });

  // 冻结自身(no-op if already frozen)
  return Object.freeze(obj);
}
