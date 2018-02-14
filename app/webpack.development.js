const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.common');

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
        new ExtractTextPlugin('[name].css')
    ]
});

module.exports = [
    developmentMainConfig,
    developmentRenderConfig
]