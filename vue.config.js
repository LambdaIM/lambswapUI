
const webpack = require("webpack");

let historylambswap = 'history.lambswap.fi' ;
if(process.env.NODE_ENV == 'production'){
  historylambswap = 'history.lambswap.fi' ;
}else{
  // historylambswap = '59.110.68.178:8086' ;
  historylambswap = 'history.lambswap.fi' ;
}
process.env.VUE_APP_historylambswap= historylambswap;

console.log(process.env);

module.exports = {
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
