import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/reactive-skill-schema.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  outDir: 'build',
});
