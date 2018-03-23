import { spawn, SpawnOptions } from 'child_process';
import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';

import configs = require('../app/webpack.development');

let binaryPath = '';

const projectRoot = path.join(__dirname, '..');
const getDistRoot = (): string => path.join(projectRoot, 'dist');

if (process.platform === 'win32') {
    binaryPath = path.join(getDistRoot(), 'electronreactmobxtemplate-win32-x64', 'electronreactmobxtemplate.exe');
}

function startApp(): void {
    const options: SpawnOptions = {
        stdio: 'inherit'
    }

    options.env = Object.assign(options.env || {}, process.env, {
        NODE_ENV: 'development'
    });

    const runningApp = spawn(binaryPath, [], options);

    if (!runningApp) {
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
else {
    const developmentRenderConfig = configs[1];

    const server = express();
    const compiler = webpack(developmentRenderConfig);
    const port = Number.parseInt(process.env.PORT) || 3000;

    server.use(webpackDevMiddleware(compiler, {
        publicPath: developmentRenderConfig.output.publicPath,
    }));

    server.use(webpackHotMiddleware(compiler));

    server.listen(port, 'localhost', (error?: Error): void => {
        if (error) {
            console.log(error);
            process.exit(1);
            return;
        }

        console.log(`Server running at http://localhost:${port}`);
        startApp();
    });
}