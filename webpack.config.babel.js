import CleanWebpackPlugin from 'clean-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

let plugins = [
  new CleanWebpackPlugin(['dist']),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(true),
];

if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),
  ]);
}

export default {
  devtool: 'source-map',
  entry: {
    weblinks: path.join(__dirname, 'src', 'index.js'),
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.s?css$/,
      loaders: ['style', 'css', 'postcss', 'sass'],
      exclude: /node_modules/,
    }, {
      test: require.resolve('sweetalert2'),
      loader: 'imports?this=>window',
    }],
  },
  output: {
    path: 'dist',
    filename: '[name].js',
    library: 'weblinks',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: '/resource/weblinkjs/',
    pathinfo: true,
  },
  externals: {
    jquery: 'jQuery',
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules'),
    ],
    extensions: ['', '.js'],
  },
  plugins,
};
