import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

const outputDir: string = 'out';
export const externals: string[] = ['7zip'];

if(process.env.NODE_ENV === 'development') {
    externals.push('devtron');
}

const commonConfig: webpack.Configuration = {
    externals: externals,
    output: {
        path: path.resolve(__dirname, '..', outputDir),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
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
    plugins: [
        new CleanWebpackPlugin([outputDir], { verbose: false })
    ],
    node: {
        __dirname: false,
        __filename: false
    }
}

export const commonMainConfig: webpack.Configuration = merge(commonConfig, {
    target: 'electron-main',
    entry: {
        main: path.resolve(__dirname, 'src/main-process/main')
    }
});

export const commonRenderConfig: webpack.Configuration = merge(commonConfig, {
    target: 'electron-renderer',
    entry: {
        renderer: path.resolve(__dirname, 'src/ui/index')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'static', 'index.html')
        })
    ]
});