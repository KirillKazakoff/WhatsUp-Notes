const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    target: 'web',
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    devServer: {
        client: {
            logging: 'none',
        },
        port: 9001,
        compress: true,
        historyApiFallback: true,
        https: false,
        // hot: true,
    },
    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.(png|jpg|gif|ttf|ico|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },

    resolve: {
        extensions: ['.js'],
        fallback: {
            path: require.resolve('path-browserify'),
        },
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            cache: false,
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),

        new CopyPlugin({
            patterns: [
                { from: 'src/svg', to: 'svg' },
                { from: 'src/img/srcImg', to: 'img' },
                { from: 'node_modules/jszip/dist/jszip.js', to: 'worker' },
                { from: 'src/app/upload/zip/zip-worker.js', to: 'worker' },
                { from: 'src/app/service-worker/service-worker.js', to: './' },
            ],
        }),
    ],
};
