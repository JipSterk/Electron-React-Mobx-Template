import * as cp from 'child_process';
import * as packager from 'electron-packager';
import * as fs from 'fs-extra';
import * as path from 'path';

import { externals } from '../app/webpack.common';

type PackageLookup = {
    [key: string]: string
}

const isPublishableBuild = process.env.NODE_ENV !== 'development';

const projectRoot = path.join(__dirname, '..');
const outRoot = path.join(projectRoot, 'out');

const getDistRoot = (): string => path.join(projectRoot, 'dist');

copyDependencies();

packageApp((error: Error | null, appPaths: string | string[]): void => {
    if (error) {
        console.error(error);
        process.exit(1);
    } else {
        console.log(`Built to ${appPaths}`);
    }
});

function copyDependencies(): void {
    const originalPackage = require(path.join(projectRoot, 'app', 'package.json'));

    const oldDependencies = originalPackage.dependencies;
    const newDependencies: PackageLookup = {}

    Object.keys(oldDependencies).forEach(name => {
        const spec = oldDependencies[name];
        if (externals.indexOf(name) !== -1) {
            newDependencies[name] = spec;
        }
    });

    const oldDevDependencies = originalPackage.devDependencies;
    const newDevDependencies: PackageLookup = {}

    if (!isPublishableBuild) {
        Object.keys(oldDevDependencies).forEach(name => {
            const spec = oldDevDependencies[name];
            if (externals.indexOf(name) !== -1) {
                newDevDependencies[name] = spec;
            }
        });
    }

    const updatedPackage = Object.assign({}, originalPackage, {
        productName: 'electronreactmobxtemplate',
        dependencies: newDependencies,
        devDependencies: newDevDependencies,
    });

    if (isPublishableBuild) {
        delete updatedPackage.devDependencies;
    }

    fs.writeFileSync(path.join(outRoot, 'package.json'), JSON.stringify(updatedPackage));

    fs.removeSync(path.resolve(outRoot, 'node_modules'));

    if (Object.keys(newDependencies).length || Object.keys(newDevDependencies).length) {
        console.log('Installing dependencies via yarn…');
        cp.execSync('yarn install', { cwd: outRoot, env: process.env });
    }

    if (!isPublishableBuild) {
        console.log('Installing 7zip (dependency for electron-devtools-installer)');

        const sevenZipSource = path.resolve(projectRoot, 'app/node_modules/7zip');
        const sevenZipDestination = path.resolve(outRoot, 'node_modules/7zip');

        fs.mkdirpSync(sevenZipDestination);
        fs.copySync(sevenZipSource, sevenZipDestination);
    }
}

function packageApp(callback: (error: Error | null, appPaths: string | string[]) => void): void {
    const options: packager.Options = {
        overwrite: true,
        platform: 'win32',
        arch: 'x64',
        prune: false,
        out: getDistRoot(),
        dir: outRoot,
        ignore: [
            new RegExp('/node_modules/electron($|/)'),
            new RegExp('/node_modules/electron-packager($|/)'),
            new RegExp('/\\.git($|/)'),
            new RegExp('/node_modules/\\.bin($|/)'),
        ],
    }

    packager(options, (error: Error, appPaths: string | string[]): void => {
        if (error) {
            callback(error, appPaths);
        }
        else {
            callback(null, appPaths);
        }
    });
}