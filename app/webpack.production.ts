import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';

import * as common from './webpack.common';

const productionConfig: webpack.Configuration = webpackMerge(common.commonConfig, {
});

const productionMainConfig: webpack.Configuration = webpackMerge(productionConfig, common.commonMainConfig, {
});

const productionRenderConfig: webpack.Configuration = webpackMerge(productionConfig, common.commonRenderConfig, {
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


export =[
    productionMainConfig,
    productionRenderConfig
]