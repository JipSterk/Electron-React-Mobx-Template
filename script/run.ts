import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

let binaryPath: string = '';

const projectRoot: string = path.join(__dirname, '..');
const getDistRoot = (): string => path.join(projectRoot, 'dist');

if (process.platform === 'win32') {
    binaryPath = path.join(getDistRoot(), 'electronreactmobxtemplate-win32-x64', 'electronreactmobxtemplate.exe');
}

export function run(spawnOptions: SpawnOptions): ChildProcess | null {
    try {
        const stats: fs.Stats = fs.statSync(binaryPath);
        if (!stats.isFile()) {
            return null;
        }
    } catch (error) {
        return null;
    }

    const options: SpawnOptions = Object.assign({}, spawnOptions);

    options.env = Object.assign(options.env || {}, process.env, {
        NODE_ENV: 'development'
    });

    return spawn(binaryPath, [], options);
}