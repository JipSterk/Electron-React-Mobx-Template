import * as electronInstaller from 'electron-winstaller';
import * as path from 'path';

import { getDistPath } from './dist-info';

const distPath: string = getDistPath();
const outputDir: string = path.join(distPath, '..', 'installer');

if (process.platform === 'win32') {
    packageWindows();
}

function packageWindows(): void {
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

    electronInstaller.createWindowsInstaller(options)
        .then((): void => {
            console.log(`Installers created in ${outputDir}`);
        }).catch((error: Error): void => {
            console.error(`Error packaging: ${error}`);
            process.exit(1);
        });
}