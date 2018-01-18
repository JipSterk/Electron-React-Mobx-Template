const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const common = require('./common.webpack');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const productionConfig = webpackMerge(common.commonConfig, {
});

const productionMainConfig = webpackMerge(productionConfig, common.commonMainConfig, {
});

const productionRenderConfig = webpackMerge(productionConfig, common.commonRenderConfig, {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
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
    productionMainConfig,
    productionRenderConfig
]