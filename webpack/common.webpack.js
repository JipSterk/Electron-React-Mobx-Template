const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');

const commonConfig = {
    output: {
        path: path.resolve('dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: [
            '.js',
            '.ts',
            '.tsx'
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader'
            }
        ]
    },
    node: {
        __dirname: false,
        __filename: false
    }
}

const commonMainConfig = {
    target: 'electron-main',
    entry: {
        main: './src/main.ts'
    }
}

const commonRenderConfig = {
    target: 'electron-renderer',
    entry: {
        renderer: './src/index.tsx'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('src', 'index.html')
        })
    ]
}

module.exports = {
    commonConfig: commonConfig,
    commonMainConfig: commonMainConfig,
    commonRenderConfig: commonRenderConfig
}