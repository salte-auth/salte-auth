module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        esmodules: true
      },
      exclude: [
        '@babel/plugin-transform-async-to-generator',
        '@babel/plugin-transform-regenerator'
      ]
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
}