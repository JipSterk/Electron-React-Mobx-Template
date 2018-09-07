import * as electronInstaller from 'electron-winstaller';
import * as path from 'path';

import { getDistPath } from './dist-info';

const distPath: string = getDistPath();
const outputDir: string = path.join(distPath, '..', 'installer');

if (process.platform === 'win32') {
    packageWindows();
}

async function packageWindows(): Promise<void> {
    const options: electronInstaller.Options = {
        name: 'electronreactmobxtemplate.nupkg',
        appDirectory: distPath,
        outputDirectory: outputDir,
        authors: 'YOUR COMPANY NAME',
        description: 'SOME DESCRIPTION',
        exe: 'electronreactmobxtemplate.exe',
        title: 'electronreactmobxtemplate',
        setupExe: 'electronreactmobxtemplate Setup.exe',
        setupMsi: 'electronreactmobxtemplate Setup.msi',
    }

    try {
        await electronInstaller.createWindowsInstaller(options);
        console.log(`Installers created in ${outputDir}`);
    } catch (error) {
        console.log(`Error packaging: ${error}`);
        process.exit(1);
    }
}