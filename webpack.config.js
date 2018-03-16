var webpack = require('webpack');
var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var isProduction = process.env.NODE_ENV === 'production';


module.exports = {
    mode: 'development',
    entry: {
        app: [
            './src/main.js',
            './src/main.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader,"css-loader",'sass-loader'],
                // use: [
                //     MiniCssExtractPlugin.loader,
                //     {
                //         loader: 'css-loader',
                //         options: {url: false}
                //     },
                //     'sass-loader'
                // ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[hash].[ext]'
                }

            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: isProduction
        })
    ],
};


if (isProduction) {
    module.exports.plugins.push(
        new UglifyJsPlugin()
    )
}