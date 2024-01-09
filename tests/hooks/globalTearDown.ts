// Runs only once after test execution
import { envConfig } from '@config/env.config';
import * as console from 'console';
import { CliAPISteps } from '@steps/api/cli/cliAPISteps';
import { defaultUserContext } from '@config/UserContext';

async function globalTearDown() {
    console.log('Global tear down...');
    if (!envConfig.isSmoke) {
        console.log(`Current pod's status after test execution:`);
        console.log(await CliAPISteps.getAllExistingPodsAsTable(defaultUserContext));
    }
    console.log('Global tear down ends');
}

export default globalTearDown;
