import { rollup } from "rollup";
import inlineFile from "./rollup-plugin-inline-file";

rollup({
  entry: "main.js",
  plugins: [
    inlineFile({
      include: ["**/*.html", "**/*.css"],
    }),
    inlineFile({
      include: ["**/*.png", "**/*.gif"],
      // base64 encode
      transformer: btoa
    })
  ]
});