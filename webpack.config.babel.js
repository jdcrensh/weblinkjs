import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import yargs from 'yargs';

import CleanWebpackPlugin from 'clean-webpack-plugin';

const argv = yargs
  .usage('npm run build -- [args]')
  .option('minify', {
    type: 'boolean',
    default: true
  })
  .argv;

const plugins = [
  new CleanWebpackPlugin(['dist'])
];
if (argv.minify) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      },
      comments: false
    })
  );
};

export default {
  devtool: 'source-map',
  entry: {
    weblinks: ['index.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.s?css$/,
      loaders: ['style', 'css', 'postcss', 'sass'],
      exclude: /node_modules/
    }, {
      test: require.resolve('sweetalert2'),
      loader: 'legacy'
    }]
  },
  output: {
    path: 'dist',
    filename: 'weblinks.js',
    library: 'weblinks',
    libraryTarget: 'this',
    publicPath: '/resource/weblinkjs/'
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src']
  },
  plugins
};
