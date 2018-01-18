const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const common = require('./common.webpack');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

const developmentConfig = webpackMerge(common.commonConfig, {
    devtool: 'cheap-module-eval-source-map',
});

const developmentMainConfig = webpackMerge(developmentConfig, common.commonMainConfig, {
});

const developmentRenderConfig = webpackMerge(developmentConfig, common.commonRenderConfig, {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV)
        })
    ]
});

module.exports = [
    developmentMainConfig,
    developmentRenderConfig
]