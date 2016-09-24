import CleanWebpackPlugin from 'clean-webpack-plugin';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

const babelrc = () => {
  const json = JSON.parse(fs.readFileSync('.babelrc'));
  const res = {
    ...json,
    babelrc: false,
    cacheDirectory: true,
  };
  res.presets.forEach((preset) => {
    if (preset[0] === 'es2015') {
      res.presets[1].modules = false;
    }
  });
  return res;
};

let plugins = [
  new CleanWebpackPlugin(['dist']),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  }),
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
      compress: { warnings: false },
      output: { comments: false },
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
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: babelrc(),
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.s?css$/,
      loaders: ['style', 'css', 'postcss', 'sass'],
    }, {
      test: /\.(eot|ttf|woff2?|otf|svg|png|jpg)$/,
      loader: 'file?name=[name].[ext]',
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
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules'),
    ],
    extensions: ['', '.js', '.jsx'],
  },
  plugins,
};
