module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  publicPath: '/acudiente>/',
  outputDir: 'acudiente>',
  configureWebpack: {
    resolve: {
       symlinks: false
    }
  },
  transpileDependencies: [
    '@coreui/utils',
    '@coreui/vue'
  ]
}
