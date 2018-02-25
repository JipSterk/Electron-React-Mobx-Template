import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';

import * as common from './webpack.common';

const developmentConfig: webpack.Configuration = webpackMerge(common.commonConfig, {
    devtool: 'cheap-module-eval-source-map',
});

const developmentMainConfig: webpack.Configuration = webpackMerge(developmentConfig, common.commonMainConfig, {
});

const developmentRenderConfig: webpack.Configuration = webpackMerge(developmentConfig, common.commonRenderConfig, {
    entry: {
        renderer: [
            'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
            (common.commonRenderConfig.entry as webpack.Entry).renderer as string,
        ],
    },
    output: {
        publicPath: 'http://localhost:3000/build/',
    },
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

export =[
    developmentMainConfig,
    developmentRenderConfig
]