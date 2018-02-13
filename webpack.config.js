const path = require('path');

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
    }
};
