const path = require("path");
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  lintOnSave: false,
  outputDir: "dist",
  // 开发环境显示报错位置 生产环境设置为false减少打包体积
  productionSourceMap: false,
  runtimeCompiler: true, //开启运行时编译
  devServer: {
    port: 88,
    disableHostCheck: true,
    proxy: {
      // 作用前提是所有的请求必须以/api开头 前面什么都不能有
      '/api': {
        // 代理源的地址
        target: 'http://192.168.1.4:10000',
        // 是否切换源
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
    /*overlay: {
      warning: false,
      errors: false
    }*/


  },
  configureWebpack: {
    plugins: [
      new MonacoEditorPlugin({ languages: ['javascript', 'html', 'css', 'json'] })
    ]
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 全局变量路径，不能使用路径别名
        path.resolve(__dirname, "./src/assets/theme.less"),
      ],
    },
  },
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            'text-color': '#111',
            'border-color': '#eee',
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "src/assets/theme.less";`,
          },
        },
      },
    },
  },
}
