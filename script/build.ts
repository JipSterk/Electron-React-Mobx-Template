import * as cp from 'child_process';
import * as packager from 'electron-packager';
import * as fs from 'fs-extra';
import * as path from 'path';

import { externals } from '../app/webpack.common';
import { getDistRoot } from './dist-info';

type PackageLookup = {
    [key: string]: string
}

type Package = {
    productName: string,
    dependencies: PackageLookup,
    devDependencies: PackageLookup
}

const isPublishableBuild: boolean = process.env.NODE_ENV !== 'development';

const projectRoot: string = path.join(__dirname, '..');
const outRoot: string = path.join(projectRoot, 'out');

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
    const originalPackage: Package = require(path.join(projectRoot, 'app', 'package.json'));

    const oldDependencies: PackageLookup = originalPackage.dependencies;
    const newDependencies: PackageLookup = {}

    Object.keys(oldDependencies).forEach((name: string): void => {
        const spec: string = oldDependencies[name];
        if (externals.indexOf(name) !== -1) {
            newDependencies[name] = spec;
        }
    });

    const oldDevDependencies: PackageLookup = originalPackage.devDependencies;
    const newDevDependencies: PackageLookup = {}

    if (!isPublishableBuild) {
        Object.keys(oldDevDependencies).forEach((name: string): void => {
            const spec: string = oldDevDependencies[name];
            if (externals.indexOf(name) !== -1) {
                newDevDependencies[name] = spec;
            }
        });
    }

    const updatedPackage: Package = Object.assign({}, originalPackage, {
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

        const sevenZipSource: string = path.resolve(projectRoot, 'app/node_modules/7zip');
        const sevenZipDestination: string = path.resolve(outRoot, 'node_modules/7zip');

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