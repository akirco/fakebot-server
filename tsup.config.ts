import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'es2022',
  platform: 'node',
  format: ['cjs'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: true,
  dts: true,
  treeshake: false,
  silent: true,
})
