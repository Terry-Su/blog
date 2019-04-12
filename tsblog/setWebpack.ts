import path from 'path'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import { __DEV__ } from '../scripts/global'

export default function setWebpack( webpackConfig ) {
  webpackConfig.module.rules = [
    ...webpackConfig.module.rules,
    {
      test: /\.css$/,
      use : [ "style-loader", "css-loader" ]
    }
    // {
    //   test: /\.txt$/i,
    //   use : "raw-loader"
    // }
  ]
  webpackConfig.resolve.alias = {
    "@"        : path.resolve( __dirname, "../src" ),
    "@cache"   : path.resolve( __dirname, "../.cache" ),
    "@tsblog"  : path.resolve( __dirname, "../../tsblog/src" ),
    "@locale"  : path.resolve( __dirname, "../locale" ),
    "@examples": path.resolve( __dirname, "../examples" )
  }
  webpackConfig.devtool = "cheap-module-eval-source-map"
  webpackConfig.plugins = [
    ...( webpackConfig.plugins || [] ),
    ...( !__DEV__ ? [ new BundleAnalyzerPlugin() ] : [] )
  ]

  // # webpack dev server
  if ( !webpackConfig.devServer ) {
    webpackConfig.devServer = {}
  }
  // ## Add static directories
  webpackConfig.devServer.contentBase = [
    ...( webpackConfig.devServer.contentBase || [] )
  ]
}
