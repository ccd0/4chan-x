/*
 * This file has the code for the jsx to { innerHTML: "safe string" }
 *
 * Usage: import h from this file.
 * Attributes are stringified raw, so the names must be like html text: eg class and not className.
 * Boolean values are stringified as followed: true will mean the attribute is there, false means it will be omitted.
 * Strings bound to attributes and children will be escaped automatically.
 * It returns interface EscapedHtml { innerHTML: "safe string", [isEscaped]: true }
 *
 * For strings that don't have a parent element you can use fragments: <></>.
 * Note that you need to import hFragment, which for some reason isn't auto imported on "add all missing imports"
 */

import { E } from "./globals";

/**
 * The symbol indicating that a string is safely escaped.
 * This is a symbol so it can't be faked by a json blob from the internet.
 */
export const isEscaped = Symbol('isEscaped');

export interface EscapedHtml {
  innerHTML: string,
  [isEscaped]: true,
}

const voidElements = new Set(
  ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',]
);

export const hFragment = Symbol('hFragment');

/** Function that jsx/tsx will be compiled to. */
export default function h(
  tag: string | typeof hFragment,
  attributes: Record<string, unknown> | null,
  ...children: unknown[]
): EscapedHtml {
  let innerHTML = tag === hFragment ? '' : `<${tag}`;

  if (attributes) {
    for (const [attribute, value] of Object.entries(attributes)) {
      if (!value && value !== 0) continue;
      innerHTML += ` ${attribute}`;
      if (value === true) continue;
      innerHTML += `="${E(value.toString())}"`;
    }
  }
  if (tag !== hFragment) innerHTML += '>';

  const isVoid = tag !== hFragment && voidElements.has(tag);
  if (isVoid) {
    if (children.length) throw new TypeError(`${tag} is a void html element and can't have child elements`);
  } else {
    for (const child of children) {
      if (child === null || child === undefined || child === '') continue;

      if (child instanceof Object && "innerHTML" in child && child[isEscaped]) {
        innerHTML += child.innerHTML;
        continue;
      }

      innerHTML += E(child.toString());
    }
  }

  if (!isVoid && tag !== hFragment) innerHTML += `</${tag}>`;

  return { innerHTML, [isEscaped]: true };
}
