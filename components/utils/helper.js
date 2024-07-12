/**
 * Created by wyz.
 */
import _ from 'lodash'
const ASC = 'ASC'

export const getLocalStorage = (name) => {
  try {
    return localStorage.getItem(name) && JSON.parse(localStorage.getItem(name))
  } catch (e) {
    console.log('catch localStorage setItem[%s]', name);
  }
  return null
};

export const setLocalStorage = (name, data) => {
  try {
    localStorage.setItem(name, JSON.stringify(data))
  } catch (e) {
    console.log('localStorage setItem[%s] has Error: %o', name, e);
  }
};

export const isEmptyObject = o => {
  for (let t in o) { return !1 } return !0
};


export function toQueryString(obj = {}) {
  let str = "";
  for (let key in obj) {
    if (str) {
      str += "&";
    }
    str += key + "=" + encodeURIComponent(obj[key]);
  }
  return str
}

export function removeNullValues(obj = {}) {
  return _.pickBy(obj)
}

export function removeUndefined(obj = {}) {
  for (let k in obj) {
    if (_.isUndefined(obj[k]))
      delete obj[k]
  }
  return obj
}
export function removeEmptyString(obj = {}) {
  for (let k in obj) {
    if (obj[k] === '')
      delete obj[k]
  }
  return obj
}


export function generateId() {
  return Math.random().toString(16).slice(2)
}

/* start sort by wyz */
const sortEmpty = (a, b) => {
  if (!a) return - 1;
  if (!b) return 1;
};
// todo deprecated
export const sorterNum = (key, sort) => (a, b) => sort === ASC ? a[key] - b[key] : b[key] - a[key];

// 数字排序
export const sorterByNumber = (key, sort) => (a, b) => {
  let em = sortEmpty(a[key], b[key]);
  if (em) return em;
  return sort === ASC ? a[key] - b[key] : b[key] - a[key]
};
// etc 2020-03-30 日期排序
export const sorterUnderline = (key) => (a, b) => {
  let em = sortEmpty(a[key], b[key]);
  if (em) return em;
  return a[key].replace(/-/g, '') * 1 - b[key].replace(/-/g, '') * 1;
};
export const sorterDate = (key, sort) => (a, b) => {
  let em = sortEmpty(a[key], b[key]);
  if (em) return em;
  const v = o => o[key] || '';
  return sort === 'ASC' ? v(a).replace(/-/g, '') * 1 - v(b).replace(/-/g, '') * 1 : v(b).replace(/-/g, '') * 1 - v(a).replace(/-/g, '') * 1;
}
// localeCompare
export const sortByLetter = (key, sort) => (a, b) => {
  let em = sortEmpty(a[key], b[key]);
  if (em) return em;
  if (sort === ASC) return a[key].localeCompare(b[key])
  return b[key].localeCompare(a[key])
};

// USD JPY 首字母排序
const sortByCharCode = (a, b) => a.charCodeAt(0) - b.charCodeAt(0);
export const sortByInitial = key => (a, b) => {
  if (!a || !b) return;
  return sortByCharCode(_.get(a, key, ''), _.get(b, key, ''))
};
export const sortByArrayInitial = key => (a, b) => {
  if (!a || !b) return;
  const getA = a[key]?.join('')
  const getB = b[key]?.join('')
  return sortCode(getA, getB)
};
export function sortByName(name) {
  return function (a, b) {
    return sortCode(a[name], b[name])
  }
}
export function sortByNameWithObject(obj, key) {
  return function (a, b) {
    return sortCode(a[obj][key], b[obj][key])
  }
}

function sortCode(a, b) {
  if (typeof a === 'boolean') return 0;
  let em = sortEmpty(a, b);
  if (em) return em;
  let nameA = a.toUpperCase(); // ignore upper and lowercase
  let nameB = b.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}
/* end sort by wyz */

//** doms /
export function getScrollbarWidth() {
  // 创建一个 div 元素并设置样式
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.msOverflowStyle = 'scrollbar'; // 使 IE 浏览器显示滚动条
  document.body.appendChild(outer);

  // 计算滚动条宽度
  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);
  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  // 返回滚动条宽度
  return widthNoScroll - widthWithScroll;
}

export function moveParamToLast(paramName, paramsArray) {
  const index = paramsArray.indexOf(paramName);
  if (index !== -1) {
    paramsArray.splice(index, 1);
    paramsArray.push(paramName);
  }
  return paramsArray;
}

