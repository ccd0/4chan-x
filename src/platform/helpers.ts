// This file was created because these functions on $ were sometimes not initialized yet because of circular
// dependencies, so try to keep this file without dependencies, so these functions don't have to wait for something else

export const debounce = (wait: number, fn: Function) => {
  let lastCall = 0;
  let timeout = null;
  let that = null;
  let args = null;
  const exec = function () {
    lastCall = Date.now();
    return fn.apply(that, args);
  };
  return function () {
    args = arguments;
    that = this;
    if (lastCall < (Date.now() - wait)) {
      return exec();
    }
    // stop current reset
    clearTimeout(timeout);
    // after wait, let next invocation execute immediately
    return timeout = setTimeout(exec, wait);
  };
};

export const dict = () => Object.create(null);

dict.clone = function (obj) {
  if ((typeof obj !== 'object') || (obj === null)) {
    return obj;
  } else if (obj instanceof Array) {
    const arr = [];
    for (let i = 0, end = obj.length; i < end; i++) {
      arr.push(dict.clone(obj[i]));
    }
    return arr;
  } else {
    const map = Object.create(null);
    for (var key in obj) {
      var val = obj[key];
      map[key] = dict.clone(val);
    }
    return map;
  }
};

dict.json = (str: string) => dict.clone(JSON.parse(str));

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export const platform = window.GM_xmlhttpRequest ? 'userscript' : 'crx';
