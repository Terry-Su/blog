import path from 'path'

export default function setWebpack( webpackConfig ) {
  webpackConfig.resolve.alias = {
    "@"      : path.resolve( __dirname, "../src" ),
    "@cache" : path.resolve( __dirname, "../.cache" ),
    "@tsblog": path.resolve( __dirname, "../../tsblog/src" ),
    "@locale": path.resolve( __dirname, "../locale" )
  }
  webpackConfig.devtool = "cheap-module-eval-source-map"
  webpackConfig.plugins = [ ...( webpackConfig.plugins || [] ) ]
}
