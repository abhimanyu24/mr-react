"use strict";

const webpack = require("webpack");
const path = require("path");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");
// const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const appConfig = require("./webpack/config/assessprep")

const config = {
  mode: "production",
  // devtool: "source-map",
  //   entry: path.join(__dirname, "examples/src/index.js"),
  // entry: ["react-hot-loader/patch", "./examples/src/index.js"],
  // entry: path.join(__dirname, "./src/index.js"),
  // entry: "./src/index.js",nvm 
  // entry: path.join(__dirname, "src", "index.js"),
  entry: path.join(__dirname, "src", "index.js"),
  // output: {
  //   path: path.resolve(__dirname, "dist"),
  //   filename: "[name].[contenthash].js"
  // },
  output: {
    // library: "mr_react_framework",
    // path: path.resolve(__dirname, "dist"),
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    // libraryTarget: "commonjs2", // THIS IS THE MOST IMPORTANT LINE! :mindblow: I wasted more than 2 days until realize this was the line most important in all this guide.,
    libraryTarget: "umd",
    libraryExport: "default"
    // libraryExport: "default"
    // sourceMapFilename: "[file].map" // string,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png"
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          // {
          //   loader: 'less-loader',
          //   options: {
          //     lessOptions: {
          //       // strictMath: true,
          //       // modifyVars: {
          //       //   'primary-color': '#00BCD4',
          //       //   'link-color': '#1DA57A',
          //       //   'border-radius-base': '2px',
          //       // },
          //       modifyVars: appConfig.lessConfig,
          //       javascriptEnabled: true,
          //     },
          //   },
          // },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: "url-loader",
        options: {
          limit: 8192
        }
      },
      {
        test: /\.svg$/,
        use: "file-loader"
      }
    ]
  },
  // resolve: {
  //   extensions: [".js", ".jsx"],
  //   alias: {
  //     "react-dom": "@hot-loader/react-dom"
  //   }
  // },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new HtmlWebpackPlugin({
      template: require("html-webpack-template"),
      inject: false,
      appMountId: "root"
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },



  // externals: {
  //   react: {
  //     // root: "React",
  //     commonjs2: "react",
  //     commonjs: "react",
  //     amd: "react"
  //   },
  //   "react-dom": {
  //     // root: "ReactDOM",
  //     commonjs2: "react-dom",
  //     commonjs: "react-dom",
  //     amd: "react-dom"
  //   },
  //   "react-router-dom": {
  //     // root: "ReactRouterDOM",
  //     commonjs2: "react-router-dom",
  //     commonjs: "react-router-dom",
  //     amd: "react-router-dom"
  //   },
  //   "react-redux": {
  //     root: "ReactRedux",
  //     commonjs2: "react-redux",
  //     commonjs: "react-redux"
  //   },
  //   "react-intl": {
  //     root: "ReactIntl",
  //     commonjs2: "react-intl",
  //     commonjs: "react-intl"
  //   },
  //   "styled-components": {
  //     // root: "ReactIntl",
  //     commonjs2: "styled-components",
  //     commonjs: "styled-components"
  //   },
  //   "antd": {
  //     // root: "ReactIntl",
  //     commonjs2: "antd",
  //     commonjs: "antd",
  //     // root: "antd"
  //   },
  //   "dayjs": {
  //     // root: "ReactIntl",
  //     commonjs2: "dayjs",
  //     commonjs: "dayjs",
  //     // root: "antd"
  //   },
  //   "moment": {
  //     // root: "ReactIntl",
  //     commonjs2: "moment",
  //     commonjs: "moment",
  //     // root: "antd"
  //   },
  //   "@ant-design/icons": {
  //     // root: "ReactIntl",
  //     commonjs2: "@ant-design/icons",
  //     commonjs: "@ant-design/icons",
  //     // root: "@ant-design/icons"
  //   }
  // }
};

module.exports = config;