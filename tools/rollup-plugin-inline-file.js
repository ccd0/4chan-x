import { createFilter } from "@rollup/pluginutils";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function setupFileInliner(packageJson) {
  /** @param {string} string */
  const escape = (string) => string.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\\${');

  /**
   * @param {{
   *  include: import("@rollup/pluginutils").FilterPattern,
   *  exclude?: import("@rollup/pluginutils").FilterPattern,
   *  transformer?: (input: string) => string
   *  wrap?: boolean
   * }} opts
   * @returns {import("rollup").Plugin}
   */
  return function inlineFile(opts) {
    if (!opts.include) {
      throw Error("include option should be specified");
    }

    if (opts.transformer && typeof opts.transformer !== 'function') {
      throw new Error('If transformer is given, it must be a function');
    }

    const wrap = 'wrap' in opts ? opts.wrap : true;

    const filter = createFilter(opts.include, opts.exclude);

    return {
      name: "inlineFile",

      async transform(code, id) {
        if (filter(id)) {
          if (opts.transformer) {
            code = opts.transformer(code);
          }
          if (!wrap) return code;

          code = escape(code);
          code = code.replace(/<%= meta\.(\w+) %>/g, (match, $1) => {
            return escape(packageJson.meta[$1]);
          });
          return `export default \`${code}\`;`;
        }
      }
    };
  };
}
