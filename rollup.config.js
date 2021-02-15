import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import cleaner from 'rollup-plugin-cleaner'
import copy from 'rollup-plugin-copy'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import packageJson from './package.json'

const production = !process.env.ROLLUP_WATCH
const sourcemap = !production

export default {
	input: './src/index.ts',
	output: [
		{
			file: packageJson.main,
			format: 'cjs',
			sourcemap,
		},
		{
			file: packageJson.module,
			format: 'esm',
			sourcemap,
		},
	],
	external: ['react'],
	plugins: [
		cleaner({
			targets: ['./dist/'],
		}),
		peerDepsExternal(),
		resolve(),
		commonjs(),
		typescript(),
		copy({
			targets: [{ src: './src/style.css', dest: './dist' }],
		}),
	],
}
