const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const currentTask = process.env.npm_lifecycle_event;

const PostCSSPlugins = [
    require('postcss-mixins'),
    require('postcss-nested'),
    require('postcss-import'),
    require('postcss-simple-vars'),
    require('autoprefixer')
]

module.exports = {
    mode: 'development',
    entry: {
        app: "./app/scripts/App.js"
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        clean: true
    },
    plugins: [
        new MiniCssExtractPlugin({filename: '[name].[contenthash].css'}),
        new HtmlWebpackPlugin({filename: 'index.html', template: './app/index.html'})
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                exclude: /(node_modules)/,
                use: [
                    currentTask == "build" ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: PostCSSPlugins
                            }
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 1000
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    },
    devServer: {
        watchFiles: ["app/**/*.html"],
        static: {
            directory: path.resolve(__dirname, 'docs')
        },
        port: 3000,
        hot: true
    }
}