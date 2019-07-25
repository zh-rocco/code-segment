import data from 'china-area-data/data';

const code2text = {};

const text2code = {};

export function convertAreaData(code = '86', deepth = Infinity) {
  function recursive(obj, deep = 1) {
    if (deep > deepth) return obj;

    const { code, name } = obj;
    const childrenMap = data[code];
    
    code2text[code] = name;
    text2code[name] = code;

    if (!childrenMap) return obj;

    deep++;

    const children = Object.entries(childrenMap).map(([_code, _name]) => {
      return recursive({ code: _code, name: _name }, deep);
    });

    if (children.length) {
      obj.children = children;
    }

    return obj;
  }

  return recursive({ code, name });
}

export const provinceData = convertAreaData('86', 1).children;

export const cityData = convertAreaData('86', 2).children;

export const regionData = convertAreaData().children;

export { code2text, text2code };
