import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'node16',
  platform: 'node',
  format: ['cjs'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: false,
  dts: true,
})