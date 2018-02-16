const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = require('dotenv');

env.config();

module.exports = {
    context: __dirname,
    resolve: {
        extensions: ['.ts']
    },
    entry: {
        app: './src/provider.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jwplayer.provider-hls.js'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 9000,
        open: true,
        inline: false,
        overlay: {
            warnings: true,
            errors: true
        },
        watchContentBase: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'JWPlayer',
            chunksSortMode: 'dependency',
            metadata: {
                baseUrl: '/',
                apiKey: process.env.API_KEY,
                playerUrl: process.env.PLAYER_URL,
                manifestUrl: process.env.MANIFEST_URL,
            },
            inject: 'body'
        })
    ]
};
