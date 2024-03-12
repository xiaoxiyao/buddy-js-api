import typescript from '@rollup/plugin-typescript'
import type { Plugin, RollupOptions } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import { rimraf } from 'rimraf'

export default [
  {
    input: './src/index.ts',
    output: [
      {
        format: 'cjs',
        sourcemap: true,
        file: 'dist/bundle.cjs',
      },
      {
        format: 'es',
        sourcemap: true,
        file: 'dist/bundle.js',
      },
    ],
    plugins: [
      cleanBefore(),
      typescript({
        declaration: true,
        rootDir: 'src',
        declarationDir: 'dist/types',
      }),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [
      {
        file: 'dist/index.d.cts',
        format: 'cjs',
      },
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [
      dts(),
      cleanEnd(),
    ],
  },
] satisfies Array<RollupOptions>

function cleanBefore(): Plugin {
  return {
    name: 'cleanBefore',
    buildStart: async () => {
      await rimraf('dist')
    },
  }
}

function cleanEnd(): Plugin {
  return {
    name: 'cleanEnd',
    writeBundle: async () => {
      await rimraf('dist/types')
    },
  }
}
