const presets = [
  '@babel/env'
]

const plugins = [
  '@babel/plugin-transform-runtime'
]

const ignore = [
  '**/*.test.js'
]

module.exports = {
  presets,
  plugins,
  ignore: process.env.NODE_ENV === 'test' ? undefined : ignore
}
