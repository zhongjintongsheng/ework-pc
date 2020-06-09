const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  devServer: {
    port: {{ port }},
    proxy: 'http://172.17.121.211:7093'
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/static/{{ projName }}'
    : '/',
  outputDir: '../../package/{{ projName }}',
  indexPath: '../../package/{{ projName }}/index.html',
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: config => {
    Object.assign(config, {
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial'
            },
            elementUI: {
              name: 'chunk-elementUI', // 单独将 elementUI 拆包
              priority: 20,
              test: /[\\/]node_modules[\\/]element-ui[\\/]/
            },
            commons: {
              name: 'chunk-commons',
              test: resolve('src/components'),
              minChunks: 3,
              priority: 5,
              reuseExistingChunk: true
            }
          }
        }
      }
    })
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp(`\\.(${['js', 'css'].join('|')})$`),
        threshold: 10240,
        minRatio: 0.8
      }))
      config.plugins.push(new TerserPlugin({
        terserOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        },
        sourceMap: false,
        parallel: true
      }))
      config.plugins.push(new FileManagerPlugin({
        onStart: [
          {
            delete: [path.join(config.output.path, '..', '{{ projName }}.zip')]
          }
        ],
        onEnd: [
          {
            copy: [
              {
                source: config.output.path,
                destination: path.join(config.output.path, '../temp-{{ projName }}/{{ projName }}')
              }
            ]
          },
          {
            archive: [
              {
                source: path.join(config.output.path, '../temp-{{ projName }}'),
                destination: path.join(config.output.path, '..', '{{ projName }}.zip')
              }
            ]
          },
          {
            delete: [path.join(config.output.path, '../temp-{{ projName }}')]
          }
        ]
      }))
    }
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  }
}
