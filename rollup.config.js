import nodeResolve from "rollup-plugin-node-resolve";
//    uglify = require("rollup-plugin-uglify");
//import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
export default {
  entry: "src/index.js",
  format: "iife",
  moduleName: "template",
  dest: "template.js",
  sourceMap: 'inline',
  plugins: [
    nodeResolve({ jsnext: true }),
		eslint({
      exclude: [
        'src/styles/**',
      ]
    }),

		/*activate if babel should be used			
		*babel({
		*	exclude: 'node_modules/**'
		*})
   */
		// uglify(), Turn back on uglify for production
  ]
};
