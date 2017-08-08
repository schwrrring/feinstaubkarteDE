import nodeResolve from "rollup-plugin-node-resolve";
//    uglify = require("rollup-plugin-uglify");

export default {
  entry: "src/index.js",
  format: "iife",
  moduleName: "template",
  dest: "template.js",
  sourceMap: 'inline',
  plugins: [
    nodeResolve({ jsnext: true }),
   // uglify(), Turn back on uglify for production
  ]
};
