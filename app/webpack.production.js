const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.common');

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
        new ExtractTextPlugin('[name].css')
    ]
});


module.exports = [
    productionMainConfig,
    productionRenderConfig
]