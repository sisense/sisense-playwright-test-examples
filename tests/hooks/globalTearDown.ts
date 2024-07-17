// Runs only once after test execution
import * as console from 'console';

async function globalTearDown() {
    console.log('Global tear down...');

    console.log('Global tear down ends');
}

export default globalTearDown;