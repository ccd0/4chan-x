import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import setupFileInliner from './rollup-plugin-inline-file.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import generateMetadata from '../src/meta/metadata.js';
import { copyFile, readFile, writeFile } from 'fs/promises';
import importBase64 from './rollup-plugin-base64.js';
import generateManifestJson from '../src/meta/manifestJson.js';
import removeTestCode from './rollup-plugin-remove-test-code.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const buildDir = resolve(__dirname, '../builds/test/');

let channel = '';

if (process.argv.includes('-beta')) {
  channel = '-beta';
} else if (process.argv.includes('-noupdate')) {
  channel = '-noupdate';
}
const buildForTest = process.argv.includes('-test');

(async () => {
  const packageJson = JSON.parse(await readFile(resolve(__dirname, '../package.json'), 'utf-8'));

  const metadata = await generateMetadata(packageJson, channel);

  const license = await readFile(resolve(__dirname, '../LICENSE'), 'utf8');

  const version = JSON.parse(await readFile(resolve(__dirname, '../version.json'), 'utf-8'));


  const inlineFile = await setupFileInliner(packageJson);

  const bundle = await rollup({
    input: resolve(__dirname, '../src/main/Main.js'),
    plugins: [
      buildForTest ? undefined : removeTestCode({
        include: [
          // Only files that actually have test code.
          "**/src/main/Main.js",
          "**/src/classes/Post.js",
          "**/src/Linkification/Linkify.js",
        ],
        sourceMap: false,
      }),
      typescript(),
      inlineFile({
        include: ["**/*.html", "**/*.css"],
      }),
      importBase64({ include: ["**/*.png", "**/*.gif", "**/*.wav", "**/*.woff", "**/*.woff2"] }),
      inlineFile({
        include: "**/package.json",
        wrap: false,
        transformer(input) {
          const data = JSON.parse(input);
          return `export default ${JSON.stringify(data.meta, undefined, 1)};`;
        }
      }),
      inlineFile({
        include: "**/*.json",
        exclude: "**/package.json",
        wrap: false,
        transformer(input) {
          return `export default ${input};`;
        }
      })
    ]
  });

  /** @type {import('rollup').OutputOptions} */
  const sharedBundleOpts = {
    format: "iife",
    generatedCode: {
      // needed for possible circular dependencies
      constBindings: false,
    },
    // Can't be none as long as the root file defined exports
    // exports: 'none',
  };

  // user script
  await bundle.write({
    ...sharedBundleOpts,
    banner: metadata + license,
    // file: '../builds/test/rollupOutput.js',
    file: resolve(buildDir, `${packageJson.meta.path}${channel}.user.js`),
  });

  // chrome extension
  const crxDir = resolve(buildDir, 'crx');
  await bundle.write({
    ...sharedBundleOpts,
    banner: license,
    file: resolve(crxDir, 'script.js'),
  });

  await copyFile(resolve(__dirname, '../src/meta/eventPage.js'), resolve(crxDir, 'eventPage.js'));

  writeFile(resolve(crxDir, 'manifest.json'), generateManifestJson(packageJson, version, channel));

  for (const file of ['icon16.png', 'icon48.png', 'icon128.png']) {
    await copyFile(resolve(__dirname, '../src/meta/', file), resolve(crxDir, file));
  };
})();
