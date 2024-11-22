import { createFilter } from "@rollup/pluginutils";
import MagicString from 'magic-string';

/**
 * Remove test code comments from the output build.
 *
 * @param {Object} opts
 * @param {import("@rollup/pluginutils").FilterPattern} opts.include
 * @param {import("@rollup/pluginutils").FilterPattern} [opts.exclude]
 * @param {boolean} opts.sourceMap
 * @returns {import("rollup").Plugin}
 */
export default function removeTestCode(opts) {
  if (!opts.include) {
    throw Error("include option should be specified");
  }

  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: "removeTestCode",

    async transform(code, id) {
      if (!filter(id)) return;

      const ms = new MagicString(code);

      let index = 0;
      while (index >= 0) {
        const startIndex = code.indexOf('// #region tests_enabled', index);
        if (startIndex < 0) break;

        index = code.indexOf('// #endregion', startIndex) + 13
        ms.remove(startIndex, index);
      }

      return { code: ms.toString(), map: opts.sourceMap ? ms.generateMap() : { mappings: '' } };
    }
  };
};