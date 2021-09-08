// rollup.config.js
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'index.js',
  output: {
    file: 'index.umd.js',
    format: 'umd',
    name: 'CapsuleLint'
  },
  plugins: [
    commonjs(),
    json(),
    resolve()
  ]
};