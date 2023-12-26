import $ from "../platform/$";

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
export default class SimpleDict<T> {
  keys: string[]

  constructor() {
    this.keys = [];
  }

  push(key, data: T) {
    key = `${key}`;
    if (!this[key]) { this.keys.push(key); }
    return this[key] = data;
  }

  rm(key) {
    let i;
    key = `${key}`;
    if ((i = this.keys.indexOf(key)) !== -1) {
      this.keys.splice(i, 1);
      return delete this[key];
    }
  }

  forEach(fn) { 
    for (var key of [...Array.from(this.keys)]) { fn(this[key]); }
  }

  get(key): T {
    if (key === 'keys') {
      return undefined;
    } else {
      return $.getOwn(this, key);
    }
  }
}
