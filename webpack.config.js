// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=


const distPath = './dist';
const srcPath = "./src/";

const IS_HOT = process.env.WEBPACK_DEV_SERVER === 'true';

// Plugins
const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let config = {
    entry: {
        cms: [
            srcPath + 'js/cms.js',
            srcPath + 'scss/cms.scss'
        ]
    },

    output: {
        path: path.resolve(__dirname, distPath),
        filename: '[name].js',
        publicPath : IS_HOT ? 'http://localhost:8081/'+ distPath : '/' + distPath
    },

    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'vendor',
    //                 chunks: "all"
    //             }
    //         }
    //     }
    // },

    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },

    plugins: [
        new WebpackNotifierPlugin({
            skipFirstNotification: true
        }),
        new webpack.NamedModulesPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: "[id].css"
        }),
        // new webpack.SourceMapDevToolPlugin({
        //     filename: 'js/[name].js.map',
        // }),
        new VueLoaderPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.m?js$/,
                include: [
                    path.resolve('./src/js'),
                    path.resolve('./node_modules/domtastic/src'),
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: IS_HOT,
                            reloadAll: true,
                        },
                    },
                    path.resolve('./src/webpack-libs/css-url-loader.js'),
                    {loader:'css-loader', options: {url: false,}},
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: IS_HOT
                        },
                    },
                    path.resolve('./src/webpack-libs/css-url-loader.js'),
                    {loader:'css-loader', options: {url: false,}},
                ],
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }, // inline base64 URLs for <=8k images, direct URLs for the rest
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?publicPath=../&name=fonts/[name].[ext]'
            }
        ]
    },

    devServer: {
        contentBase: path.resolve(__dirname, distPath),
        // host: '0.0.0.0',
        port: 8081,
        disableHostCheck: true,
        compress: true,
        overlay: true,
        stats: {
            colors: true
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    },
};

if (IS_HOT) {
    config.devtool = '';
}

module.exports = config;