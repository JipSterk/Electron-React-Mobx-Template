import * as electronInstaller from 'electron-winstaller';
import * as path from 'path';

const projectRoot = path.join(__dirname, '..');

const getDistRoot = (): string => path.join(projectRoot, 'dist');

const getDistPath = (): string => path.join(`${getDistRoot()}`, 'electronreactmobxtemplate-win32-x64');

const outputDir = path.join(getDistPath(), '..', 'installer');

const packageWindows = (): void => {
    const options: electronInstaller.Options = {
        name: 'electronreactmobxtemplate.nupkg',
        appDirectory: getDistPath(),
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
        }).catch((error: Error) =>{
            console.error(`Error packaging: ${error}`);
            process.exit(1);
        });
}

if(process.platform === 'win32') {
    packageWindows();
}