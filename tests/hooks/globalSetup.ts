import { envConfig } from '@config/env.config';
import { downloadFileFromArtifactory } from '@utils/artifactoryUtils';
import {
    changeFilePermission,
    createDirectoryRecursively,
    removeDirectoryRecursively,
} from '@utils/fileUtils';
import { sh } from '@utils/shellUtils';
import * as console from 'console';
import { CliAPISteps } from '@steps/api/cli/cliAPISteps';
import { defaultUserContext } from '@config/UserContext';

// Runs only once before test execution
async function globalSetup() {
    console.log('Global setup starts');
    removeDirectoryRecursively(envConfig.localTestDataDirectory);
    createDirectoryRecursively(envConfig.localArtifactsDirectory);
    createDirectoryRecursively(envConfig.localDownloadsDirectory);
    createDirectoryRecursively(envConfig.localConfigDirectory);
    createDirectoryRecursively(envConfig.localLogsDirectory);
    if (envConfig.artifactoryUrl) {
        await downloadFileFromArtifactory(
            envConfig.dbCredentialsFileName,
            envConfig.crossReleaseBranch,
            envConfig.localConfigDirectory,
        );
        await downloadFileFromArtifactory(
            envConfig.ssoCredentialsFileName,
            envConfig.releaseBranch,
            envConfig.localConfigDirectory,
        );
        await downloadFileFromArtifactory(
            envConfig.hostCertFileName,
            envConfig.crossReleaseBranch,
            envConfig.localConfigDirectory,
        );
    }
    changeFilePermission(
        `${envConfig.localConfigDirectory}/${envConfig.hostCertFileName}`,
        '00400',
    );
    if (!envConfig.isSmoke) {
        console.log(`Current pod's status before test execution:`);
        console.log(await CliAPISteps.getAllExistingPodsAsTable(defaultUserContext));
    }

    if (!envConfig.isSmoke && envConfig.isSSL && !envConfig.isStandardCloud) {
        await sh(`"sudo sed -i '2i${envConfig.hostIP}  ${envConfig.host}' /etc/hosts"`);
    }

    console.log('Global setup ends');
}

export default globalSetup;
