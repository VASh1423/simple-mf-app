const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const { ModuleFederationPlugin } = require('webpack').container

const deps = require("./package.json").dependencies

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const optimization = () => {
  const config = {
    // splitChunks: {
    //   chunks: 'all'
    // }
  }

  if(isProd){
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ]
  }

  return config
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './index.js',
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    open: true,
    hot: true,
    compress: true,
    port: 9002,
    devMiddleware: {writeToDisk: true}
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "counter",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Counter": "./components/Counter"
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Main',
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new MiniCssExtractPlugin({
      filename: `./styles/${filename('css')}`,
    })
  ],
  optimization: optimization(),
  devtool: isProd ? false : 'source-map',
  module:{
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader"
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
          "sass-loader"
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: { 
          filename: 'asset/img/[hash][ext][query]'
        }
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
        generator: { 
          filename: 'asset/fonts/[hash][ext][query]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  }
}