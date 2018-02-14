import * as express from 'express';
import * as webpack from 'webpack';
import * as path from 'path';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as configs from '../app/webpack.development';
import { spawn, SpawnOptions } from 'child_process';

let binaryPath = '';

const projectRoot = path.join(__dirname, '..');
const getDistRoot = (): string => path.join(projectRoot, 'dist');

if (process.platform === 'win32') {
    binaryPath = path.join(getDistRoot(), 'electronreactmobxtemplate-win32-x64',  'electronreactmobxtemplate.exe');
}

const startApp = (): void => {
    const options: SpawnOptions = {
        stdio: 'inherit'
    }

    options.env = Object.assign(options.env || {}, process.env, {
        NODE_ENV: 'development'
    });

    const runningApp = spawn(binaryPath, [], options);

    if (!runningApp){
        console.log('Couldn\'t launch app. Try building it');
        process.exit(1);
    }

    runningApp.on('close', (): void => {
        process.exit(0)
    });
}

if (process.env.NODE_ENV === 'production') {
    startApp();
}

const [developmentRenderConfig] = configs;

const server = express();
const compiler = webpack(developmentRenderConfig);
const port = process.env.PORT || 3000;

server.use(webpackDevMiddleware(compiler, {
    publicPath: developmentRenderConfig.output.publicPath,
    noInfo: true
}));

server.use(webpackHotMiddleware(compiler));

server.listen(port, 'localhost', (error: Error) => {
    if (error) {
        console.log(error);
        process.exit(1);
        return;
    }

    console.log(`Server running at http://localhost:${port}`);
    startApp();
});