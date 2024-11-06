const path = require('path');
const { build } = require('esbuild');
const esbuildPluginTsc = require('esbuild-plugin-tsc');
const { existsSync, rmSync } = require('fs');

const distPath = path.resolve(__dirname, 'dist');
if (existsSync(distPath)) {
  rmSync(distPath, {
    recursive: true,
  });
}

build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: false,
  platform: 'node',
  outdir: 'dist',
  external: ['pg-native'],
  alias: {
    core: path.resolve(__dirname, 'src', 'core'),
    database: path.resolve(__dirname, 'src', 'database'),
    middlewares: path.resolve(__dirname, 'src', 'middlewares'),
    modules: path.resolve(__dirname, 'src', 'modules'),
    utils: path.resolve(__dirname, 'src', 'utils'),
  },
  plugins: [esbuildPluginTsc()],
  resolveExtensions: ['.ts', '.js'],
})
  .then((result) => {
    console.log('build ok', result);
  })
  .catch((error) => {
    console.log('Build error', JSON.stringify(error, null, 2));
  });
