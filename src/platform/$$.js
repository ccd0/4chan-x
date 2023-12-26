import { d } from "../globals/globals";

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const $$ = (selector, root = d.body) => [...Array.from(root.querySelectorAll(selector))];
export default $$;
