const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDir = 'out';
const externals = ['7zip'];

const commonConfig = {
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

const commonMainConfig = {
    target: 'electron-main',
    entry: {
        main: path.resolve(__dirname, 'src/main-process/main.ts')
    }
}

const commonRenderConfig = {
    target: 'electron-renderer',
    entry: {
        renderer: path.resolve(__dirname, 'src/ui/index.tsx')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'static', 'index.html')
        })
    ]
}

module.exports = {
    commonConfig,
    commonMainConfig,
    commonRenderConfig,
}