import * as console from 'console';

// Runs only once before test execution
async function globalSetup() {
    console.log('Global setup starts');
    //Add code for global setup here 
    console.log('Global setup ends');
}

export default globalSetup;