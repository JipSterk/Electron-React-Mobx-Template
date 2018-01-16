// import * as path from 'path';
// import * as webpack from 'webpack';
// import * as HtmlWebpackPlugin from 'html-webpack-plugin';
// import * as webpackMerge from 'webpack-merge';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const commonConfig: webpack.Configuration = {
const commonConfig = {
    output: {
        path: path.resolve(__dirname, 'dist'),
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

// const mainConfig: webpack.Configuration = webpackMerge(commonConfig, {
const mainConfig = webpackMerge(commonConfig, {
    target: 'electron-main',
    entry: {
        main: './src/main.ts'
    }
});

const renderConfig = webpackMerge(commonConfig, {
    target: 'electron-renderer',
    entry: {
        renderer: './src/index.tsx'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html')
        })
    ]
})

module.exports = [
    mainConfig,
    renderConfig
]