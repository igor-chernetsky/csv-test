module.exports = {
  entry: ['babel-polyfill', './src/Application.jsx'],
  output: {
    path: './public',
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react', 'stage-0']
        },
        exclude: /node_modules/
      }
    ]
  }
};
