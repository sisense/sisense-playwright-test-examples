type EnvProperties = {
    userEmail: string;
    userPassword: string;
    host: string;
    tenantBaseHost: string | undefined;
    clientPort: number;
    isSSL: boolean;
    getClientUrl(): string;
    systemTenant: string;
    getTenantName(): string;
    allTestProject: string;
    defaultPassword: string;
    releaseBranch: string;
    crossReleaseBranch: string;
    getSisenseBuildVersion(): string;
    testBranch: string;
    artifactoryUrl: string;
    artifactoryUserName: string;
    artifactoryPassword: string;
    getArtifactoryRepository(): string;
    localTestDataDirectory: string;
    localArtifactsDirectory: string;
    localDownloadsDirectory: string;
    localConfigDirectory: string;
    localLogsDirectory: string;
    dbCredentialsFileName: string;
    dbCredentialsFilePath: string;
    ssoCredentialsFileName: string;
    ssoCredentialsFilePath: string;
    hostCertFileName: string;
    hostStorageDirectory: string;
    isReportPortalEnabled: boolean;
    jenkinsBuildUrl: string | undefined;
    jenkinsJob: string | undefined;
    isSmoke: boolean;
    hostIP: string;
    caRunType: string;
    isWindows: boolean;
    isCustomTenant: boolean;
    isStandardCloud: boolean;
    createCustomTenant: boolean;
    autobot_dashboards: string;
    autobot_external: boolean;
};

export const envConfig: EnvProperties = {
    userEmail: process.env.USER_EMAIL || '',
    userPassword: process.env.PASSWORD || '',
    host: process.env.HOST || '',
    tenantBaseHost: process.env.TENANT_BASE_HOST,
    hostIP: process.env.HOST_IP || '',
    clientPort: parseInt(process.env.HOST_PORT!) || 30845,
    isWindows: process.env.OS_TYPE == 'Windows',
    isSSL: process.env.IS_SSL == 'false',
    getClientUrl(): string {
        return this.isSSL ? `https://${this.host}` : `http://${this.host}:${this.clientPort}`;
    },
    systemTenant: 'system',
    getTenantName(): string {
        return process.env.TENANT || this.systemTenant;
    },
    allTestProject: 'all',
    defaultPassword: '',
    releaseBranch: 'develop',
    crossReleaseBranch: 'cross-version',
    getSisenseBuildVersion(): string {
        return process.env.SISENSE_VERSION || this.releaseBranch;
    },
    testBranch: process.env.TEST_BRANCH || 'develop',
    artifactoryUrl: 'https://artifactory.sisense.com',
    artifactoryUserName: '',
    artifactoryPassword: '',
    getArtifactoryRepository(): string {
        return `${this.artifactoryUrl}/artifactory/playwright`;
    },
    localTestDataDirectory: './test-data',
    localArtifactsDirectory: './test-data/artifacts',
    localDownloadsDirectory: './test-data/downloads',
    localConfigDirectory: './test-data/config',
    localLogsDirectory: './test-data/logs',
    dbCredentialsFileName: 'dbCreds.json',
    dbCredentialsFilePath: './test-data/config/dbCreds.json',
    ssoCredentialsFileName: 'ssoCreds.json',
    ssoCredentialsFilePath: './test-data/config/ssoCreds.json',
    hostCertFileName: 'ec2.pem',
    hostStorageDirectory: '/opt/sisense/storage',
    isReportPortalEnabled: process.env.ENABLE_REPORT_PORTAL == 'true',
    jenkinsBuildUrl: process.env.JENKINS_BUILD_URL,
    jenkinsJob: process.env.JOB_NAME,
    isSmoke: process.env.IS_SMOKE === 'true',
    caRunType: process.env.CA_RUN_TYPE || '',
    isCustomTenant: process.env.IS_CUSTOM_TENANT == 'true',
    isStandardCloud: process.env.IS_STANDARD_CLOUD == 'true',
    createCustomTenant: process.env.CREATE_CUSTOM_TENANT == 'true',
    autobot_dashboards: process.env.AUTOBOT_DASHBOARDS || '',
    autobot_external: process.env.AUTOBOT_EXTERNAL == 'true',
};