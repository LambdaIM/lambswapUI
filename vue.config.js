let historylambswap = 'history.lambswap.fi' ;
if(process.env.NODE_ENV == 'production'){
  historylambswap = 'history.lambswap.fi' ;
  // historylambswap = '59.110.68.178:8080' ;
}else{
  historylambswap = '59.110.68.178:8080' ;
  // historylambswap = 'history.lambswap.fi' ;
}
process.env.VUE_APP_historylambswap= historylambswap;

console.log(process.env);

module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'LambSwap 存储资产DEX',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    indexEn: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/indexEn.html',
      // output as dist/index.html
      filename: 'indexEn.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'LambSwap Storage Digital Assets DEX',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }

  },
  configureWebpack: {
    // plugins: [
    //   new webpack.DefinePlugin({
    //     historylambswap: JSON.stringify(historylambswap)
    //   })
    // ],
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
          options: {
            fix: true,
            cache: false,
            failOnError: false,
          },
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  chainWebpack: (config) => {
    config
    .optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });

  },

};
