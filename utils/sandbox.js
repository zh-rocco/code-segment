var allowedGlobals = ['console', 'Date', 'Math'];

function compileCode(code) {
  code = `with (sandbox) { ${code} }`;
  var func = new Function('sandbox', code); // eslint-disable-line
  return (sandbox) => {
    var proxy = new Proxy(sandbox, {
      has(target, key) {
        if (!allowedGlobals.includes(key)) {
          return true; // 欺骗，告知属性存在
        }
      },
      // get(target, key, receiver) {
      //   console.log('-', target, key, receiver);
      //   // 加固，防止逃逸
      //   if (key === Symbol.unscopables) {
      //     return undefined;
      //   }
      //   Reflect.get(target, key, receiver);
      // },
    });
    return func(proxy);
  };
}

var code = 'console.log(a, b)';

var func = compileCode(code);

var b = 3;

func({ a: 10 }); // 10, undefined
