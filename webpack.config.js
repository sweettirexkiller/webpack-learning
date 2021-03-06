var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')


var isProduction = process.env.NODE_ENV === 'production';

// the path(s) that should be cleaned
let pathsToClean = [
    'dist',
];

// the clean options to use
let cleanOptions = {
    root: __dirname,
    verbose: true,
    dry: false
};


module.exports = {
    mode: 'development',
    entry: {
        app: [
            './src/main.js',
            // './src/main.scss'
        ],
        vendor: ['jquery']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", 'sass-loader'],
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
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[hash].[ext]'
                        }
                    },
                    {
                        loader: 'img-loader'
                    }
                ],
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].[hash].css",
            chunkFilename: "[id].css"
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: isProduction
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'index.html')),
            minimize: isProduction
        }),
        function () {
            this.plugin('done', stats => {
                require('fs').writeFileSync(
                    path.join(__dirname, 'dist/manifest.json'),
                    JSON.stringify(stats.toJson().assetsByChunkName)
                );
            })
        }
    ],
};


if (isProduction) {
    module.exports.plugins.push(
        new UglifyJsPlugin()
    )
}