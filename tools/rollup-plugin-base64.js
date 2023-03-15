import { readFile } from 'fs/promises';
import { createFilter } from "@rollup/pluginutils";

/**
 * @param {{
 *  include: import("@rollup/pluginutils").FilterPattern,
 *  exclude?: import("@rollup/pluginutils").FilterPattern,
 * }} opts
 * @returns {import("rollup").Plugin}
 */
export default function importBase64(opts) {
  if (!opts.include) {
    throw Error("include option should be specified");
  }
  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: "base64",

    async load(id) {
      if (!filter(id)) return;

      const file = await readFile(id);
      return `export default '${file.toString('base64')}';`;
    }
  };
};
