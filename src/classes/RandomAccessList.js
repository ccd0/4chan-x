/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
export default class RandomAccessList {
  constructor(items) {
    this.length = 0;
    if (items) { for (var item of items) { this.push(item); } }
  }

  push(data) {
    let item;
    let {ID} = data;
    if (!ID) { ID = data.id; }
    if (this[ID]) { return; }
    const {last} = this;
    this[ID] = (item = {
      prev: last,
      next: null,
      data,
      ID
    });
    item.prev = last;
    this.last = last ?
      (last.next = item)
    :
      (this.first = item);
    return this.length++;
  }

  before(root, item) {
    if ((item.next === root) || (item === root)) { return; }

    this.rmi(item);

    const {prev} = root;
    root.prev = item;
    item.next = root;
    item.prev = prev;
    if (prev) {
      return prev.next = item;
    } else {
      return this.first = item;
    }
  }

  after(root, item) {
    if ((item.prev === root) || (item === root)) { return; }

    this.rmi(item);

    const {next} = root;
    root.next = item;
    item.prev = root;
    item.next = next;
    if (next) {
      return next.prev = item;
    } else {
      return this.last = item;
    }
  }

  prepend(item) {
    const {first} = this;
    if ((item === first) || !this[item.ID]) { return; }
    this.rmi(item);
    item.next  = first;
    if (first) {
      first.prev = item;
    } else {
      this.last = item;
    }
    this.first = item;
    return delete item.prev;
  }

  shift() {
    return this.rm(this.first.ID);
  }

  order() {
    let item;
    const order = [(item = this.first)];
    while ((item = item.next)) { order.push(item); }
    return order;
  }

  rm(ID) {
    const item = this[ID];
    if (!item) { return; }
    delete this[ID];
    this.length--;
    this.rmi(item);
    delete item.next;
    return delete item.prev;
  }

  rmi(item) {
    const {prev, next} = item;
    if (prev) {
      prev.next = next;
    } else {
      this.first = next;
    }
    if (next) {
      return next.prev = prev;
    } else {
      return this.last = prev;
    }
  }
}
