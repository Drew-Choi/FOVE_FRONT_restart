/* eslint-disable */

module.exports = {
  resolve: {
    fallback: {
      fs: false,
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new Dotenv(), // 추가한 부분
  ],
};
