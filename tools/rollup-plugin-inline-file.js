import { createFilter } from "rollup-pluginutils";

export default function inlineFile(opts = {}) {
  if (!opts.include) {
    throw Error("include option should be specified");
  }

  if (opts.transformer && typeof opts.transformer !== 'function') {
    throw new Error('If transformer is given, it must be a function');
  }

  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: "inlineFile",

    transform(code, id) {
      if (filter(id)) {
        if (opts.transformer) {
          code = opts.transformer(code);
        }
        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: "" }
        };
      }
    }
  };
}