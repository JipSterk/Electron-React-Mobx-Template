import * as MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';

import * as common from './webpack.common';

const config: webpack.Configuration = {
    mode: 'production',
    devtool: 'source-map'
}

const productionMainConfig: webpack.Configuration = webpackMerge(config, common.commonMainConfig, {
});

const productionRenderConfig: webpack.Configuration = webpackMerge(config, common.commonRenderConfig, {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: '[name].css'
        })
    ]
});


export =[
    productionMainConfig,
    productionRenderConfig
];