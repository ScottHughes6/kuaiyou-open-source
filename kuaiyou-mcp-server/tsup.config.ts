import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/reactive-skill-schema.ts', 'src/device.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  outDir: 'build',
  banner: {
    js: '#!/usr/bin/env node',
  },
});
