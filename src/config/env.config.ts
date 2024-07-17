export const envConfig = {
    userEmail: process.env.USER_EMAIL || '',
    userPassword: process.env.PASSWORD || '',
    host: process.env.HOST || '',
    clientPort: parseInt(process.env.HOST_PORT!) || 30845,
    getClientUrl(): string {
        return `http://${this.host}:${this.clientPort}`;
    },
    systemTenant: 'system',
};

(() => {
    console.log('Executing health check of configuration...');
    if (envConfig.userEmail === '') throw new Error('User e-mail undefined: USER_EMAIL');
    if (envConfig.userPassword === '') throw new Error('User password undefined: PASSWORD');
    if (envConfig.host === '') throw new Error('Host undefined: HOST');
})();