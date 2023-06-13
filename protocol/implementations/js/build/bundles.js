import esbuild from 'esbuild';
import browserConfig from './esbuild-browser-config.cjs';

// cjs bundle. external dependencies **not** bundled
esbuild.buildSync({
  platform       : 'node',
  bundle         : true,
  format         : 'cjs',
  packages       : 'external',
  sourcemap      : true,
  entryPoints    : ['./src/main.ts'],
  outfile        : './dist/cjs/main.cjs',
  allowOverwrite : true,
});

// esm bundle. external dependencies **not** bundled
esbuild.buildSync({
  platform       : 'node',
  bundle         : true,
  format         : 'esm',
  packages       : 'external',
  sourcemap      : true,
  entryPoints    : ['./src/main.ts'],
  outfile        : './dist/esm/main.mjs',
  allowOverwrite : true,
});

// esm polyfilled bundle for browser
esbuild.build({
  ...browserConfig,
  outfile: 'dist/browser.mjs',
});

// iife polyfilled bundle for browser
esbuild.build({
  ...browserConfig,
  format     : 'iife',
  globalName : 'tbDEX',
  outfile    : 'dist/browser.js',
});