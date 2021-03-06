import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import { terser } from 'rollup-plugin-terser'
// import { sizeSnapshot } from 'rollup-plugin-size-snapshot'

const globals = {
	react: 'React',
	// 'react-router-dom': 'ReactRouterDOM',
	'prop-types': 'PropTypes',
	'@material-ui/core': 'window["material-ui"]'
}

const externals = [
	...Object.keys(globals),
	id => /@material-ui/.test(id)
]

const basePlugins = [
	// List external libraries that should not be bundled
	external(),
	postcss({
		modules: true
	}),
	url(),
	svgr(),
	babel({
		exclude: 'node_modules/**',
		plugins: ['external-helpers']
	}),

	// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
	commonjs({
		namedExports: {
			// left-hand side can be an absolute path, a path
			// relative to the current directory, or the name
			// of a module in node_modules
			'node_modules/@material-ui/core/styles/index.js': [ 'withStyles' ]
		}
	}),

	// Allow node_modules resolution, so you can use 'external' to control
	// which external modules to include in the bundle
	// https://github.com/rollup/rollup-plugin-node-resolve#usage
	resolve()

	// Output a file listing bundle sizes for easy review
	// sizeSnapshot(),

	// Enable minification
	// terser()
]


export default [
	{
		input: 'src/index.js',
		output: {
			file: `cjs/index.js`,
			format: 'cjs',
			exports: 'named'
		},
		plugins: basePlugins
	},

	{
		input: 'src/index.js',
		output: {
			file: `esm/index.js`,
			format: 'esm',
			exports: 'named',
			esModule: true
		},
		plugins: basePlugins
		// plugins: [sizeSnapshot()].concat(basePlugins)
	},

	{
		input: 'src/index.js',
		output: {
			file: `umd/form-manager.js`,
			format: 'umd',
			name: 'RepoName',
			globals,
			external: externals,
			exports: 'named',
			esModule: false,
			sourcemap: true
		},
		plugins: basePlugins
	},

	{
		input: 'src/index.js',
		output: {
			file: `umd/form-manager.min.js`,
			format: 'umd',
			name: 'RepoName',
			globals,
			external: externals,
			exports: 'named',
			esModule: false,
			sourcemap: true
		},
		plugins: [terser()].concat(basePlugins)
		// plugins: [terser(), sizeSnapshot()].concat(basePlugins)
	}
]
